import Modal from './Modal'
import { useState } from 'react'
import { addPayable, updatePayable, deletePayable, togglePayable, load } from '../data/store'
export default function PayablesModal({ open, onClose }){
  const [data,setData]=useState(load()); const [editing,setEditing]=useState(null);
  function submitNew(e){ e.preventDefault(); const f=new FormData(e.currentTarget); setData(addPayable({ titulo:f.get('titulo'), valor:Number(f.get('valor')), data:f.get('data') })); e.currentTarget.reset() }
  function submitEdit(e){ e.preventDefault(); const f=new FormData(e.currentTarget); setData(updatePayable(editing.id,{ titulo:f.get('titulo'), valor:Number(f.get('valor')), data:f.get('data') })); setEditing(null) }
  const list = (data.payables || [])
  return (<Modal open={open} onClose={onClose} title="Contas a pagar">
    <form onSubmit={submitNew} className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
      <input name="titulo" placeholder="Título" className="bg-[color:var(--panel)] border border-white/10 rounded px-3 py-2 md:col-span-2" required />
      <input name="valor" type="number" step="0.01" placeholder="Valor" className="bg-[color:var(--panel)] border border-white/10 rounded px-3 py-2" required />
      <input name="data" type="date" className="bg-[color:var(--panel)] border border-white/10 rounded px-3 py-2" required />
      <button className="rounded text-white font-semibold px-4" style={{background:'linear-gradient(90deg,var(--brand1),var(--brand2),var(--brand3))'}}>Adicionar</button>
    </form>
    <table className="w-full text-sm">
      <thead className="text-white/80"><tr><th className="text-left py-2">Título</th><th className="text-right">Valor</th><th className="text-center">Data</th><th className="text-center">Pago</th><th></th></tr></thead>
      <tbody>
        {list.map(p=>(<tr key={p.id} className="border-t border-white/10"><td className="py-2">{p.titulo}</td><td className="text-right">R$ {p.valor}</td><td className="text-center">{p.data}</td><td className="text-center">{p.pago?'Sim':'Não'}</td><td className="text-right"><button onClick={()=>setEditing(p)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 mr-2">Editar</button><button onClick={()=>{setData(togglePayable(p.id))}} className="px-3 py-1 rounded bg-emerald-600/70 hover:bg-emerald-600/90 mr-2">{p.pago?'Desfazer':'Marcar pago'}</button><button onClick={()=>{setData(deletePayable(p.id))}} className="px-3 py-1 rounded bg-red-500/70 hover:bg-red-500/90">Apagar</button></td></tr>))}
        {list.length===0 && <tr><td colSpan={5} className="text-center py-6 text-white/60">Sem contas.</td></tr>}
      </tbody>
    </table>
    {editing && (<form onSubmit={submitEdit} className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4"><input name="titulo" defaultValue={editing?.titulo} className="bg-[color:var(--panel)] border border-white/10 rounded px-3 py-2 md:col-span-2" /><input name="valor" type="number" step="0.01" defaultValue={editing?.valor} className="bg-[color:var(--panel)] border border-white/10 rounded px-3 py-2" /><input name="data" type="date" defaultValue={editing?.data} className="bg-[color:var(--panel)] border border-white/10 rounded px-3 py-2" /><button className="rounded text-white font-semibold px-4" style={{background:'linear-gradient(90deg,var(--brand1),var(--brand2),var(--brand3))'}}>Salvar</button></form>)}
  </Modal>)
}