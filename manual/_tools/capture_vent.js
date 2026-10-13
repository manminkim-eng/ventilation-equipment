// 기계환기설비 환기량 산정 시스템 매뉴얼 화면 캡처 — usage: node capture_vent.js <repoDir> <outDir>
// 규격: 1440×900 · DSF 1.25 · _marks.json(번호 배지 % 좌표) · _example.json(예제 검증값 — 앱에서 읽음)
const {chromium}=require(process.env.MM_PW||'playwright');const fs=require('fs');const path=require('path');const {setup,server}=require('./serve');
const repo=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const VW=1440,VH=900,DSF=1.25,PORT=8898;
/* 예제 A = 사무실(업무시설) · 바닥 500 ㎡ · 층고 3.0 m · 재실 100명 · 외기 100 % · 여유율 10 % · 제1종
   예제 B = 공동주택 세대 · 84 ㎡ · 2.3 m · 외기 100 % · 여유율 10 % · 제1종
   다중 구역 = 사무실 500 ㎡/3.0 m/100명 · 회의실 60 ㎡/3.0 m/20명 · 화장실 30 ㎡/3.0 m · 주차장 2,500 ㎡/3.3 m · 여유율 10 % */
const FREEZE=`(()=>{const T=new Date(2026,9,13,10,0,0).getTime();const D=Date;class F extends D{constructor(...a){if(a.length)super(...a);else super(T);}static now(){return T;}}window.Date=F;window.alert=()=>{};window.confirm=()=>true;try{localStorage.clear();localStorage.setItem('pwa-dismissed-ventilation','1');localStorage.setItem('pwa-welcome-ventilation','1')}catch(e){}})()`;
const HIDE='#pwa-banner,#pwa-install-banner,.pwa-banner,#ios-modal,#toast,.toast{display:none!important}';
const HELP=`window.__vis=e=>e&&e.getClientRects().length>0;
window.__card=t=>{const h=[...document.querySelectorAll('.card-tit')].find(e=>__vis(e)&&e.textContent.trim().startsWith(t));return h?h.closest('.card'):null;};
window.__find=sel=>{if(sel.startsWith('card:'))return __card(sel.slice(5));
 if(sel.startsWith('a4sub:'))return document.querySelectorAll('#a4Page .a4-sub')[+sel.slice(6)]||null;
 if(sel.startsWith('msec:'))return [...document.querySelectorAll('#guideModal .modal-sec')].find(e=>e.textContent.includes(sel.slice(5)))||null;
 if(sel.startsWith('up:')){const [a,b]=sel.slice(3).split('|');const e=document.querySelector(a);return e?e.closest(b):null;}
 for(const s of sel.split(',')){const e=[...document.querySelectorAll(s)].find(__vis);if(e)return e;}return null;};
window.__tab=t=>showTab(t,document.querySelector('.tab-bar .tb[data-tab="'+t+'"]'));
window.__set=(id,v)=>{document.getElementById(id).value=v;};
window.__in=(id,v)=>{const e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};
window.__proj=()=>{__set('projName','만민 건축사 사옥 신축공사');__set('projUser','김만민');__set('projDate','2026-10-13');};
window.__A=()=>{resetAll();__tab('calc');__proj();selectBtype('office');__in('area','500');__in('height','3.0');__set('vol','');__set('persons','100');__set('oaRatio','100');__set('margin','10');__set('ventType','1종');doCalc();window.scrollTo(0,0);};
window.__B=()=>{resetAll();__tab('calc');__proj();selectBtype('apt');__in('area','84');__in('height','2.3');__set('vol','');__set('persons','');__set('oaRatio','100');__set('margin','10');__set('ventType','1종');doCalc();window.scrollTo(0,0);};
window.__M=()=>{__tab('multi');document.getElementById('multiTbody').innerHTML='';multiRowId=0;
  [['사무실','office',500,3.0,100],['회의실','meet',60,3.0,20],['화장실','wc',30,3.0,''],['지하주차장','park',2500,3.3,'']].forEach(([nm,id,a,h,p])=>{addMultiRow();const r=multiRowId;
   __set('mn_'+r,nm);__set('mt_'+r,id);document.getElementById('mt_'+r).dispatchEvent(new Event('change'));__set('ma_'+r,a);__set('mh_'+r,h);autoMultiVol(r);__set('mp_'+r,p);});
  __set('multiMargin','10');calcMulti();window.scrollTo(0,0);};
window.__ex=()=>{const R=calcResult;return {bt:R.btype.id,btNm:R.btype.nm,basis:R.btype.basis,pq:R.btype.pq||null,aq:R.btype.aq||null,pqBasis:R.btype.pqBasis,
  area:R.area,h:R.h,vol:R.vol,n:R.n,persons:R.persons,oaRatio:R.oaRatio,marginPct:R.marginPct,ventType:R.ventType,
  Q_law:R.Q_law,Q_person:R.Q_person,Q_base:R.Q_base,Q_design:R.Q_design,Q_oa:R.Q_oa,Q_final:R.Q_final,reqTxt:R.reqTxt,reqBasis:R.reqBasis,
  hero:document.getElementById('heroVal').textContent,sum:[...document.querySelectorAll('.sum-bar .sum-item')].map(e=>e.textContent.trim())};};
window.__mex=()=>({rows:[...document.querySelectorAll('#multiTbody tr')].map(tr=>{const r=tr.id.replace('mr_','');const bt=BTYPE_DATA.find(b=>b.id===document.getElementById('mt_'+r).value);
  return {nm:document.getElementById('mn_'+r).value,bt:bt.id,btNm:bt.nm,n:bt.rate,pq:bt.pq||null,aq:bt.aq||null,area:+document.getElementById('ma_'+r).value,h:+document.getElementById('mh_'+r).value,vol:+document.getElementById('mv_'+r).value,
   persons:+document.getElementById('mp_'+r).value||0,qv:+tr.dataset.qv,qr:tr.dataset.qr?+tr.dataset.qr:0,q:+tr.dataset.q,d:+tr.dataset.d};}),
  totalQ:document.getElementById('multiTotalQ').textContent,totalD:document.getElementById('multiTotalD').textContent,margin:+document.getElementById('multiMargin').value});
window.__tables=()=>({btypes:BTYPE_DATA});`;
const SHOTS=[
 {id:'s01_overview',pre:"__A()",clip:'viewport',m:[['.tab-bar-inner','작업 탭'],['.sum-bar','요약 스트립'],['#tab-calc .step-bar','진행 단계'],['card:STEP 1','STEP 1 공사 정보'],['card:STEP 2','STEP 2 용도 선택'],['card:STEP 3','STEP 3 면적 · 체적 · 재실인원'],['card:STEP 4','STEP 4 산정 결과'],['.fab-wrap','초기화 · 이용방법']]},
 {id:'s02_tabs',clip:'.hdr-shell',m:[['.tab-bar .tb[data-tab="calc"]','환기량 산정'],['.tab-bar .tb[data-tab="multi"]','다중 구역 산정'],['.tab-bar .tb[data-tab="guide"]','설계 기준표'],['.tab-bar .tb[data-tab="a4"]','A4 미리보기'],['.tb-manual','매뉴얼'],['.hdr-right','근거 기준']]},
 {id:'s03_project',clip:'card:STEP 1',m:[['#projName','공사명'],['#projUser','작성자'],['#projDate','작성일']]},
 {id:'s04_btype',clip:'card:STEP 2',m:[['#btypeGrid','용도 18종(직접입력 포함)'],['#bt_office','선택한 용도'],['#selRate','기준 환기횟수'],['#selBasis','산출 기준']]},
 {id:'s05_input',clip:'.col-input',m:[['#area','바닥면적'],['#height','층고'],['#vol','체적(자동 · 직접)'],['#persons','재실 인원'],['#oaRatio','외기도입 비율'],['#margin','여유율'],['#ventType','환기 방식'],['.calc-btn','환기량 산정하기'],['.col-input .reset-btn','전체 초기화'],['.col-input .duct-link-btn','덕트 규격 산정기 연동']]},
 {id:'s06_result',clip:'card:STEP 4',m:[['#heroMain','기준 환기량 Max(체적 · 법정)'],['#r_vol','체적 V'],['#r_n','환기횟수 N'],['#r_design','설계 환기량(여유율)'],['#personCheck','법정 필요환기량 검토'],['#formulaEq','산출 근거'],['#resultTbody','결과 표'],['#ductLinkMain','덕트 규격 산정기 연동']]},
 {id:'s07_result_b',pre:"__B()",wait:700,clip:'card:STEP 4',post:"__A()",m:[['#heroMain','공동주택 0.5회/h — 설비규칙 제11조①'],['#resultTbody','법정 필요환기량 행 없음(체적 기준)']]},
 {id:'s08_multi',pre:"__M()",wait:700,clip:'card:다중 구역 환기량',m:[['#multiMargin','여유율'],['#multiTbl thead','용도 · 면적 · 층고 · 체적 · 인원 · 환기횟수 · 기준 · 설계'],['#multiTbody tr:nth-child(4)','지하주차장 — 27 ㎥/㎡·h(법정)'],['#multiTotalQ','전체 합계']]},
 {id:'s09_multi_sum',clip:'card:다중 구역 산정 요약',m:[['#multiSummaryBoxes','기준 · 설계 합계 · 구역 수'],['#multiDuctNote','덕트 설계 참고']]},
 {id:'s10_guide_rate',pre:"__tab('guide');scrollTo(0,0)",wait:700,clip:'card:용도별 환기횟수',m:[['#guideRateTable','용도 · 회/h · 산출 기준'],['in:용도별 환기횟수>>.formula-box','환기량 산출식']]},
 {id:'s11_guide_law',clip:'card:환기설비 설치 대상',m:[]},
 {id:'s12_guide_type',clip:'card:환기 방식별',union:'card:1인당 외기량',m:[]},
 {id:'s13_modal',pre:"__tab('calc');scrollTo(0,0);showGuide();document.querySelector('#guideModal .modal-box').scrollTop=0",wait:700,fixed:true,clip:'#guideModal .modal-box',m:[]},
 {id:'s14_modal_law',pre:"(()=>{const b=document.querySelector('#guideModal .modal-box');const s=__find('msec:법령 적용 기준');b.scrollTop+=s.getBoundingClientRect().top-b.getBoundingClientRect().top-70;})()",wait:500,fixed:true,post:"closeGuide()",clip:'#guideModal .modal-box',m:[]},
 {id:'s15_a4',pre:"__A();__tab('a4');scrollTo(0,0)",wait:1500,clip:'viewport',m:[['.btn-print','인쇄 / PDF'],['.btn-jpg','JPG 저장'],['.btn-duct','덕트 계산기'],['#a4Page','A4 환기량 산정서']]},
 {id:'s16_a4page',clip:'#a4Page',m:[['a4sub:0','건물(공간) 개요'],['a4sub:1','환기량 산출 근거'],['a4sub:2','덕트 규격 산정 연동']]},
];
(async()=>{
 const s=await server(repo,PORT);const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:DSF,serviceWorkers:'block'});await setup(ctx);
 const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(FREEZE);
 await pg.goto(`http://127.0.0.1:${PORT}/index.html`);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(2500);
 await pg.addStyleTag({content:HIDE});
 await pg.evaluate(HELP);
 const ex={};const meta={};
 for(const S of SHOTS){
  if(S.pre){try{await pg.evaluate(S.pre);}catch(e){errs.push(S.id+' pre '+e.message);}}
  await pg.waitForTimeout(S.wait||600);
  if(S.id==='s01_overview'){ex.A=await pg.evaluate('__ex()');ex.tables=await pg.evaluate('__tables()');}
  if(S.id==='s07_result_b')ex.B=await pg.evaluate('__ex()');
  if(S.id==='s08_multi')ex.M=await pg.evaluate('__mex()');
  if(S.id==='s16_a4page')ex.A_a4=await pg.evaluate(()=>document.getElementById('a4Page').innerText.replace(/\s+/g,' '));
  const info=await pg.evaluate(({S,VW,VH})=>{
   const abs=e=>{const r=e.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};};
   const F=sel=>{if(sel.startsWith('in:')){const [t,q]=sel.slice(3).split('>>');const c=__card(t);return c?c.querySelector(q):null;}return __find(sel);};
   let clip;
   if(S.clip==='viewport'){clip={x:0,y:scrollY,width:VW,height:VH};}
   else{const el=__find(S.clip);if(!el)return {err:'clip '+S.clip};const a=abs(el);clip={x:a.x,y:a.y,width:a.w,height:a.h};
     if(S.union){const e2=__find(S.union);if(e2){const a2=abs(e2);const x0=Math.min(clip.x,a2.x),y0=Math.min(clip.y,a2.y),x1=Math.max(clip.x+clip.width,a2.x+a2.w),y1=Math.max(clip.y+clip.height,a2.y+a2.h);clip={x:x0,y:y0,width:x1-x0,height:y1-y0};}}
     const P=12;clip={x:Math.max(0,clip.x-P),y:Math.max(0,clip.y-P),width:clip.width+2*P,height:clip.height+2*P};}
   const marks=[];(S.m||[]).forEach(([sel,label],i)=>{const e=F(sel);if(!e){marks.push({n:i+1,label,miss:sel});return;}const a=abs(e);
     marks.push({n:i+1,label,x:+((a.x-clip.x)/clip.width*100).toFixed(2),y:+((a.y-clip.y)/clip.height*100).toFixed(2),w:+(Math.min(a.w,clip.x+clip.width-a.x)/clip.width*100).toFixed(2),h:+(Math.min(a.h,clip.y+clip.height-a.y)/clip.height*100).toFixed(2)});});
   return {clip,marks};},{S,VW,VH});
  if(info.err){errs.push(S.id+' '+info.err);continue;}
  const c=info.clip;const cl={x:Math.max(0,c.x),y:Math.max(0,c.y),width:Math.min(c.width,VW-Math.max(0,c.x)),height:c.height};
  if(S.clip==='viewport'){await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:0,y:0,width:VW,height:VH}});}
  else if(S.fixed){const sx=await pg.evaluate(()=>scrollX),sy=await pg.evaluate(()=>scrollY);await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:c.x-sx,y:c.y-sy,width:Math.min(c.width,VW),height:Math.min(c.height,VH)}});}
  else{await pg.screenshot({path:path.join(out,S.id+'.png'),clip:cl,fullPage:true});}
  meta[S.id]={w:Math.round(cl.width),h:Math.round(Math.min(cl.height,S.fixed?VH:1e9)),marks:info.marks};
  if(S.post){try{await pg.evaluate(S.post);}catch(e){errs.push(S.id+' post '+e.message);}await pg.waitForTimeout(400);}
 }
 await pg.evaluate('__A()');await pg.waitForTimeout(500);ex.after=await pg.evaluate('__ex()');
 const mctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,serviceWorkers:'block',isMobile:true,hasTouch:true});await setup(mctx);
 const mp=await mctx.newPage();await mp.addInitScript(FREEZE);
 await mp.goto(`http://127.0.0.1:${PORT}/index.html`);await mp.waitForTimeout(2500);
 await mp.addStyleTag({content:HIDE});await mp.evaluate(HELP);await mp.evaluate('__A()');await mp.waitForTimeout(600);
 await mp.screenshot({path:path.join(out,'s17_mobile_main.png')});meta['s17_mobile_main']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{document.getElementById('heroMain').scrollIntoView({block:'start'});window.scrollBy(0,-70);});await mp.waitForTimeout(500);
 await mp.screenshot({path:path.join(out,'s18_mobile_result.png')});meta['s18_mobile_result']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{__tab('a4');window.scrollTo(0,0);});await mp.waitForTimeout(1200);
 await mp.screenshot({path:path.join(out,'s19_mobile_a4.png')});meta['s19_mobile_a4']={w:390,h:844,marks:[]};
 ex.mobile=await mp.evaluate(()=>({page:document.documentElement.scrollWidth,tabbar:document.querySelector('.tab-bar-inner').scrollWidth,vw:innerWidth,manualVisible:(()=>{const r=document.querySelector('.tb-manual').getBoundingClientRect();return r.right<=innerWidth&&r.width>0;})()}));
 fs.writeFileSync(path.join(out,'_marks.json'),JSON.stringify(meta,null,1));fs.writeFileSync(path.join(out,'_example.json'),JSON.stringify(ex,null,1));
 const miss=[];Object.entries(meta).forEach(([k,v])=>v.marks.forEach(m=>{if(m.miss)miss.push(k+':'+m.miss);else if(m.x<0||m.y<0||m.x+m.w>100.5||m.y+m.h>100.5||m.w<=0||m.h<=0)miss.push(k+':OUT '+m.label+' '+m.x+','+m.y+','+m.w+','+m.h);}));
 const pick=e=>e&&[e.Q_law,e.Q_person,e.Q_base,e.Q_design];
 console.log(JSON.stringify({A:pick(ex.A),B:pick(ex.B),M:ex.M&&[ex.M.totalQ,ex.M.totalD],same:JSON.stringify({...ex.A,sum:0})===JSON.stringify({...ex.after,sum:0}),mobile:ex.mobile,sizes:Object.fromEntries(Object.entries(meta).map(([k,v])=>[k,v.w+'x'+v.h])),miss,errs:errs.slice(0,15)},null,1));
 await b.close();s.close();
})();
