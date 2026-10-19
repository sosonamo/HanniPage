export interface MemberPlaylist { id: string; title: string; url: string; }
export interface MemberContent { notice: string; playlists: MemberPlaylist[]; resources: MemberPlaylist[]; }

export function parseMemberContent(value: unknown): MemberContent {
  const data = value as Partial<MemberContent> | null;
  if (!data || typeof data.notice !== 'string' || !Array.isArray(data.playlists)) {
    throw new Error('회원 콘텐츠 설정을 확인해주세요. 운영진에게 문의해주세요.');
  }
  const ids = new Set<string>();
  const playlists = data.playlists.map(item => {
    if (!item || typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id)
      || typeof item.title !== 'string' || !item.title.trim() || typeof item.url !== 'string') {
      throw new Error('영상 목록 설정을 확인해주세요.');
    }
    const url = new URL(item.url);
    if (url.protocol !== 'https:' || !['youtube.com', 'www.youtube.com'].includes(url.hostname)
      || url.pathname !== '/playlist' || !url.searchParams.get('list') || url.username || url.password) {
      throw new Error('YouTube 재생목록 주소를 확인해주세요.');
    }
    ids.add(item.id);
    return { id: item.id, title: item.title, url: url.href };
  });
  if (data.resources !== undefined && !Array.isArray(data.resources)) throw new Error('공유 자료 목록을 확인해주세요.');
  const resourceIds = new Set<string>();
  const resources = (data.resources ?? []).map(item => {
    if (!item || typeof item.id !== 'string' || !item.id.trim() || resourceIds.has(item.id)
      || typeof item.title !== 'string' || !item.title.trim() || typeof item.url !== 'string') {
      throw new Error('공유 자료 목록을 확인해주세요.');
    }
    const url = new URL(item.url);
    if (url.protocol !== 'https:' || !['drive.google.com', 'docs.google.com'].includes(url.hostname) || url.port || url.username || url.password
      || !/^https:\/\/(?:drive\.google\.com\/(?:file\/d\/[A-Za-z0-9_-]+|drive\/(?:u\/\d+\/)?folders\/[A-Za-z0-9_-]+|open\?id=[A-Za-z0-9_-]+)|docs\.google\.com\/(?:document|spreadsheets)\/(?:u\/\d+\/)?d\/[A-Za-z0-9_-]+)(?:[/?&#][^\s]*)?$/.test(item.url)) {
      throw new Error('Google Drive 파일·폴더 또는 Google 문서·스프레드시트 공유 주소를 확인해주세요.');
    }
    resourceIds.add(item.id);
    return { id: item.id, title: item.title, url: url.href };
  });
  return { notice: data.notice, playlists, resources };
}
