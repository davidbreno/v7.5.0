export default function CardSaldo({ value=0,trend=0,transacoes=0 })
{ const neg=trend<0,arrow=neg?'▼':'▲',color=neg?'text-rose-400':
    'text-amber-300'; return (<div className="card-saldo"><div className=
        "flex-1"><div className="big">{(value).toLocaleString?.
            ('pt-BR')??value} <span className="unit">s</span></div>
            <div className={`trend ${color}`}><span className="mr-1">{arrow}</span>{Math.abs(trend)}%</div>
            </div><div className="grid grid-cols-2 gap-4 text-sm"><div className="p-3 rounded bg-white/5 border border-white/10">Transações: <b>{transacoes}</b></div><div className="p-3 rounded bg-white/5 border border-white/10">Meta Água: <b>Config</b></div></div></div>) }