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
      { label: "Residencial", href: "/residencial" },
      { label: "Comercial & Industrial", href: "/comercial-industrial" },
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

// Footer Legal Links
export const FOOTER_LEGAL = [
  { label: "Política de Privacidade", href: "/privacidade" },
  { label: "Termos de Uso", href: "/termos-de-uso" },
] as const;

// Footer Social Data
export const FOOTER_SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/construtora-berkahn/?viewAsMember=true", type: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/berkahn.co/", type: "instagram" },
] as const;
