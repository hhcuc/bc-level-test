const REPORT_BASE='__BASE__';
const V=['significant','obvious','operate','relieve','constant','blurred','applause','awkward','enroll','pleaded'];
const S=[['중','as ~ as, 과거완료'],['중','not A but B, to부정사 보어'],['중','장소 부사구 도치, 분사 병렬'],['상','It was not until ~ that 강조'],['상','Had it not been for 가정법 도치'],['상','the 비교급, 가주어, what절, less A than B']];
const G=[['하','⑤','현재완료진행','1단계 21'],['하','⑤','강조 재귀대명사','1단계 22'],['하','③','사역동사 수동태','1단계 23'],['하','③','seem to부정사 전환','1단계 24'],['하','⑤','동명사 vs 현재분사','1단계 25'],['하','herself','재귀대명사 영작','1단계 52'],['하','It','가주어','1단계 54'],
['중','④','분사구문','1단계 26'],['중','⑤','get O p.p.','1단계 27'],['중','①','조건 부사절 시제','1단계 28'],['중','I entering','독립분사구문 영작','1단계 56'],['중','5형식','consider O C 영작','1단계 57'],['중','so~that','so ~ that 영작','1단계 58'],
['상','③','관계대명사 that/which','1단계 29'],['상','②','주어·동사 수일치','1단계 30'],['상','5 times','배수 비교 영작','1단계 60'],['상','②','수능어법 (a little)','3단계 수능어법 3'],['상','④','수능어법 (farther)','3단계 수능어법 5'],['상','turned','동사 자리','3단계 기출 응용'],['상','unhurried','보어 자리 형용사','3단계 기출']];
const R=[['하','⑤','도표','1단계 33'],['하','④','안내문 일치','1단계 34'],['하','②','심경','1단계 36'],['하','①','제목','1단계 38'],['하','②','빈칸(낱말)','1단계 39'],
['중','②','어휘 네모','1단계 42'],['중','⑤','제목','1단계 43'],['중','②','빈칸(구)','1단계 45'],['중','③','무관한 문장','1단계 46'],['중','③','연결어','1단계 47'],
['상','④','글의 순서','1단계 48'],['상','④','문장 삽입','1단계 49'],['상','③','빈칸 추론 · 수능기출','3단계 3'],['상','②','어휘 추론 · 수능기출','3단계 2'],['상','④','빈칸 추론 · 수능기출','3단계 4']];

let st;let isSample=true;
const $=id=>document.getElementById(id);
function blank(){return{v:Array(10).fill(null),s:Array(6).fill(null),g:Array(20).fill(null),r:Array(15).fill(null),l:Array(12).fill(null),lOn:false}}
function sample(){const o=x=>[...x].map(c=>c==='o'?1:c==='x'?0:null);
  return{v:o('ooxooxoxoo'),s:[3,2,3,2,1,1],g:o('ooooxooooxoxooxoxoxo'),r:o('oooooooxoooxoxx'),l:o('ooooxoooxooo'),lOn:true}}
const info=()=>({n:$('sName').value,sc:$('sSchool').value,d:$('sDate').value});
const cur=()=>model(st,info());

function cyc(a,i){a[i]=a[i]===null?1:a[i]===1?0:null}
function chip(label,ans,val,on){const b=document.createElement('button');b.className='it'+(val===1?' o':val===0?' x':'');b.type='button';
  b.innerHTML=`<b>${label}${val===1?' O':val===0?' X':''}</b>${ans?`<small>${esc(ans)}</small>`:''}`;b.setAttribute('aria-label',`${label}번 ${val===1?'정답':val===0?'오답':'미채점'}`);b.onclick=on;return b}

