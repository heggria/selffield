import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <div className="empty-page page-pad"><p className="eyebrow">404 · An honest unknown</p><h1>这里没有被看见的内容。</h1><p>未知不需要被假装填满。回到 SelfField，继续从真实经历开始。</p><Link className="button button-dark" to="/"><ArrowLeft size={17} />返回首页</Link></div>
}
