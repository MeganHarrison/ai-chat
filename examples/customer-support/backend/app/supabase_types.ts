/**
 * Supabase database types for Nutrition Solutions AI Sales Coach.
 * Generated from backend/app/supabase_schema.sql (user_profiles, session_history, rag_documents).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PrimaryGoal = "fat_loss" | "muscle_gain" | "recomp";
export type Gender = "male" | "female" | "nonbinary" | "prefer_not";
export type RagCategory = "faq" | "meal_plans" | "testimonials" | "brand_voice";

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          name: string | null;
          age: number | null;
          gender: Gender | null;
          primary_goal: PrimaryGoal | null;
          cooking_preference: boolean | null;
          eating_habits: string | null;
          emotional_why: string | null;
          support_level: number | null;
          objection: string | null;
          recommended_plan: string | null;
          returning_user: boolean;
          last_seen: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          age?: number | null;
          gender?: Gender | null;
          primary_goal?: PrimaryGoal | null;
          cooking_preference?: boolean | null;
          eating_habits?: string | null;
          emotional_why?: string | null;
          support_level?: number | null;
          objection?: string | null;
          recommended_plan?: string | null;
          returning_user?: boolean;
          last_seen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          age?: number | null;
          gender?: Gender | null;
          primary_goal?: PrimaryGoal | null;
          cooking_preference?: boolean | null;
          eating_habits?: string | null;
          emotional_why?: string | null;
          support_level?: number | null;
          objection?: string | null;
          recommended_plan?: string | null;
          returning_user?: boolean;
          last_seen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      session_history: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          messages: Json[];
          started_at: string;
          last_message_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          messages?: Json[];
          started_at?: string;
          last_message_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          messages?: Json[];
          started_at?: string;
          last_message_at?: string | null;
        };
      };
      rag_documents: {
        Row: {
          id: string;
          content: string;
          content_type: string;
          title: string | null;
          metadata: Json | null;
          embedding: number[] | null;
          category: string | null;
          priority: number | null;
          last_updated: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          content_type: string;
          title?: string | null;
          metadata?: Json | null;
          embedding?: number[] | null;
          category?: string | null;
          priority?: number | null;
          last_updated?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          content_type?: string;
          title?: string | null;
          metadata?: Json | null;
          embedding?: number[] | null;
          category?: string | null;
          priority?: number | null;
          last_updated?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_rag_documents: {
        Args: {
          query_text: string;
          category?: string;
          filters?: Json;
          match_count?: number;
          min_score?: number;
        };
        Returns: Array<{
          id: string;
          content: string;
          category: string | null;
          title: string | null;
          metadata: Json | null;
          score: number;
        }>;
      };
    };
    Enums: Record<string, never>;
  };
}
