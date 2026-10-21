// ===== 2단계 레벨테스트 공통 엔진 (정답 데이터 없음) =====
const ACADEMY_TEL='0507-1389-3392';
const LVG=[...'하하하하하하하중중중중중중상상상상상상상'];
const LVRD=[...'하하하하하중중중중중상상상상상'];
const W={하:{g:1,r:2},중:{g:1.5,r:3},상:{g:2,r:4}};
// 난이도 척도: 8=중2, 9=중3, 10=고1, 11=고2, 12=고3
const LVR={어휘:[8,9.5],구문:[9,10],문법:[8,11],독해:[8,12]};
const clamp01=x=>Math.max(0,Math.min(1,x));
const gfmt=x=>x<10?'중'+(x-6).toFixed(1).replace(/\.0$/,''):'고'+(x-9).toFixed(1);
const rng=k=>`${gfmt(LVR[k][0])}~${gfmt(LVR[k][1])}`;
const estV=(k,w)=>LVR[k][0]+(LVR[k][1]-LVR[k][0])*clamp01(w);
const est=(k,w)=>gfmt(estV(k,w));
const BOOK={syn:['Basic','Intermediate','Advanced 01','Advanced 심화'],read:['중2 독해','중3 독해','고2 독해','수능 독해 심화'],gram:['중2 문법','중3 문법','고2 문법','수능어법'],mock:['고1','고1','고2','고3']};
const sum=a=>a.reduce((x,y)=>x+y,0);
const fmt1=x=>(+x.toFixed(1)).toString();

function calc(st){
  const cnt=a=>a.filter(x=>x===1).length;
  const v={c:cnt(st.v)};v.pts=v.c*0.7;
  const sp=st.s.map(x=>x||0);
  const s={pts:sum(sp),mid:sum(sp.slice(0,3)),hi:sum(sp.slice(3))};s.w=s.pts/18;s.u=s.hi/9;
  const area=(k,L)=>{const o={pts:0,max:0,lv:{하:[0,0],중:[0,0],상:[0,0]}};
    L.forEach((lv,i)=>{const w=W[lv][k];o.max+=w;o.lv[lv][1]++;if(st[k][i]===1){o.pts+=w;o.lv[lv][0]++}});
    o.w=o.pts/o.max;o.u=o.lv.상[0]/o.lv.상[1];return o};
  const g=area('g',LVG),r=area('r',LVRD);
  return{v,s,g,r,l:st.lOn?cnt(st.l):null,total:v.pts+s.pts+g.pts+r.pts};
}
function step(w,u){let s=w<.5?1:w<.7?2:w<.85?3:4;if(s===4&&u<.8)s=3;if(s===3&&u<.4)s=2;return s}
function vocab(c){return c<=3?['중등실력',1]:c<=5?['중고난도',2]:c<=7?['고등베이직',2]:c<=9?['수능2000',3]:['고등Complete',3]}

