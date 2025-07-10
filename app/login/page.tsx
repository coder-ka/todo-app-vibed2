import { createAccount, createLoginToken } from '@/lib/auth'
import { sendMagicLink } from '@/lib/email'
import { redirect } from 'next/navigation'

interface LoginPageProps {
  searchParams: Promise<{ sent?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { sent } = await searchParams
  
  async function handleLogin(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    if (!email) {
      return
    }
    
    const account = await createAccount(email)
    const token = await createLoginToken(account.id)
    
    await sendMagicLink(email, token)
    
    redirect('/login?sent=true')
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            メールアドレスを入力してマジックリンクを受信してください
          </p>
        </div>
        
        <form className="mt-8 space-y-6" action={handleLogin}>
          <div>
            <label htmlFor="email" className="sr-only">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="メールアドレス"
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              マジックリンクを送信
            </button>
          </div>
        </form>
        
        {sent && (
          <div className="text-center">
            <p className="text-sm text-green-600">
              メールを送信しました。メールボックスを確認してください。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}