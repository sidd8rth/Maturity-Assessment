import { supabase } from './supabase';
import type { IndustryId, Environment, OrgSize, Tier, DomainScore } from '../types';
import type { StackKey } from '../data/stacks';

export interface AssessmentRow {
  id: string;
  user_id: string;
  industry: IndustryId;
  environment: Environment;
  org_size: OrgSize;
  answers: (number | null)[];
  score: number;
  tier: Tier;
  payload: AssessmentPayload;
  created_at: string;
}

export interface AssessmentPayload {
  domainScores: DomainScore[];
  picks: StackKey[];
  archTier: 'starter' | 'standard' | 'advanced';
}

export interface AssessmentInput {
  industry: IndustryId;
  environment: Environment;
  org_size: OrgSize;
  answers: (number | null)[];
  score: number;
  tier: Tier;
  payload: AssessmentPayload;
}

/** Save a completed assessment for the currently-authenticated user. */
export async function saveAssessment(input: AssessmentInput): Promise<{ id: string | null; error: string | null }> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { id: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('assessments')
    .insert({ ...input, user_id: userId })
    .select('id')
    .single();

  if (error) return { id: null, error: error.message };
  return { id: data.id, error: null };
}

/** List assessments for the current user, newest first. */
export async function listMyAssessments(): Promise<{ rows: AssessmentRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as AssessmentRow[], error: null };
}

/** Fetch a single assessment by id (RLS guarantees it belongs to caller). */
export async function getAssessment(id: string): Promise<{ row: AssessmentRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { row: null, error: error.message };
  return { row: data as AssessmentRow, error: null };
}

/** Delete an assessment by id. */
export async function deleteAssessment(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('assessments').delete().eq('id', id);
  return { error: error ? error.message : null };
}