function model(st,info){
  const sc=calc(st);const name=(info.n||'').trim()||'학생';
  const WR={어휘:sc.v.c/10,구문:sc.s.w,문법:sc.g.w,독해:sc.r.w};
  const sS=step(sc.s.w,sc.s.u),sR=step(sc.r.w,sc.r.u),sG=step(sc.g.w,sc.g.u),[vb,sV]=vocab(sc.v.c);
  const core=Math.floor((sS+sR+sG)/3);
  const csat=[12,13,14].filter(i=>st.r[i]===1).length,gcsat=[16,17].filter(i=>st.g[i]===1).length;
  const cks=[[csat>=2,`독해 수능기출(13~15) ${csat}/3 — 기준 2 이상`],[sc.r.lv.상[0]>=4,`독해 상 ${sc.r.lv.상[0]}/5 — 기준 4 이상`],[sc.g.lv.상[0]>=5&&gcsat>=1,`문법 상 ${sc.g.lv.상[0]}/7, 수능어법 ${gcsat}/2 — 기준 5 이상·1 이상`],[sc.s.hi>=6,`구문 상 ${sc.s.hi}/9점 — 기준 6 이상`]];
  const pass=cks.filter(c=>c[0]).length;
  const [cls,vd,nx]=pass===4?['go','M-3 하이퍼 후보','3단계 테스트와 수능특강(상) 문항 확인으로 최종 확정']:pass>=2?['hold','M-3 하이퍼 보류','STEP 3 과정 4~8주 후 재응시 권장']:['no','M-3 하이퍼 대상 아님','월·금 / 화·목 정규반에서 단계별 진행'];
  const ar=[['구문',sc.s.w],['문법',sc.g.w],['독해',sc.r.w],['어휘',sc.v.c/10]].sort((a,b)=>a[1]-b[1]);
  const pattern=(o,n)=>{const h=o.lv.하[0]/o.lv.하[1],u=o.lv.상[0]/o.lv.상[1];return h>=.8&&u<.4?`${n}는 기본 유형은 안정적이지만 상 문항(추론·수능형)에서 크게 떨어집니다.`:h<.6?`${n}는 하 문항부터 흔들려 기본기 정리가 먼저 필요합니다.`:''};
  const total=fmt1(sc.total);
  const lines=[`${name} 학생은 100점 만점에 ${total}점으로, 종합 STEP ${core} 수준입니다.`,
    `가장 강한 영역은 ${ar[3][0]}, 보완이 필요한 영역은 ${ar[0][0]}입니다.`,pattern(sc.r,'독해'),pattern(sc.g,'문법'),
    `권장 배치: 구문독해 ${BOOK.syn[sS-1]}, 독해 ${BOOK.read[sR-1]}, 문법 ${BOOK.gram[sG-1]}, 어휘 ${vb}. STEP 1~3은 과목별 수강이 가능합니다.`,
    `M-3 하이퍼: ${vd} (${pass}/4 기준 충족).`].filter(Boolean);
  const lvTxt=o=>`하 ${o.lv.하[0]}/${o.lv.하[1]} · 중 ${o.lv.중[0]}/${o.lv.중[1]} · 상 ${o.lv.상[0]}/${o.lv.상[1]}`;
  const areas=[['어휘',sc.v.pts,7,`${sc.v.c}/10 정답`,sV],['구문',sc.s.pts,18,`중 ${sc.s.mid}/9 · 상 ${sc.s.hi}/9`,sS],['문법',sc.g.pts,30,lvTxt(sc.g),sG],['독해',sc.r.pts,45,lvTxt(sc.r),sR]];
  const recs=[['구문독해',sS,BOOK.syn[sS-1],'구문'],['독해',sR,BOOK.read[sR-1],'독해'],['문법',sG,BOOK.gram[sG-1],'문법'],['어휘',sV,vb+' 단어장','어휘'],['실전모고',sR,BOOK.mock[sR-1],null]];
  return{name,school:info.sc||'',date:info.d||'',sc,WR,sS,sR,sG,sV,vb,core,total,m3:{cls,vd,nx,cks,pass},lines,areas,recs};
}

