// Navigation Links
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Empresa", href: "/empresa" },
  { label: "Serviços", href: "/servicos" },
  { label: "LSF", href: "/lsf" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Atualidade", href: "/atualidade" },
  { label: "Contato", href: "/contato" },
] as const;

// Footer Contact Data (icons will be added in Footer component)
export const FOOTER_CONTACT = [
  { label: "Email", value: "contato@berkahn.com.br", type: "email" },
  { label: "Telefone", value: "+55 (11) 98765-4321", type: "phone" },
  { label: "Localização", value: "São Paulo, SP - Brasil", type: "location" },
] as const;

// Footer Social Data
export const FOOTER_SOCIAL = [
  { label: "LinkedIn", href: "https://linkedin.com/company/berkahn", type: "linkedin" },
  { label: "Instagram", href: "https://instagram.com/berkahn", type: "instagram" },
  { label: "Facebook", href: "https://facebook.com/berkahn", type: "facebook" },
] as const;
