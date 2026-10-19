import importlib.util
import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

spec = importlib.util.spec_from_file_location('importer', 'scripts/import-member-videos.py')
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)

class ImportTests(unittest.TestCase):
    def test_patch_only_playlists_with_backup_and_version_guard(self):
        data = {'playlists': [{'id': 'one', 'title': 'One', 'url': 'https://youtube.com/playlist?list=example'}]}
        current = {'updateTime': '2026-10-19T00:00:00Z', 'fields': {'notice': {'stringValue': 'KEEP'}}}
        calls = []
        def request(req, timeout):
            calls.append(req)
            if req.method == 'GET':
                return io.BytesIO(json.dumps(current).encode())
            self.assertEqual(parse_qs(urlparse(req.full_url).query), {
                'updateMask.fieldPaths': ['playlists'], 'currentDocument.updateTime': [current['updateTime']]})
            body = json.loads(req.data)
            self.assertEqual(set(body['fields']), {'playlists'})
            return io.BytesIO(json.dumps(body).encode())
        old = Path.cwd()
        with tempfile.TemporaryDirectory() as directory:
            try:
                os.chdir(directory)
                with patch.object(importer, 'EMBEDDED_CONTENT', data), patch('sys.argv', ['importer', '--apply']), \
                     patch.object(importer.subprocess, 'check_output', return_value='test-token'), \
                     patch.object(importer, 'urlopen', side_effect=request), patch.dict(os.environ, {}, clear=True), \
                     patch('sys.stdout', new_callable=io.StringIO):
                    importer.main()
                backup = next(Path('firebase-private').glob('*.json'))
                self.assertEqual(json.loads(backup.read_text()), current)
                self.assertEqual(len(calls), 2)
            finally:
                os.chdir(old)

    def test_invalid_or_empty_data_rejected(self):
        for data in ({'playlists': []}, {'playlists': [{'id': 'x', 'title': 'x', 'url': 'javascript:alert(1)'}]}):
            with self.assertRaises(ValueError):
                importer.validate(data)

if __name__ == '__main__':
    unittest.main()
