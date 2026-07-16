import { ArrowRight, CircleHelp, Eye, GitCompareArrows, History, Layers3, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const lenses = [
  ['价值', '你愿意保护、牺牲或优先满足什么。'],
  ['动机', '安全、归属、意义、探索等力量如何拉动你。'],
  ['注意与解释', '你首先注意什么，又如何理解发生的事。'],
  ['选择与取舍', '资源有限或目标冲突时，你怎样决定。'],
  ['行动与回避', '你如何开始、坚持、拖延、放弃与恢复。'],
  ['关系与边界', '你怎样处理距离、权力、冲突与互惠。'],
  ['情绪与调节', '压力、不确定与失败如何改变你的状态。'],
  ['自我叙事', '你如何解释过去，以及故事如何塑造现在。'],
]

export function MethodPage() {
  return (
    <div className="method-page">
      <section className="method-hero page-pad">
        <p className="eyebrow">How SelfField sees a person</p>
        <h1>人不是待测量的物体，<br /><em>而是持续发生的过程。</em></h1>
        <p>SelfField 的起点不是“哪套题最准确”，而是四个更基础的事实：我们只能从经历逐渐逼近一个人；情境会改变行动；矛盾可以同时真实；任何理解都必须允许被修正。</p>
      </section>

      <section className="model-section page-pad">
        <div className="section-heading split-heading"><div><p className="eyebrow">The model</p><h2>从证据到暂时的理解</h2></div><p>每一步都保留返回原始经历的路径，不让推断脱离来源。</p></div>
        <div className="model-flow" aria-label="真实经历形成阶段性镜像的过程">
          <div><Eye /><span>真实经历</span><small>Observation</small></div><i>→</i>
          <div><Layers3 /><span>局部信号</span><small>Signal</small></div><i>→</i>
          <div><GitCompareArrows /><span>张力与反例</span><small>Tension</small></div><i>→</i>
          <div><History /><span>阶段性快照</span><small>Snapshot</small></div>
        </div>
      </section>

      <section className="lenses-section page-pad">
        <div className="section-heading"><p className="eyebrow">Eight lenses, never one score</p><h2>八个观察镜头</h2></div>
        <div className="lens-table">
          {lenses.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
        <p className="summary-caveat">这些不是八项人格分数。同一个镜头仍需要经过情境、对象、状态和时间四层条件。</p>
      </section>

      <section className="language-section page-pad">
        <div><p className="eyebrow">Language is an ethical boundary</p><h2>系统可以怎样说，不能怎样说。</h2></div>
        <div className="language-grid">
          <article className="language-do"><span>可以</span><p>“在工作责任较高时，你似乎更倾向保护确定性。这来自一段经历，目前仍有反例。”</p></article>
          <article className="language-dont"><span>不可以</span><p>“你就是一个缺乏冒险精神的人。真正的你永远会选择安全。”</p></article>
        </div>
      </section>

      <section className="limits-section page-pad">
        <div><CircleHelp size={24} /><p className="eyebrow">Honest limits</p><h2>它明确不知道什么</h2></div>
        <div><p>SelfField 不是心理诊断，不用于招聘、信贷、保险、风控或伴侣匹配。它无法读取你没有主动提供的生活，也不会把一次记录包装成完整人格。</p><p>系统的职责不是宣布真相，而是组织证据、暴露矛盾、标记未知，并把最后的解释权留给你。</p><Link className="text-link" to="/data"><ShieldCheck size={16} />了解数据边界 <ArrowRight size={15} /></Link></div>
      </section>

      <section className="method-cta page-pad"><p className="eyebrow">One honest moment is enough to begin</p><h2>带来一件真的发生过的事。</h2><Link className="button button-light" to="/reflect">开始一次照见 <ArrowRight size={17} /></Link></section>
    </div>
  )
}
