// Navigation Types
export interface NavLinkItem {
  label: string;
  href: string;
}

export type NavLinks = readonly NavLinkItem[];

// Navigation Links
//
// Só primeiro nível: a navbar é uma pílula e não tem submenu. Residencial e
// Comercial & Industrial continuam alcançáveis pela página de Serviços e pela
// seção de segmentos da home.
export const NAV_LINKS: NavLinks = [
  { label: "Home", href: "/" },
  { label: "Empresa", href: "/empresa" },
  { label: "Serviços", href: "/servicos" },
  { label: "LSF", href: "/lsf" },
  { label: "Sustentabilidade", href: "/sustentabilidade" },
  // TODO: Descomentar para mostrar Portfólio no menu
  // { label: "Portfólio", href: "/portfolio" },
  { label: "Atualidades", href: "/atualidades" },
  { label: "FAQ", href: "/perguntas-frequentes" },
] as const;

// Links da navbar e do menu do celular. "Home" fica de fora: a marca já leva
// para a home. O rodapé continua usando NAV_LINKS inteiro.
export const BAR_LINKS: NavLinks = NAV_LINKS.filter((link) => link.href !== "/");

export function isNavLinkActive(pathname: string | null, href: string): boolean {
  return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
}

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
] as const;
