import { ArrowDown, ArrowRight, Eye, Layers3, LockKeyhole, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

const principles = [
  { icon: Eye, index: '01', title: '揭示，而非裁决', body: '每个洞察都是等待你确认或反驳的假设，不是系统替你宣布的真相。' },
  { icon: Layers3, index: '02', title: '多维，而非分类', body: '价值、动机、行动、关系与情境彼此交叠，不再被压缩成四个字母。' },
  { icon: ArrowDown, index: '03', title: '保留矛盾', body: '自由与安全、亲密与独立可以同时真实。这里不把张力平均掉。' },
  { icon: RefreshCw, index: '04', title: '观察变化', body: '每份镜像都有日期。真正重要的不是一次答案，而是你如何持续改变。' },
]

export function HomePage() {
  return (
    <>
      <section className="hero page-pad">
        <div className="hero-copy">
          <p className="eyebrow"><span /> A living mirror for the many dimensions of you</p>
          <h1>你不是一个答案。<br /><em>你是一个不断变化的场。</em></h1>
          <p className="hero-lede">SelfField 从真实发生过的选择、关系、回避和意外出发，逐渐形成一面有证据、有反例、也敢于承认未知的个人镜像。</p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/reflect">开始一次照见 <ArrowRight size={18} /></Link>
            <Link className="text-link" to="/method">它如何理解一个人 <ArrowRight size={16} /></Link>
          </div>
          <p className="privacy-note"><LockKeyhole size={15} />所有记录只保存在当前设备。无需登录，不会上传。</p>
        </div>

        <div className="field-visual" aria-label="一张同时保留自由与安全两种需要的示意镜像">
          <div className="field-orbit orbit-one" />
          <div className="field-orbit orbit-two" />
          <div className="field-node node-freedom"><span>自由</span><small>选择权 · 空间</small></div>
          <div className="field-node node-safety"><span>安全</span><small>确定 · 可控</small></div>
          <div className="field-center"><small>内在张力</small><strong>两者都是真的</strong><p>不必选出一个<br />“真正的你”</p></div>
          <div className="field-caption"><span>FIELD NOTE · 07.16</span><p>矛盾不是误差，而是一个人完整性的证据。</p></div>
        </div>
      </section>

      <section className="statement-band">
        <p>See yourself as a field, <i>not a label.</i></p>
      </section>

      <section className="principles-section page-pad" id="principles">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">First principles</p><h2>镜子不替你下定义。</h2></div>
          <p>它只是让已经发生的选择变得可见，让冲突拥有位置，让时间参与理解。</p>
        </div>
        <div className="principle-grid">
          {principles.map((item) => {
            const Icon = item.icon
            return (
              <article className="principle-card" key={item.index}>
                <div><span>{item.index}</span><Icon size={20} strokeWidth={1.5} /></div>
                <h3>{item.title}</h3><p>{item.body}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="how-section page-pad">
        <div className="section-heading"><p className="eyebrow">One honest moment at a time</p><h2>不用完成一套测试。<br />只需要带来一件真的发生过的事。</h2></div>
        <ol className="how-list">
          <li><span>01</span><div><h3>从具体经历开始</h3><p>一次选择、一段关系、一次回避，或一个让你意外的自己。</p></div></li>
          <li><span>02</span><div><h3>看见行动背后的保护</h3><p>你做了什么、在保护什么，又把什么暂时放在了后面。</p></div></li>
          <li><span>03</span><div><h3>主动寻找反例</h3><p>换一个对象、压力或情境，这个解释还成立吗？</p></div></li>
          <li><span>04</span><div><h3>留下阶段性快照</h3><p>你可以确认、修正或否认每条洞察，再让时间显露变化。</p></div></li>
        </ol>
      </section>

      <section className="closing-section page-pad">
        <p className="eyebrow">Your inner life is not commercial data</p>
        <h2>尽可能诚实地照见已经显露的部分，<br />也坦白承认仍然看不见的部分。</h2>
        <Link className="button button-light" to="/reflect">开始第一次记录 <ArrowRight size={18} /></Link>
      </section>
    </>
  )
}
