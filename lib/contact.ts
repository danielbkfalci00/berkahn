// Endpoints e links de contato compartilhados pelos formulários públicos.
//
// Não é segredo: o endpoint do Apps Script é público por natureza (o form
// posta direto do browser) e o número do WhatsApp está no rodapé do site.
// O motivo de centralizar é outro — a URL estava hardcoded dentro do
// ContactFormDialog, e a extração do ContactForm a duplicaria.

/** Google Apps Script que grava o lead na planilha. */
export const LEAD_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbx7AGRX_hBuPp4z8UAv27xKQCZls0QRT4g1P2jGeGvqZ6v7IQesTDLmvijN5RwAyvAt4Q/exec";

export const WHATSAPP_NUMBER = "5511966415742";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Gostaria de saber mais sobre os serviços da Berkahn."
)}`;
