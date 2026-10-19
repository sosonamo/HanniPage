const { test, before, after } = require('node:test');
const { readFileSync } = require('node:fs');
const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { doc, setDoc, getDoc, collection, getDocs, deleteDoc, serverTimestamp, Timestamp } = require('firebase/firestore');
let env;
before(async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Run with Firestore emulator; see FIREBASE_SETUP.md');
  env = await initializeTestEnvironment({ projectId: 'demo-hanni-auth', firestore: { rules: readFileSync('firestore.rules', 'utf8') } });
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, 'memberUID', 'approved'), { active: true });
    await setDoc(doc(db, 'memberUID', 'revoked'), { active: false });
    await setDoc(doc(db, 'memberContent', 'main'), { notice: 'test', playlists: [] });
  });
});
after(async () => { if (env) await env.cleanup(); });
function user(uid, overrides = {}) {
  return env.authenticatedContext(uid, { email: 'test@example.com', email_verified: true,
    firebase: { sign_in_provider: 'google.com' }, ...overrides }).firestore();
}
test('only approved verified Google users can get protected content', async () => {
  await assertSucceeds(getDoc(doc(user('approved'), 'memberContent', 'main')));
  for (const db of [env.unauthenticatedContext().firestore(), user('unknown'), user('revoked'),
    user('approved', { email_verified: false }), user('approved', { firebase: { sign_in_provider: 'password' } })]) {
    await assertFails(getDoc(doc(db, 'memberContent', 'main')));
  }
});
test('users can read own status but cannot list members or self-approve', async () => {
  const db = user('unknown');
  await assertSucceeds(getDoc(doc(db, 'memberUID', 'unknown')));
  await assertFails(getDoc(doc(db, 'memberUID', 'approved')));
  await assertFails(getDocs(collection(db, 'memberUID')));
  await assertFails(setDoc(doc(db, 'memberUID', 'unknown'), { active: true }));
});
test('approved members cannot modify content or list documents', async () => {
  const db = user('approved');
  await assertFails(setDoc(doc(db, 'memberContent', 'main'), { notice: 'changed' }));
  await assertFails(getDocs(collection(db, 'memberContent')));
  await assertFails(setDoc(doc(db, 'anything', 'new'), { active: true }));
});
test('revocation blocks the next server read', async () => {
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), 'memberUID', 'temporary'), { active: true });
  });
  const db = user('temporary');
  await assertSucceeds(getDoc(doc(db, 'memberContent', 'main')));
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), 'memberUID', 'temporary'), { active: false });
  });
  await assertFails(getDoc(doc(db, 'memberContent', 'main')));
});

test('email allowlist grants verified Google users, but cannot be read by others or self-written', async () => {
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), 'memberEmails', 'team@example.com'), { active: true });
  });
  const db = user('email-only', { email: 'Team@Example.com' });
  await assertSucceeds(getDoc(doc(db, 'memberContent', 'main')));
  await assertSucceeds(getDoc(doc(db, 'memberEmails', 'team@example.com')));
  await assertFails(getDoc(doc(user('other'), 'memberEmails', 'team@example.com')));
  await assertFails(getDocs(collection(db, 'memberEmails')));
  await assertFails(setDoc(doc(db, 'memberEmails', 'team@example.com'), { active: true }));
  await assertFails(getDoc(doc(user('email-only', { email: 'team@example.com', email_verified: false }), 'memberContent', 'main')));
  await assertFails(getDoc(doc(user('email-only', { email: 'team@example.com', firebase: { sign_in_provider: 'password' } }), 'memberContent', 'main')));
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), 'memberEmails', 'team@example.com'), { active: false });
  });
  await assertFails(getDoc(doc(db, 'memberContent', 'main')));
  await assertSucceeds(getDoc(doc(user('approved', { email: 'team@example.com' }), 'memberContent', 'main')));
});


test('presence is readable only by approved members; only owners can write their own sessions', async () => {
  const db = user('approved');
  const session = doc(db, 'memberPresence', 'session-a');
  const data = { uid: 'approved', name: '한늬', lastSeen: serverTimestamp() };
  await assertSucceeds(setDoc(session, data));
  await assertSucceeds(getDocs(collection(db, 'memberPresence')));
  for (const denied of [env.unauthenticatedContext().firestore(), user('unknown'), user('revoked'), user('approved', { email_verified: false }), user('approved', { firebase: { sign_in_provider: 'password' } })]) {
    await assertFails(getDoc(doc(denied, 'memberPresence', 'session-a')));
    await assertFails(getDocs(collection(denied, 'memberPresence')));
    await assertFails(setDoc(doc(denied, 'memberPresence', 'denied-session'), data));
  }
  await assertFails(setDoc(session, { ...data, uid: 'other' }));
  await assertFails(setDoc(session, { ...data, lastSeen: Timestamp.fromMillis(0) }));
  await assertFails(setDoc(session, { ...data, email: 'private@example.com' }));
  await assertFails(setDoc(session, { ...data, name: '' }));
  await assertFails(setDoc(session, { ...data, name: 'x'.repeat(201) }));
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), 'memberEmails', 'online@example.com'), { active: true });
  });
  const other = user('other', { email: 'online@example.com' });
  await assertSucceeds(getDocs(collection(other, 'memberPresence')));
  await assertSucceeds(setDoc(doc(other, 'memberPresence', 'session-b'), { uid: 'other', name: '팀원', lastSeen: serverTimestamp() }));
  await assertFails(setDoc(doc(other, 'memberPresence', 'session-a'), { uid: 'other', name: '변경', lastSeen: serverTimestamp() }));
  await assertFails(deleteDoc(doc(other, 'memberPresence', 'session-a')));
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), 'memberEmails', 'online@example.com'), { active: false });
  });
  await assertFails(getDocs(collection(other, 'memberPresence')));
  await assertFails(setDoc(doc(other, 'memberPresence', 'session-b'), { uid: 'other', name: '팀원', lastSeen: serverTimestamp() }));
  await assertSucceeds(deleteDoc(doc(other, 'memberPresence', 'session-b')));
  await assertSucceeds(deleteDoc(session));
});
