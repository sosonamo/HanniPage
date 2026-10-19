import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

export function downloadUrl(link) {
  const url = new URL(link);
  if (url.protocol !== 'https:' || url.hostname !== 'drive.google.com') {
    throw new Error('https://drive.google.com/ 형식의 파일 공유 링크를 입력하세요.');
  }
  const id = url.pathname.match(/^\/file\/d\/([\w-]+)/)?.[1] ?? url.searchParams.get('id');
  if (!id || !/^[\w-]+$/.test(id)) throw new Error('폴더가 아닌 사진 파일의 공유 링크가 필요합니다.');
  const target = new URL('https://drive.google.com/uc');
  target.searchParams.set('export', 'download');
  target.searchParams.set('id', id);
  const resourceKey = url.searchParams.get('resourcekey');
  if (resourceKey) target.searchParams.set('resourcekey', resourceKey);
  return target.href;
}

export async function syncImages(root, fetchImage = fetch) {
  const entries = JSON.parse(await readFile(resolve(root, 'src/data/drive-images.json'), 'utf8'));
  for (const section of ['gallery', 'roster']) {
    const config = JSON.parse(await readFile(resolve(root, `src/data/${section}.json`), 'utf8'));
    const items = section === 'gallery' ? config.items : config;
    if (section === 'gallery' && (!Array.isArray(config.categories) || config.categories.some(category => typeof category !== 'string'))) throw new Error('gallery.json의 categories는 문자열 배열이어야 합니다.');
    if (!Array.isArray(items)) throw new Error(`${section}.json의 사진 목록은 배열이어야 합니다.`);
    const ids = new Set();
    for (const item of items) {
      if (typeof item.id !== 'string' || !/^[\w-]+$/.test(item.id) || ids.has(item.id)) throw new Error(`${section}: id는 중복 없는 영문/숫자/밑줄/하이픈이어야 합니다.`);
      ids.add(item.id);
      const fields = section === 'gallery' ? ['title', 'category', 'date', 'caption'] : ['name', 'role', 'position', 'intro'];
      for (const field of [...fields, 'url']) {
        if (typeof item[field] !== 'string') throw new Error(`${section}/${item.id}: ${field} 문자열이 필요합니다.`);
      }
      if (section === 'roster' && (!Number.isInteger(item.number) || !['운영진', '코치진', '주장', '선수'].includes(item.role) || !['PG','SG','SF','PF','C','Coach','Staff'].includes(item.position))) throw new Error(`roster/${item.id}: 등번호, 역할, 포지션을 확인하세요.`);
      entries[`${section}-${item.id}`] = { url: item.url };
    }
  }
  const output = {};
  for (const [key, entry] of Object.entries(entries)) {
    if (!/^[a-zA-Z][\w-]*$/.test(key) || typeof entry?.url !== 'string') throw new Error(`잘못된 사진 설정: ${key}`);
    if (!entry.url.trim()) continue;
    try {
      const response = await fetchImage(downloadUrl(entry.url.trim()), { signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error(`다운로드 실패 (HTTP ${response.status})`);
      const chunks = [];
      let size = 0;
      for await (const chunk of response.body) {
        size += chunk.length;
        if (size > 30 * 1024 * 1024) throw new Error('사진은 30MB 이하로 올려주세요.');
        chunks.push(chunk);
      }
      const bytes = Buffer.concat(chunks);
      const metadata = await sharp(bytes, { limitInputPixels: 80000000 }).metadata();
      if (!['jpeg', 'png', 'webp', 'avif', 'heif', 'tiff'].includes(metadata.format)) throw new Error('JPG, PNG, WebP 등 정지 사진을 사용하세요.');
      const optimized = await sharp(bytes, { limitInputPixels: 80000000 })
        .rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 }).toBuffer();
      const hash = createHash('sha256').update(optimized).digest('hex').slice(0, 12);
      const relative = `drive-images/${key}-${hash}.webp`;
      await mkdir(resolve(root, 'public/drive-images'), { recursive: true });
      await writeFile(resolve(root, 'public', relative), optimized);
      output[key] = relative;
      console.log(`${key}: ${Math.round(size / 1024)}KB → ${Math.round(optimized.length / 1024)}KB`);
    } catch (error) {
      throw new Error(`${key}: 사진 동기화 실패. 공유 권한이 '링크가 있는 모든 사용자 / 뷰어'인지 확인하세요. ${error.message}`);
    }
  }
  // 모든 다운로드가 성공한 경우에만 사용하는 사진 목록을 갱신합니다.
  await mkdir(resolve(root, 'src/assets/generated'), { recursive: true });
  await writeFile(resolve(root, 'src/assets/generated/drive-images.json'), JSON.stringify(output, null, 2) + '\n');
  console.log(`드라이브 사진 ${Object.keys(output).length}개 준비 완료`);
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncImages(resolve(dirname(fileURLToPath(import.meta.url)), '..')).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
