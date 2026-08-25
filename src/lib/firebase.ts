const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const isConfigured = Object.values(firebaseConfig).every(Boolean)

type Consultation = {
  name: string
  phone: string
  message: string
}

export async function saveConsultation(consultation: Consultation) {
  if (!isConfigured) {
    throw new Error('firebase-not-configured')
  }

  const [{ getApp, getApps, initializeApp }, { doc, getFirestore, serverTimestamp, setDoc }] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
  ])
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const submissionId = crypto.randomUUID()

  await setDoc(doc(db, 'consultations', submissionId), {
    ...consultation,
    source: 'jeongseong-landing',
    createdAt: serverTimestamp(),
  })

  try {
    const response = await fetch('/api/consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...consultation, submissionId, website: '' }),
    })

    return { integrationsSynced: response.ok }
  } catch {
    return { integrationsSynced: false }
  }
}
