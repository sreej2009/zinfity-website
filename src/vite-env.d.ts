/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_CONTACT_ENDPOINT?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_CONTACT_PHONE?: string
  readonly VITE_CONTACT_LOCATION?: string
  readonly VITE_CAREERS_ENDPOINT?: string
  readonly VITE_CAREERS_EMAIL?: string
  readonly VITE_SOCIAL_LINKEDIN?: string
  readonly VITE_SOCIAL_INSTAGRAM?: string
  readonly VITE_SOCIAL_X?: string
  readonly VITE_SOCIAL_GITHUB?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
