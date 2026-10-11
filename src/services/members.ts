export interface MemberContent {
  videoId: string;
  videoTitle: string;
  notice: string;
}

const endpoint = import.meta.env.VITE_MEMBERS_API_URL?.trim() || '';
export const isMembersConfigured = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint);

export async function loginMember(email: string, password: string): Promise<MemberContent> {
  if (!isMembersConfigured) throw new Error('회원 로그인 연결을 준비 중입니다.');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      // URLSearchParams 사용: 인증 정보는 URL 대신 본문으로 전송합니다.
      body: new URLSearchParams({ action: 'login', email: email.trim(), password }),
      credentials: 'omit',
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('로그인 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    const result = await response.json();
    if (result.ok !== true) {
      throw new Error(typeof result.message === 'string' ? result.message : '로그인에 실패했습니다.');
    }
    const content = result.content;
    if (!content || typeof content.videoId !== 'string' || !/^[A-Za-z0-9_-]{11}$/.test(content.videoId)
      || typeof content.videoTitle !== 'string' || typeof content.notice !== 'string') {
      throw new Error('회원 콘텐츠 응답을 확인할 수 없습니다.');
    }
    return content;
  } catch (error) {
    if (error instanceof TypeError || error instanceof SyntaxError || (error instanceof Error && error.name === 'AbortError')) {
      throw new Error('로그인 서버 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
