export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Accounts: {
        Row: {
          company: string | null
          created_at: string
          id: number
          name: string
          type: Database["public"]["Enums"]["account_types"] | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          id?: number
          name: string
          type?: Database["public"]["Enums"]["account_types"] | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          id?: number
          name?: string
          type?: Database["public"]["Enums"]["account_types"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Transaction_Templates: {
        Row: {
          category: string | null
          created_at: string
          description: string
          id: number
          is_reoccuring: boolean | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          id?: number
          is_reoccuring?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          id?: number
          is_reoccuring?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Transactions: {
        Row: {
          account_id: number | null
          amount: number
          category: string | null
          created_at: string
          date: string
          description: string
          id: string
          is_reoccuring: boolean
          name: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: number | null
          amount: number
          category?: string | null
          created_at?: string
          date: string
          description: string
          id?: string
          is_reoccuring?: boolean
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: number | null
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_reoccuring?: boolean
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "Accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_types: "chequing" | "savings" | "investment" | "cc"
      categories:
        | "bills"
        | "cash"
        | "charity"
        | "entertainment"
        | "excluded"
        | "groceries"
        | "holidays"
        | "housing"
        | "income"
        | "investments"
        | "personal"
        | "shopping"
        | "take_out"
        | "transport"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_types: ["chequing", "savings", "investment", "cc"],
      categories: [
        "bills",
        "cash",
        "charity",
        "entertainment",
        "excluded",
        "groceries",
        "holidays",
        "housing",
        "income",
        "investments",
        "personal",
        "shopping",
        "take_out",
        "transport",
      ],
    },
  },
} as const
