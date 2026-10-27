#!/bin/bash
set -e
SP=$(cd "$(dirname "$0")" && pwd)
SITE=/home/user/jacksonfletcher108.github.io
cd $SP/twbuild && cp $SP/index.html src.html
npx -y tailwindcss@3.4.17 -c tailwind.config.js -i in.css -o out.css --minify >/dev/null 2>&1
python3 - <<PY
import re
s=open('$SP/index.html').read(); css=open('$SP/twbuild/out.css').read()
s=re.sub(r'<script src="https://cdn\.tailwindcss\.com/3\.4\.17"></script>\s*<script>\s*tailwind\.config = .*?</script>\n', lambda m: '<style>'+css+'</style>\n', s, flags=re.S)
s=s.replace('<meta name="claude:viewport-fit-sides" content="cover">\n','')
s=s.replace('<title>Supper</title>\n', open('$SP/head.html').read())
s=s.replace('  // expose the engine for testing in the console\n','  // engine hook for testing\n')
assert '<script src="https://cdn.tailwindcss' not in s and 'tailwind.config' not in s and 'claude' not in s.lower() and 'apple-touch-icon' in s
open('$SITE/mise/index.html','w').write(s)
PY
echo built
