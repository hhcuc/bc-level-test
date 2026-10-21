import sys
base=sys.argv[1] if len(sys.argv)>1 else 'https://REPLACE/'
core=open('src/core.js').read(); gj=open('src/grader.js').read().replace('__BASE__',base); head=open('src/grader_head.html').read()
libs='<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>\n'
art=head+libs+'<script>\n'+core+'\n'+gj+'</script>\n'
open('/tmp/claude-0/-home-claude/8d80aaa7-ba95-5b05-9ffa-c14355813536/scratchpad/stage2-grader.html','w').write(art)
title=head.split('</title>')[0]+'</title>'
body=head[len(title):]
vg='<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="robots" content="noindex">\n'+title+'\n</head>\n<body style="margin:0">\n'+body+libs+'<script>\n'+core+'\n'+gj+'</script>\n</body>\n</html>\n'
open('dist/grade-bc7q4m2x.html','w').write(vg)
open('dist/index.html','w').write(open('src/viewer.html').read().replace('/*CORE*/',core))
open('dist/vercel.json','w').write('{"cleanUrls":true,"headers":[{"source":"/(.*)","headers":[{"key":"X-Robots-Tag","value":"noindex"}]}]}')
for f in ['dist/index.html','dist/grade-bc7q4m2x.html']:
    s=open(f).read(); import re
    js='\n'.join(re.findall(r'<script>(.*?)</script>',s,re.S)); open('/tmp/t/site/chk.js','w').write(js)
    import subprocess; r=subprocess.run(['node','--check','/tmp/t/site/chk.js'],capture_output=True,text=True); print(f, 'OK' if r.returncode==0 else r.stderr[:500])
