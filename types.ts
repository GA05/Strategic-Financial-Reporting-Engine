
export type DataRow = Record<string, any>;

export interface Kpi {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      financial_data: {
        Row: {
          id: number;
          created_at: string;
          month: string;
          revenue: number | null;
          new_users: number | null;
          conversion_rate: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          month: string;
          revenue?: number | null;
          new_users?: number | null;
          conversion_rate?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          month?: string;
          revenue?: number | null;
          new_users?: number | null;
          conversion_rate?: number | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type FinancialDataRow = Database['public']['Tables']['financial_data']['Row'];
export type FinancialDataInsert = Database['public']['Tables']['financial_data']['Insert'];