function renderParts(){
  const P=$('parts');P.innerHTML='';const sc=calc(st);
  const card=(title,score)=>{const c=document.createElement('div');c.className='card';c.innerHTML=`<div class="phead"><h2>${title}</h2><span class="pscore">${score}</span></div>`;P.appendChild(c);return c};
  let c=card('Part 1 · 어휘',`${fmt1(sc.v.pts)} / 7`);const iv=document.createElement('div');iv.className='items';
  V.forEach((w,i)=>iv.appendChild(chip(i+1,w,st.v[i],()=>{cyc(st.v,i);upd()})));c.appendChild(iv);
  c=card('Part 2 · 구문 해석·표기',`${sc.s.pts} / 18`);const sy=document.createElement('div');sy.className='syn';
  S.forEach((x,i)=>{const d=document.createElement('div');d.className='synitem';d.innerHTML=`<b>${i+1}번 · ${x[0]}</b><div>${x[1]}</div>`;
    const sg=document.createElement('div');sg.className='seg';[0,1,2,3].forEach(p=>{const b=document.createElement('button');b.type='button';b.textContent=p;b.setAttribute('aria-pressed',st.s[i]===p);b.setAttribute('aria-label',`${i+1}번 ${p}점`);b.onclick=()=>{st.s[i]=p;upd()};sg.appendChild(b)});
    d.appendChild(sg);sy.appendChild(d)});c.appendChild(sy);
  c.insertAdjacentHTML('beforeend','<div class="hint">해석 2점 + 구문 표시 1점</div>');
  [['g',G,'Part 3 · 문법',30],['r',R,'Part 4 · 독해',45]].forEach(([k,D,t,mx])=>{
    c=card(t,`${fmt1(sc[k].pts)} / ${mx}`);
    ['하','중','상'].forEach(lv=>{const row=document.createElement('div');row.className='lvrow';row.innerHTML=`<span class="lvlab">${lv} · 문항당 ${W[lv][k]}점</span>`;
      const it=document.createElement('div');it.className='items';D.forEach((x,i)=>{if(x[0]===lv)it.appendChild(chip(i+1,x[1],st[k][i],()=>{cyc(st[k],i);upd()}))});row.appendChild(it);c.appendChild(row)})});
  c=card('선택 · 듣기 (참고용)',st.lOn?`${sc.l} / 12`:'미응시');
  const tg=document.createElement('label');tg.style.cssText='display:flex;gap:8px;align-items:center;font-weight:700';tg.innerHTML=`<input type="checkbox" id="lOn" ${st.lOn?'checked':''}> 듣기 평가 응시`;
  tg.querySelector('input').onchange=e=>{st.lOn=e.target.checked;upd()};c.appendChild(tg);
  if(st.lOn){const il=document.createElement('div');il.className='items';st.l.forEach((v,i)=>il.appendChild(chip(i+1,'',v,()=>{cyc(st.l,i);upd()})));c.appendChild(il);
    c.insertAdjacentHTML('beforeend','<div class="hint">정답은 1단계 원본 정답지(1~5, 7~11, 16~17번)를 따릅니다. 총점에는 넣지 않습니다.</div>')}
}

function report(){
  const m=cur(),sc=m.sc;
  $('tot').textContent=m.total;$('tLisn').textContent=sc.l!=null?`듣기 ${sc.l}/12 (참고)`:'';
  $('rTitle').textContent=`${m.name} 상담 리포트`;$('rMeta').textContent=[m.school,m.date].filter(Boolean).join(' · ');
  $('bars').innerHTML=m.areas.map(([n,p,mx,t])=>`<div class="bar"><b>${n}</b><div class="track"><div class="fill" style="width:${p/mx*100}%"></div></div><span class="num">${fmt1(p)}/${mx}</span><span class="lvls">${t}<br><span class="lvchip">범위 ${rng(n)} · 추정 ${est(n,m.WR[n])}</span></span></div>`).join('');
  $('recs').innerHTML=m.recs.map(([a,s,b,k])=>`<tr><td><b>${a}</b></td><td><span class="stepchip s${s}">STEP ${s}</span></td><td>${esc(b)}</td><td>${k?`${rng(k)} · <b>${est(k,m.WR[k])}</b>`:'–'}</td></tr>`).join('');
  const x=$('m3');x.className='m3 '+m.m3.cls;
  x.innerHTML=`<span class="hint">화·목 M-3 하이퍼 (수능특강·고3 수능어법)</span><span class="verdict">${m.m3.vd}</span><ul class="checks">${m.m3.cks.map(c=>`<li data-m="${c[0]?'✓':'·'}">${c[1]}</li>`).join('')}</ul><span class="hint">다음 단계: ${m.m3.nx}</span>`;
  $('comment').textContent=m.lines.join('\n');
  $('sampleTag').hidden=!isSample;$('linkOut').hidden=true;
}
function upd(){renderParts();report()}

