const KEY='dashboard:data',THEME_KEY='dashboard:theme',SET_KEY='dashboard:settings';export const DAYS=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']
const seed={financas:{saldoAtual:0,variacaoPercentual:0,transacoes:[]},saude:{peso:[],agua:[]},relatorios:[],ciclo:{itens:[]},payables:[]};
const seedSettings={aguaMetaLitros:3, weightTargetKg:80, cycleGoalDays:4, weightGoalMode:'auto'}
export function settings(){const raw=localStorage.getItem(SET_KEY);if(raw){try{return JSON.parse(raw)}catch{}}localStorage.setItem(SET_KEY,JSON.stringify(seedSettings));return structuredClone(seedSettings)}
export function saveSettings(s){localStorage.setItem(SET_KEY,JSON.stringify(s))}
export function today(){const d=new Date();return d.toISOString().slice(0,10)}
export function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
export function load(){ const raw=localStorage.getItem(KEY); let d; try{ d= raw? JSON.parse(raw): structuredClone(seed) }catch{ d= structuredClone(seed) } d.financas ??= { saldoAtual:0, variacaoPercentual:0, transacoes:[] }; d.financas.transacoes ??= []; d.saude ??= {peso:[],agua:[]}; d.saude.peso ??= []; d.saude.agua ??= []; d.ciclo ??= {itens:[]}; d.ciclo.itens ??= []; d.relatorios ??= []; d.payables ??= []; save(d); return d }
export function reset(){localStorage.removeItem(KEY);localStorage.removeItem(SET_KEY);return load()}
export function exportData(){return JSON.stringify({data:load(),settings:settings()},null,2)}
export function importData(j){try{const o=JSON.parse(j);if(o?.data){save(o.data);if(o.settings)saveSettings(o.settings);return true}if(!o.financas||!o.saude)return false;save(o);return true}catch{return false}}
export function useDashboard(){const d=load();const saldo={value:d.financas.saldoAtual,trend:d.financas.variacaoPercentual,transacoes:d.financas.transacoes.length};return {data:d,saldo}}
export function useTheme(){const t=localStorage.getItem(THEME_KEY)||'default';function setTheme(n){localStorage.setItem(THEME_KEY,n)}function apply(n){const b=document.body;b.className=b.className.replace(/(^|\s)theme-\w+\b/g,'').trim();if(n&&n!=='default')b.classList.add(`theme-${n}`)}return {theme:t,setTheme,apply}}
function rec(d){const total=d.financas.transacoes.reduce((a,t)=>a+(t.tipo==='entrada'?t.valor:-t.valor),0);const prev=d.financas.saldoAtual||0;d.financas.saldoAtual=total;const base=prev===0?1:prev;d.financas.variacaoPercentual=Math.round(((total-prev)/Math.abs(base))*100)}
export function addTransaction(tx){const d=load();d.financas.transacoes.push({id:Date.now(),...tx});rec(d);save(d);return d}
export function updateTransaction(id,p){const d=load();const it=d.financas.transacoes.find(t=>t.id===id);if(it)Object.assign(it,p);rec(d);save(d);return d}
export function deleteTransaction(id){const d=load();d.financas.transacoes=d.financas.transacoes.filter(t=>t.id!==id);rec(d);save(d);return d}
export function addWeight(e){const d=load();d.saude.peso.push({id:Date.now(),...e});save(d);return d}
export function updateWeight(id,p){const d=load();const it=d.saude.peso.find(x=>x.id===id);if(it)Object.assign(it,p);save(d);return d}
export function deleteWeight(id){const d=load();d.saude.peso=d.saude.peso.filter(x=>x.id!==id);save(d);return d}
export function addWater(e){const d=load();d.saude.agua.push({id:Date.now(),...e});save(d);return d}
export function updateWater(id,p){const d=load();const it=d.saude.agua.find(x=>x.id===id);if(it)Object.assign(it,p);save(d);return d}
export function deleteWater(id){const d=load();d.saude.agua=d.saude.agua.filter(x=>x.id!==id);save(d);return d}
export function addCycle(i){const d=load();d.ciclo.itens.push({id:Date.now(),...i});save(d);return d}
export function updateCycle(id,p){const d=load();const it=d.ciclo.itens.find(x=>x.id===id);if(it)Object.assign(it,p);save(d);return d}
export function removeCycle(id){const d=load();d.ciclo.itens=d.ciclo.itens.filter(x=>x.id!==id);save(d);return d}
// Payables
export function addPayable(p){ const d=load(); d.payables.push({id:Date.now(),pago:false, ...p}); save(d); return d }
export function updatePayable(id,p){ const d=load(); const it=d.payables.find(x=>x.id===id); if(it) Object.assign(it,p); save(d); return d }
export function deletePayable(id){ const d=load(); d.payables=d.payables.filter(x=>x.id!==id); save(d); return d }
export function togglePayable(id){ const d=load(); const it=d.payables.find(x=>x.id===id); if(it) it.pago=!it.pago; save(d); return d }
// KPIs
export function kpiEntradasSaidas(){const d=load();const ent=d.financas.transacoes.filter(t=>t.tipo==='entrada').reduce((a,t)=>a+t.valor,0);const sai=d.financas.transacoes.filter(t=>t.tipo==='saida').reduce((a,t)=>a+t.valor,0);const tot=ent+sai;return {percent: tot? Math.round((ent/tot)*100):0, ent, sai, tot}}
export function kpiAguaHoje(){const d=load(), s=settings(); const th=today(); const rec=d.saude.agua.find(a=>a.data===th); const litros=rec?.litros||0; const pct=s.aguaMetaLitros? Math.min(100, Math.round((litros/s.aguaMetaLitros)*100)):0; return {percent:pct, litros, meta:s.aguaMetaLitros}}
export function kpiCicloMeta(){const d=load(), s=settings(); const dias=new Set(d.ciclo.itens.map(i=>i.dia)).size; const goal=Math.max(1, s.cycleGoalDays||7); const percent=Math.min(100, Math.round((dias/goal)*100)); return {percent, dias, goal}}
export function kpiPesoMeta(){const d=load(), s=settings(); if(d.saude.peso.length===0) return {percent:0, atual:0, alvo:s.weightTargetKg, inicio:0, mode:s.weightGoalMode||'auto'}; const sorted=[...d.saude.peso].sort((a,b)=>a.data.localeCompare(b.data)); const inicio=sorted[0].kg; const atual=sorted[sorted.length-1].kg; const alvo=s.weightTargetKg||inicio; const mode=(s.weightGoalMode||'auto'); const dir=mode==='auto'?(alvo<inicio?'loss':'gain'):mode; const span=Math.max(0.1, Math.abs(alvo-inicio)); const delta=Math.max(0, dir==='loss'? Math.max(0, inicio-atual): Math.max(0, atual-inicio)); const progresso=Math.min(100, Math.round((delta/span)*100)); return {percent:progresso, atual, alvo, inicio, mode:dir}}
export function alertsStatus(){ const agua=kpiAguaHoje(); const ciclo=kpiCicloMeta(); return {aguaLow:agua.percent<100, cicloLow:ciclo.percent<100} }
// Report
function normalize(arr){ if(arr.length===0) return arr; const min=Math.min(...arr), max=Math.max(...arr); const span=(max-min)||1; return arr.map(v=>((v-min)/span)*60+20) }
export function seriesReport(){const d=load(); const dates=new Set(); d.financas.transacoes.forEach(t=>dates.add(t.data)); d.saude.agua.forEach(a=>dates.add(a.data)); d.saude.peso.forEach(p=>dates.add(p.data)); const xs=Array.from(dates).sort(); let acc=0; const saldos=[], aguas=[], pesos=[]; xs.forEach(dt=>{ d.financas.transacoes.filter(t=>t.data===dt).forEach(t=>{acc+=t.tipo==='entrada'?t.valor:-t.valor}); saldos.push(acc); const a=d.saude.agua.find(r=>r.data===dt); aguas.push(a?a.litros:0); const p=d.saude.peso.find(r=>r.data===dt); pesos.push(p?p.kg:0) }); const A=normalize(saldos), B=normalize(aguas), C=normalize(pesos); return xs.map((dt,i)=>({ x:dt, a:A[i]||0, b:B[i]||0, c:C[i]||0, base:15+((i%10)/10)*10 })) }
// Semana da água
export function waterWeek(){ const s=settings(); const meta=Math.max(0.0001, Number(s.aguaMetaLitros)||0); const days=[]; const d=load(); const map=new Map(d.saude.agua.map(a=>[a.data,a])); const now=new Date(); for(let i=6;i>=0;i--){ const dt=new Date(now); dt.setDate(now.getDate()-i); const iso=dt.toISOString().slice(0,10); const rec=map.get(iso); const litros=rec?Number(rec.litros):0; const pct=Math.max(0, Math.min(100, Math.round((litros/meta)*100))); days.push({ data:iso, litros, pct }) } return { days, meta } }
// Calendar month matrix
export function monthMatrix(iso){ const base=new Date((iso||today())+'T00:00:00'); base.setDate(1); const start=(base.getDay()+6)%7; const days=[]; base.setDate(base.getDate()-start); for(let i=0;i<42;i++){ const d=new Date(base); const s=d.toISOString().slice(0,10); days.push({iso:s,monthSame:d.getMonth()===(new Date((iso||today())+'T00:00:00')).getMonth()}); base.setDate(base.getDate()+1) } return days }
