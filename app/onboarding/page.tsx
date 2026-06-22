import { cookies } from 'next/headers'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

async function getUser() {
  try {
    const jar = await cookies()
    const raw = jar.get('zinkro_session')?.value
    if (!raw) return null
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as { name: string; email: string; phone?: string }
  } catch {
    return null
  }
}

export default async function OnboardingPage() {
  const user = await getUser()
  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const virtualNumber = process.env.ZINKRO_VIRTUAL_NUMBER ?? '+234 901 234 5678'

  return <OnboardingWizard firstName={firstName} virtualNumber={virtualNumber} />
}
