import { getCurrentUser, logout } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  async function handleLogout() {
    'use server'
    await logout()
    redirect('/login')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Todo App
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
            <form action={handleLogout}>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                ログアウト
              </button>
            </form>
          </div>
        </header>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            ログイン成功！
          </h2>
          <p className="text-gray-600">
            認証システムが正常に動作しています。
          </p>
        </div>
      </div>
    </div>
  )
}
