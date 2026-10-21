const ACADEMY_TEL='0507-1389-3392';
// ---- 문항 데이터 ----
const L3=[9,13,15];
const LKEY=['③','④','①','①','②','④','⑤','②','②','④','⑤','④','④','⑤','①','③','⑤']; // [3점] 표시 듣기 문항
const KEY=[ // [번호, 영역, 난도, 정답, 포인트]
[21,'문법','하','⑤*','현재완료진행 (정답 보기 오류 주의)'],[22,'문법','하','⑤','강조 재귀대명사'],[23,'문법','하','③','사역동사 수동태'],[24,'문법','하','③','seem to → It seems that'],[25,'문법','하','⑤','동명사 vs 현재분사'],
[26,'문법','중','④','분사구문 made→making'],[27,'문법','중','⑤','get O p.p.'],[28,'문법','중','①','조건 부사절 시제'],[29,'문법','상','③','관계대명사 which/that'],[30,'문법','상','②','수일치'],
[31,'독해','하','⑤','글의 목적'],[32,'독해','하','⑤','주제'],[33,'독해','하','⑤','도표'],[34,'독해','하','④','안내문'],[35,'독해','하','①','분위기'],[36,'독해','하','②','심경'],[37,'독해','하','①','글의 목적'],[38,'독해','하','①','제목'],[39,'독해','하','②','빈칸(낱말)'],[40,'독해','하','⑤','안내문'],
[41,'독해','중','④','내용 일치'],[42,'독해','중','②','어휘 네모'],[43,'독해','중','⑤','제목'],[44,'독해','중','③','지칭'],[45,'독해','중','②','빈칸(구)'],[46,'독해','중','③','무관한 문장'],[47,'독해','중','③','연결어'],
[48,'독해','상','④','글의 순서'],[49,'독해','상','④','문장 삽입'],[50,'독해','상','②','요약'],
[51,'서술형','하','has lost','현재완료(결과)'],[52,'서술형','하','herself','재귀대명사'],[53,'서술형','하','Was / made','의문문 수동태'],[54,'서술형','하','It','가주어'],[55,'서술형','하',"I'm looking forward to receiving your response.",'look forward to -ing'],
[56,'서술형','중','I entering the room','독립분사구문'],[57,'서술형','중','I have considered him as my true friend.','consider O as C'],[58,'서술형','중',"He was so young that he couldn't understand the novel.",'so ~ that'],
[59,'서술형','상',"isn't an actress (is not)",'as if 가정법 과거'],[60,'서술형','상','five times as many books as','배수 as 원급 as']];
const SYN=[['Among those present / was / a little boy (named Tom). — 부사구 도치, 과거분사 후치수식','참석한 사람들 중에는 Tom이라는 이름의 어린 소년이 있었다.'],
['There used to be / an old oak tree / around here. — used to (과거 상태)','예전에 이 근처에 오래된 참나무 한 그루가 있었다. (oak tree: 참나무)'],
['He / heard / the men / having an argument / in the next room. — 지각동사 + O + 현재분사','그는 그 남자들이 옆방에서 말다툼하는 것을 들었다.'],
['I / found / the movie / as interesting as (my father had said it would be). — find O C, as ~ as','나는 그 영화가 아버지께서 말씀하셨던 만큼 재미있다는 것을 알았다.'],
['The end of study / is / not to possess knowledge (as ~ purse), but to make knowledge a part of ourselves. — not A but B','학문의 목적은 사람이 지갑 속 동전을 소유하듯 지식을 소유하는 것이 아니라, 지식을 우리 자신의 일부로 만드는 것이다.']];
const AREA={문법:{pts:2,max:20,book:['중2 문법','중3 문법']},독해:{pts:2,max:40,book:['중2 독해','중3 독해']},서술형:{pts:1,max:10,book:['중2 문법 (영작)','중3 문법 (영작)']}};
// 난이도 척도: 7=중1, 8=중2, 9=중3, 10=고1, 11=고2
const LVR={듣기:[8,10],문법:[7,9.5],독해:[7,10],서술형:[7,9.5],구문:[8,9.5]};
const SC0=7,SC1=11;
const clamp01=x=>Math.max(0,Math.min(1,x));
const gfmt=x=>x<10?'중'+(x-6).toFixed(1).replace(/\.0$/,''):'고'+(x-9).toFixed(1).replace(/\.0$/,'');
const rng=k=>`${gfmt(LVR[k][0])}~${gfmt(LVR[k][1])}`;
const estV=(k,w)=>LVR[k][0]+(LVR[k][1]-LVR[k][0])*clamp01(w);
const est=(k,w)=>gfmt(estV(k,w));
const fmt1=x=>(+x.toFixed(1)).toString();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// ---- 상태 ----
const $=id=>document.getElementById(id);
let st,isSample=true;
function blank(){return{l:Array(17).fill(null),k:Array(40).fill(null),s:Array(10).fill(null),lOn:true}}
function sample(){const o=x=>[...x].map(c=>c==='o'?1:c==='x'?0:null);
  return{l:o('ooooxoooxooooxooo'),k:o('ooooooxooxooooooooxooxoooooxoxooooxoxoxx'),s:o('oooooxoxox'),lOn:true}}
