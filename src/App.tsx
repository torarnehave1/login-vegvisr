import { useEffect, useMemo, useState } from 'react'
import { LanguageSelector } from 'vegvisr-ui-kit'
import { LanguageContext } from './lib/LanguageContext'
import { getStoredLanguage, setStoredLanguage } from './lib/storage'
import { useTranslation } from './lib/useTranslation'

const MAGIC_BASE = 'https://email-worker.torarnehave.workers.dev'
const DASHBOARD_BASE = 'https://dashboard.vegvisr.org'

function App() {
  const [language, setLanguageState] = useState(getStoredLanguage())
  const [email, setEmail] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const setLanguage = (value: typeof language) => {
    setLanguageState(value)
    setStoredLanguage(value)
  }
  const contextValue = useMemo(() => ({ language, setLanguage }), [language])
  const t = useTranslation(language)

  const setAuthCookie = (token: string) => {
    if (!token) return
    const isVegvisr = window.location.hostname.endsWith('vegvisr.org')
    const domain = isVegvisr ? '; Domain=.vegvisr.org' : ''
    const maxAge = 60 * 60 * 24 * 30
    document.cookie = `vegvisr_token=${encodeURIComponent(
      token
    )}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure${domain}`
  }

  const persistUser = (user: {
    email: string
    role: string
    user_id: string | null
    emailVerificationToken: string | null
    oauth_id?: string | null
    phone?: string | null
    phoneVerifiedAt?: string | null
    branding?: { mySite: string | null; myLogo: string | null }
    profileimage?: string | null
  }) => {
    const payload = {
      email: user.email,
      role: user.role,
      user_id: user.user_id,
      oauth_id: user.oauth_id || user.user_id || null,
      emailVerificationToken: user.emailVerificationToken,
      phone: user.phone || null,
      phoneVerifiedAt: user.phoneVerifiedAt || null,
      branding: user.branding || { mySite: null, myLogo: null },
      profileimage: user.profileimage || null
    }
    localStorage.setItem('user', JSON.stringify(payload))
    if (user.emailVerificationToken) {
      setAuthCookie(user.emailVerificationToken)
    }
    sessionStorage.setItem('email_session_verified', '1')
  }

  const fetchUserContext = async (targetEmail: string) => {
    const roleRes = await fetch(
      `${DASHBOARD_BASE}/get-role?email=${encodeURIComponent(targetEmail)}`
    )
    if (!roleRes.ok) {
      throw new Error(`User role unavailable (status: ${roleRes.status})`)
    }
    const roleData = await roleRes.json()
    if (!roleData?.role) {
      throw new Error('Unable to retrieve user role.')
    }

    const userDataRes = await fetch(
      `${DASHBOARD_BASE}/userdata?email=${encodeURIComponent(targetEmail)}`
    )
    if (!userDataRes.ok) {
      throw new Error(`Unable to fetch user data (status: ${userDataRes.status})`)
    }
    const userData = await userDataRes.json()
    return {
      email: targetEmail,
      role: roleData.role,
      user_id: userData.user_id,
      emailVerificationToken: userData.emailVerificationToken,
      oauth_id: userData.oauth_id,
      phone: userData.phone,
      phoneVerifiedAt: userData.phoneVerifiedAt,
      branding: userData.branding,
      profileimage: userData.profileimage
    }
  }

  const sendMagicLink = async () => {
    if (!email.trim()) return
    setErrorMessage('')
    setStatusMessage('')
    setLoading(true)
    try {
      const params = new URLSearchParams(window.location.search)
      const redirectTarget = params.get('redirect') || 'https://aichat.vegvisr.org'
      const redirectUrl = `${window.location.origin}?redirect=${encodeURIComponent(redirectTarget)}`
      const res = await fetch(`${MAGIC_BASE}/login/magic/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), redirectUrl })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send magic link.')
      }
      setStatusMessage(t('login.sentStatus'))
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : t('login.errorSend'))
    } finally {
      setLoading(false)
    }
  }

  const verifyMagicToken = async (token: string) => {
    setErrorMessage('')
    setStatusMessage(t('login.verifyStatus'))
    setLoading(true)
    try {
      const res = await fetch(
        `${MAGIC_BASE}/login/magic/verify?token=${encodeURIComponent(token)}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      )
      const data = await res.json()
      if (!res.ok || !data.success || !data.email) {
        throw new Error(data.error || 'Invalid or expired magic link.')
      }
      const userContext = await fetchUserContext(data.email)
      persistUser(userContext)
      const params = new URLSearchParams(window.location.search)
      const fallbackRedirect = params.get('redirect') || 'https://aichat.vegvisr.org'
      window.location.href = fallbackRedirect
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : t('login.errorVerify')
      )
      setStatusMessage('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const magic = params.get('magic')
    if (magic) {
      verifyMagicToken(magic)
    }
  }, [])

  return (
    <LanguageContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.25),_transparent_55%)]" />
        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm font-semibold uppercase tracking-[0.4em] text-white/60">
              {t('app.title')}
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector value={language} onChange={setLanguage} />
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                {t('app.badge')}
              </span>
            </div>
          </header>

          <main className="mt-16 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                  Magic Link
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white">
                  {t('login.title')}
                </h1>
                <p className="mt-3 text-sm text-white/70">
                  {t('login.subtitle')}
                </p>

                <div className="mt-8 space-y-4">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    {t('login.label')}
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="email"
                      placeholder={t('login.placeholder')}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                    />
                    <button
                      type="button"
                      onClick={sendMagicLink}
                      disabled={loading}
                      className="rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30"
                    >
                      {loading ? t('login.actionSending') : t('login.action')}
                    </button>
                  </div>
                  {statusMessage && (
                    <p className="text-xs text-emerald-300">{statusMessage}</p>
                  )}
                  {errorMessage && (
                    <p className="text-xs text-rose-300">{errorMessage}</p>
                  )}
                  <p className="text-xs text-white/50">
                    {t('login.note')}
                  </p>
                </div>
              </div>
            </section>

            <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
              <h2 className="text-lg font-semibold text-white">{t('login.stepsTitle')}</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>{t('login.steps.one')}</li>
                <li>{t('login.steps.two')}</li>
                <li>{t('login.steps.three')}</li>
              </ul>
            </aside>
          </main>
        </div>
      </div>
    </LanguageContext.Provider>
  )
}

export default App
