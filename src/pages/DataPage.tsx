import { Download, FileUp, LockKeyhole, ShieldCheck, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { parseArchive } from '../lib/archive'
import { createArchive, useSelfFieldStore } from '../store/useSelfFieldStore'

export function DataPage() {
  const snapshots = useSelfFieldStore((state) => state.snapshots)
  const replaceSnapshots = useSelfFieldStore((state) => state.replaceSnapshots)
  const clearAll = useSelfFieldStore((state) => state.clearAll)
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')

  const exportData = () => {
    const blob = new Blob([JSON.stringify(createArchive(snapshots), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `selffield-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    setMessage('已导出一份可读的 JSON 备份。')
  }

  const importData = async (file?: File) => {
    if (!file) return
    try {
      const archive = parseArchive(JSON.parse(await file.text()))
      if (snapshots.length && !window.confirm(`导入会用 ${archive.snapshots.length} 份记录替换当前 ${snapshots.length} 份记录。继续吗？`)) return
      replaceSnapshots(archive.snapshots)
      setMessage(`已恢复 ${archive.snapshots.length} 份阶段性镜像。`)
    } catch {
      setMessage('无法读取这份文件。它不是有效的 SelfField 备份。')
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeAll = () => {
    if (!snapshots.length) return
    if (window.confirm(`彻底删除这台设备上的 ${snapshots.length} 份记录？这个动作无法撤销。`)) {
      clearAll()
      setMessage('本地记录已全部删除。')
    }
  }

  return (
    <div className="data-page page-pad">
      <header className="page-header split-heading">
        <div><p className="eyebrow">Your data remains yours</p><h1>数据主权</h1></div>
        <p>你的内心不是商业数据。SelfField 不要求账号，不连接分析服务，也不会把记录发送到服务器。</p>
      </header>

      <section className="storage-card">
        <div className="storage-status"><div><LockKeyhole size={24} /><span className="status-dot" /></div><p className="eyebrow">On this device only</p><h2>{snapshots.length} 份记录，只在当前浏览器中。</h2><p>清除浏览器数据会同时删除它们。需要长期保留时，请主动导出备份。</p></div>
        <div className="data-actions">
          <button className="data-action" type="button" onClick={exportData}><Download /><span><strong>导出全部数据</strong><small>下载开放、可读的 JSON 文件</small></span></button>
          <button className="data-action" type="button" onClick={() => inputRef.current?.click()}><FileUp /><span><strong>恢复一份备份</strong><small>验证格式后替换当前记录</small></span></button>
          <input ref={inputRef} type="file" accept="application/json,.json" hidden onChange={(event) => void importData(event.target.files?.[0])} />
          <button className="data-action danger" type="button" onClick={removeAll} disabled={!snapshots.length}><Trash2 /><span><strong>彻底删除</strong><small>不保留云端副本，也无法恢复</small></span></button>
        </div>
      </section>
      {message && <p className="data-message" role="status">{message}</p>}

      <section className="privacy-grid">
        <article><span>01</span><ShieldCheck /><h3>默认私密</h3><p>没有账号、追踪脚本、广告画像或第三方心理数据服务。</p></article>
        <article><span>02</span><Download /><h3>完整可携带</h3><p>你可以随时导出全部原始经历、洞察、反馈和时间信息。</p></article>
        <article><span>03</span><Trash2 /><h3>真正可删除</h3><p>删除发生在本地，没有隐藏副本等待另一次请求。</p></article>
      </section>

      <section className="ethics-note"><p className="eyebrow">Deliberate non-features</p><h2>不会出现的功能</h2><p>公开人格排行榜、稀有度、好友 PK、未经同意的数据接入、基于心理状态的广告，以及制造焦虑的“自我了解完成度”。</p></section>
    </div>
  )
}
