const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtemp, mkdir, writeFile, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

test('Drive links accept file IDs and reject folders and other hosts', async () => {
  const { downloadUrl } = await import('../scripts/sync-drive-images.mjs');
  assert.match(downloadUrl('https://drive.google.com/file/d/abc_123/view?resourcekey=key'), /id=abc_123&resourcekey=key/);
  assert.match(downloadUrl('https://drive.google.com/open?id=abc'), /id=abc/);
  assert.throws(() => downloadUrl('https://drive.google.com/drive/folders/abc'));
  assert.throws(() => downloadUrl('https://example.com/file/d/abc/view'));
});

test('optimizes images, preserves manifest on failure, and restores fallbacks for empty links', async () => {
  const { syncImages } = await import('../scripts/sync-drive-images.mjs');
  const sharp = require('sharp');
  const root = await mkdtemp(join(tmpdir(), 'hanni-drive-'));
  try {
    await mkdir(join(root, 'src/data'), { recursive: true });
    await writeFile(join(root, 'src/data/gallery.json'), '{"categories":[],"items":[]}');
    await writeFile(join(root, 'src/data/roster.json'), '[]');
    const config = join(root, 'src/data/drive-images.json');
    await writeFile(config, JSON.stringify({ galleryTraining: { url: 'https://drive.google.com/file/d/abc/view' }, hanniLogo: { url: '' } }));
    const source = await sharp({ create: { width: 2000, height: 1000, channels: 4, background: '#ff000080' } }).png().toBuffer();
    const result = await syncImages(root, async () => new Response(source));
    const meta = await sharp(join(root, 'public', result.galleryTraining)).metadata();
    assert.equal(meta.format, 'webp');
    assert.equal(meta.width, 1600);
    assert.equal(meta.height, 800);
    assert.equal(meta.hasAlpha, true);
    assert.equal(result.hanniLogo, undefined);
    const manifest = join(root, 'src/assets/generated/drive-images.json');
    const before = await readFile(manifest, 'utf8');
    await assert.rejects(syncImages(root, async () => new Response('<html>Login required</html>')), /galleryTraining/);
    assert.equal(await readFile(manifest, 'utf8'), before);
    await assert.rejects(syncImages(root, async () => new Response('', { status: 403 })), /403/);
    await writeFile(config, JSON.stringify({ galleryTraining: { url: '' } }));
    assert.deepEqual(await syncImages(root, () => { throw Error('Must not fetch'); }), {});
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('section settings produce separate image keys and reject duplicate IDs', async () => {
  const { syncImages } = await import('../scripts/sync-drive-images.mjs');
  const sharp = require('sharp');
  const root = await mkdtemp(join(tmpdir(), 'hanni-sections-'));
  try {
    await mkdir(join(root, 'src/data'), { recursive: true });
    await writeFile(join(root, 'src/data/drive-images.json'), '{}');
    const photo = { id: 'one', url: 'https://drive.google.com/file/d/abc/view' };
    const gallery = { ...photo, title: '정모', category: '새 분류', date: '2026-10-19', caption: '설명' };
    const player = { ...photo, name: '선수', number: 7, role: '선수', position: 'SF', intro: '소개' };
    await writeFile(join(root, 'src/data/gallery.json'), JSON.stringify({ categories: [gallery.category], items: [gallery] }));
    await writeFile(join(root, 'src/data/roster.json'), JSON.stringify([player]));
    const source = await sharp({ create: { width: 10, height: 10, channels: 3, background: 'red' } }).png().toBuffer();
    const result = await syncImages(root, async () => new Response(source));
    assert.deepEqual(Object.keys(result), ['gallery-one', 'roster-one']);
    await writeFile(join(root, 'src/data/gallery.json'), JSON.stringify({ categories: [gallery.category], items: [gallery, gallery] }));
    await assert.rejects(syncImages(root, () => { throw Error('Must validate before downloading'); }), /id/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