const info=()=>({n:$('sName').value,sc:$('sSchool').value,d:$('sDate').value});

function calc(){
  const r={};
  // 듣기
  let lp=0,lc=0;st.l.forEach((v,i)=>{if(v===1){lc++;lp+=L3.includes(i+1)?2:1}});r.듣기={pts:lp,max:20,c:lc,n:17,w:lp/20};
  for(const a in AREA){const o={pts:0,max:AREA[a].max,c:0,n:0,lv:{하:[0,0],중:[0,0],상:[0,0]}};
    KEY.forEach((q,i)=>{if(q[1]!==a)return;o.n++;o.lv[q[2]][1]++;if(st.k[i]===1){o.c++;o.pts+=AREA[a].pts;o.lv[q[2]][0]++}});
    o.w=o.pts/o.max;r[a]=o}
  const sp=st.s.filter(x=>x===1).length;r.구문={pts:sp,max:10,c:sp,n:10,w:sp/10,tr:[0,2,4,6,8].filter(i=>st.s[i]===1).length,sy:[1,3,5,7,9].filter(i=>st.s[i]===1).length};
  const raw=r.문법.pts+r.독해.pts+r.서술형.pts+r.구문.pts+(st.lOn?r.듣기.pts:0);
  r.total=st.lOn?raw:raw*100/80;r.raw=raw;
  const hi=['문법','독해','서술형'].reduce((a,k)=>[a[0]+r[k].lv.상[0],a[1]+r[k].lv.상[1]],[0,0]);r.hi=hi;
  return r;
}
function model(){
  const r=calc(),I=info(),name=I.n.trim()||'학생';
  const stepOf=w=>w>=.7?2:1;
  const sG=stepOf(r.문법.w),sR=(r.독해.w>=.7&&r.독해.lv.상[0]>=2)?2:1,sW=stepOf(r.서술형.w),sS=r.구문.pts>=8?2:1;
  const recs=[['구문독해',sS,['Basic','Intermediate'][sS-1],'구문'],['독해',sR,AREA.독해.book[sR-1],'독해'],['문법',(r.문법.w>=.7&&r.서술형.w>=.6)?2:1,null,'문법'],['어휘',1,'중등실력 단어장 (2단계에서 재확인)',null]];
  recs[2][2]=AREA.문법.book[recs[2][1]-1];
  const total=fmt1(r.total);
  const go2=r.total>=80&&r.hi[0]>=Math.ceil(r.hi[1]/2);
  const basic=r.total<50||r.문법.lv.하[0]<3;
  const [cls,vd,nx]=go2?['go','2단계 테스트 응시 권장','2단계 결과로 STEP 2~3과 M-3 하이퍼 여부 판단']:basic?['no','STEP 1 · 기초 보강','중2 교재 진입 전 기본 문법·문장 구조 정리']:['hold','STEP 1~2 배치','영역별 결과대로 과목별 수강'];
  const core=go2?2:(recs.filter(x=>x[1]===2).length>=2?2:1);
  const list=[['문법',r.문법.w],['독해',r.독해.w],['서술형',r.서술형.w],['구문',r.구문.w]].concat(st.lOn?[['듣기',r.듣기.w]]:[]).sort((a,b)=>a[1]-b[1]);
  const lines=[`${name} 학생은 ${st.lOn?'':'듣기 제외 환산 '}${total}점으로, 종합 STEP ${core} 수준입니다.`,
    `가장 강한 영역은 ${list[list.length-1][0]}, 보완이 필요한 영역은 ${list[0][0]}입니다.`,
    r.구문.tr>r.구문.sy+1?'구문은 해석은 되지만 문장 구조(S·V·O·C, 수식 관계) 표시가 약합니다.':'',
    r.서술형.w<r.문법.w-.25?'객관식 문법보다 영작(서술형)에서 크게 떨어져, 써 보는 연습이 필요합니다.':'',
    `권장 배치: 구문독해 ${recs[0][2]}, 독해 ${recs[1][2]}, 문법 ${recs[2][2]}.`,`다음 단계: ${vd} — ${nx}.`].filter(Boolean);
  const lvTxt=o=>`하 ${o.lv.하[0]}/${o.lv.하[1]} · 중 ${o.lv.중[0]}/${o.lv.중[1]} · 상 ${o.lv.상[0]}/${o.lv.상[1]}`;
  const areas=[];
  if(st.lOn)areas.push(['듣기',r.듣기.pts,20,`${r.듣기.c}/17 정답`,null]);
  areas.push(['문법',r.문법.pts,20,lvTxt(r.문법),recs[2][1]],['독해',r.독해.pts,40,lvTxt(r.독해),sR],['서술형',r.서술형.pts,10,lvTxt(r.서술형),sW],['구문',r.구문.pts,10,`해석 ${r.구문.tr}/5 · 구문 ${r.구문.sy}/5`,sS]);
  const WR={};areas.forEach(a=>WR[a[0]]=r[a[0]].w);
  return{name,school:I.sc,date:I.d,r,total,core,recs,areas,WR,lines,nxt:{cls,vd,nx},lOn:st.lOn};
}

