import { ArrowLeft, ArrowRight, Check, Copy, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getContext, getValue } from '../data/reflection'
import { compareSnapshots } from '../lib/synthesize'
import { useSelfFieldStore } from '../store/useSelfFieldStore'
import type { Feedback } from '../types'

const feedbackOptions: Array<{ id: Feedback; label: string }> = [
  { id: 'seen', label: '照见了' },
  { id: 'partial', label: '部分准确' },
  { id: 'misread', label: '误读了' },
  { id: 'unknown', label: '还不知道' },
]

export function MirrorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const snapshots = useSelfFieldStore((state) => state.snapshots)
  const setFeedback = useSelfFieldStore((state) => state.setFeedback)
  const removeSnapshot = useSelfFieldStore((state) => state.removeSnapshot)
  const snapshot = snapshots.find((item) => item.id === id)

  if (!snapshot) {
    return <div className="empty-page page-pad"><p className="eyebrow">Nothing to label</p><h1>没有找到这份镜像。</h1><p>它可能已被删除，或者只存在于另一台设备。</p><Link className="button button-dark" to="/history">查看全部记录</Link></div>
  }

  const index = snapshots.findIndex((item) => item.id === snapshot.id)
  const previous = snapshots[index + 1]
  const date = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(snapshot.createdAt))
  const copySummary = async () => {
    await navigator.clipboard.writeText(`${snapshot.summary}\n\n${snapshot.nextQuestion}\n\n— SelfField · ${date}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  const remove = () => {
    if (window.confirm('删除这份快照？这个动作无法撤销。')) {
      removeSnapshot(snapshot.id)
      navigate('/history')
    }
  }

  return (
    <div className="mirror-page page-pad">
      <Link className="back-link" to="/history"><ArrowLeft size={16} />全部轨迹</Link>
      <header className="mirror-header">
        <p className="eyebrow">A provisional mirror · {date}</p>
        <h1>此刻显露的，<br /><em>不是全部的你。</em></h1>
        <p>{snapshot.summary}</p>
        <div className="mirror-meta">
          <span>{getContext(snapshot.context).label}</span><span>压力 {snapshot.pressure}/5</span><span>自我确信 {snapshot.confidence}/5</span>
        </div>
      </header>

      <section className="tension-stage" aria-label={`${getValue(snapshot.protectedValue).label}与${getValue(snapshot.quieterValue).label}之间的张力`}>
        <div className="tension-node node-primary"><small>这次被保护</small><strong>{getValue(snapshot.protectedValue).label}</strong><span>{getValue(snapshot.protectedValue).description}</span></div>
        <div className="tension-line"><i /><span>并存，不平均</span><i /></div>
        <div className="tension-node node-secondary"><small>同时被压低</small><strong>{getValue(snapshot.quieterValue).label}</strong><span>{getValue(snapshot.quieterValue).description}</span></div>
      </section>

      <section className="insight-list">
        {snapshot.insights.map((insight, insightIndex) => (
          <article className="insight-card" key={insight.id}>
            <div className="insight-index">0{insightIndex + 1}</div>
            <div className="insight-body">
              <p className="eyebrow">{insight.eyebrow}</p><h2>{insight.title}</h2><p className="insight-statement">{insight.statement}</p>
              <details><summary>查看证据与边界 <ArrowRight size={15} /></summary><blockquote>{insight.evidence}</blockquote><p>{insight.caveat}</p></details>
              <div className="feedback-row"><span>这条理解对你来说：</span><div>
                {feedbackOptions.map((option) => <button className={snapshot.feedback[insight.id] === option.id ? 'selected' : ''} type="button" key={option.id} onClick={() => setFeedback(snapshot.id, insight.id, option.id)}>{snapshot.feedback[insight.id] === option.id && <Check size={13} />}{option.label}</button>)}
              </div></div>
            </div>
          </article>
        ))}
      </section>

      <section className="change-card">
        <p className="eyebrow">Change needs time</p><h2>关于变化，目前能说什么？</h2><p>{compareSnapshots(snapshot, previous)}</p>
      </section>

      <section className="next-question">
        <span>下一次值得观察</span><h2>{snapshot.nextQuestion}</h2><Link className="button button-light" to="/reflect"><Plus size={17} />记录新的经历</Link>
      </section>

      <div className="mirror-actions">
        <button className="button button-ghost" type="button" onClick={copySummary}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? '已复制' : '复制阶段性摘要'}</button>
        <button className="danger-link" type="button" onClick={remove}><Trash2 size={15} />删除这份快照</button>
      </div>
    </div>
  )
}