function mapTables(){
  $('mapG').innerHTML=G.map((x,i)=>`<tr><td>${i+1}</td><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td></tr>`).join('');
  $('mapR').innerHTML=R.map((x,i)=>`<tr><td>${i+1}</td><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td></tr>`).join('');
  $('mapS').innerHTML=S.map((x,i)=>`<tr><td>${i+1}</td><td>${x[0]}</td><td>${x[1]}</td></tr>`).join('');
}
function load(sm){isSample=sm;st=sm?sample():blank();$('sName').value=sm?'예시 학생':'';$('sSchool').value=sm?'○○중 2학년':'';upd()}
$('btnReset').onclick=()=>load(false);
$('btnSample').onclick=()=>load(true);
$('btnAllO').onclick=()=>{['v','g','r'].forEach(k=>st[k]=st[k].map(()=>1));st.s=st.s.map(()=>3);upd()};
['sName','sSchool','sDate'].forEach(id=>$(id).addEventListener('input',()=>{if(isSample)isSample=false;report()}));
$('btnCopy').onclick=async()=>{const t=$('comment');try{await navigator.clipboard.writeText(t.textContent);$('btnCopy').textContent='복사됨'}catch(e){const r=document.createRange();r.selectNodeContents(t);const s=getSelection();s.removeAllRanges();s.addRange(r);$('btnCopy').textContent='선택됨 · Ctrl+C'}setTimeout(()=>$('btnCopy').textContent='코멘트 복사',1800)};
const tabs=[['tab-grade','view-grade'],['tab-map','view-map']];
tabs.forEach(([t])=>$(t).onclick=()=>tabs.forEach(([t2,v2])=>{$(t2).setAttribute('aria-selected',t2===t);$(v2).hidden=t2!==t}));
try{$('sDate').value=new Date().toISOString().slice(0,10)}catch(e){}

// ---- 내보내기 ----
const exMsg=t=>$('exMsg').textContent=t;
const errMsg=e=>e&&e.code==='declined'?'저장을 취소했습니다.':e&&e.code==='rate_limited'?'잠시 후 다시 눌러 주세요.':'저장하지 못했습니다. 다시 시도해 주세요.';
async function run(label,fn){exMsg(label+' 만드는 중…');try{await fn();}catch(e){exMsg(errMsg(e))}}
$('exPng').onclick=()=>run('PNG',async()=>{const m=cur();await saveFile(fileBase(m)+'.png',await makePngBlob(m));exMsg('PNG(9:16)를 저장했습니다.')});
$('exPdf').onclick=()=>run('PDF',async()=>{const m=cur();await saveFile(fileBase(m)+'.pdf',await makePdfBlob(m));exMsg('A4 PDF를 저장했습니다.')});
$('exCopy').onclick=()=>{const m=cur();exMsg('이미지 만드는 중…');
  try{const p=makePngBlob(m);navigator.clipboard.write([new ClipboardItem({'image/png':p})]).then(()=>exMsg('이미지를 복사했습니다. 카카오톡 대화창에 붙여넣기(Ctrl+V) 하세요.'),()=>exMsg('이 화면에서는 이미지 복사가 막혀 있습니다. PNG 저장 또는 학부모 링크를 써 주세요.'))}
  catch(e){exMsg('이 화면에서는 이미지 복사가 막혀 있습니다. PNG 저장 또는 학부모 링크를 써 주세요.')}};
const linkBase=()=>isTopLevel&&location.protocol.startsWith('http')?location.origin+'/':REPORT_BASE;
$('exLink').onclick=async()=>{const url=linkBase()+'?r='+encodeState(st,info());const o=$('linkOut');o.value=url;o.hidden=false;
  try{await navigator.clipboard.writeText(url);exMsg('학부모용 링크를 복사했습니다. 카카오톡에 붙여넣어 보내세요.')}catch(e){o.focus();o.select();exMsg('링크가 선택되었습니다. Ctrl+C로 복사하세요.')}};
if(isTopLevel){$('exPrint').hidden=false;$('exPrint').onclick=()=>{$('printArea').innerHTML=a4Html(cur());setTimeout(()=>window.print(),300)}}
try{if(isTopLevel&&navigator.canShare&&navigator.canShare({files:[new File(['x'],'x.png',{type:'image/png'})]})){$('exShare').hidden=false;
  $('exShare').onclick=()=>run('이미지',async()=>{const m=cur();if(await shareBlob(await makePngBlob(m),fileBase(m)+'.png',m.name+' 레벨테스트 결과'))exMsg('공유 창을 열었습니다.')})}}catch(e){}
mapTables();load(true);
