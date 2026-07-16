import { ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getContext, getValue, values } from '../data/reflection'
import { useSelfFieldStore } from '../store/useSelfFieldStore'

export function HistoryPage() {
  const snapshots = useSelfFieldStore((state) => state.snapshots)

  if (snapshots.length === 0) {
    return (
      <div className="empty-page history-empty page-pad">
        <div className="empty-field" aria-hidden="true"><i /><i /><i /></div>
        <p className="eyebrow">A trajectory begins with evidence</p><h1>你的场还没有留下轨迹。</h1>
        <p>先记录一件真正发生过的事。变化不是由一次测试宣布的，而是在多个时间点之间被看见。</p>
        <Link className="button button-dark" to="/reflect"><Plus size={17} />开始第一次照见</Link>
      </div>
    )
  }

  const valueCounts = values
    .map((value) => ({ ...value, count: snapshots.filter((snapshot) => snapshot.protectedValue === value.id || snapshot.quieterValue === value.id).length }))
    .filter((value) => value.count > 0)
    .sort((a, b) => b.count - a.count)
  const tensionCounts = snapshots.reduce<Record<string, number>>((acc, snapshot) => {
    const pair = [snapshot.protectedValue, snapshot.quieterValue].sort().join(':')
    acc[pair] = (acc[pair] ?? 0) + 1
    return acc
  }, {})
  const repeatedTensions = Object.entries(tensionCounts).filter(([, count]) => count > 1)

  return (
    <div className="history-page page-pad">
      <header className="page-header split-heading">
        <div><p className="eyebrow">Snapshots, not scores</p><h1>变化轨迹</h1></div>
        <div><p>这里没有“完整度”。只有你主动留下的 {snapshots.length} 个时间点，以及它们之间逐渐显露的重复与变化。</p><Link className="button button-dark button-compact" to="/reflect"><Plus size={16} />新的照见</Link></div>
      </header>

      <section className="field-summary">
        <div className="section-heading"><p className="eyebrow">Signals across time</p><h2>哪些方向反复出现？</h2></div>
        <div className="signal-cloud">
          {valueCounts.map((value, index) => <div className={`signal-chip tone-${index % 4}`} key={value.id} style={{ '--signal-size': `${Math.min(1 + value.count * 0.12, 1.5)}rem` } as React.CSSProperties}><strong>{value.label}</strong><span>在 {value.count} 份经历中被提及</span></div>)}
        </div>
        <p className="summary-caveat">出现次数不是人格分数。它也可能只反映你最近正在面对的生活主题。</p>
      </section>

      <section className="tension-summary">
        <div><p className="eyebrow">Tensions</p><h2>{repeatedTensions.length ? '这些矛盾不止出现了一次。' : '矛盾还没有形成重复模式。'}</h2></div>
        <div className="repeated-list">
          {repeatedTensions.length ? repeatedTensions.map(([pair, count]) => {
            const [first, second] = pair.split(':')
            return <p key={pair}><strong>{getValue(first as Parameters<typeof getValue>[0]).label}</strong><i>与</i><strong>{getValue(second as Parameters<typeof getValue>[0]).label}</strong><span>{count} 次</span></p>
          }) : <p>至少需要两份出现相似张力的记录，才值得把它称作“重复信号”。</p>}
        </div>
      </section>

      <section className="timeline-section">
        <div className="section-heading"><p className="eyebrow">Evidence timeline</p><h2>每一份阶段性镜像</h2></div>
        <div className="timeline">
          {snapshots.map((snapshot, index) => (
            <Link className="timeline-item" to={`/mirror/${snapshot.id}`} key={snapshot.id}>
              <div className="timeline-date"><span>{new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(new Date(snapshot.createdAt))}</span><small>{new Date(snapshot.createdAt).getFullYear()}</small></div>
              <div><p>{snapshot.title} · {getContext(snapshot.context).label}</p><h3>{getValue(snapshot.protectedValue).label} <i>与</i> {getValue(snapshot.quieterValue).label}</h3><span>{snapshot.summary}</span></div>
              <div className="timeline-count">0{snapshots.length - index}</div><ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
