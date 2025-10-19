import React from 'react'
export default function WeeklyWaterThermo({ items=[], meta=0 }){
  if(!items||items.length===0){ items=Array.from({length:7},()=>({pct:0,litros:0,data:'—'})) }
  const labels=['S','T','Q','Q','S','S','D']
  return (<div className="mt-3">
    <div className="flex items-end gap-1 h-10">
      {items.map((d,i)=>{
        const h=Math.max(2,Math.min(100,d.pct))/100*36
        const ring=d.pct>=100?'outline-2 outline-lime-400/70':'outline-1 outline-white/20'
        return (<div key={i} className={`relative w-5 rounded-sm bg-white/10 ${ring}`} style={{height:36}} title={`${d.data}: ${d.litros}L (${d.pct}%)`}>
          <div className="absolute bottom-0 left-0 right-0 rounded-sm" style={{height:h,background:'linear-gradient(180deg,var(--brand1),var(--brand2),var(--brand3))'}} />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] opacity-70">{labels[i]}</div>
        </div>)
      })}
    </div>
    <div className="text-[11px] opacity-70 mt-2">Meta: {meta}L/dia (últimos 7 dias)</div>
  </div>)
}