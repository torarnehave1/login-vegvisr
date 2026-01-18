export type Language = 'en' | 'is' | 'no' | 'nl';

type TranslationValue = string | TranslationTree;
interface TranslationTree {
  [key: string]: TranslationValue;
}

export const translations: Record<Language, TranslationTree> = {
  en: {
    app: {
      title: 'Vegvisr Login',
      badge: 'Early Access'
    },
    login: {
      title: 'Sign in to continue your Vegvisr journey',
      subtitle: 'Enter your email and we will send you a secure magic link to access your account.',
      label: 'Email address',
      placeholder: 'you@vegvisr.org',
      action: 'Send magic link',
      actionSending: 'Sending...',
      verifyStatus: 'Verifying magic link...',
      sentStatus: 'Magic link sent. Check your email to continue.',
      errorSend: 'Failed to send magic link.',
      errorVerify: 'Magic link verification failed.',
      note: 'This login is the gateway for the new Pages apps (aichat, future tools).',
      stepsTitle: 'What happens next',
      steps: {
        one: 'Check your inbox for a secure login link.',
        two: 'Open the link to verify your session.',
        three: 'Continue into Vegvisr AI Chat and other tools.'
      }
    }
  },
  is: {
    app: {
      title: 'Vegvisr Innskraning',
      badge: 'Early Access'
    },
    login: {
      title: 'Skradu inn til ad halda afram i Vegvisr ferlinu',
      subtitle: 'Skradu inn netfang og vid sendum ther trygga galdra-tengingu.',
      label: 'Netfang',
      placeholder: 'you@vegvisr.org',
      action: 'Senda galdra-tengingu',
      actionSending: 'Sendi...',
      verifyStatus: 'Stadfesti galdra-tengingu...',
      sentStatus: 'Galdra-tenging send. Athugadu póstinn.',
      errorSend: 'Mistókst ad senda galdra-tengingu.',
      errorVerify: 'Stadfesting galdra-tengingar mistókst.',
      note: 'Thessi innskraning er hliid fyrir nyju Pages forritin (aichat, fleiri verkfaeri).',
      stepsTitle: 'Hvad gerist naest',
      steps: {
        one: 'Athugadu innholfid fyrir trygga tengingu.',
        two: 'Opnadu tenginguna til ad stadfesta lotu.',
        three: 'Haltu afram i Vegvisr AI Chat og onnur verkfaeri.'
      }
    }
  },
  no: {
    app: {
      title: 'Vegvisr Innlogging',
      badge: 'Tidlig Tilgang'
    },
    login: {
      title: 'Logg inn for a fortsette Vegvisr-reisen',
      subtitle: 'Skriv inn e-post, sa sender vi en sikker magisk lenke.',
      label: 'E-postadresse',
      placeholder: 'you@vegvisr.org',
      action: 'Send magisk lenke',
      actionSending: 'Sender...',
      verifyStatus: 'Verifiserer magisk lenke...',
      sentStatus: 'Magisk lenke sendt. Sjekk e-posten din.',
      errorSend: 'Kunne ikke sende magisk lenke.',
      errorVerify: 'Verifisering av magisk lenke feilet.',
      note: 'Denne innloggingen er inngangen til de nye Pages-appene (aichat, flere verktøy).',
      stepsTitle: 'Hva skjer videre',
      steps: {
        one: 'Sjekk innboksen for en sikker innloggingslenke.',
        two: 'Aapne lenken for a bekrefte okten.',
        three: 'Fortsett inn i Vegvisr AI Chat og andre verktoy.'
      }
    }
  },
  nl: {
    app: {
      title: 'Vegvisr Inloggen',
      badge: 'Early Access'
    },
    login: {
      title: 'Log in om door te gaan met je Vegvisr-reis',
      subtitle: 'Vul je e-mail in en we sturen je een veilige magic link.',
      label: 'E-mailadres',
      placeholder: 'you@vegvisr.org',
      action: 'Stuur magic link',
      actionSending: 'Versturen...',
      verifyStatus: 'Magic link verifiëren...',
      sentStatus: 'Magic link verzonden. Check je e-mail.',
      errorSend: 'Magic link verzenden mislukt.',
      errorVerify: 'Magic link verificatie mislukt.',
      note: 'Deze login is de toegang tot de nieuwe Pages apps (aichat, toekomstige tools).',
      stepsTitle: 'Wat gebeurt er hierna',
      steps: {
        one: 'Controleer je inbox voor de veilige loginlink.',
        two: 'Open de link om je sessie te verifiëren.',
        three: 'Ga verder naar Vegvisr AI Chat en andere tools.'
      }
    }
  }
};
