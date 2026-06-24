// Database type para o cliente Supabase tipado.
// Por ora cobre apenas `orcamentos` (Sprint 2). Bruno pode estender conforme
// outras tabelas precisarem de tipagem forte no service client.

import type {
  Orcamento,
  OrcamentoInsert,
  OrcamentoUpdate,
} from "./orcamento-estimativa"

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12"
  }
  public: {
    Tables: {
      orcamentos: {
        Row: Orcamento
        Insert: OrcamentoInsert
        Update: OrcamentoUpdate
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
