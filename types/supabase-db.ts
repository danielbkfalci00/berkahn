export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string
          entity_name: string
          entity_type: string
          id: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id: string
          entity_name: string
          entity_type: string
          id?: string
          user_id?: string | null
          user_name: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string
          entity_name?: string
          entity_type?: string
          id?: string
          user_id?: string | null
          user_name?: string
        }
        Relationships: []
      }
      analytics_snapshots: {
        Row: {
          context: Json
          ga4_data: Json
          ga4_prev: Json | null
          generated_at: string
          gsc_data: Json
          gsc_prev: Json | null
          month: string
        }
        Insert: {
          context: Json
          ga4_data: Json
          ga4_prev?: Json | null
          generated_at?: string
          gsc_data: Json
          gsc_prev?: Json | null
          month: string
        }
        Update: {
          context?: Json
          ga4_data?: Json
          ga4_prev?: Json | null
          generated_at?: string
          gsc_data?: Json
          gsc_prev?: Json | null
          month?: string
        }
        Relationships: []
      }
      analytics_tasks: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          completion_note: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          origin_signal: string | null
          priority: string
          sort_order: number
          source: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          completion_note?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          origin_signal?: string | null
          priority?: string
          sort_order?: number
          source?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          completion_note?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          origin_signal?: string | null
          priority?: string
          sort_order?: number
          source?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      conteudo_pautas: {
        Row: {
          atualizado_em: string
          capa_blog_url: string | null
          capa_linkedin_url: string | null
          criado_em: string
          criado_por: string | null
          data_alvo: string | null
          draft_path: string | null
          funil: string | null
          id: string
          insights: string | null
          intencao: string | null
          keyword: string | null
          linkedin_briefing: string | null
          linkedin_imagem_briefing: string | null
          linkedin_imagem_prompt: string | null
          linkedin_publicado_em: string | null
          linkedin_texto: string | null
          linkedin_url: string | null
          ordem_blog: number | null
          ordem_linkedin: number | null
          plataformas: string[]
          post_id: string | null
          prioridade: number | null
          pesquisa_conteudo: string | null
          semana: number | null
          status_blog: string | null
          status_linkedin: string | null
          tipo: string
          titulo: string
          trilha: string | null
        }
        Insert: {
          atualizado_em?: string
          capa_blog_url?: string | null
          capa_linkedin_url?: string | null
          criado_em?: string
          criado_por?: string | null
          data_alvo?: string | null
          draft_path?: string | null
          funil?: string | null
          id?: string
          insights?: string | null
          intencao?: string | null
          keyword?: string | null
          linkedin_briefing?: string | null
          linkedin_imagem_briefing?: string | null
          linkedin_imagem_prompt?: string | null
          linkedin_publicado_em?: string | null
          linkedin_texto?: string | null
          linkedin_url?: string | null
          ordem_blog?: number | null
          ordem_linkedin?: number | null
          plataformas?: string[]
          post_id?: string | null
          prioridade?: number | null
          pesquisa_conteudo?: string | null
          semana?: number | null
          status_blog?: string | null
          status_linkedin?: string | null
          tipo?: string
          titulo: string
          trilha?: string | null
        }
        Update: {
          atualizado_em?: string
          capa_blog_url?: string | null
          capa_linkedin_url?: string | null
          criado_em?: string
          criado_por?: string | null
          data_alvo?: string | null
          draft_path?: string | null
          funil?: string | null
          id?: string
          insights?: string | null
          intencao?: string | null
          keyword?: string | null
          linkedin_briefing?: string | null
          linkedin_imagem_briefing?: string | null
          linkedin_imagem_prompt?: string | null
          linkedin_publicado_em?: string | null
          linkedin_texto?: string | null
          linkedin_url?: string | null
          ordem_blog?: number | null
          ordem_linkedin?: number | null
          plataformas?: string[]
          post_id?: string | null
          prioridade?: number | null
          pesquisa_conteudo?: string | null
          semana?: number | null
          status_blog?: string | null
          status_linkedin?: string | null
          tipo?: string
          titulo?: string
          trilha?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conteudo_pautas_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }

      orcamentos: {
        Row: {
          atualizado_em: string
          cliente_email: string | null
          cliente_nome: string
          cliente_telefone: string | null
          condicionantes_extras: Json
          criado_em: string
          criado_por: string | null
          data_cotacao: string
          data_elaboracao: string
          entrega_categorias_ativas: Json
          exclusoes_extras: Json
          hero_image_url: string | null
          id: string
          numero: string
          obra_cidade: string
          obra_endereco: string
          obra_referencia: string | null
          pdf_storage_path: string | null
          pdf_url: string | null
          projeto_area_m2: number
          projeto_padrao: string
          projeto_pavimentos: number
          projeto_piscina: string | null
          regime_recomendado: string
          responsavel_tecnico: string | null
          slug: string
          status: string
          validade_dias: number
          valor_m2_max: number
          valor_m2_min: number
          valor_max: number
          valor_min: number
        }
        Insert: {
          atualizado_em?: string
          cliente_email?: string | null
          cliente_nome: string
          cliente_telefone?: string | null
          condicionantes_extras?: Json
          criado_em?: string
          criado_por?: string | null
          data_cotacao?: string
          data_elaboracao?: string
          entrega_categorias_ativas?: Json
          exclusoes_extras?: Json
          hero_image_url?: string | null
          id?: string
          numero: string
          obra_cidade: string
          obra_endereco: string
          obra_referencia?: string | null
          pdf_storage_path?: string | null
          pdf_url?: string | null
          projeto_area_m2: number
          projeto_padrao: string
          projeto_pavimentos?: number
          projeto_piscina?: string | null
          regime_recomendado?: string
          responsavel_tecnico?: string | null
          slug?: string
          status?: string
          validade_dias?: number
          valor_m2_max: number
          valor_m2_min: number
          valor_max: number
          valor_min: number
        }
        Update: {
          atualizado_em?: string
          cliente_email?: string | null
          cliente_nome?: string
          cliente_telefone?: string | null
          condicionantes_extras?: Json
          criado_em?: string
          criado_por?: string | null
          data_cotacao?: string
          data_elaboracao?: string
          entrega_categorias_ativas?: Json
          exclusoes_extras?: Json
          hero_image_url?: string | null
          id?: string
          numero?: string
          obra_cidade?: string
          obra_endereco?: string
          obra_referencia?: string | null
          pdf_storage_path?: string | null
          pdf_url?: string | null
          projeto_area_m2?: number
          projeto_padrao?: string
          projeto_pavimentos?: number
          projeto_piscina?: string | null
          regime_recomendado?: string
          responsavel_tecnico?: string | null
          slug?: string
          status?: string
          validade_dias?: number
          valor_m2_max?: number
          valor_m2_min?: number
          valor_max?: number
          valor_min?: number
        }
        Relationships: []
      }
      posts: {
        Row: {
          answer_summary: string | null
          author: string
          category: string
          components: Json | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string
          featured: boolean
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          read_time: number
          scheduled_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          answer_summary?: string | null
          author?: string
          category?: string
          components?: Json | null
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt: string
          featured?: boolean
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: number
          scheduled_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          answer_summary?: string | null
          author?: string
          category?: string
          components?: Json | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: number
          scheduled_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      presentations: {
        Row: {
          access_token: string
          client_email: string | null
          client_name: string
          cover_image: string | null
          created_at: string
          expires_at: string | null
          id: string
          project_type: string
          sent_at: string | null
          slides: Json
          status: string
          title: string
          updated_at: string
          view_count: number
          viewed_at: string | null
        }
        Insert: {
          access_token?: string
          client_email?: string | null
          client_name: string
          cover_image?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          project_type: string
          sent_at?: string | null
          slides?: Json
          status?: string
          title: string
          updated_at?: string
          view_count?: number
          viewed_at?: string | null
        }
        Update: {
          access_token?: string
          client_email?: string | null
          client_name?: string
          cover_image?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          project_type?: string
          sent_at?: string | null
          slides?: Json
          status?: string
          title?: string
          updated_at?: string
          view_count?: number
          viewed_at?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          access_token: string
          client_address: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          discount_amount: number
          discount_type: string
          discount_value: number
          id: string
          internal_notes: string | null
          items: Json
          notes: string | null
          payment_terms: string | null
          project_description: string | null
          project_type: string
          proposal_number: string
          responded_at: string | null
          sent_at: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string
          valid_until: string
          viewed_at: string | null
        }
        Insert: {
          access_token?: string
          client_address?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          discount_amount?: number
          discount_type?: string
          discount_value?: number
          id?: string
          internal_notes?: string | null
          items?: Json
          notes?: string | null
          payment_terms?: string | null
          project_description?: string | null
          project_type: string
          proposal_number?: string
          responded_at?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          valid_until?: string
          viewed_at?: string | null
        }
        Update: {
          access_token?: string
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          discount_amount?: number
          discount_type?: string
          discount_value?: number
          id?: string
          internal_notes?: string | null
          items?: Json
          notes?: string | null
          payment_terms?: string | null
          project_description?: string | null
          project_type?: string
          proposal_number?: string
          responded_at?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          valid_until?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gerar_numero_orcamento: { Args: never; Returns: string }
      get_dashboard_stats: { Args: never; Returns: Json }
      mover_pautas_conteudo: {
        Args: { p_canal: string; p_updates: Json; p_origem?: string }
        Returns: undefined
      }
      publicar_artigo_pauta: {
        Args: { p_pauta_id: string; p_publicado_path: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
