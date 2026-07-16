import { ArrowLeft, ArrowRight, Check, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { actions, contexts, getLens, getValue, lenses, values } from '../data/reflection'
import { createSnapshot } from '../lib/synthesize'
import { useSelfFieldStore } from '../store/useSelfFieldStore'
import type { ActionId, ContextId, LensId, ReflectionDraft, ValueId } from '../types'

const initialDraft: ReflectionDraft = {
  lens: 'decision',
  experience: '',
  context: 'work',
  pressure: 3,
  action: 'wait',
  protectedValue: 'safety',
  quieterValue: 'freedom',
  cost: '',
  counterexample: '',
  confidence: 3,
}

const stepLabels = ['入口', '经历', '情境', '张力', '反例', '确认']

export function ReflectPage() {
  const navigate = useNavigate()
  const addSnapshot = useSelfFieldStore((state) => state.addSnapshot)
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<ReflectionDraft>(initialDraft)
  const [touched, setTouched] = useState(false)

  const update = <K extends keyof ReflectionDraft>(key: K, value: ReflectionDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setTouched(false)
  }

  const isValid = (() => {
    if (step === 1) return draft.experience.trim().length >= 24
    if (step === 3) return draft.protectedValue !== draft.quieterValue && draft.cost.trim().length >= 8
    if (step === 4) return draft.counterexample.trim().length >= 12
    return true
  })()

  const next = () => {
    if (!isValid) {
      setTouched(true)
      return
    }
    setStep((current) => Math.min(current + 1, stepLabels.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const complete = () => {
    const snapshot = createSnapshot(draft)
    addSnapshot(snapshot)
    navigate(`/mirror/${snapshot.id}`)
  }

  return (
    <div className="reflect-page page-pad">
      <header className="reflect-header">
        <div>
          <p className="eyebrow">A field note, not a test</p>
          <h1>开始一次照见</h1>
        </div>
        <p><LockKeyhole size={15} />内容只保存在这台设备</p>
      </header>

      <div className="progress" aria-label={`第 ${step + 1} 步，共 ${stepLabels.length} 步`}>
        <div className="progress-track"><i style={{ width: `${((step + 1) / stepLabels.length) * 100}%` }} /></div>
        <div className="progress-label"><span>0{step + 1}</span><span>{stepLabels[step]}</span><span>0{stepLabels.length}</span></div>
      </div>

      <section className="reflect-card">
        {step === 0 && (
          <div className="step-content">
            <StepHeading index="01" title="今天，你想照见什么？" body="选一个真实入口。不是描述一般意义上的自己，而是回到一件具体发生过的事。" />
            <div className="lens-grid">
              {lenses.map((lens) => (
                <button className={`choice-card ${draft.lens === lens.id ? 'selected' : ''}`} type="button" key={lens.id} onClick={() => update('lens', lens.id as LensId)}>
                  <span>{lens.index}</span><strong>{lens.title}</strong><p>{lens.description}</p>{draft.lens === lens.id && <Check size={17} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="step-content narrow-step">
            <StepHeading index="02" title={getLens(draft.lens).prompt} body="写下事实、你的行动和当时真正重要的细节。不需要把故事讲得漂亮。" />
            <label className="field-label" htmlFor="experience">这件事是怎样发生的？</label>
            <textarea id="experience" className="large-textarea" value={draft.experience} onChange={(event) => update('experience', event.target.value)} placeholder="例如：上周我收到一个很想做但风险很高的机会。我没有立刻答应，而是……" rows={8} autoFocus />
            <div className="field-meta"><span className={touched && !isValid ? 'error-text' : ''}>{draft.experience.trim().length < 24 ? '至少写下 24 个字，让这件事足够具体。' : '已经足够具体，可以继续。'}</span><span>{draft.experience.trim().length}</span></div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content narrow-step">
            <StepHeading index="03" title="情境改变了什么？" body="同一个人在不同关系、压力和位置中，本来就可能做出不同选择。" />
            <fieldset><legend>这件事主要发生在哪里？</legend><div className="pill-options">
              {contexts.map((context) => <button type="button" className={draft.context === context.id ? 'selected' : ''} key={context.id} onClick={() => update('context', context.id as ContextId)}>{context.label}</button>)}
            </div></fieldset>
            <fieldset><legend>当时的压力有多强？ <span>{draft.pressure}/5</span></legend>
              <input className="range-input" type="range" min="1" max="5" value={draft.pressure} onChange={(event) => update('pressure', Number(event.target.value))} aria-label="压力强度" />
              <div className="range-labels"><span>有余裕</span><span>被推着走</span></div>
            </fieldset>
            <fieldset><legend>你实际上做了什么？</legend><div className="action-grid">
              {actions.map((action) => <button type="button" className={draft.action === action.id ? 'selected' : ''} key={action.id} onClick={() => update('action', action.id as ActionId)}>{action.label}</button>)}
            </div></fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <StepHeading index="04" title="这次选择保护了什么，又压低了什么？" body="不要选“更正确”的答案。两个方向可以同样真实，只是在这一刻排序不同。" />
            <div className="value-columns">
              <fieldset><legend>被放在前面的</legend><div className="value-list">
                {values.map((value) => <button type="button" className={draft.protectedValue === value.id ? 'selected primary' : ''} key={value.id} onClick={() => update('protectedValue', value.id as ValueId)}><strong>{value.label}</strong><span>{value.description}</span></button>)}
              </div></fieldset>
              <fieldset><legend>同时存在、但被压低的</legend><div className="value-list">
                {values.map((value) => <button type="button" disabled={draft.protectedValue === value.id} className={draft.quieterValue === value.id ? 'selected secondary' : ''} key={value.id} onClick={() => update('quieterValue', value.id as ValueId)}><strong>{value.label}</strong><span>{value.description}</span></button>)}
              </div></fieldset>
            </div>
            <label className="field-label" htmlFor="cost">这个排序带来了什么代价？</label>
            <textarea id="cost" value={draft.cost} onChange={(event) => update('cost', event.target.value)} placeholder="例如：我获得了确定性，但也放弃了一次表达真实想法的机会。" rows={4} />
            {touched && !isValid && <p className="error-text">请选择两个不同方向，并具体写下这次选择的代价。</p>}
          </div>
        )}

        {step === 4 && (
          <div className="step-content narrow-step">
            <StepHeading index="05" title="什么时候，你不会这样选择？" body="一个解释如果找不到反例，就很容易变成新的标签。请主动为它寻找边界。" />
            <label className="field-label" htmlFor="counterexample">换一个对象、压力或情境，什么会让你做出不同选择？</label>
            <textarea id="counterexample" className="large-textarea" value={draft.counterexample} onChange={(event) => update('counterexample', event.target.value)} placeholder="例如：如果这件事只影响我自己，或风险能够撤回，我可能会更愿意直接尝试。" rows={7} autoFocus />
            <fieldset><legend>你有多确定“{getValue(draft.protectedValue).label}”是这次最重要的保护？</legend><div className="certainty-options">
              {[1, 2, 3, 4, 5].map((value) => <button type="button" className={draft.confidence === value ? 'selected' : ''} key={value} onClick={() => update('confidence', value)}>{value}</button>)}
            </div><div className="range-labels"><span>只是猜测</span><span>非常贴近</span></div></fieldset>
            {touched && !isValid && <p className="error-text">请写下至少一种可能的反例，让这份理解保留边界。</p>}
          </div>
        )}

        {step === 5 && (
          <div className="step-content review-step">
            <StepHeading index="06" title="先保留这一刻，不急着把它变成结论。" body="SelfField 会生成一份带日期的阶段性镜像。你可以逐条确认、修正或否认。" />
            <div className="review-grid">
              <div><span>入口</span><strong>{getLens(draft.lens).title}</strong></div>
              <div><span>情境</span><strong>{contexts.find((item) => item.id === draft.context)?.label}</strong></div>
              <div><span>被保护</span><strong>{getValue(draft.protectedValue).label}</strong></div>
              <div><span>被压低</span><strong>{getValue(draft.quieterValue).label}</strong></div>
            </div>
            <blockquote>“{draft.experience}”</blockquote>
            <div className="review-tension"><span>{getValue(draft.protectedValue).label}</span><i>与</i><span>{getValue(draft.quieterValue).label}</span></div>
            <p className="review-note">这不是心理诊断，也不会告诉你“真正的你是什么”。它只整理你主动提供的一段经历。</p>
          </div>
        )}
      </section>

      <div className="step-actions">
        <button className="button button-ghost" type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft size={17} />上一步</button>
        {step < stepLabels.length - 1
          ? <button className="button button-dark" type="button" onClick={next}>继续 <ArrowRight size={17} /></button>
          : <button className="button button-dark" type="button" onClick={complete}>生成阶段性镜像 <ArrowRight size={17} /></button>}
      </div>
    </div>
  )
}

function StepHeading({ index, title, body }: { index: string; title: string; body: string }) {
  return <header className="step-heading"><span>{index}</span><div><h2>{title}</h2><p>{body}</p></div></header>
}
