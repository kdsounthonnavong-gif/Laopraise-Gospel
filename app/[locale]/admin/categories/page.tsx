'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/supabase/types'

type CatName = { lo: string; th: string; en: string; ko: string }
const EMPTY_NAME: CatName = { lo: '', th: '', en: '', ko: '' }

export default function AdminCategoriesPage() {
  const [cats,     setCats]    = useState<Category[]>([])
  const [form,     setForm]    = useState<CatName>(EMPTY_NAME)
  const [parentId, setParent]  = useState<string>('')
  const [editId,   setEditId]  = useState<string | null>(null)
  const [saving,   setSaving]  = useState(false)

  const load = useCallback(async () => {
    const { data } = await createClient().from('categories').select('*').order('sort_order')
    setCats(data ?? [])
  }, [])

  useEffect(() => { load() }, [load])

  async function save() {
    if (!form.lo.trim()) return
    setSaving(true)
    const supabase = createClient()
    const payload  = { name: form, parent_id: parentId || null }

    if (editId) {
      await supabase.from('categories').update(payload).eq('id', editId)
    } else {
      await supabase.from('categories').insert({ ...payload, sort_order: cats.length })
    }

    setForm(EMPTY_NAME); setParent(''); setEditId(null)
    await load()
    setSaving(false)
  }

  async function del(id: string) {
    if (!confirm('ລຶບໝວດນີ້?')) return
    await createClient().from('categories').delete().eq('id', id)
    await load()
  }

  function startEdit(cat: Category) {
    setEditId(cat.id)
    setForm(cat.name as CatName)
    setParent(cat.parent_id ?? '')
  }

  const inputClass = 'flex-1 px-3 py-2 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'
  const parents    = cats.filter(c => !c.parent_id)

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-lg font-bold text-amber-900">📂 ຈັດການໝວດໝູ່</h1>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-amber-100 p-4 space-y-3">
        <p className="text-xs font-semibold text-amber-700">{editId ? 'ແກ້ໄຂ' : 'ເພີ່ມໝວດໃໝ່'}</p>
        {(['lo', 'th', 'en', 'ko'] as const).map(code => (
          <div key={code} className="flex items-center gap-2">
            <span className="text-xs text-amber-500 w-6">{code}</span>
            <input
              className={inputClass}
              value={form[code]}
              onChange={e => setForm(f => ({ ...f, [code]: e.target.value }))}
              placeholder={`ຊື່ (${code})`}
            />
          </div>
        ))}
        <div>
          <label className="text-xs text-amber-500 block mb-1">Parent (ຖ້າເປັນ sub-folder)</label>
          <select className={`${inputClass} w-full`} value={parentId} onChange={e => setParent(e.target.value)}>
            <option value="">-- ບໍ່ມີ parent --</option>
            {parents.map(p => (
              <option key={p.id} value={p.id}>{(p.name as Record<string, string>)['lo']}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {editId && (
            <button
              onClick={() => { setEditId(null); setForm(EMPTY_NAME); setParent('') }}
              className="flex-1 py-2 rounded-xl border border-amber-200 text-amber-600 text-sm"
            >
              ຍົກເລີກ
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !form.lo.trim()}
            className="flex-1 py-2 rounded-xl bg-amber-900 text-white text-sm font-bold disabled:opacity-40"
          >
            {saving ? '...' : '💾 ບັນທຶກ'}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
        {parents.map(parent => {
          const kids = cats.filter(c => c.parent_id === parent.id)
          return (
            <div key={parent.id}>
              <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-amber-100">
                <span className="font-semibold text-amber-900 text-sm">📂 {(parent.name as Record<string, string>)['lo']}</span>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(parent)} className="text-xs text-amber-600">ແກ້</button>
                  <button onClick={() => del(parent.id)} className="text-xs text-red-400">ລຶບ</button>
                </div>
              </div>
              {kids.map(child => (
                <div key={child.id} className="flex items-center justify-between px-4 py-2.5 border-b border-amber-50 last:border-0">
                  <span className="text-sm text-amber-700 ml-4">↳ {(child.name as Record<string, string>)['lo']}</span>
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(child)} className="text-xs text-amber-600">ແກ້</button>
                    <button onClick={() => del(child.id)} className="text-xs text-red-400">ລຶບ</button>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
        {cats.length === 0 && (
          <p className="text-center text-amber-400 py-8 text-sm">ຍັງບໍ່ມີໝວດ</p>
        )}
      </div>
    </div>
  )
}