// ---- 화면 ----
function cyc(a,i){a[i]=a[i]===null?1:a[i]===1?0:null}
function chip(label,ans,val,on,extra){const b=document.createElement('button');b.className='it'+(val===1?' o':val===0?' x':'');b.type='button';
  b.innerHTML=`<b>${label}${val===1?' O':val===0?' X':''}</b>${ans?`<small>${esc(ans)}</small>`:''}${extra?`<small>${extra}</small>`:''}`;b.setAttribute('aria-label',`${label}번 ${val===1?'정답':val===0?'오답':'미채점'}`);b.onclick=on;return b}
function renderParts(){
  const P=$('parts');P.innerHTML='';const r=calc();
  const card=(t,s)=>{const c=document.createElement('div');c.className='card';c.innerHTML=`<div class="phead"><h2>${t}</h2><span class="pscore">${s}</span></div>`;P.appendChild(c);return c};
  let c=card('듣기 1~17',st.lOn?`${r.듣기.pts} / 20`:'미응시');
  const tg=document.createElement('label');tg.style.cssText='display:flex;gap:8px;align-items:center;font-weight:700';tg.innerHTML=`<input type="checkbox" id="lOn" ${st.lOn?'checked':''}> 듣기 평가 응시`;
  tg.querySelector('input').onchange=e=>{st.lOn=e.target.checked;upd()};c.appendChild(tg);
  if(st.lOn){const it=document.createElement('div');it.className='items';st.l.forEach((v,i)=>it.appendChild(chip(i+1,LKEY[i],v,()=>{cyc(st.l,i);upd()},L3.includes(i+1)?'2점':'')));c.appendChild(it);
    c.insertAdjacentHTML('beforeend','<div class="hint">[3점] 표시 문항(9·13·15번)은 2점입니다.</div>')}
  ['문법','독해','서술형'].forEach(a=>{c=card(`${a} ${a==='문법'?'21~30':a==='독해'?'31~50':'51~60'}`,`${fmt1(r[a].pts)} / ${AREA[a].max}`);
    ['하','중','상'].forEach(lv=>{const row=document.createElement('div');row.className='lvrow';row.innerHTML=`<span class="lvlab">${lv} · 문항당 ${AREA[a].pts}점</span>`;
      const it=document.createElement('div');it.className='items';KEY.forEach((q,i)=>{if(q[1]===a&&q[2]===lv)it.appendChild(chip(q[0],q[3],st.k[i],()=>{cyc(st.k,i);upd()}))});row.appendChild(it);c.appendChild(row)})});
  c=card('구문 해석·표기 (5문장)',`${r.구문.pts} / 10`);const sy=document.createElement('div');sy.className='syn';
  SYN.forEach((x,i)=>{const d=document.createElement('div');d.className='synitem';d.innerHTML=`<b>${i+1}번</b>`;const row=document.createElement('div');row.className='items';
    row.appendChild(chip('해석','',st.s[i*2],()=>{cyc(st.s,i*2);upd()}));row.appendChild(chip('구문','',st.s[i*2+1],()=>{cyc(st.s,i*2+1);upd()}));d.appendChild(row);sy.appendChild(d)});
  c.appendChild(sy);c.insertAdjacentHTML('beforeend','<div class="hint">문장마다 해석 1점, 구문 표시 1점. 모범 답안은 \'정답·문항표\' 탭에 있습니다.</div>');
}
function report(){
  const m=model();
  $('tot').textContent=m.total;$('tNote').textContent=m.lOn?`원점수 ${m.r.raw}/100`:`듣기 제외 · 원점수 ${m.r.raw}/80`;
  $('rTitle').textContent=`${m.name} 상담 리포트`;$('rMeta').textContent=[m.school,m.date].filter(Boolean).join(' · ');
  $('bars').innerHTML=m.areas.map(([n,p,mx,t])=>`<div class="bar"><b>${n}</b><div class="track"><div class="fill" style="width:${p/mx*100}%"></div></div><span class="num">${fmt1(p)}/${mx}</span><span class="lvls">${t}<br><span class="lvchip">범위 ${rng(n)} · 추정 ${est(n,m.WR[n])}</span></span></div>`).join('');
  $('recs').innerHTML=m.recs.map(([a,s,b,k])=>`<tr><td><b>${a}</b></td><td><span class="stepchip s${s}">STEP ${s}</span></td><td>${esc(b)}</td><td>${k?`${rng(k)} · <b>${est(k,m.WR[k])}</b>`:'–'}</td></tr>`).join('');
  const x=$('next');x.className='m3 '+m.nxt.cls;x.innerHTML=`<span class="hint">다음 단계</span><span class="verdict">${m.nxt.vd}</span><span class="hint">${m.nxt.nx}</span>`;
  $('comment').textContent=m.lines.join('\n');$('sampleTag').hidden=!isSample;
}
function upd(){renderParts();report()}
function mapTables(){
  $('mapK').innerHTML=KEY.map(q=>`<tr><td>${q[0]}</td><td>${q[1]}</td><td>${q[2]}</td><td>${esc(q[3])}</td><td>${q[4]}</td></tr>`).join('');
  $('mapS').innerHTML=SYN.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x[0])}</td><td>${esc(x[1])}</td></tr>`).join('');
}

// ---- 내보내기 템플릿 ----
const C={ink:'#3E2A1E',mut:'#7A5E48',line:'#EADBBE',cream:'#FBF6E9',wheat:'#E3C38E',wal:'#8A5A36',track:'#F1E6CF'};
const STEPC=[null,['#F6E7B8','#3E2A1E'],['#E3C38E','#3E2A1E'],['#8A5A36','#FFFFFF'],['#4A3020','#F6E7B8']];
const chipS=(n,fs=12)=>`<span style="display:inline-block;background:${STEPC[n][0]};color:${STEPC[n][1]};font-weight:900;font-size:${fs}px;line-height:1.5;border-radius:6px;padding:1px 8px;white-space:nowrap">STEP ${n}</span>`;
const NXC={go:['#E3F1E6','#2F7A4B'],hold:['#FFF0C7','#8A5A00'],no:['#F6EDE4','#7A5E48']};
function lvScale(k,w,h){const [a,b]=LVR[k];const p=x=>(x-SC0)/(SC1-SC0)*100;const e=p(estV(k,w)),d=h+6;
  return `<div style="position:relative;height:${d}px"><div style="position:absolute;left:0;right:0;top:3px;height:${h}px;background:${C.track};border-radius:${h}px"></div><div style="position:absolute;left:${p(a)}%;width:${p(b)-p(a)}%;top:3px;height:${h}px;background:${C.wheat};border-radius:${h}px"></div><div style="position:absolute;left:${e}%;margin-left:-${d/2}px;top:0;width:${d}px;height:${d}px;border-radius:50%;background:${C.wal};border:2px solid #FFFFFF;box-sizing:border-box"></div></div>`}
const axis=fs=>`<div style="display:flex;justify-content:space-between;font-size:${fs}px;color:${C.mut};font-weight:700"><span>중1</span><span>중2</span><span>중3</span><span>고1</span><span>고2</span></div>`;
const FONT=`font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif`,SERIF=`font-family:'Noto Serif KR',Georgia,serif`;
const stepCell=s=>s?chipS(s,10.5):'';
function a4Html(m){
  const meta=[m.school,m.date].filter(Boolean).map(esc).join(' · ');
  const bars=m.areas.map(([n,p,mx,t])=>`<div style="display:grid;grid-template-columns:62px 150px 1fr 96px;gap:14px;align-items:center;padding:9px 0;border-top:1px solid ${C.line}"><b style="font-size:15px">${n}</b><div><div style="font-size:15px;font-weight:900">${fmt1(p)} <span style="font-size:12px;font-weight:500;color:${C.mut}">/ ${mx}</span></div><div style="font-size:11px;color:${C.mut}">${t}</div></div><div>${lvScale(n,m.WR[n],8)}<div style="font-size:11px;color:${C.mut};margin-top:3px">시험 범위 ${rng(n)}</div></div><div style="text-align:right"><div style="font-size:11px;color:${C.mut}">추정 수준</div><div style="font-size:17px;font-weight:900;color:${C.wal}">${est(n,m.WR[n])}</div></div></div>`).join('');
  const td=`padding:8px 10px;border-top:1px solid ${C.line}`;
  const recs=m.recs.map(([a,s,b,k])=>`<tr><td style="${td};font-weight:700">${a}</td><td style="${td}">${chipS(s)}</td><td style="${td}">${esc(b)}</td><td style="${td};color:${C.mut}">${k?`${rng(k)} · <b style="color:${C.ink}">${est(k,m.WR[k])}</b>`:'–'}</td></tr>`).join('');
  const [nb,nf]=NXC[m.nxt.cls];
  return `<div style="width:794px;height:1122px;flex:none;box-sizing:border-box;padding:46px 50px 34px;background:#FFFFFF;color:${C.ink};${FONT};display:flex;flex-direction:column;gap:16px;overflow:hidden">
  <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid ${C.ink};padding-bottom:14px"><div><div style="font-size:11px;font-weight:700;letter-spacing:3px;color:${C.wal}">BRYAN CHU EDUCATION · 초·중등부</div><div style="${SERIF};font-size:30px;font-weight:900;margin-top:4px">1단계 레벨테스트 결과 리포트</div></div><div style="text-align:right"><div style="${SERIF};font-size:24px;font-weight:900">${esc(m.name)}</div><div style="font-size:12px;color:${C.mut}">${meta}</div></div></div>
  <div style="display:flex;gap:18px;align-items:stretch"><div style="width:180px;flex:none;background:${C.cream};border-radius:14px;padding:18px;display:flex;flex-direction:column;justify-content:center;gap:6px"><div style="font-size:12px;font-weight:700;color:${C.mut}">총점${m.lOn?'':' (듣기 제외 환산)'}</div><div><span style="${SERIF};font-size:52px;font-weight:900;line-height:1">${m.total}</span><span style="font-size:14px;color:${C.mut}"> / 100</span></div><div style="margin-top:6px">${chipS(m.core,14)} <span style="font-size:12px;color:${C.mut}">종합</span></div></div>
  <div style="flex:1;min-width:0"><div style="display:grid;grid-template-columns:62px 150px 1fr 96px;gap:14px;font-size:11px;color:${C.mut};font-weight:700;padding-bottom:4px"><span>영역</span><span>점수</span>${axis(10)}<span style="text-align:right">난이도</span></div>${bars}</div></div>
  <div><div style="${SERIF};font-size:17px;font-weight:900;margin-bottom:6px">추천 배치 · 연결 교재</div><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr style="background:${C.cream};font-size:11.5px;color:${C.mut}"><th style="text-align:left;padding:7px 10px">영역</th><th style="text-align:left;padding:7px 10px">추천 단계</th><th style="text-align:left;padding:7px 10px">연결 교재</th><th style="text-align:left;padding:7px 10px">난이도 (범위 · 추정)</th></tr></thead><tbody>${recs}</tbody></table></div>
  <div style="background:${nb};border:1.5px solid ${nf};border-radius:12px;padding:12px 16px"><div style="font-size:11px;color:${C.mut}">다음 단계</div><div style="font-size:16px;font-weight:900;color:${nf}">${m.nxt.vd}</div><div style="font-size:12px;color:${C.mut}">${m.nxt.nx}</div></div>
  <div style="flex:1;min-height:0;border:1.5px dashed ${C.wheat};border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:6px"><div style="${SERIF};font-size:16px;font-weight:900">상담 코멘트</div>${m.lines.map(l=>`<div style="font-size:13px;line-height:1.65">${esc(l)}</div>`).join('')}</div>
  <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:${C.mut};border-top:1px solid ${C.line};padding-top:10px"><span><b style="color:${C.ink}">브추교육학원</b> · 상담 ${ACADEMY_TEL}</span><span>STEP 1 기초 · STEP 2 중등 완성 · STEP 3 예비고1 · STEP 4 특목·자사고</span></div></div>`;
}
function phoneHtml(m){
  const meta=[m.school,m.date].filter(Boolean).map(esc).join(' · ');
  const rows=m.areas.map(([n,p,mx,t,s])=>`<div style="display:flex;flex-direction:column;gap:3px;padding:6px 0;border-top:1px solid ${C.line}"><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13.5px;font-weight:900">${n} <span style="font-size:11px;font-weight:500;color:${C.mut}">${fmt1(p)}/${mx}</span></span><span style="display:flex;gap:6px;align-items:center"><span style="font-size:12.5px;font-weight:900;color:${C.wal}">${est(n,m.WR[n])}</span>${stepCell(s)}</span></div>${lvScale(n,m.WR[n],6)}</div>`).join('');
  const place=m.recs.slice(0,3).map(([a,s,b])=>`<div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0"><span style="color:${C.mut}">${a}</span><b>${esc(b)}</b></div>`).join('');
  const [nb,nf]=NXC[m.nxt.cls];
  return `<div style="width:360px;height:640px;flex:none;box-sizing:border-box;padding:22px 22px 16px;background:#FFFFFF;color:${C.ink};${FONT};display:flex;flex-direction:column;gap:9px;overflow:hidden">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid ${C.ink};padding-bottom:9px"><div><div style="font-size:9px;font-weight:700;letter-spacing:2px;color:${C.wal}">BRYAN CHU EDUCATION</div><div style="${SERIF};font-size:19px;font-weight:900;margin-top:2px">레벨테스트 결과</div></div><div style="text-align:right"><div style="${SERIF};font-size:17px;font-weight:900">${esc(m.name)}</div><div style="font-size:10px;color:${C.mut}">${meta}</div></div></div>
  <div style="display:flex;justify-content:space-between;align-items:center;background:${C.cream};border-radius:12px;padding:10px 14px"><div><div style="font-size:10.5px;font-weight:700;color:${C.mut}">총점</div><span style="${SERIF};font-size:38px;font-weight:900;line-height:1">${m.total}</span><span style="font-size:12px;color:${C.mut}"> / 100</span></div><div style="text-align:right;display:flex;flex-direction:column;gap:4px;align-items:flex-end"><span style="font-size:10.5px;color:${C.mut}">종합 수준</span>${chipS(m.core,14)}</div></div>
  <div><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px"><span style="font-size:12px;font-weight:900">영역별 난이도</span><span style="font-size:9.5px;color:${C.mut}">● 추정 수준 · 색 띠 시험 범위</span></div>${axis(9)}${rows}</div>
  <div style="background:${C.cream};border-radius:10px;padding:7px 12px"><div style="font-size:12px;font-weight:900;margin-bottom:1px">추천 배치</div>${place}</div>
  <div style="display:flex;flex-direction:column;gap:3px;padding:0 2px">${m.lines.filter(l=>!/^(권장|다음)/.test(l)).slice(1,3).map(l=>`<div style="font-size:11.5px;line-height:1.55">· ${esc(l)}</div>`).join('')}</div>
  <div style="background:${nb};border:1.5px solid ${nf};border-radius:10px;padding:7px 12px;font-size:12px;font-weight:900;color:${nf}">${m.nxt.vd}</div>
  <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;font-size:10.5px;color:${C.mut};border-top:1px solid ${C.line};padding-top:8px"><b style="color:${C.ink}">브추교육학원</b><span>상담 ${ACADEMY_TEL}</span></div></div>`;
}
let __rid=0;
async function renderCanvas(html,w,h,scale){const id='__cap'+(++__rid);const host=document.createElement('div');host.id=id;
  host.style.cssText=`position:fixed;left:-40000px;top:0;width:${w}px;height:${h}px;z-index:-1`;host.innerHTML=html;document.body.appendChild(host);
  try{try{await Promise.all(['400 14px "Noto Sans KR"','700 14px "Noto Sans KR"','900 14px "Noto Sans KR"','900 14px "Noto Serif KR"'].map(f=>document.fonts.load(f)));await document.fonts.ready}catch(e){}
    return await html2canvas(host.firstElementChild,{scale,backgroundColor:'#FFFFFF',width:w,height:h,windowWidth:Math.max(w,1200),scrollX:0,scrollY:0,onclone:d=>{const c=d.getElementById(id);if(c){c.style.left='0px';c.style.zIndex='9999'}}})}finally{host.remove()}}
