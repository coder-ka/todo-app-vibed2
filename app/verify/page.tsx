import { verifyToken, setAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface VerifyPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { token } = await searchParams
  
  if (!token) {
    redirect('/login')
  }
  
  const login = await verifyToken(token)
  
  if (!login) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              無効なトークン
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              リンクが無効または期限切れです。再度ログインしてください。
            </p>
            <a
              href="/login"
              className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              ログインページに戻る
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  async function handleVerifyToken() {
    'use server'
    if (token) {
      await setAuthCookie(token)
      redirect('/')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            ログイン中...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            認証を完了しています。しばらくお待ちください。
          </p>
        </div>
        <form action={handleVerifyToken}>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ログインを完了する
          </button>
        </form>
      </div>
    </div>
  )
}