import { useLocation } from 'react-router'
import { site } from '@/config/site'

const message = 'Hi Zinfity Technologies, I would like to discuss a project.'

/** Floating WhatsApp chat link, bottom-right on every page. */
export function WhatsAppButton() {
  const number = site.contact.whatsapp
  const { pathname } = useLocation()
  if (!number || pathname.startsWith('/admin')) return null
  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Zinfity Technologies on WhatsApp (opens in a new tab)"
      className="wa-float group fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-[#25d366] p-3.5 text-white shadow-[0_18px_36px_-12px_rgb(0_0_0/0.45)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366] sm:bottom-7 sm:right-7"
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-[#25d366] opacity-40 motion-safe:animate-ping [animation-duration:2.6s]" />
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="currentColor">
        <path d="M16.04 3C9.38 3 3.98 8.4 3.98 15.06c0 2.13.56 4.21 1.62 6.04L3.9 27.3l6.35-1.66a12.04 12.04 0 0 0 5.78 1.47h.01c6.66 0 12.06-5.4 12.06-12.06 0-3.22-1.25-6.25-3.53-8.53A11.98 11.98 0 0 0 16.04 3Zm0 22.07h-.01a10 10 0 0 1-5.1-1.4l-.37-.22-3.77.99 1-3.67-.24-.38a9.96 9.96 0 0 1-1.53-5.33c0-5.53 4.5-10.03 10.03-10.03a9.97 9.97 0 0 1 10.02 10.04c0 5.53-4.5 10-10.03 10Zm5.5-7.5c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.07-.13-.27-.2-.57-.35Z" />
      </svg>
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-[0.88rem] font-medium transition-[max-width,padding] duration-500 group-hover:max-w-[10rem] group-hover:pr-1.5 sm:inline">Chat with us</span>
    </a>
  )
}
