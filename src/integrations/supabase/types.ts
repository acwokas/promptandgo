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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_usage: {
        Row: {
          created_at: string
          id: string
          queries_used: number
          reset_date: string
          updated_at: string
          usage_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          queries_used?: number
          reset_date?: string
          updated_at?: string
          usage_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          queries_used?: number
          reset_date?: string
          updated_at?: string
          usage_type?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_rate_limits: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          email_hash: string
          id: string
          ip_address: unknown | null
          window_start: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          email_hash: string
          id?: string
          ip_address?: unknown | null
          window_start?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          email_hash?: string
          id?: string
          ip_address?: unknown | null
          window_start?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          item_id: string | null
          item_type: string
          order_id: string
          quantity: number
          title: string | null
          unit_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string | null
          item_type: string
          order_id: string
          quantity?: number
          title?: string | null
          unit_amount: number
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string | null
          item_type?: string
          order_id?: string
          quantity?: number
          title?: string | null
          unit_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string
          currency: string
          id: string
          mode: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string
          id?: string
          mode: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string
          id?: string
          mode?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pack_access: {
        Row: {
          created_at: string
          pack_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          pack_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          pack_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_access_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_prompts: {
        Row: {
          created_at: string
          pack_id: string
          prompt_id: string
        }
        Insert: {
          created_at?: string
          pack_id: string
          prompt_id: string
        }
        Update: {
          created_at?: string
          pack_id?: string
          prompt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_prompts_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_prompts_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_tags: {
        Row: {
          created_at: string
          pack_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          pack_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          pack_id?: string
          tag_id?: string
        }
        Relationships: []
      }
      packs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price_cents: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price_cents?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price_cents?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      pending_contacts: {
        Row: {
          confirmation_token: string
          confirmed: boolean
          created_at: string
          email: string
          id: string
          message: string
          name: string
          newsletter_opt_in: boolean
          processed: boolean
          updated_at: string
        }
        Insert: {
          confirmation_token: string
          confirmed?: boolean
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          newsletter_opt_in?: boolean
          processed?: boolean
          updated_at?: string
        }
        Update: {
          confirmation_token?: string
          confirmed?: boolean
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          newsletter_opt_in?: boolean
          processed?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          created_at: string
          icon: string
          id: string
          manual_percentage: number | null
          manual_vote_count: number | null
          order_index: number
          poll_id: string
          text: string
          use_manual_percentage: boolean | null
          use_manual_vote_count: boolean | null
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          manual_percentage?: number | null
          manual_vote_count?: number | null
          order_index?: number
          poll_id: string
          text: string
          use_manual_percentage?: boolean | null
          use_manual_vote_count?: boolean | null
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          manual_percentage?: number | null
          manual_vote_count?: number | null
          order_index?: number
          poll_id?: string
          text?: string
          use_manual_percentage?: boolean | null
          use_manual_vote_count?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          option_id: string
          poll_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          option_id: string
          poll_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          option_id?: string
          poll_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          description: string | null
          display_pages: string[]
          id: string
          intro_copy: string
          is_active: boolean
          manual_total_votes: number | null
          title: string
          updated_at: string
          use_manual_total_votes: boolean | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_pages?: string[]
          id?: string
          intro_copy: string
          is_active?: boolean
          manual_total_votes?: number | null
          title: string
          updated_at?: string
          use_manual_total_votes?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_pages?: string[]
          id?: string
          intro_copy?: string
          is_active?: boolean
          manual_total_votes?: number | null
          title?: string
          updated_at?: string
          use_manual_total_votes?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          context_fields_completed: boolean | null
          context_popup_dismissed: boolean | null
          created_at: string
          desired_outcome: string | null
          display_name: string | null
          id: string
          industry: string | null
          preferred_tone: string | null
          project_type: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          context_fields_completed?: boolean | null
          context_popup_dismissed?: boolean | null
          created_at?: string
          desired_outcome?: string | null
          display_name?: string | null
          id: string
          industry?: string | null
          preferred_tone?: string | null
          project_type?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          context_fields_completed?: boolean | null
          context_popup_dismissed?: boolean | null
          created_at?: string
          desired_outcome?: string | null
          display_name?: string | null
          id?: string
          industry?: string | null
          preferred_tone?: string | null
          project_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prompt_access: {
        Row: {
          created_at: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_access_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_tags: {
        Row: {
          created_at: string
          prompt_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          prompt_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          prompt_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_tags_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          category_id: string
          created_at: string
          excerpt: string | null
          id: string
          image_prompt: string | null
          is_pro: boolean
          prompt: string
          ribbon: string | null
          search_vector: unknown | null
          subcategory_id: string | null
          title: string
          updated_at: string
          what_for: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_prompt?: string | null
          is_pro?: boolean
          prompt: string
          ribbon?: string | null
          search_vector?: unknown | null
          subcategory_id?: string | null
          title: string
          updated_at?: string
          what_for?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_prompt?: string | null
          is_pro?: boolean
          prompt?: string
          ribbon?: string | null
          search_vector?: unknown | null
          subcategory_id?: string | null
          title?: string
          updated_at?: string
          what_for?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          count: number | null
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          window_start: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          window_start?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      shared_links: {
        Row: {
          clicks: number
          content_id: string
          content_type: string
          created_at: string
          id: string
          original_url: string
          shared_by: string | null
          short_code: string
          title: string | null
          updated_at: string
        }
        Insert: {
          clicks?: number
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          original_url: string
          shared_by?: string | null
          short_code: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          clicks?: number
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          original_url?: string
          shared_by?: string | null
          short_code?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string | null
          email_enc: string | null
          email_hash: string | null
          id: string
          stripe_customer_id: string | null
          stripe_customer_id_enc: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          email_enc?: string | null
          email_hash?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_customer_id_enc?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          email_enc?: string | null
          email_hash?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_customer_id_enc?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          admin_notes: string | null
          ai_category: string | null
          ai_sentiment: string | null
          ai_summary: string | null
          content: string
          created_at: string
          email: string | null
          feedback_type: string
          id: string
          name: string | null
          priority: string | null
          prompt_id: string | null
          rating: number | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          ai_category?: string | null
          ai_sentiment?: string | null
          ai_summary?: string | null
          content: string
          created_at?: string
          email?: string | null
          feedback_type: string
          id?: string
          name?: string | null
          priority?: string | null
          prompt_id?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          ai_category?: string | null
          ai_sentiment?: string | null
          ai_summary?: string | null
          content?: string
          created_at?: string
          email?: string | null
          feedback_type?: string
          id?: string
          name?: string | null
          priority?: string | null
          prompt_id?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_generated_prompts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          prompt: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          prompt: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          prompt?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_prompt_preferences: {
        Row: {
          created_at: string
          id: string
          preference_type: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preference_type: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preference_type?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_prompt_preferences_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ratings: {
        Row: {
          created_at: string
          id: string
          prompt_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      widget_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_increment_usage: {
        Args: { usage_type_param: string; user_id_param: string }
        Returns: {
          allowed: boolean
          current_usage: number
          daily_limit: number
          remaining: number
        }[]
      }
      cleanup_newsletter_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_decrypted_subscriber_email: {
        Args: { p_key: string; p_user_id: string }
        Returns: string
      }
      get_poll_results: {
        Args: { poll_id_param: string }
        Returns: {
          option_icon: string
          option_id: string
          option_text: string
          percentage: number
          vote_count: number
        }[]
      }
      get_poll_results_with_manual: {
        Args: { poll_id_param: string }
        Returns: {
          is_manual: boolean
          option_icon: string
          option_id: string
          option_text: string
          percentage: number
          vote_count: number
        }[]
      }
      get_prompt_rating: {
        Args: { prompt_id_param: string }
        Returns: {
          average_rating: number
          total_ratings: number
        }[]
      }
      get_subscriber_info: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          subscribed: boolean
          subscription_end: string
          subscription_tier: string
          updated_at: string
          user_id: string
        }[]
      }
      get_subscribers_admin_view: {
        Args: Record<PropertyKey, never>
        Returns: {
          email_hash: string
          id: string
          subscribed: boolean
          subscription_end: string
          subscription_tier: string
          updated_at: string
          user_id: string
        }[]
      }
      get_user_ai_limits: {
        Args: { user_id_param: string }
        Returns: {
          daily_assistant_limit: number
          daily_generator_limit: number
          daily_suggestions_limit: number
        }[]
      }
      get_user_newsletter_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          newsletter_subscribed: boolean
        }[]
      }
      get_user_subscription_status: {
        Args: { p_user_id?: string }
        Returns: {
          subscribed: boolean
          subscription_end: string
          subscription_tier: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_link_clicks: {
        Args: { link_code: string }
        Returns: undefined
      }
      secure_upsert_subscriber: {
        Args: {
          p_email: string
          p_key: string
          p_stripe_customer_id: string
          p_subscribed: boolean
          p_subscription_end: string
          p_subscription_tier: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
