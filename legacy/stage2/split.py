c=lambda s:'\n'.join(l.strip() for l in s.split('\n') if l.strip())+'\n'
base='https://bchoo-leveltest-788-9a4d.vercel.app/'
core=open('src/core.js').read()
open('dist/core.js','w').write(c(core))
v=open('src/viewer.html').read().replace('<script>\n/*CORE*/','<script src="/core.js"></script>\n<script>')
open('dist/index.html','w').write(c(v))
g=open('dist/grade-bc7q4m2x.html').read()
i=g.index('// ===== 2단계 레벨테스트 공통 엔진'); j=g.index("const isTopLevel=");j=g.index('\n',j)+1
g=g[:i].rstrip()[:-len('<script>')]+'<script src="/core.js"></script>\n<script>\n'+g[j:]
open('dist/grade-bc7q4m2x.html','w').write(c(g))
