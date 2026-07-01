import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { AppLocale } from '@/i18n'

export default async function AdminUsersPage({
  params: { locale },
}: {
  params: { locale: AppLocale }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)

  const { data: myRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (myRole?.role !== 'admin') {
    return (
      <div className="text-center py-12 text-amber-500">
        ສະຖານທີ່ນີ້ສຳລັບ Admin ເທົ່ານັ້ນ
      </div>
    )
  }

  const { data: roles } = await supabase.from('user_roles').select('*')

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-lg font-bold text-amber-900">👤 ຈັດການຜູ້ໃຊ້</h1>
      <p className="text-xs text-amber-500">
        ເພີ່ມຜູ້ໃຊ້ໃໝ່ຜ່ານ Supabase Dashboard → Authentication → Invite User
        ຈາກນັ້ນ insert row ໃນ table <code>user_roles</code> ດ້ວຍ role &apos;editor&apos; ຫລື &apos;admin&apos;
      </p>
      <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-amber-50 border-b border-amber-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-amber-700">User ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-amber-700">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50">
            {(roles ?? []).map(r => (
              <tr key={r.id}>
                <td className="px-4 py-3 text-xs font-mono text-amber-600 truncate max-w-[180px]">{r.user_id}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {r.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
