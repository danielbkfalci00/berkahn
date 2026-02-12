// Shared interfaces used across multiple pages (residencial, comercial-industrial)

export interface ContentBlock {
  title: string;
  description: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}