// ----- 링크용 인코딩 -----
function encodeState(st,info){
  const t=a=>a.map(x=>x===1?'1':x===0?'0':'-').join('');
  const o={n:info.n||'',sc:info.sc||'',d:info.d||'',v:t(st.v),s:st.s.map(x=>x==null?'-':x).join(''),g:t(st.g),r:t(st.r),l:st.lOn?t(st.l):''};
  const b=new TextEncoder().encode(JSON.stringify(o));let s='';b.forEach(c=>s+=String.fromCharCode(c));
  return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function decodeState(str){
  try{
    let b=str.replace(/-/g,'+').replace(/_/g,'/');while(b.length%4)b+='=';
    const bin=atob(b);const o=JSON.parse(new TextDecoder().decode(Uint8Array.from(bin,c=>c.charCodeAt(0))));
    const f=c=>c==='1'?1:c==='0'?0:null;
    const ok=(x,n)=>typeof x==='string'&&x.length===n;
    if(!ok(o.v,10)||!ok(o.s,6)||!ok(o.g,20)||!ok(o.r,15))return null;
    return{st:{v:[...o.v].map(f),s:[...o.s].map(c=>c==='-'?null:Math.min(3,parseInt(c,10)||0)),g:[...o.g].map(f),r:[...o.r].map(f),l:ok(o.l,12)?[...o.l].map(f):Array(12).fill(null),lOn:ok(o.l,12)},info:{n:String(o.n||'').slice(0,40),sc:String(o.sc||'').slice(0,60),d:String(o.d||'').slice(0,20)}};
  }catch(e){return null}
}

// ----- 리포트 템플릿 (내보내기 전용, 밝은 색 고정) -----
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C={ink:'#3E2A1E',mut:'#7A5E48',line:'#EADBBE',cream:'#FBF6E9',but:'#F6E7B8',wheat:'#E3C38E',wal:'#8A5A36',coc:'#4A3020',track:'#F1E6CF'};
const STEPC=[null,['#F6E7B8','#3E2A1E'],['#E3C38E','#3E2A1E'],['#8A5A36','#FFFFFF'],['#4A3020','#F6E7B8']];
const chipS=(n,fs=12)=>`<span style="display:inline-block;background:${STEPC[n][0]};color:${STEPC[n][1]};font-weight:900;font-size:${fs}px;line-height:1.5;border-radius:6px;padding:1px 8px;white-space:nowrap">STEP ${n}</span>`;
const M3C={go:['#E3F1E6','#2F7A4B'],hold:['#FFF0C7','#8A5A00'],no:['#F6EDE4','#7A5E48']};
function lvScale(k,w,h){const [a,b]=LVR[k];const p=x=>(x-8)/4*100;const e=p(estV(k,w));const d=h+6;
  return `<div style="position:relative;height:${d}px">
    <div style="position:absolute;left:0;right:0;top:3px;height:${h}px;background:${C.track};border-radius:${h}px"></div>
    <div style="position:absolute;left:${p(a)}%;width:${p(b)-p(a)}%;top:3px;height:${h}px;background:${C.wheat};border-radius:${h}px"></div>
    <div style="position:absolute;left:${e}%;margin-left:-${d/2}px;top:0;width:${d}px;height:${d}px;border-radius:50%;background:${C.wal};border:2px solid #FFFFFF;box-sizing:border-box"></div>
  </div>`}
const axis=fs=>`<div style="display:flex;justify-content:space-between;font-size:${fs}px;color:${C.mut};font-weight:700"><span>중2</span><span>중3</span><span>고1</span><span>고2</span><span>고3</span></div>`;
const FONT=`font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif`;
const SERIF=`font-family:'Noto Serif KR',Georgia,serif`;

function a4Html(m){
  const meta=[m.school,m.date].filter(Boolean).map(esc).join(' · ');
  const bars=m.areas.map(([n,p,mx,t,s])=>`
    <div style="display:grid;grid-template-columns:62px 150px 1fr 96px;gap:14px;align-items:center;padding:10px 0;border-top:1px solid ${C.line}">
      <b style="font-size:15px">${n}</b>
      <div><div style="font-size:15px;font-weight:900">${fmt1(p)} <span style="font-size:12px;font-weight:500;color:${C.mut}">/ ${mx}</span></div><div style="font-size:11px;color:${C.mut}">${t}</div></div>
      <div>${lvScale(n,m.WR[n],8)}<div style="font-size:11px;color:${C.mut};margin-top:3px">시험 범위 ${rng(n)}</div></div>
      <div style="text-align:right"><div style="font-size:11px;color:${C.mut}">추정 수준</div><div style="font-size:17px;font-weight:900;color:${C.wal}">${est(n,m.WR[n])}</div></div>
    </div>`).join('');
  const recs=m.recs.map(([a,s,b,k])=>`<tr><td style="padding:8px 10px;border-top:1px solid ${C.line};font-weight:700">${a}</td><td style="padding:8px 10px;border-top:1px solid ${C.line}">${chipS(s)}</td><td style="padding:8px 10px;border-top:1px solid ${C.line}">${esc(b)}</td><td style="padding:8px 10px;border-top:1px solid ${C.line};color:${C.mut}">${k?`${rng(k)} · <b style="color:${C.ink}">${est(k,m.WR[k])}</b>`:'–'}</td></tr>`).join('');
  const [mb,mf]=M3C[m.m3.cls];
  return `<div style="width:794px;height:1122px;flex:none;box-sizing:border-box;padding:46px 50px 34px;background:#FFFFFF;color:${C.ink};${FONT};display:flex;flex-direction:column;gap:18px;overflow:hidden">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid ${C.ink};padding-bottom:14px">
      <div><div style="font-size:11px;font-weight:700;letter-spacing:3px;color:${C.wal}">BRYAN CHU EDUCATION · 중등부 무학년제</div>
        <div style="${SERIF};font-size:30px;font-weight:900;margin-top:4px">2단계 레벨테스트 결과 리포트</div></div>
      <div style="text-align:right"><div style="${SERIF};font-size:24px;font-weight:900">${esc(m.name)}</div><div style="font-size:12px;color:${C.mut}">${meta}</div></div>
    </div>
    <div style="display:flex;gap:18px;align-items:stretch">
      <div style="width:180px;flex:none;background:${C.cream};border-radius:14px;padding:18px;display:flex;flex-direction:column;justify-content:center;gap:6px">
        <div style="font-size:12px;font-weight:700;color:${C.mut}">총점</div>
        <div><span style="${SERIF};font-size:52px;font-weight:900;line-height:1">${m.total}</span><span style="font-size:14px;color:${C.mut}"> / 100</span></div>
        <div style="margin-top:6px">${chipS(m.core,14)} <span style="font-size:12px;color:${C.mut}">종합</span></div>
        ${m.sc.l!=null?`<div style="font-size:11px;color:${C.mut}">듣기 ${m.sc.l}/12 (참고)</div>`:''}
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:grid;grid-template-columns:62px 150px 1fr 96px;gap:14px;font-size:11px;color:${C.mut};font-weight:700;padding-bottom:4px"><span>영역</span><span>점수</span>${axis(10)}<span style="text-align:right">난이도</span></div>
        ${bars}
      </div>
    </div>
    <div>
      <div style="${SERIF};font-size:17px;font-weight:900;margin-bottom:6px">추천 배치 · 연결 교재</div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="background:${C.cream};font-size:11.5px;color:${C.mut}"><th style="text-align:left;padding:7px 10px">영역</th><th style="text-align:left;padding:7px 10px">추천 단계</th><th style="text-align:left;padding:7px 10px">연결 교재</th><th style="text-align:left;padding:7px 10px">난이도 (범위 · 추정)</th></tr></thead>
        <tbody>${recs}</tbody></table>
    </div>
    <div style="display:flex;gap:16px">
      <div style="flex:1;background:${mb};border:1.5px solid ${mf};border-radius:12px;padding:12px 16px;display:flex;flex-direction:column;gap:5px">
        <div style="font-size:11px;color:${C.mut}">화·목 M-3 하이퍼 (수능특강 · 고3 수능어법)</div>
        <div style="font-size:16px;font-weight:900;color:${mf}">${m.m3.vd} <span style="font-size:12px;font-weight:700">(${m.m3.pass}/4)</span></div>
        ${m.m3.cks.map(c=>`<div style="font-size:11.5px"><b style="display:inline-block;width:16px">${c[0]?'✓':'·'}</b>${c[1]}</div>`).join('')}
        <div style="font-size:11px;color:${C.mut}">다음 단계: ${m.m3.nx}</div>
      </div>
    </div>
    <div style="flex:1;min-height:0;border:1.5px dashed ${C.wheat};border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:6px">
      <div style="${SERIF};font-size:16px;font-weight:900">상담 코멘트</div>
      ${m.lines.map(l=>`<div style="font-size:13px;line-height:1.65">${esc(l)}</div>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:${C.mut};border-top:1px solid ${C.line};padding-top:10px">
      <span><b style="color:${C.ink}">브추교육학원</b> · 상담 ${ACADEMY_TEL}</span>
      <span>STEP 1 기초 · STEP 2 중등 완성 · STEP 3 예비고1 · STEP 4 특목·자사고</span>
    </div>
  </div>`;
}

function phoneHtml(m){
  const meta=[m.school,m.date].filter(Boolean).map(esc).join(' · ');
  const rows=m.areas.map(([n,p,mx,t,s])=>`
    <div style="display:flex;flex-direction:column;gap:4px;padding:8px 0;border-top:1px solid ${C.line}">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:14px;font-weight:900">${n} <span style="font-size:11.5px;font-weight:500;color:${C.mut}">${fmt1(p)}/${mx}</span></span>
        <span style="display:flex;gap:6px;align-items:center"><span style="font-size:13px;font-weight:900;color:${C.wal}">${est(n,m.WR[n])}</span>${chipS(s,10.5)}</span>
      </div>
      ${lvScale(n,m.WR[n],6)}
    </div>`).join('');
  const place=m.recs.slice(0,4).map(([a,s,b])=>`<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0"><span style="color:${C.mut}">${a}</span><b>${esc(b)}</b></div>`).join('');
  const [mb,mf]=M3C[m.m3.cls];
  const showM3=m.m3.pass>=2;
  return `<div style="width:360px;height:640px;flex:none;box-sizing:border-box;padding:22px 22px 16px;background:#FFFFFF;color:${C.ink};${FONT};display:flex;flex-direction:column;gap:10px;overflow:hidden">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid ${C.ink};padding-bottom:9px">
      <div><div style="font-size:9px;font-weight:700;letter-spacing:2px;color:${C.wal}">BRYAN CHU EDUCATION</div>
        <div style="${SERIF};font-size:19px;font-weight:900;margin-top:2px">레벨테스트 결과</div></div>
      <div style="text-align:right"><div style="${SERIF};font-size:17px;font-weight:900">${esc(m.name)}</div><div style="font-size:10px;color:${C.mut}">${meta}</div></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;background:${C.cream};border-radius:12px;padding:10px 14px">
      <div><div style="font-size:10.5px;font-weight:700;color:${C.mut}">총점</div><span style="${SERIF};font-size:38px;font-weight:900;line-height:1">${m.total}</span><span style="font-size:12px;color:${C.mut}"> / 100</span></div>
      <div style="text-align:right;display:flex;flex-direction:column;gap:4px;align-items:flex-end"><span style="font-size:10.5px;color:${C.mut}">종합 수준</span>${chipS(m.core,14)}</div>
    </div>
    <div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px"><span style="font-size:12px;font-weight:900">영역별 난이도</span><span style="font-size:9.5px;color:${C.mut}">● 추정 수준 · 색 띠 시험 범위</span></div>
      ${axis(9)}
      ${rows}
    </div>
    <div style="background:${C.cream};border-radius:10px;padding:8px 12px">
      <div style="font-size:12px;font-weight:900;margin-bottom:2px">추천 배치</div>${place}
    </div>
    <div style="display:flex;flex-direction:column;gap:3px;padding:0 2px">${m.lines.filter(l=>!/^(권장|M-3)/.test(l)).slice(1,3).map(l=>`<div style="font-size:11.5px;line-height:1.55;color:${C.ink}">· ${esc(l)}</div>`).join('')}</div>
    ${showM3?`<div style="background:${mb};border:1.5px solid ${mf};border-radius:10px;padding:7px 12px;font-size:12px;font-weight:900;color:${mf}">${m.m3.vd} <span style="font-weight:500;color:${C.mut};font-size:10.5px">화·목 M-3 하이퍼반</span></div>`:''}
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;font-size:10.5px;color:${C.mut};border-top:1px solid ${C.line};padding-top:8px">
      <b style="color:${C.ink}">브추교육학원</b><span>상담 ${ACADEMY_TEL}</span>
    </div>
  </div>`;
}

// ----- 이미지·PDF 만들기 -----
let __rid=0;
async function renderCanvas(html,w,h,scale){
  const id='__cap'+(++__rid);
  const host=document.createElement('div');host.id=id;
  host.style.cssText=`position:fixed;left:-40000px;top:0;width:${w}px;height:${h}px;z-index:-1`;
  host.innerHTML=html;document.body.appendChild(host);
  try{
    try{await Promise.all(['400 14px "Noto Sans KR"','700 14px "Noto Sans KR"','900 14px "Noto Sans KR"','900 14px "Noto Serif KR"'].map(f=>document.fonts.load(f)));await document.fonts.ready}catch(e){}
    return await html2canvas(host.firstElementChild,{scale,backgroundColor:'#FFFFFF',width:w,height:h,windowWidth:Math.max(w,1200),scrollX:0,scrollY:0,
      onclone:d=>{const c=d.getElementById(id);if(c){c.style.left='0px';c.style.zIndex='9999'}}});
  }finally{host.remove()}
}
async function makePngBlob(m){const c=await renderCanvas(phoneHtml(m),360,640,3);return await new Promise(r=>c.toBlob(r,'image/png'))}
async function makePdfBlob(m){const c=await renderCanvas(a4Html(m),794,1122,2);
  const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4'});pdf.addImage(c.toDataURL('image/jpeg',0.93),'JPEG',0,0,210,297);return pdf.output('blob')}
async function saveFile(filename,blob){
  let dl=null;try{if(window.claude&&window.claude.use)dl=await window.claude.use('downloads')}catch(e){}
  if(dl){await dl.save({filename,data:blob});return}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);
}
async function shareBlob(blob,filename,title){
  const f=new File([blob],filename,{type:blob.type});
  if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title});return true}
  return false;
}
const fileBase=m=>`${m.name}_2단계_레벨테스트${m.date?'_'+m.date:''}`.replace(/[\\/:*?"<>|]/g,'');
const isTopLevel=(()=>{try{return window.top===window.self}catch(e){return false}})();
