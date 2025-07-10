import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  } : undefined
})

export async function sendMagicLink(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const magicLink = `${baseUrl}/verify?token=${token}`
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'ログイン用のマジックリンク',
    html: `
      <p>以下のリンクをクリックしてログインしてください：</p>
      <p><a href="${magicLink}">${magicLink}</a></p>
      <p>このリンクは24時間有効です。</p>
    `
  })
}