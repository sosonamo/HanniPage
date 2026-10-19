#!/usr/bin/env python3
"""Import playlists using the operator's gcloud login; never service-account keys."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone
from urllib.parse import urlencode, urlparse, parse_qs
from urllib.request import Request, urlopen
from urllib.error import HTTPError

EMBEDDED_CONTENT = None
PROJECT = 'hannipage-9c2ff'


def validate(content):
    playlists = content.get('playlists') if isinstance(content, dict) else None
    if not isinstance(playlists, list) or not playlists:
        raise ValueError('영상 목록이 없거나 비어 있습니다. 가져오기를 중단합니다.')
    ids = set()
    for item in playlists:
        if not isinstance(item, dict) or any(not isinstance(item.get(k), str) or not item[k].strip() for k in ('id', 'title', 'url')):
            raise ValueError('모든 영상에 id, title, url 문자열이 필요합니다.')
        if item['id'] in ids:
            raise ValueError('중복된 영상 ID가 있습니다.')
        ids.add(item['id'])
        url = urlparse(item['url'])
        if url.scheme != 'https' or url.netloc not in ('youtube.com', 'www.youtube.com') or url.path != '/playlist' or not parse_qs(url.query).get('list'):
            raise ValueError('YouTube 재생목록 주소가 아닌 항목이 있습니다.')
    return playlists


def firestore_playlists(playlists):
    return {'arrayValue': {'values': [
        {'mapValue': {'fields': {k: {'stringValue': item[k]} for k in ('id', 'title', 'url')}}}
        for item in playlists
    ]}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true', help='Firebase에 실제 반영 (기본은 미리보기)')
    parser.add_argument('--input', default='firebase-private/member-content.json')
    parser.add_argument('--bundle', help='Cloud Shell에 업로드할 단일 파일 생성 (데이터 포함)')
    args = parser.parse_args()
    content = EMBEDDED_CONTENT if EMBEDDED_CONTENT is not None else json.loads(Path(args.input).read_text())
    playlists = validate(content)
    print(f'대상: {PROJECT} / memberContent/main')
    print(f'영상 {len(playlists)}개:')
    for item in playlists:
        print(' - ' + item['title'])
    if args.bundle:
        if args.apply:
            raise ValueError('--bundle과 --apply는 동시에 사용할 수 없습니다.')
        target = Path(args.bundle)
        source = Path(__file__).read_text()
        source = source.replace('EMBEDDED_CONTENT = None', 'EMBEDDED_CONTENT = ' + repr(content), 1)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(source)
        target.chmod(0o600)
        print('업로드용 단일 파일 생성 완료. 인증 정보는 포함되지 않습니다.')
        return
    if not args.apply:
        print('미리보기 완료. Firebase는 변경하지 않았습니다. --apply로 반영합니다.')
        return
    if os.environ.get('FIRESTORE_EMULATOR_HOST'):
        raise ValueError('에뮬레이터 환경변수를 해제하고 실행해주세요.')
    # Cloud Shell already has gcloud. The access token stays in memory only.
    token = subprocess.check_output(['gcloud', 'auth', 'print-access-token'], text=True).strip()
    endpoint = f'https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents/memberContent/main'
    def request(url, method='GET', data=None):
        req = Request(url, method=method, data=json.dumps(data).encode() if data is not None else None,
                      headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'})
        with urlopen(req, timeout=30) as response:
            return json.load(response)
    current = request(endpoint)
    if not current.get('updateTime'):
        raise ValueError('기존 문서 버전을 확인하지 못했습니다.')
    backup_dir = Path('firebase-private')
    backup_dir.mkdir(exist_ok=True)
    backup = backup_dir / ('member-content-backup-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ') + '.json')
    with open(backup, 'x', opener=lambda path, flags: os.open(path, flags, 0o600)) as output:
        json.dump(current, output, ensure_ascii=False, indent=2)
    query = urlencode({'updateMask.fieldPaths': 'playlists', 'currentDocument.updateTime': current['updateTime']})
    expected = firestore_playlists(playlists)
    result = request(endpoint + '?' + query, 'PATCH', {'fields': {'playlists': expected}})
    if result.get('fields', {}).get('playlists') != expected:
        raise ValueError('응답 검증에 실패했습니다. Firestore에서 결과를 확인해주세요.')
    print(f'완료: 영상 {len(playlists)}개를 반영했습니다. 공지와 회원 승인 정보는 유지했습니다.')
    print(f'변경 전 문서 백업: {backup}')


if __name__ == '__main__':
    try:
        main()
    except HTTPError as error:
        print(f'Firebase HTTP {error.code}: 권한과 문서를 확인해주세요. 409/412이면 다른 변경이 있어 중단된 것이므로 재실행하세요.', file=sys.stderr)
        sys.exit(1)
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f'가져오기 중단: {error}', file=sys.stderr)
        sys.exit(1)
