import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
const links=[{to:'/',label:'Dashboard'},{to:'/entradas',label:'Entradas & Saídas'},{to:'/saldo',label:'Saldo'},{to:'/peso',label:'Peso'},{to:'/agua',label:'Água'},{to:'/ciclo',label:'Ciclo'},{to:'/relatorios',label:'Relatórios'},{to:'/config',label:'Configurações'}]
export default function Sidebar(){
  const {pathname}=useLocation();
  useEffect(() => {
    const handler = () => window.dispatchEvent(new CustomEvent('openPayablesModal'));
    window.openPayablesModal = handler;
    return () => { delete window.openPayablesModal };
  }, []);
  return (
    <aside className="sidebar">
  <div className="side-title">Dr David</div>
      {links.map(l=>{
        const a=pathname===l.to;
        return <Link key={l.to} to={l.to} className={`side-link ${a?'active':''}`}>{l.label}</Link>
      })}
      <button className="side-link mt-6" style={{width:'100%'}} onClick={() => window.openPayablesModal && window.openPayablesModal()}>
        Abrir Contas a pagar
      </button>
    </aside>
  )
}