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
      admin_rate_limits: {
        Row: {
          action: string
          count: number
          created_at: string
          id: string
          user_id: string
          window_start: string
        }
        Insert: {
          action: string
          count?: number
          created_at?: string
          id?: string
          user_id: string
          window_start?: string
        }
        Update: {
          action?: string
          count?: number
          created_at?: string
          id?: string
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
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
      analytics_funnel_completions: {
        Row: {
          completed_at: string | null
          created_at: string
          funnel_id: string | null
          id: string
          is_complete: boolean | null
          session_id: string | null
          steps_completed: Json
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          funnel_id?: string | null
          id?: string
          is_complete?: boolean | null
          session_id?: string | null
          steps_completed?: Json
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          funnel_id?: string | null
          id?: string
          is_complete?: boolean | null
          session_id?: string | null
          steps_completed?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_funnel_completions_funnel_id_fkey"
            columns: ["funnel_id"]
            isOneToOne: false
            referencedRelation: "analytics_funnels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_funnel_completions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "analytics_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_funnels: {
        Row: {
          created_at: string
          funnel_name: string
          funnel_steps: Json
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          funnel_name: string
          funnel_steps?: Json
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          funnel_name?: string
          funnel_steps?: Json
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      analytics_notifications: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          id: string
          message: string
          metric_type: string
          metric_value: number
          notification_type: string
          sent_at: string
          threshold_id: string | null
          threshold_value: number
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          id?: string
          message: string
          metric_type: string
          metric_value: number
          notification_type: string
          sent_at?: string
          threshold_id?: string | null
          threshold_value: number
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          id?: string
          message?: string
          metric_type?: string
          metric_value?: number
          notification_type?: string
          sent_at?: string
          threshold_id?: string | null
          threshold_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "analytics_notifications_threshold_id_fkey"
            columns: ["threshold_id"]
            isOneToOne: false
            referencedRelation: "analytics_thresholds"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_page_views: {
        Row: {
          created_at: string
          id: string
          page_path: string
          page_title: string | null
          referrer: string | null
          scroll_depth: number | null
          session_id: string | null
          time_on_page_seconds: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          page_title?: string | null
          referrer?: string | null
          scroll_depth?: number | null
          session_id?: string | null
          time_on_page_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          scroll_depth?: number | null
          session_id?: string | null
          time_on_page_seconds?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_page_views_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "analytics_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_sessions: {
        Row: {
          browser: string | null
          conversion_type: string | null
          converted: boolean | null
          country: string | null
          created_at: string
          device_type: string | null
          entry_page: string | null
          events_count: number | null
          exit_page: string | null
          id: string
          ip_hash: string | null
          is_bounce: boolean | null
          max_scroll_depth: number | null
          os: string | null
          pages_viewed: number | null
          referrer: string | null
          session_end: string | null
          session_start: string
          total_time_seconds: number | null
          updated_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          browser?: string | null
          conversion_type?: string | null
          converted?: boolean | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          entry_page?: string | null
          events_count?: number | null
          exit_page?: string | null
          id?: string
          ip_hash?: string | null
          is_bounce?: boolean | null
          max_scroll_depth?: number | null
          os?: string | null
          pages_viewed?: number | null
          referrer?: string | null
          session_end?: string | null
          session_start?: string
          total_time_seconds?: number | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          browser?: string | null
          conversion_type?: string | null
          converted?: boolean | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          entry_page?: string | null
          events_count?: number | null
          exit_page?: string | null
          id?: string
          ip_hash?: string | null
          is_bounce?: boolean | null
          max_scroll_depth?: number | null
          os?: string | null
          pages_viewed?: number | null
          referrer?: string | null
          session_end?: string | null
          session_start?: string
          total_time_seconds?: number | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      analytics_thresholds: {
        Row: {
          comparison: string
          created_at: string
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          metric_type: string
          notify_browser: boolean | null
          notify_email: boolean | null
          threshold_name: string
          threshold_value: number
          time_window_minutes: number
          updated_at: string
        }
        Insert: {
          comparison: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          metric_type: string
          notify_browser?: boolean | null
          notify_email?: boolean | null
          threshold_name: string
          threshold_value: number
          time_window_minutes?: number
          updated_at?: string
        }
        Update: {
          comparison?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          metric_type?: string
          notify_browser?: boolean | null
          notify_email?: boolean | null
          threshold_name?: string
          threshold_value?: number
          time_window_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      api_key_rotation_log: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          rotated_by: string | null
          rotation_date: string
          service_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          rotated_by?: string | null
          rotation_date?: string
          service_name: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          rotated_by?: string | null
          rotation_date?: string
          service_name?: string
        }
        Relationships: []
      }
      article_assets: {
        Row: {
          article_id: string
          asset_description: string | null
          asset_title: string | null
          asset_type: string
          asset_url: string
          created_at: string
          display_order: number | null
          id: string
        }
        Insert: {
          article_id: string
          asset_description?: string | null
          asset_title?: string | null
          asset_type: string
          asset_url: string
          created_at?: string
          display_order?: number | null
          id?: string
        }
        Update: {
          article_id?: string
          asset_description?: string | null
          asset_title?: string | null
          asset_type?: string
          asset_url?: string
          created_at?: string
          display_order?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_assets_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          focus_keyword: string | null
          id: string
          is_published: boolean
          keyphrases: string[] | null
          meta_description: string | null
          meta_title: string | null
          published_date: string | null
          slug: string
          synopsis: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          focus_keyword?: string | null
          id?: string
          is_published?: boolean
          keyphrases?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_date?: string | null
          slug: string
          synopsis?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          focus_keyword?: string | null
          id?: string
          is_published?: boolean
          keyphrases?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_date?: string | null
          slug?: string
          synopsis?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
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
      certification_completions: {
        Row: {
          certificate_id: string
          completion_date: string
          created_at: string
          full_name: string
          id: string
          quiz_score: number
          total_xp: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          certificate_id: string
          completion_date?: string
          created_at?: string
          full_name: string
          id?: string
          quiz_score: number
          total_xp?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          certificate_id?: string
          completion_date?: string
          created_at?: string
          full_name?: string
          id?: string
          quiz_score?: number
          total_xp?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      countdown_settings: {
        Row: {
          created_at: string
          enabled: boolean
          expiry_hours: number
          id: string
          offer_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          expiry_hours?: number
          id?: string
          offer_text?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          expiry_hours?: number
          id?: string
          offer_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupon_usage: {
        Row: {
          coupon_id: string
          discount_applied: number
          id: string
          order_id: string | null
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          discount_applied: number
          id?: string
          order_id?: string | null
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          discount_applied?: number
          id?: string
          order_id?: string | null
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          current_uses: number
          description: string | null
          discount_type: string
          discount_value: number | null
          free_pack_id: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          minimum_purchase_cents: number | null
          updated_at: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number
          description?: string | null
          discount_type: string
          discount_value?: number | null
          free_pack_id?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          minimum_purchase_cents?: number | null
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number
          description?: string | null
          discount_type?: string
          discount_value?: number | null
          free_pack_id?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          minimum_purchase_cents?: number | null
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      daily_ai_sends: {
        Row: {
          created_at: string
          id: string
          send_count: number
          send_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          send_count?: number
          send_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          send_count?: number
          send_date?: string
          updated_at?: string
          user_id?: string
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
      featured_categories: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          link: string
          message: string
          title: string
          updated_at: string | null
          usage_text: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon: string
          id?: string
          is_active?: boolean | null
          link: string
          message: string
          title: string
          updated_at?: string | null
          usage_text: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          link?: string
          message?: string
          title?: string
          updated_at?: string | null
          usage_text?: string
        }
        Relationships: []
      }
      newsletter_rate_limits: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          email_hash: string
          id: string
          ip_address: unknown
          window_start: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          email_hash: string
          id?: string
          ip_address?: unknown
          window_start?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          email_hash?: string
          id?: string
          ip_address?: unknown
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
          email_enc: string | null
          email_hash: string | null
          id: string
          message: string
          message_enc: string | null
          name: string
          name_enc: string | null
          newsletter_opt_in: boolean
          processed: boolean
          updated_at: string
        }
        Insert: {
          confirmation_token: string
          confirmed?: boolean
          created_at?: string
          email: string
          email_enc?: string | null
          email_hash?: string | null
          id?: string
          message: string
          message_enc?: string | null
          name: string
          name_enc?: string | null
          newsletter_opt_in?: boolean
          processed?: boolean
          updated_at?: string
        }
        Update: {
          confirmation_token?: string
          confirmed?: boolean
          created_at?: string
          email?: string
          email_enc?: string | null
          email_hash?: string | null
          id?: string
          message?: string
          message_enc?: string | null
          name?: string
          name_enc?: string | null
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
          ip_address: unknown
          option_id: string
          poll_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown
          option_id: string
          poll_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
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
          certification_badge_url: string | null
          context_fields_completed: boolean | null
          context_popup_dismissed: boolean | null
          created_at: string
          desired_outcome: string | null
          display_name: string | null
          id: string
          industry: string | null
          is_certified: boolean | null
          preferred_tone: string | null
          project_type: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          certification_badge_url?: string | null
          context_fields_completed?: boolean | null
          context_popup_dismissed?: boolean | null
          created_at?: string
          desired_outcome?: string | null
          display_name?: string | null
          id: string
          industry?: string | null
          is_certified?: boolean | null
          preferred_tone?: string | null
          project_type?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          certification_badge_url?: string | null
          context_fields_completed?: boolean | null
          context_popup_dismissed?: boolean | null
          created_at?: string
          desired_outcome?: string | null
          display_name?: string | null
          id?: string
          industry?: string | null
          is_certified?: boolean | null
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
          search_vector: unknown
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
          search_vector?: unknown
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
          search_vector?: unknown
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
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
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
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
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
      site_analytics_events: {
        Row: {
          browser: string | null
          country: string | null
          created_at: string
          device_type: string | null
          event_category: string | null
          event_name: string
          event_type: string
          id: string
          ip_hash: string | null
          metadata: Json | null
          os: string | null
          page_path: string | null
          page_title: string | null
          referrer: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_category?: string | null
          event_name: string
          event_type: string
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          os?: string | null
          page_path?: string | null
          page_title?: string | null
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_category?: string | null
          event_name?: string
          event_type?: string
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          os?: string | null
          page_path?: string | null
          page_title?: string | null
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
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
      user_ai_preferences: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          provider_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          provider_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          provider_id?: string
          updated_at?: string
          user_id?: string
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
          email_enc: string | null
          email_hash: string | null
          feedback_type: string
          id: string
          name: string | null
          name_enc: string | null
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
          email_enc?: string | null
          email_hash?: string | null
          feedback_type: string
          id?: string
          name?: string | null
          name_enc?: string | null
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
          email_enc?: string | null
          email_hash?: string | null
          feedback_type?: string
          id?: string
          name?: string | null
          name_enc?: string | null
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
      user_xp: {
        Row: {
          available_xp: number
          created_at: string
          id: string
          level: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_xp?: number
          created_at?: string
          id?: string
          level?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_xp?: number
          created_at?: string
          id?: string
          level?: number
          total_xp?: number
          updated_at?: string
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
      xp_activities: {
        Row: {
          activity_description: string | null
          activity_key: string
          activity_name: string
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          is_repeatable: boolean
          repeat_interval: string | null
          xp_value: number
        }
        Insert: {
          activity_description?: string | null
          activity_key: string
          activity_name: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          is_repeatable?: boolean
          repeat_interval?: string | null
          xp_value: number
        }
        Update: {
          activity_description?: string | null
          activity_key?: string
          activity_name?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          is_repeatable?: boolean
          repeat_interval?: string | null
          xp_value?: number
        }
        Relationships: []
      }
      xp_reward_redemptions: {
        Row: {
          id: string
          metadata: Json | null
          redeemed_at: string
          reward_id: string
          status: string
          user_id: string
          xp_spent: number
        }
        Insert: {
          id?: string
          metadata?: Json | null
          redeemed_at?: string
          reward_id: string
          status?: string
          user_id: string
          xp_spent: number
        }
        Update: {
          id?: string
          metadata?: Json | null
          redeemed_at?: string
          reward_id?: string
          status?: string
          user_id?: string
          xp_spent?: number
        }
        Relationships: []
      }
      xp_rewards: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          reward_description: string | null
          reward_key: string
          reward_name: string
          reward_type: string
          reward_value: Json | null
          xp_cost: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          reward_description?: string | null
          reward_key: string
          reward_name: string
          reward_type: string
          reward_value?: Json | null
          xp_cost: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          reward_description?: string | null
          reward_key?: string
          reward_name?: string
          reward_type?: string
          reward_value?: Json | null
          xp_cost?: number
        }
        Relationships: []
      }
      xp_transactions: {
        Row: {
          activity_key: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          transaction_type: string
          user_id: string
          xp_amount: number
        }
        Insert: {
          activity_key?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          transaction_type: string
          user_id: string
          xp_amount: number
        }
        Update: {
          activity_key?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          transaction_type?: string
          user_id?: string
          xp_amount?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      audit_unencrypted_pii: {
        Args: never
        Returns: {
          issue_type: string
          record_count: number
          severity: string
          table_name: string
        }[]
      }
      award_xp: {
        Args: {
          p_activity_key: string
          p_description?: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: {
          new_total_xp: number
          success: boolean
          xp_awarded: number
        }[]
      }
      check_admin_rate_limit: {
        Args: { p_action: string; p_limit?: number; p_window_minutes?: number }
        Returns: boolean
      }
      check_analytics_thresholds: {
        Args: never
        Returns: {
          current_value: number
          is_triggered: boolean
          message: string
          metric_type: string
          threshold_id: string
          threshold_name: string
          threshold_value: number
        }[]
      }
      check_and_increment_daily_ai_sends: {
        Args: { p_user_id: string }
        Returns: Json
      }
      check_and_increment_usage: {
        Args: { usage_type_param: string; user_id_param: string }
        Returns: {
          allowed: boolean
          current_usage: number
          daily_limit: number
          remaining: number
        }[]
      }
      check_api_key_rotation_status: {
        Args: never
        Returns: {
          days_since_rotation: number
          last_rotation: string
          rotation_recommended: boolean
          service_name: string
        }[]
      }
      cleanup_newsletter_rate_limits: { Args: never; Returns: undefined }
      confirm_contact_secure: {
        Args: { p_encryption_key: string; p_token: string }
        Returns: {
          contact_id: string
          created_at: string
          email: string
          message: string
          name: string
          newsletter_opt_in: boolean
        }[]
      }
      detect_unusual_admin_access: {
        Args: never
        Returns: {
          action_count: number
          last_action: string
          risk_level: string
          user_id: string
        }[]
      }
      enhanced_security_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_limit?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      get_admin_contact_data: {
        Args: { p_contact_id: string; p_encryption_key: string }
        Returns: {
          confirmed: boolean
          created_at: string
          email: string
          id: string
          message: string
          name: string
          newsletter_opt_in: boolean
          processed: boolean
        }[]
      }
      get_admin_feedback_data: {
        Args: { p_encryption_key: string; p_feedback_id: string }
        Returns: {
          content: string
          created_at: string
          email: string
          feedback_type: string
          id: string
          name: string
          rating: number
          user_id: string
        }[]
      }
      get_admin_subscriber_data: {
        Args: { p_encryption_key: string; p_user_id: string }
        Returns: {
          email: string
          id: string
          stripe_customer_id: string
          subscribed: boolean
          subscription_end: string
          subscription_tier: string
          user_id: string
        }[]
      }
      get_analytics_summary: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          avg_session_duration: number
          bounce_rate: number
          conversion_rate: number
          total_events: number
          total_page_views: number
          total_sessions: number
          unique_visitors: number
        }[]
      }
      get_daily_ai_sends_count: { Args: { p_user_id: string }; Returns: Json }
      get_decrypted_contact: {
        Args: { p_contact_id: string; p_key: string }
        Returns: {
          confirmed: boolean
          created_at: string
          email: string
          id: string
          message: string
          name: string
          newsletter_opt_in: boolean
          processed: boolean
        }[]
      }
      get_decrypted_subscriber_email: {
        Args: { p_key: string; p_user_id: string }
        Returns: string
      }
      get_event_counts: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          event_count: number
          event_name: string
          event_type: string
        }[]
      }
      get_pending_contacts_admin: {
        Args: { p_encryption_key: string }
        Returns: {
          confirmed: boolean
          created_at: string
          email: string
          id: string
          message: string
          name: string
          newsletter_opt_in: boolean
          processed: boolean
        }[]
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
      get_safe_subscriber_view: {
        Args: { p_user_id?: string }
        Returns: {
          created_at: string
          email_hash: string
          has_encrypted_email: boolean
          id: string
          subscribed: boolean
          subscription_end: string
          subscription_tier: string
          updated_at: string
          user_id: string
        }[]
      }
      get_sgt_date: { Args: never; Returns: string }
      get_subscriber_encrypted_data: {
        Args: { p_encryption_key: string; p_user_id: string }
        Returns: {
          email: string
          id: string
          stripe_customer_id: string
          subscribed: boolean
          subscription_end: string
          subscription_tier: string
          user_id: string
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
        Args: never
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
      get_top_pages: {
        Args: { p_end_date?: string; p_limit?: number; p_start_date?: string }
        Returns: {
          avg_scroll_depth: number
          avg_time_on_page: number
          page_path: string
          view_count: number
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
        Args: never
        Returns: {
          newsletter_subscribed: boolean
        }[]
      }
      get_user_subscription_data: {
        Args: never
        Returns: {
          created_at: string
          id: string
          subscribed: boolean
          subscription_end: string
          subscription_tier: string
          updated_at: string
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
      increment_link_clicks: { Args: { link_code: string }; Returns: undefined }
      is_admin_user: { Args: never; Returns: boolean }
      log_data_access: {
        Args: {
          p_action: string
          p_ip_address?: unknown
          p_record_id?: string
          p_table_name: string
          p_user_agent?: string
        }
        Returns: undefined
      }
      log_encryption_failure: {
        Args: {
          p_error_message: string
          p_record_id: string
          p_table_name: string
        }
        Returns: undefined
      }
      log_security_event: {
        Args: {
          p_description?: string
          p_event_type: string
          p_metadata?: Json
          p_severity?: string
        }
        Returns: undefined
      }
      migrate_contacts_service_role: { Args: never; Returns: undefined }
      migrate_encrypt_contacts: {
        Args: { p_encryption_key: string }
        Returns: undefined
      }
      migrate_encrypt_feedback: {
        Args: { p_encryption_key: string }
        Returns: undefined
      }
      migrate_encrypt_subscribers: {
        Args: { p_encryption_key: string }
        Returns: undefined
      }
      redeem_xp_reward: {
        Args: { p_reward_id: string; p_user_id: string }
        Returns: {
          message: string
          new_available_xp: number
          success: boolean
        }[]
      }
      rotate_featured_categories: { Args: never; Returns: undefined }
      secure_insert_contact: {
        Args: {
          p_email: string
          p_key: string
          p_message: string
          p_name: string
          p_newsletter_opt_in?: boolean
        }
        Returns: string
      }
      secure_insert_feedback: {
        Args: {
          p_content: string
          p_email?: string
          p_feedback_type: string
          p_key: string
          p_name?: string
          p_prompt_id?: string
          p_rating?: number
          p_user_id: string
        }
        Returns: string
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
      validate_coupon: {
        Args: { p_cart_total_cents: number; p_code: string; p_user_id: string }
        Returns: {
          coupon_id: string
          discount_type: string
          discount_value: number
          free_pack_id: string
          message: string
          valid: boolean
        }[]
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
