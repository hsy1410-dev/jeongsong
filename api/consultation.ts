import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

type ConsultationPayload = {
  name: string
  phone: string
  message: string
  submissionId: string
  website?: string
}

const REQUIRED_ENV = [
  'GOOGLE_SHEET_ID',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
] as const

function parsePayload(body: unknown): ConsultationPayload | null {
  let value = body

  if (typeof body === 'string') {
    try {
      value = JSON.parse(body)
    } catch {
      return null
    }
  }

  if (!value || typeof value !== 'object') return null

  const candidate = value as Record<string, unknown>
  const name = typeof candidate.name === 'string' ? candidate.name.trim() : ''
  const phone = typeof candidate.phone === 'string' ? candidate.phone.trim() : ''
  const message = typeof candidate.message === 'string' ? candidate.message.trim() : ''
  const submissionId = typeof candidate.submissionId === 'string' ? candidate.submissionId.trim() : ''
  const website = typeof candidate.website === 'string' ? candidate.website.trim() : ''

  if (
    !name || name.length > 30 ||
    !/^[0-9+() -]{8,20}$/.test(phone) ||
    !message || message.length > 1500 ||
    !/^[0-9a-f-]{36}$/i.test(submissionId)
  ) {
    return null
  }

  return { name, phone, message, submissionId, website }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

async function appendToGoogleSheet(payload: ConsultationPayload, submittedAt: string) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const sheets = google.sheets({ version: 'v4', auth })

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: process.env.GOOGLE_SHEET_RANGE || '상담신청!A:F',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      majorDimension: 'ROWS',
      values: [[
        submittedAt,
        payload.name,
        payload.phone,
        payload.message,
        '랜딩페이지',
        payload.submissionId,
      ]],
    },
  })
}

async function sendTelegramNotification(payload: ConsultationPayload, submittedAt: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  const text = [
    '<b>🔔 새로운 상담 신청</b>',
    '',
    `<b>접수:</b> ${escapeHtml(submittedAt)}`,
    `<b>이름:</b> ${escapeHtml(payload.name)}`,
    `<b>연락처:</b> ${escapeHtml(payload.phone)}`,
    `<b>문의:</b> ${escapeHtml(payload.message)}`,
    `<b>접수 ID:</b> <code>${escapeHtml(payload.submissionId)}</code>`,
  ].join('\n')

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`telegram-${response.status}`)
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  const payload = parsePayload(request.body)
  if (!payload) {
    return response.status(400).json({ ok: false, error: 'invalid_payload' })
  }

  if (payload.website) {
    return response.status(200).json({ ok: true })
  }

  const missingEnvironment = REQUIRED_ENV.filter((name) => !process.env[name])
  if (missingEnvironment.length > 0) {
    return response.status(503).json({ ok: false, error: 'integration_not_configured' })
  }

  const submittedAt = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Asia/Seoul',
  }).format(new Date())

  const [sheetResult, telegramResult] = await Promise.allSettled([
    appendToGoogleSheet(payload, submittedAt),
    sendTelegramNotification(payload, submittedAt),
  ])

  const failed = [
    sheetResult.status === 'rejected' ? 'google_sheets' : null,
    telegramResult.status === 'rejected' ? 'telegram' : null,
  ].filter(Boolean)

  if (failed.length > 0) {
    console.error('Consultation integration failed:', failed.join(', '))
    return response.status(502).json({ ok: false, error: 'integration_failed', failed })
  }

  return response.status(200).json({ ok: true })
}
