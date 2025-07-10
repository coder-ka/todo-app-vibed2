import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import { prisma } from './db'

export async function createAccount(email: string) {
  const existing = await prisma.account.findUnique({
    where: { email }
  })
  
  if (existing) {
    return existing
  }
  
  return await prisma.account.create({
    data: { email }
  })
}

export async function createLoginToken(accountId: string) {
  const token = crypto.randomBytes(32).toString('hex')
  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  
  await prisma.login.create({
    data: {
      token,
      accountId,
      expiredAt
    }
  })
  
  return token
}

export async function verifyToken(token: string) {
  const login = await prisma.login.findUnique({
    where: { token },
    include: { account: true }
  })
  
  if (!login || login.expiredAt < new Date()) {
    return null
  }
  
  return login
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 // 24 hours
  })
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    return null
  }
  
  const login = await verifyToken(token)
  return login?.account || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function logout() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (token) {
    await prisma.login.delete({
      where: { token }
    }).catch(() => {})
  }
  
  cookieStore.delete('auth-token')
}