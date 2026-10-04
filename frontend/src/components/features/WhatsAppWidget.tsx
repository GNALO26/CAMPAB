// src/components/features/WhatsAppWidget.tsx
'use client'

import { site } from '@/lib/site'

const DEFAULT_MESSAGE =
  'Bonjour, je souhaite obtenir des informations sur les services du cabinet.'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.032 2.001c-5.52 0-9.998 4.478-9.998 9.997 0 1.755.455 3.478 1.32 4.987L2 22l5.076-1.365a9.976 9.976 0 0 0 4.956 1.362c5.52 0 9.998-4.478 9.998-9.997 0-5.52-4.478-9.998-9.998-9.998zm0 18.396c-1.65 0-3.273-.44-4.68-1.276l-3.46.93 1.012-3.385a8.978 8.978 0 0 1-1.39-4.87c0-4.955 4.03-8.985 8.985-8.985 4.954 0 8.985 4.03 8.985 8.985s-4.03 8.985-8.985 8.985zm4.964-6.428c-.27-.135-1.602-.79-1.85-.88-.249-.09-.43-.135-.61.135-.18.27-.698.88-.855 1.06-.157.18-.313.203-.583.068-.27-.135-1.14-.42-2.168-1.335-.802-.72-1.342-1.606-1.5-1.878-.157-.27-.017-.416.118-.55.12-.12.27-.315.405-.472.135-.158.18-.27.27-.45.09-.18.045-.338-.023-.473-.067-.135-.6-1.44-.82-1.972-.216-.525-.436-.453-.6-.46-.153-.007-.33-.008-.506-.008-.18 0-.47.067-.716.337-.248.27-.945.924-.945 2.255 0 1.33.97 2.616 1.105 2.797.135.18 1.905 2.92 4.62 4.106.645.282 1.148.45 1.54.577.646.205 1.234.176 1.7.107.518-.077 1.602-.655 1.828-1.288.226-.634.226-1.177.157-1.29-.067-.113-.248-.18-.518-.315z" />
    </svg>
  )
}

export default function WhatsAppWidget() {
  const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    DEFAULT_MESSAGE,
  )}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-widget"
      aria-label="Contacter le cabinet sur WhatsApp"
      title="Discuter sur WhatsApp"
    >
      <span className="whatsapp-widget__label">Discuter sur WhatsApp</span>
      <WhatsAppIcon className="whatsapp-widget__icon" />
    </a>
  )
}