async function makePngBlob(m){const c=await renderCanvas(phoneHtml(m),360,640,3);return await new Promise(r=>c.toBlob(r,'image/png'))}
async function makePdfBlob(m){const c=await renderCanvas(a4Html(m),794,1122,2);const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4'});pdf.addImage(c.toDataURL('image/jpeg',0.93),'JPEG',0,0,210,297);return pdf.output('blob')}
async function saveFile(filename,blob){let dl=null;try{if(window.claude&&window.claude.use)dl=await window.claude.use('downloads')}catch(e){}
  if(dl){await dl.save({filename,data:blob});return}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000)}
const fileBase=m=>`${m.name}_1단계_레벨테스트${m.date?'_'+m.date:''}`.replace(/[\\/:*?"<>|]/g,'');

// ---- 이벤트 ----
function load(sm){isSample=sm;st=sm?sample():blank();$('sName').value=sm?'예시 학생':'';$('sSchool').value=sm?'○○중 1학년':'';upd()}
$('btnReset').onclick=()=>load(false);$('btnSample').onclick=()=>load(true);
$('btnAllO').onclick=()=>{st.l=st.l.map(()=>1);st.k=st.k.map(()=>1);st.s=st.s.map(()=>1);upd()};
['sName','sSchool','sDate'].forEach(id=>$(id).addEventListener('input',()=>{if(isSample)isSample=false;report()}));
$('btnCopy').onclick=async()=>{const t=$('comment');try{await navigator.clipboard.writeText(t.textContent);$('btnCopy').textContent='복사됨'}catch(e){const r=document.createRange();r.selectNodeContents(t);const s=getSelection();s.removeAllRanges();s.addRange(r);$('btnCopy').textContent='선택됨 · Ctrl+C'}setTimeout(()=>$('btnCopy').textContent='코멘트 복사',1800)};
const tabs=[['tab-grade','view-grade'],['tab-map','view-map']];
tabs.forEach(([t])=>$(t).onclick=()=>tabs.forEach(([t2,v2])=>{$(t2).setAttribute('aria-selected',t2===t);$(v2).hidden=t2!==t}));
try{$('sDate').value=new Date().toISOString().slice(0,10)}catch(e){}
const exMsg=t=>$('exMsg').textContent=t;
const errMsg=e=>e&&e.code==='declined'?'저장을 취소했습니다.':e&&e.code==='rate_limited'?'잠시 후 다시 눌러 주세요.':'저장하지 못했습니다. 다시 시도해 주세요.';
async function run(label,fn){exMsg(label+' 만드는 중…');try{await fn()}catch(e){exMsg(errMsg(e))}}
$('exPng').onclick=()=>run('PNG',async()=>{const m=model();await saveFile(fileBase(m)+'.png',await makePngBlob(m));exMsg('PNG(9:16)를 저장했습니다.')});
$('exPdf').onclick=()=>run('PDF',async()=>{const m=model();await saveFile(fileBase(m)+'.pdf',await makePdfBlob(m));exMsg('A4 PDF를 저장했습니다.')});
$('exCopy').onclick=()=>{const m=model();exMsg('이미지 만드는 중…');const fail=()=>exMsg('이 화면에서는 이미지 복사가 막혀 있습니다. PNG 저장을 써 주세요.');
  try{navigator.clipboard.write([new ClipboardItem({'image/png':makePngBlob(m)})]).then(()=>exMsg('이미지를 복사했습니다. 카카오톡 대화창에 붙여넣기(Ctrl+V) 하세요.'),fail)}catch(e){fail()}};
mapTables();load(true);
