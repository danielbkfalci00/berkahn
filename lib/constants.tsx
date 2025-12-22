// Navigation Types
export interface NavLinkChild {
  label: string;
  href: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
  children?: NavLinkChild[];
}

export type NavLinks = readonly NavLinkItem[];

// Navigation Links
export const NAV_LINKS: NavLinks = [
  { label: "Home", href: "/" },
  { label: "Empresa", href: "/empresa" },
  {
    label: "Serviços",
    href: "/servicos",
    children: [
      { label: "Execução de Obras", href: "/servicos#execucao" },
      { label: "Projetos Prontos", href: "/servicos#projetos" },
    ],
  },
  { label: "LSF", href: "/lsf" },
  // TODO: Descomentar para mostrar Portfólio no menu
  // { label: "Portfólio", href: "/portfolio" },
  { label: "Atualidade", href: "/atualidade" },
] as const;

// Footer Contact Data (icons will be added in Footer component)
export const FOOTER_CONTACT = [
  { label: "Email", value: "contato.berkahn@gmail.com", type: "email" },
  { label: "Telefone", value: "+55 (11) 96641-5742", type: "phone" },
  { label: "Localização", value: "São Paulo, SP - Brasil", type: "location" },
  { label: "CNPJ", value: "39.455.932/0001-64", type: "cnpj" },
] as const;

// Footer Social Data
export const FOOTER_SOCIAL = [
  { label: "LinkedIn", href: "https://linkedin.com/company/berkahn", type: "linkedin" },
  { label: "Instagram", href: "https://instagram.com/berkahn", type: "instagram" },
  { label: "Facebook", href: "https://facebook.com/berkahn", type: "facebook" },
] as const;
