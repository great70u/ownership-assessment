import { cookies } from 'next/headers'
import { SettingsClient } from './client'

async function getSessionUser() {
  const cookieStore = await cookies()
  const session = cookieStore.get('zinkro_session')
  if (!session?.value) return null
  try {
    return JSON.parse(Buffer.from(session.value, 'base64').toString('utf-8'))
  } catch {
    return null
  }
}

export default async function SettingsPage() {
  const user = await getSessionUser()
  return <SettingsClient user={user} />
}
