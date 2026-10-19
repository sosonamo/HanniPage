import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, Timestamp, where, type Firestore } from 'firebase/firestore';

export const PRESENCE_TTL = 90_000;
export interface OnlineMember { uid: string; name: string }
export interface PresenceState { status: 'loading' | 'ready' | 'error'; members: OnlineMember[] }
interface Session extends OnlineMember { lastSeen: number }

export function onlineMembers(sessions: Session[], now: number): OnlineMember[] {
  const members = new Map<string, Session>();
  for (const session of sessions) {
    if (session.lastSeen <= now - PRESENCE_TTL) continue;
    if (!members.has(session.uid) || members.get(session.uid)!.lastSeen < session.lastSeen) members.set(session.uid, session);
  }
  return [...members.values()].sort((a, b) => a.name.localeCompare(b.name, 'ko')).map(({ uid, name }) => ({ uid, name }));
}

// Each mounted page gets a separate session so closing one tab cannot remove another.
export function startMemberPresence(db: Firestore, uid: string, name: string, onChange: (state: PresenceState) => void) {
  const ref = doc(collection(db, 'memberPresence'));
  let stopped = false;
  let deletion: Promise<void> | undefined;
  let writing = false;
  let sessions: Session[] = [];
  let ready = false;
  let stopSnapshot = () => {};
  let listenerGeneration = 0;
  const publish = () => {
    if (!stopped && ready) onChange({ status: 'ready', members: onlineMembers(sessions, Date.now()) });
  };
  const fail = () => {
    if (stopped) return;
    ready = false;
    sessions = [];
    onChange({ status: 'error', members: [] });
  };
  async function heartbeat() {
    if (stopped || writing) return;
    writing = true;
    try { await setDoc(ref, { uid, name, lastSeen: serverTimestamp() }); }
    catch { fail(); }
    finally { writing = false; }
  }
  function listen() {
    if (stopped) return;
    const current = ++listenerGeneration;
    stopSnapshot();
    // Move the query window periodically so old sessions do not accumulate in memory.
    stopSnapshot = onSnapshot(query(collection(db, 'memberPresence'), where('lastSeen', '>', Timestamp.fromMillis(Date.now() - PRESENCE_TTL))),
      { includeMetadataChanges: true }, snapshot => {
        if (stopped || current !== listenerGeneration) return;
        if (snapshot.metadata.fromCache) { ready = false; sessions = []; onChange({ status: 'loading', members: [] }); return; }
        sessions = snapshot.docs.flatMap(document => {
          const data = document.data();
          return typeof data.uid === 'string' && typeof data.name === 'string' && data.lastSeen instanceof Timestamp
            ? [{ uid: data.uid, name: data.name, lastSeen: data.lastSeen.toMillis() }] : [];
        });
        ready = true;
        publish();
      }, () => { if (current === listenerGeneration) fail(); });
  }
  const resume = () => { void heartbeat(); listen(); };
  const activate = () => { if (document.visibilityState === 'visible') resume(); };
  const hide = () => { void deleteDoc(ref).catch(() => {}); };
  onChange({ status: 'loading', members: [] });
  void heartbeat();
  listen();
  const beatTimer = window.setInterval(heartbeat, 30_000);
  const queryTimer = window.setInterval(listen, 60_000);
  const expiryTimer = window.setInterval(publish, 5_000);
  window.addEventListener('pagehide', hide);
  window.addEventListener('pageshow', resume);
  window.addEventListener('online', resume);
  document.addEventListener('visibilitychange', activate);
  return () => {
    if (stopped) return deletion ?? Promise.resolve();
    stopped = true;
    stopSnapshot();
    window.clearInterval(beatTimer); window.clearInterval(queryTimer); window.clearInterval(expiryTimer);
    window.removeEventListener('pagehide', hide);
    window.removeEventListener('pageshow', resume);
    window.removeEventListener('online', resume);
    document.removeEventListener('visibilitychange', activate);
    sessions = [];
    // Best effort: the heartbeat expires even if the browser cannot send this deletion.
    deletion = deleteDoc(ref).catch(() => {});
    return deletion;
  };
}
