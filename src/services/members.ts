import { startMemberPresence, type PresenceState } from './memberPresence';
import { initializeApp } from 'firebase/app';
import {
  browserSessionPersistence, getAuth, GoogleAuthProvider, onAuthStateChanged,
  setPersistence, signInWithPopup, signOut,
} from 'firebase/auth';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { parseMemberContent, type MemberContent } from './memberContent';
export type { MemberContent } from './memberContent';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
};
export const isMembersConfigured = Object.values(config).every(Boolean);
const app = isMembersConfigured ? initializeApp(config, 'hanni-members') : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
// Do not enable persistent Firestore caching for private member content.
const persistenceReady = auth ? setPersistence(auth, browserSessionPersistence) : Promise.resolve();
// Consume errors eagerly; loginMember still reports the same rejection to the user.
void persistenceReady.catch(() => {});

export interface MemberState {
  status: 'signed-out' | 'loading' | 'pending' | 'ready' | 'error';
  uid?: string;
  displayName?: string;
  content?: MemberContent;
  message?: string;
}

export function memberErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return '로그인이 취소되었습니다.';
  if (code === 'auth/popup-blocked') return '팝업을 허용한 뒤 다시 로그인해주세요. 카카오톡 안에서는 기본 브라우저로 열어주세요.';
  if (code === 'auth/unauthorized-domain') return '이 사이트의 로그인 도메인 설정을 확인해주세요. 운영진에게 문의해주세요.';
  if (code === 'permission-denied') return '회원 접근 권한이 없거나 변경되었습니다. 운영진에게 문의해주세요.';
  return '회원 서비스에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.';
}

export async function loginMember() {
  if (!auth) throw new Error('회원 로그인 연결을 준비 중입니다.');
  await persistenceReady;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await signInWithPopup(auth, provider);
}

let stopPresence = () => Promise.resolve();

export function subscribeMemberPresence(onChange: (state: PresenceState) => void) {
  const user = auth?.currentUser;
  if (!db || !user) { onChange({ status: 'error', members: [] }); return () => {}; }
  const stop = startMemberPresence(db, user.uid, user.displayName || '회원', onChange);
  stopPresence = stop;
  return () => { void stop(); };
}

export async function logoutMember() {
  await Promise.race([stopPresence(), new Promise<void>(resolve => setTimeout(resolve, 1500))]);
  if (auth) await signOut(auth);
}

export function subscribeMember(onChange: (state: MemberState) => void) {
  if (!auth || !db) { onChange({ status: 'signed-out' }); return () => {}; }
  const database = db;
  let stopMember = () => {};
  let stopContent = () => {};
  let generation = 0;
  let contentGeneration = 0;
  const stopAuth = onAuthStateChanged(auth, user => {
    const current = ++generation;
    ++contentGeneration;
    stopMember(); stopContent();
    stopMember = () => {}; stopContent = () => {};
    if (!user) { onChange({ status: 'signed-out' }); return; }
    const uid = user.uid;
    const emit = (state: MemberState) => {
      if (current === generation) onChange({ ...state, uid, displayName: user.displayName?.trim() || user.email || '회원' });
    };
    emit({ status: 'loading' });
    type Approval = 'loading' | 'active' | 'inactive' | 'error';
    const email = user.email?.toLowerCase();
    const approvals: Approval[] = ['loading', email && user.emailVerified ? 'loading' : 'inactive'];
    let contentStarted = false;
    const reconcile = () => {
      if (current !== generation) return;
      if (!approvals.includes('active')) {
        ++contentGeneration;
        stopContent(); stopContent = () => {}; contentStarted = false;
        if (approvals.includes('loading')) emit({ status: 'loading' });
        else if (approvals.includes('error')) emit({ status: 'error', message: '회원 승인 정보를 확인하지 못했습니다. 연결 상태와 운영진의 접근 규칙 설정을 확인해주세요.' });
        else emit({ status: 'pending' });
        return;
      }
      if (contentStarted) return;
      contentStarted = true;
      const contentVersion = ++contentGeneration;
      emit({ status: 'loading' });
      stopContent = onSnapshot(doc(database, 'memberContent', 'main'), { includeMetadataChanges: true }, snapshot => {
        if (contentVersion !== contentGeneration || current !== generation) return;
        if (snapshot.metadata.fromCache) { emit({ status: 'loading' }); return; }
        try {
          if (!snapshot.exists()) throw new Error('회원 공지와 영상 목록을 준비 중입니다.');
          emit({ status: 'ready', content: parseMemberContent(snapshot.data()) });
        } catch (error) {
          emit({ status: 'error', message: error instanceof Error ? error.message : '회원 콘텐츠를 확인해주세요.' });
        }
      }, error => {
        if (contentVersion === contentGeneration) emit({ status: 'error', message: memberErrorMessage(error) });
      });
    };
    const watch = (collection: string, id: string, index: number) => onSnapshot(
      doc(database, collection, id), { includeMetadataChanges: true }, snapshot => {
        if (current !== generation) return;
        approvals[index] = snapshot.metadata.fromCache ? 'loading'
          : snapshot.exists() && snapshot.data().active === true ? 'active' : 'inactive';
        reconcile();
      }, () => {
        if (current !== generation) return;
        approvals[index] = 'error';
        reconcile();
      },
    );
    const stopUid = watch('memberUID', uid, 0);
    const stopEmail = email && user.emailVerified ? watch('memberEmails', email, 1) : () => {};
    stopMember = () => { stopUid(); stopEmail(); };

  }, error => {
    ++generation; stopMember(); stopContent();
    onChange({ status: 'error', message: memberErrorMessage(error) });
  });
  return () => { ++generation; stopAuth(); stopMember(); stopContent(); };
}
