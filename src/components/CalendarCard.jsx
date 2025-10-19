import { monthMatrix, load } from '../data/store'
export default function CalendarCard({ monthISO }){
  const days=monthMatrix(monthISO); const d=load();
  const marks = (d.payables||[]).reduce((acc,p)=>{ (acc[p.data]??=[]).push(p); return acc }, {})
  const color=(items)=> items.some(x=>!x.pago)?'bg-rose-500':'bg-emerald-500'
  return (<div className="thin-outline rounded-2xl p-3">
    <div className="text-sm opacity-80 mb-2">Calendário (contas)</div>
    <div className="grid grid-cols-7 gap-1 text-center text-xs opacity-80 mb-1">{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(d=><div key={d}>{d}</div>)}</div>
    <div className="grid grid-cols-7 gap-1">
      {days.map((d,i)=>{ const items=marks[d.iso]||[]; return (<div key={i} className={`h-16 rounded-lg border border-white/10 p-1 ${d.monthSame?'':'opacity-40'}`} title={`${d.iso}${items.length?' • '+items.length+' conta(s)':''}`}><div className="text-[11px] opacity-80">{d.iso.slice(-2)}</div><div className="mt-1 flex flex-wrap gap-1">{items.slice(0,3).map(it=>(<span key={it.id} className={`${color(items)} w-2 h-2 rounded-full inline-block`} title={`${it.titulo} R$ ${it.valor}`} />))}</div></div>)})}
    </div>
    <div className="text-[11px] opacity-60 mt-2">• Rosa = pendente • Verde = pago</div>
  </div>)
}