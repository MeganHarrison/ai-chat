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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      active_clients_history: {
        Row: {
          clients: number | null
          date: string
        }
        Insert: {
          clients?: number | null
          date: string
        }
        Update: {
          clients?: number | null
          date?: string
        }
        Relationships: []
      }
      cancellations: {
        Row: {
          cancellation_date: string | null
          cancellation_reason: string | null
          code: string | null
          contact_id: number | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          start_date: string | null
        }
        Insert: {
          cancellation_date?: string | null
          cancellation_reason?: string | null
          code?: string | null
          contact_id?: number | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: never
          last_name?: string | null
          start_date?: string | null
        }
        Update: {
          cancellation_date?: string | null
          cancellation_reason?: string | null
          code?: string | null
          contact_id?: number | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: never
          last_name?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cancellations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "keap_customers"
            referencedColumns: ["keap_contact_id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chatId: string
          createdAt: string
          id: string
          role: string
        }
        Insert: {
          chatId: string
          createdAt?: string
          id: string
          role: string
        }
        Update: {
          chatId?: string
          createdAt?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chatId_chats_id_fk"
            columns: ["chatId"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          id: string
        }
        Insert: {
          id?: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      code_examples: {
        Row: {
          chunk_number: number
          content: string
          created_at: string
          embedding: string | null
          id: number
          metadata: Json
          source_id: string
          summary: string
          url: string
        }
        Insert: {
          chunk_number: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          source_id: string
          summary: string
          url: string
        }
        Update: {
          chunk_number?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          source_id?: string
          summary?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_examples_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["source_id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          id: string
          keap_app_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          keap_app_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          keap_app_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_insights: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          pattern_text: string | null
          pattern_type: string | null
          success_rate: number | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          pattern_text?: string | null
          pattern_type?: string | null
          success_rate?: number | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          pattern_text?: string | null
          pattern_type?: string | null
          success_rate?: number | null
          usage_count?: number | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          is_archived: boolean | null
          last_message_at: string | null
          metadata: Json | null
          session_id: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          is_archived?: boolean | null
          last_message_at?: string | null
          metadata?: Json | null
          session_id: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          is_archived?: boolean | null
          last_message_at?: string | null
          metadata?: Json | null
          session_id?: string
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crawled_pages: {
        Row: {
          chunk_number: number
          content: string
          created_at: string
          embedding: string | null
          id: number
          metadata: Json
          source_id: string
          url: string
        }
        Insert: {
          chunk_number: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          source_id: string
          url: string
        }
        Update: {
          chunk_number?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          source_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "crawled_pages_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["source_id"]
          },
        ]
      }
      document_metadata: {
        Row: {
          created_at: string | null
          id: string
          schema: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          schema?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          schema?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
      document_rows: {
        Row: {
          dataset_id: string | null
          id: number
          row_data: Json | null
        }
        Insert: {
          dataset_id?: string | null
          id?: number
          row_data?: Json | null
        }
        Update: {
          dataset_id?: string | null
          id?: number
          row_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_rows_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "document_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      embeddings: {
        Row: {
          content: string
          embedding: string
          id: string
          resource_id: string | null
        }
        Insert: {
          content: string
          embedding: string
          id: string
          resource_id?: string | null
        }
        Update: {
          content?: string
          embedding?: string
          id?: string
          resource_id?: string | null
        }
        Relationships: []
      }
      faq_vectors: {
        Row: {
          answer: string
          category: string | null
          combined_text: string | null
          created_at: string | null
          embedding: string | null
          id: string
          question: string
        }
        Insert: {
          answer: string
          category?: string | null
          combined_text?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          question: string
        }
        Update: {
          answer?: string
          category?: string | null
          combined_text?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      intent_patterns: {
        Row: {
          confidence_score: number | null
          correct_intent: string | null
          created_at: string | null
          detected_intent: string | null
          human_verified: boolean | null
          id: string
          user_message: string
        }
        Insert: {
          confidence_score?: number | null
          correct_intent?: string | null
          created_at?: string | null
          detected_intent?: string | null
          human_verified?: boolean | null
          id?: string
          user_message: string
        }
        Update: {
          confidence_score?: number | null
          correct_intent?: string | null
          created_at?: string | null
          detected_intent?: string | null
          human_verified?: boolean | null
          id?: string
          user_message?: string
        }
        Relationships: []
      }
      intercom_admins: {
        Row: {
          admin_id: string
          avatar_url: string | null
          away_mode_enabled: boolean | null
          away_mode_reassign: boolean | null
          created_at: string | null
          email: string | null
          has_inbox_seat: boolean | null
          job_title: string | null
          name: string | null
          synced_at: string | null
          team_ids: string[] | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          admin_id: string
          avatar_url?: string | null
          away_mode_enabled?: boolean | null
          away_mode_reassign?: boolean | null
          created_at?: string | null
          email?: string | null
          has_inbox_seat?: boolean | null
          job_title?: string | null
          name?: string | null
          synced_at?: string | null
          team_ids?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_id?: string
          avatar_url?: string | null
          away_mode_enabled?: boolean | null
          away_mode_reassign?: boolean | null
          created_at?: string | null
          email?: string | null
          has_inbox_seat?: boolean | null
          job_title?: string | null
          name?: string | null
          synced_at?: string | null
          team_ids?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      intercom_conversation_tags: {
        Row: {
          applied_at: string | null
          applied_by_id: string | null
          applied_by_type: string | null
          conversation_id: string
          tag_id: string
        }
        Insert: {
          applied_at?: string | null
          applied_by_id?: string | null
          applied_by_type?: string | null
          conversation_id: string
          tag_id: string
        }
        Update: {
          applied_at?: string | null
          applied_by_id?: string | null
          applied_by_type?: string | null
          conversation_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_conversation_tag_conv"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "intercom_conversations"
            referencedColumns: ["conversation_id"]
          },
          {
            foreignKeyName: "fk_conversation_tag_tag"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "intercom_tags"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      intercom_conversations: {
        Row: {
          admin_assignee_id: string | null
          ai_agent: Json | null
          ai_agent_participated: boolean | null
          contacts: string[] | null
          conversation_id: string
          conversation_rating: Json | null
          conversation_type: string | null
          conversion_outcome: string | null
          created_at: string | null
          custom_attributes: Json | null
          decision_factors: Json | null
          first_contact_reply_at: string | null
          first_contact_reply_type: string | null
          lead_quality_score: number | null
          linked_objects: Json | null
          objections_raised: Json | null
          open: boolean | null
          pain_points: Json | null
          primary_topic: string | null
          priority: string | null
          read: boolean | null
          sla_applied: Json | null
          snoozed_until: string | null
          source_attachments: Json | null
          source_author_email: string | null
          source_author_id: string | null
          source_author_name: string | null
          source_author_type: string | null
          source_body: string | null
          source_delivered_as: string | null
          source_id: string | null
          source_subject: string | null
          source_type: string | null
          source_url: string | null
          state: string | null
          statistics: Json | null
          synced_at: string | null
          tags: string[] | null
          team_assignee_id: string | null
          teammates: string[] | null
          ticket_id: string | null
          topics: Json | null
          type: string | null
          updated_at: string | null
          waiting_since: string | null
        }
        Insert: {
          admin_assignee_id?: string | null
          ai_agent?: Json | null
          ai_agent_participated?: boolean | null
          contacts?: string[] | null
          conversation_id: string
          conversation_rating?: Json | null
          conversation_type?: string | null
          conversion_outcome?: string | null
          created_at?: string | null
          custom_attributes?: Json | null
          decision_factors?: Json | null
          first_contact_reply_at?: string | null
          first_contact_reply_type?: string | null
          lead_quality_score?: number | null
          linked_objects?: Json | null
          objections_raised?: Json | null
          open?: boolean | null
          pain_points?: Json | null
          primary_topic?: string | null
          priority?: string | null
          read?: boolean | null
          sla_applied?: Json | null
          snoozed_until?: string | null
          source_attachments?: Json | null
          source_author_email?: string | null
          source_author_id?: string | null
          source_author_name?: string | null
          source_author_type?: string | null
          source_body?: string | null
          source_delivered_as?: string | null
          source_id?: string | null
          source_subject?: string | null
          source_type?: string | null
          source_url?: string | null
          state?: string | null
          statistics?: Json | null
          synced_at?: string | null
          tags?: string[] | null
          team_assignee_id?: string | null
          teammates?: string[] | null
          ticket_id?: string | null
          topics?: Json | null
          type?: string | null
          updated_at?: string | null
          waiting_since?: string | null
        }
        Update: {
          admin_assignee_id?: string | null
          ai_agent?: Json | null
          ai_agent_participated?: boolean | null
          contacts?: string[] | null
          conversation_id?: string
          conversation_rating?: Json | null
          conversation_type?: string | null
          conversion_outcome?: string | null
          created_at?: string | null
          custom_attributes?: Json | null
          decision_factors?: Json | null
          first_contact_reply_at?: string | null
          first_contact_reply_type?: string | null
          lead_quality_score?: number | null
          linked_objects?: Json | null
          objections_raised?: Json | null
          open?: boolean | null
          pain_points?: Json | null
          primary_topic?: string | null
          priority?: string | null
          read?: boolean | null
          sla_applied?: Json | null
          snoozed_until?: string | null
          source_attachments?: Json | null
          source_author_email?: string | null
          source_author_id?: string | null
          source_author_name?: string | null
          source_author_type?: string | null
          source_body?: string | null
          source_delivered_as?: string | null
          source_id?: string | null
          source_subject?: string | null
          source_type?: string | null
          source_url?: string | null
          state?: string | null
          statistics?: Json | null
          synced_at?: string | null
          tags?: string[] | null
          team_assignee_id?: string | null
          teammates?: string[] | null
          ticket_id?: string | null
          topics?: Json | null
          type?: string | null
          updated_at?: string | null
          waiting_since?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admin_assignee"
            columns: ["admin_assignee_id"]
            isOneToOne: false
            referencedRelation: "intercom_admins"
            referencedColumns: ["admin_id"]
          },
          {
            foreignKeyName: "intercom_conversations_admin_assignee_id_fkey"
            columns: ["admin_assignee_id"]
            isOneToOne: false
            referencedRelation: "intercom_admins"
            referencedColumns: ["admin_id"]
          },
        ]
      }
      intercom_messages: {
        Row: {
          assigned_to_id: string | null
          assigned_to_type: string | null
          attachments: Json | null
          author_email: string | null
          author_id: string | null
          author_name: string | null
          author_type: string | null
          body: string | null
          conversation_id: string
          created_at: string | null
          embedding: string | null
          external_id: string | null
          message_id: string
          message_index: number | null
          notified_at: string | null
          part_type: string | null
          redacted: boolean | null
          synced_at: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to_id?: string | null
          assigned_to_type?: string | null
          attachments?: Json | null
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          author_type?: string | null
          body?: string | null
          conversation_id: string
          created_at?: string | null
          embedding?: string | null
          external_id?: string | null
          message_id: string
          message_index?: number | null
          notified_at?: string | null
          part_type?: string | null
          redacted?: boolean | null
          synced_at?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to_id?: string | null
          assigned_to_type?: string | null
          attachments?: Json | null
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          author_type?: string | null
          body?: string | null
          conversation_id?: string
          created_at?: string | null
          embedding?: string | null
          external_id?: string | null
          message_id?: string
          message_index?: number | null
          notified_at?: string | null
          part_type?: string | null
          redacted?: boolean | null
          synced_at?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_conversation"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "intercom_conversations"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
      intercom_sync_logs: {
        Row: {
          admins_synced: number | null
          completed_at: string | null
          conversations_synced: number | null
          created_at: string | null
          errors: Json | null
          last_cursor: string | null
          messages_synced: number | null
          started_at: string | null
          status: string | null
          sync_id: string
          sync_metadata: Json | null
          sync_type: string | null
          tags_synced: number | null
          users_synced: number | null
        }
        Insert: {
          admins_synced?: number | null
          completed_at?: string | null
          conversations_synced?: number | null
          created_at?: string | null
          errors?: Json | null
          last_cursor?: string | null
          messages_synced?: number | null
          started_at?: string | null
          status?: string | null
          sync_id?: string
          sync_metadata?: Json | null
          sync_type?: string | null
          tags_synced?: number | null
          users_synced?: number | null
        }
        Update: {
          admins_synced?: number | null
          completed_at?: string | null
          conversations_synced?: number | null
          created_at?: string | null
          errors?: Json | null
          last_cursor?: string | null
          messages_synced?: number | null
          started_at?: string | null
          status?: string | null
          sync_id?: string
          sync_metadata?: Json | null
          sync_type?: string | null
          tags_synced?: number | null
          users_synced?: number | null
        }
        Relationships: []
      }
      intercom_tags: {
        Row: {
          created_at: string | null
          name: string
          tag_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          name: string
          tag_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          name?: string
          tag_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      intercom_users: {
        Row: {
          avatar_url: string | null
          browser: string | null
          browser_language: string | null
          browser_version: string | null
          companies: Json | null
          created_at: string | null
          custom_attributes: Json | null
          email: string | null
          external_id: string | null
          has_hard_bounced: boolean | null
          last_contacted_at: string | null
          last_email_clicked_at: string | null
          last_email_opened_at: string | null
          last_seen_at: string | null
          location_city: string | null
          location_country: string | null
          location_region: string | null
          marked_email_as_spam: boolean | null
          name: string | null
          os: string | null
          phone: string | null
          pseudonym: string | null
          segments: string[] | null
          signed_up_at: string | null
          social_profiles: Json | null
          synced_at: string | null
          tags: string[] | null
          type: string | null
          unsubscribed_from_emails: boolean | null
          updated_at: string | null
          user_agent_data: Json | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          browser?: string | null
          browser_language?: string | null
          browser_version?: string | null
          companies?: Json | null
          created_at?: string | null
          custom_attributes?: Json | null
          email?: string | null
          external_id?: string | null
          has_hard_bounced?: boolean | null
          last_contacted_at?: string | null
          last_email_clicked_at?: string | null
          last_email_opened_at?: string | null
          last_seen_at?: string | null
          location_city?: string | null
          location_country?: string | null
          location_region?: string | null
          marked_email_as_spam?: boolean | null
          name?: string | null
          os?: string | null
          phone?: string | null
          pseudonym?: string | null
          segments?: string[] | null
          signed_up_at?: string | null
          social_profiles?: Json | null
          synced_at?: string | null
          tags?: string[] | null
          type?: string | null
          unsubscribed_from_emails?: boolean | null
          updated_at?: string | null
          user_agent_data?: Json | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          browser?: string | null
          browser_language?: string | null
          browser_version?: string | null
          companies?: Json | null
          created_at?: string | null
          custom_attributes?: Json | null
          email?: string | null
          external_id?: string | null
          has_hard_bounced?: boolean | null
          last_contacted_at?: string | null
          last_email_clicked_at?: string | null
          last_email_opened_at?: string | null
          last_seen_at?: string | null
          location_city?: string | null
          location_country?: string | null
          location_region?: string | null
          marked_email_as_spam?: boolean | null
          name?: string | null
          os?: string | null
          phone?: string | null
          pseudonym?: string | null
          segments?: string[] | null
          signed_up_at?: string | null
          social_profiles?: Json | null
          synced_at?: string | null
          tags?: string[] | null
          type?: string | null
          unsubscribed_from_emails?: boolean | null
          updated_at?: string | null
          user_agent_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      intercom_webhook_events: {
        Row: {
          data: Json
          error: string | null
          event_id: string
          event_type: string
          processed: boolean | null
          processed_at: string | null
          received_at: string | null
          topic: string
        }
        Insert: {
          data: Json
          error?: string | null
          event_id?: string
          event_type: string
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string | null
          topic: string
        }
        Update: {
          data?: Json
          error?: string | null
          event_id?: string
          event_type?: string
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string | null
          topic?: string
        }
        Relationships: []
      }
      keap_customers: {
        Row: {
          addresses: Json | null
          company_name: string | null
          created_at: string | null
          custom_fields: Json | null
          date_created: string | null
          email: string | null
          first_name: string | null
          id: string
          keap_contact_id: number
          last_name: string | null
          last_updated: string | null
          phone: string | null
          tag_ids: Json | null
          updated_at: string | null
        }
        Insert: {
          addresses?: Json | null
          company_name?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          date_created?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          keap_contact_id: number
          last_name?: string | null
          last_updated?: string | null
          phone?: string | null
          tag_ids?: Json | null
          updated_at?: string | null
        }
        Update: {
          addresses?: Json | null
          company_name?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          date_created?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          keap_contact_id?: number
          last_name?: string | null
          last_updated?: string | null
          phone?: string | null
          tag_ids?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      keap_intercom_sync_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          intercom_contact_id: string | null
          keap_contact_id: string
          sync_direction: string
          sync_status: string
          synced_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          intercom_contact_id?: string | null
          keap_contact_id: string
          sync_direction: string
          sync_status: string
          synced_at: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          intercom_contact_id?: string | null
          keap_contact_id?: string
          sync_direction?: string
          sync_status?: string
          synced_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      keap_orders: {
        Row: {
          contact: Json | null
          created_at: string | null
          creation_date: string | null
          id: string
          keap_order_id: string
          order_date: string | null
          order_items: Json | null
          order_type: string | null
          shipping_information: Json | null
          status: string | null
          title: string | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          contact?: Json | null
          created_at?: string | null
          creation_date?: string | null
          id?: string
          keap_order_id: string
          order_date?: string | null
          order_items?: Json | null
          order_type?: string | null
          shipping_information?: Json | null
          status?: string | null
          title?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          contact?: Json | null
          created_at?: string | null
          creation_date?: string | null
          id?: string
          keap_order_id?: string
          order_date?: string | null
          order_items?: Json | null
          order_type?: string | null
          shipping_information?: Json | null
          status?: string | null
          title?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      keap_products: {
        Row: {
          created_at: string | null
          id: string
          keap_product_id: string
          product_desc: string | null
          product_name: string
          product_options: Json | null
          product_price: number | null
          product_short_desc: string | null
          sku: string | null
          status: number | null
          subscription_only: boolean | null
          subscription_plans: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          keap_product_id: string
          product_desc?: string | null
          product_name: string
          product_options?: Json | null
          product_price?: number | null
          product_short_desc?: string | null
          sku?: string | null
          status?: number | null
          subscription_only?: boolean | null
          subscription_plans?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          keap_product_id?: string
          product_desc?: string | null
          product_name?: string
          product_options?: Json | null
          product_price?: number | null
          product_short_desc?: string | null
          sku?: string | null
          status?: number | null
          subscription_only?: boolean | null
          subscription_plans?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      keap_subscriptions: {
        Row: {
          auto_charge: boolean | null
          billing_amount: number | null
          billing_cycle: string | null
          contact_id: string | null
          created_at: string | null
          credit_card_id: string | null
          end_date: string | null
          frequency: number | null
          id: string
          keap_subscription_id: string
          next_bill_date: string | null
          payment_gateway: string | null
          product_id: string | null
          program_id: string | null
          start_date: string | null
          status: string | null
          subscription_plan_id: string | null
          updated_at: string | null
        }
        Insert: {
          auto_charge?: boolean | null
          billing_amount?: number | null
          billing_cycle?: string | null
          contact_id?: string | null
          created_at?: string | null
          credit_card_id?: string | null
          end_date?: string | null
          frequency?: number | null
          id?: string
          keap_subscription_id: string
          next_bill_date?: string | null
          payment_gateway?: string | null
          product_id?: string | null
          program_id?: string | null
          start_date?: string | null
          status?: string | null
          subscription_plan_id?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_charge?: boolean | null
          billing_amount?: number | null
          billing_cycle?: string | null
          contact_id?: string | null
          created_at?: string | null
          credit_card_id?: string | null
          end_date?: string | null
          frequency?: number | null
          id?: string
          keap_subscription_id?: string
          next_bill_date?: string | null
          payment_gateway?: string | null
          product_id?: string | null
          program_id?: string | null
          start_date?: string | null
          status?: string | null
          subscription_plan_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      keap_tokens: {
        Row: {
          access_token: string
          expires_at: string
          id: number
          refresh_token: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          expires_at: string
          id: number
          refresh_token: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          expires_at?: string
          id?: number
          refresh_token?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      keep_tags: {
        Row: {
          category: string | null
          created_at: string
          id: number
          name: string | null
          notes: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id: number
          name?: string | null
          notes?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: number
          name?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      meal_plans: {
        Row: {
          bars: number | null
          calories: number | null
          carbs: number | null
          created_at: string | null
          display_order: number | null
          fat: number | null
          id: number
          meal_1: number | null
          meal_2: number | null
          meal_3: number | null
          meal_4: number | null
          meal_5: number | null
          name: string
          pancakes: number | null
          price: number | null
          protein: number | null
          sale_price: number | null
          sku: string
          tags: string | null
          total_entrees: number | null
          total_items: number | null
          updated_at: string | null
        }
        Insert: {
          bars?: number | null
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          display_order?: number | null
          fat?: number | null
          id?: never
          meal_1?: number | null
          meal_2?: number | null
          meal_3?: number | null
          meal_4?: number | null
          meal_5?: number | null
          name: string
          pancakes?: number | null
          price?: number | null
          protein?: number | null
          sale_price?: number | null
          sku: string
          tags?: string | null
          total_entrees?: number | null
          total_items?: number | null
          updated_at?: string | null
        }
        Update: {
          bars?: number | null
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          display_order?: number | null
          fat?: number | null
          id?: never
          meal_1?: number | null
          meal_2?: number | null
          meal_3?: number | null
          meal_4?: number | null
          meal_5?: number | null
          name?: string
          pancakes?: number | null
          price?: number | null
          protein?: number | null
          sale_price?: number | null
          sku?: string
          tags?: string | null
          total_entrees?: number | null
          total_items?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          computed_session_user_id: string | null
          created_at: string | null
          id: number
          message: Json
          message_data: string | null
          session_id: string
        }
        Insert: {
          computed_session_user_id?: string | null
          created_at?: string | null
          id?: never
          message: Json
          message_data?: string | null
          session_id: string
        }
        Update: {
          computed_session_user_id?: string | null
          created_at?: string | null
          id?: never
          message?: Json
          message_data?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["session_id"]
          },
        ]
      }
      notes: {
        Row: {
          id: number
          title: string | null
        }
        Insert: {
          id?: number
          title?: string | null
        }
        Update: {
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      objections: {
        Row: {
          conversion_impact: number | null
          created_at: string | null
          id: string
          objection_category: string | null
          objection_text: string | null
          success_rate: number | null
          successful_response: string | null
          usage_count: number | null
        }
        Insert: {
          conversion_impact?: number | null
          created_at?: string | null
          id?: string
          objection_category?: string | null
          objection_text?: string | null
          success_rate?: number | null
          successful_response?: string | null
          usage_count?: number | null
        }
        Update: {
          conversion_impact?: number | null
          created_at?: string | null
          id?: string
          objection_category?: string | null
          objection_text?: string | null
          success_rate?: number | null
          successful_response?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          city: string | null
          contact: string | null
          contact_id: number | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          invoice_id: number | null
          last_name: string | null
          order_date: string | null
          order_id: number
          order_title: string | null
          order_total: number | null
          order_type: string | null
          phone_1: string | null
          postal_code: string | null
          product_ids: string | null
          product_name: string | null
          state: string | null
          street_address1: string | null
          street_address2: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          contact?: string | null
          contact_id?: number | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          invoice_id?: number | null
          last_name?: string | null
          order_date?: string | null
          order_id?: number
          order_title?: string | null
          order_total?: number | null
          order_type?: string | null
          phone_1?: string | null
          postal_code?: string | null
          product_ids?: string | null
          product_name?: string | null
          state?: string | null
          street_address1?: string | null
          street_address2?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          contact?: string | null
          contact_id?: number | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          invoice_id?: number | null
          last_name?: string | null
          order_date?: string | null
          order_id?: number
          order_title?: string | null
          order_total?: number | null
          order_type?: string | null
          phone_1?: string | null
          postal_code?: string | null
          product_ids?: string | null
          product_name?: string | null
          state?: string | null
          street_address1?: string | null
          street_address2?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orders_complete: {
        Row: {
          city: string | null
          contact: string | null
          contact_id: string
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: number
          invoice_id: string | null
          last_name: string | null
          order_date: string | null
          order_id: string
          order_title: string | null
          order_total: number | null
          order_type: string | null
          phone_1: string | null
          postal_code: string | null
          product_ids: string | null
          product_name: string | null
          state: string | null
          street_address1: string | null
          street_address2: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          contact?: string | null
          contact_id: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          invoice_id?: string | null
          last_name?: string | null
          order_date?: string | null
          order_id: string
          order_title?: string | null
          order_total?: number | null
          order_type?: string | null
          phone_1?: string | null
          postal_code?: string | null
          product_ids?: string | null
          product_name?: string | null
          state?: string | null
          street_address1?: string | null
          street_address2?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          contact?: string | null
          contact_id?: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          invoice_id?: string | null
          last_name?: string | null
          order_date?: string | null
          order_id?: string
          order_title?: string | null
          order_total?: number | null
          order_type?: string | null
          phone_1?: string | null
          postal_code?: string | null
          product_ids?: string | null
          product_name?: string | null
          state?: string | null
          street_address1?: string | null
          street_address2?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      parts: {
        Row: {
          createdAt: string
          data_weather_id: string | null
          data_weather_location: string | null
          data_weather_temperature: number | null
          data_weather_weather: string | null
          file_filename: string | null
          file_mediaType: string | null
          file_url: string | null
          id: string
          messageId: string
          order: number
          providerMetadata: Json | null
          reasoning_text: string | null
          source_document_filename: string | null
          source_document_mediaType: string | null
          source_document_sourceId: string | null
          source_document_title: string | null
          source_url_sourceId: string | null
          source_url_title: string | null
          source_url_url: string | null
          text_text: string | null
          tool_errorText: string | null
          tool_getLocation_input: Json | null
          tool_getLocation_output: Json | null
          tool_getWeatherInformation_input: Json | null
          tool_getWeatherInformation_output: Json | null
          tool_state: string | null
          tool_toolCallId: string | null
          type: string
        }
        Insert: {
          createdAt?: string
          data_weather_id?: string | null
          data_weather_location?: string | null
          data_weather_temperature?: number | null
          data_weather_weather?: string | null
          file_filename?: string | null
          file_mediaType?: string | null
          file_url?: string | null
          id: string
          messageId: string
          order?: number
          providerMetadata?: Json | null
          reasoning_text?: string | null
          source_document_filename?: string | null
          source_document_mediaType?: string | null
          source_document_sourceId?: string | null
          source_document_title?: string | null
          source_url_sourceId?: string | null
          source_url_title?: string | null
          source_url_url?: string | null
          text_text?: string | null
          tool_errorText?: string | null
          tool_getLocation_input?: Json | null
          tool_getLocation_output?: Json | null
          tool_getWeatherInformation_input?: Json | null
          tool_getWeatherInformation_output?: Json | null
          tool_state?: string | null
          tool_toolCallId?: string | null
          type: string
        }
        Update: {
          createdAt?: string
          data_weather_id?: string | null
          data_weather_location?: string | null
          data_weather_temperature?: number | null
          data_weather_weather?: string | null
          file_filename?: string | null
          file_mediaType?: string | null
          file_url?: string | null
          id?: string
          messageId?: string
          order?: number
          providerMetadata?: Json | null
          reasoning_text?: string | null
          source_document_filename?: string | null
          source_document_mediaType?: string | null
          source_document_sourceId?: string | null
          source_document_title?: string | null
          source_url_sourceId?: string | null
          source_url_title?: string | null
          source_url_url?: string | null
          text_text?: string | null
          tool_errorText?: string | null
          tool_getLocation_input?: Json | null
          tool_getLocation_output?: Json | null
          tool_getWeatherInformation_input?: Json | null
          tool_getWeatherInformation_output?: Json | null
          tool_state?: string | null
          tool_toolCallId?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "parts_messageId_chat_messages_id_fk"
            columns: ["messageId"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_documents: {
        Row: {
          category: string | null
          content: string
          content_type: string
          created_at: string | null
          embedding: string | null
          id: string
          last_updated: string | null
          metadata: Json | null
          priority: number | null
          title: string | null
        }
        Insert: {
          category?: string | null
          content: string
          content_type: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          last_updated?: string | null
          metadata?: Json | null
          priority?: number | null
          title?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          content_type?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          last_updated?: string | null
          metadata?: Json | null
          priority?: number | null
          title?: string | null
        }
        Relationships: []
      }
      rag_pipeline_state: {
        Row: {
          created_at: string | null
          known_files: Json | null
          last_check_time: string | null
          last_run: string | null
          pipeline_id: string
          pipeline_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          known_files?: Json | null
          last_check_time?: string | null
          last_run?: string | null
          pipeline_id: string
          pipeline_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          known_files?: Json | null
          last_check_time?: string | null
          last_run?: string | null
          pipeline_id?: string
          pipeline_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      request_offs: {
        Row: {
          contact_id: number | null
          created_at: string
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          meal_plan: string | null
          request_off_date: string | null
          source: string | null
        }
        Insert: {
          contact_id?: number | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          meal_plan?: string | null
          request_off_date?: string | null
          source?: string | null
        }
        Update: {
          contact_id?: number | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          meal_plan?: string | null
          request_off_date?: string | null
          source?: string | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          id: string
          timestamp: string | null
          user_id: string
          user_query: string
        }
        Insert: {
          id: string
          timestamp?: string | null
          user_id: string
          user_query: string
        }
        Update: {
          id?: string
          timestamp?: string | null
          user_id?: string
          user_query?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      response_effectiveness: {
        Row: {
          context_type: string | null
          conversion_rate: number | null
          created_at: string | null
          engagement_rate: number | null
          feedback_score: number | null
          id: string
          response_template: string | null
        }
        Insert: {
          context_type?: string | null
          conversion_rate?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          feedback_score?: number | null
          id?: string
          response_template?: string | null
        }
        Update: {
          context_type?: string | null
          conversion_rate?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          feedback_score?: number | null
          id?: string
          response_template?: string | null
        }
        Relationships: []
      }
      sources: {
        Row: {
          created_at: string
          source_id: string
          summary: string | null
          total_word_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          source_id: string
          summary?: string | null
          total_word_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          source_id?: string
          summary?: string | null
          total_word_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      subscription_actions: {
        Row: {
          action: string
          contact_id: number
          details: string | null
          email: string
          id: number
          new_bill_date: string | null
          performed_at: string
        }
        Insert: {
          action: string
          contact_id: number
          details?: string | null
          email: string
          id?: never
          new_bill_date?: string | null
          performed_at?: string
        }
        Update: {
          action?: string
          contact_id?: number
          details?: string | null
          email?: string
          id?: never
          new_bill_date?: string | null
          performed_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_amount: number | null
          billing_cycle: string | null
          contact_email: string | null
          contact_id: string
          contact_name: string | null
          created_at: string | null
          end_date: string | null
          id: number
          keap_subscription_id: string
          last_payment_date: string | null
          last_synced: string | null
          next_bill_date: string | null
          payment_method: string | null
          product_id: string | null
          product_name: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          billing_amount?: number | null
          billing_cycle?: string | null
          contact_email?: string | null
          contact_id: string
          contact_name?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: number
          keap_subscription_id: string
          last_payment_date?: string | null
          last_synced?: string | null
          next_bill_date?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_name?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_amount?: number | null
          billing_cycle?: string | null
          contact_email?: string | null
          contact_id?: string
          contact_name?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: number
          keap_subscription_id?: string
          last_payment_date?: string | null
          last_synced?: string | null
          next_bill_date?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_name?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          created_at: string
          description: string | null
          document_created_at: string
          document_id: string
          id: string
          is_resolved: boolean
          original_text: string
          suggested_text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_created_at: string
          document_id: string
          id?: string
          is_resolved?: boolean
          original_text: string
          suggested_text: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_created_at?: string
          document_id?: string
          id?: string
          is_resolved?: boolean
          original_text?: string
          suggested_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          company_id: string | null
          completed_at: string | null
          errors: Json | null
          id: string
          records_processed: number | null
          started_at: string | null
          status: string
          sync_type: string
        }
        Insert: {
          company_id?: string | null
          completed_at?: string | null
          errors?: Json | null
          id?: string
          records_processed?: number | null
          started_at?: string | null
          status: string
          sync_type: string
        }
        Update: {
          company_id?: string | null
          completed_at?: string | null
          errors?: Json | null
          id?: string
          records_processed?: number | null
          started_at?: string | null
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          age: number | null
          client_name: string | null
          created_at: string | null
          embedding: string | null
          full_story: string | null
          goals_achieved: Json | null
          id: string
          image_url: string | null
          location: string | null
          objections_overcome: Json | null
          occupation: string | null
          quote: string | null
          results: string | null
          starting_point: string | null
          timeframe: string | null
          verified: boolean | null
          video_url: string | null
        }
        Insert: {
          age?: number | null
          client_name?: string | null
          created_at?: string | null
          embedding?: string | null
          full_story?: string | null
          goals_achieved?: Json | null
          id?: string
          image_url?: string | null
          location?: string | null
          objections_overcome?: Json | null
          occupation?: string | null
          quote?: string | null
          results?: string | null
          starting_point?: string | null
          timeframe?: string | null
          verified?: boolean | null
          video_url?: string | null
        }
        Update: {
          age?: number | null
          client_name?: string | null
          created_at?: string | null
          embedding?: string | null
          full_story?: string | null
          goals_achieved?: Json | null
          id?: string
          image_url?: string | null
          location?: string | null
          objections_overcome?: Json | null
          occupation?: string | null
          quote?: string | null
          results?: string | null
          starting_point?: string | null
          timeframe?: string | null
          verified?: boolean | null
          video_url?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          age: number | null
          created_at: string
          eating_habits: string | null
          email: string
          emotional_why: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_admin: boolean | null
          last_seen: string | null
          objection: string | null
          primary_goal: string | null
          recommended_plan: string | null
          returning_user: boolean | null
          support_level: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          eating_habits?: string | null
          email: string
          emotional_why?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          is_admin?: boolean | null
          last_seen?: string | null
          objection?: string | null
          primary_goal?: string | null
          recommended_plan?: string | null
          returning_user?: boolean | null
          support_level?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          created_at?: string
          eating_habits?: string | null
          email?: string
          emotional_why?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_admin?: boolean | null
          last_seen?: string | null
          objection?: string | null
          primary_goal?: string | null
          recommended_plan?: string | null
          returning_user?: boolean | null
          support_level?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          chat_id: string
          is_upvoted: boolean
          message_id: string
        }
        Insert: {
          chat_id: string
          is_upvoted: boolean
          message_id: string
        }
        Update: {
          chat_id?: string
          is_upvoted?: boolean
          message_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_custom_sql: { Args: { sql_query: string }; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      match_brand_copy: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          category: string
          content: string
          content_type: string
          id: string
          metadata: Json
          similarity: number
          title: string
        }[]
      }
      match_code_examples: {
        Args: {
          filter?: Json
          match_count?: number
          query_embedding: string
          source_filter?: string
        }
        Returns: {
          chunk_number: number
          content: string
          id: number
          metadata: Json
          similarity: number
          source_id: string
          summary: string
          url: string
        }[]
      }
      match_crawled_pages: {
        Args: {
          filter?: Json
          match_count?: number
          query_embedding: string
          source_filter?: string
        }
        Returns: {
          chunk_number: number
          content: string
          id: number
          metadata: Json
          similarity: number
          source_id: string
          url: string
        }[]
      }
      match_documents:
        | {
            Args: {
              filter?: string
              match_count?: number
              query_embedding: string
            }
            Returns: {
              category: string
              content: string
              content_type: string
              id: string
              metadata: Json
              similarity: number
              title: string
            }[]
          }
        | {
            Args: {
              filter?: Json
              match_count?: number
              query_embedding: string
            }
            Returns: {
              content: string
              id: number
              metadata: Json
              similarity: number
            }[]
          }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
