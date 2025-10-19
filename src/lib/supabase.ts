import { supabase } from "@/integrations/supabase/client";

export const emotionalStates = [
  {
    id: 'restless' as const,
    label: 'Stuck & Restless',
    icon: '⚡',
    defaultActions: ['pacing', 'stretching', 'shaking out energy']
  },
  {
    id: 'still' as const,
    label: 'Stuck & Still',
    icon: '🧊',
    defaultActions: ['deep breathing', 'holding a pillow', 'warm tea']
  },
  {
    id: 'scattered' as const,
    label: 'Stuck & Scattered',
    icon: '🌀',
    defaultActions: ['grounding 5-4-3-2-1', 'focusing on one object']
  },
  {
    id: 'looping' as const,
    label: 'Stuck & Looping',
    icon: '🔁',
    defaultActions: ['journaling', 'saying thoughts out loud']
  },
  {
    id: 'disconnected' as const,
    label: 'Stuck & Disconnected',
    icon: '🌫',
    defaultActions: ['music', 'gentle self-touch', 'movement']
  }
];

export const defaultCheckinPhrases = [
  "How's your heart feeling right now?",
  "Need a tiny pause to breathe?",
  "Do you feel a bit stuck?",
  "What's sitting heavy with you today?",
  "How are you really doing?"
];

export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserSettings(userId: string, settings: any) {
  const { data, error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getCheckinPhrases(userId: string) {
  const { data, error } = await supabase
    .from('checkin_phrases')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);
  
  if (error) throw error;
  return data || [];
}

export async function getSoothingActions(userId: string, state?: 'restless' | 'still' | 'scattered' | 'looping' | 'disconnected') {
  let query = supabase
    .from('soothing_actions')
    .select('*')
    .eq('user_id', userId);
  
  if (state) {
    query = query.eq('state', state);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function logCheckin(userId: string, logData: any) {
  const { data, error } = await supabase
    .from('checkin_logs')
    .insert({
      user_id: userId,
      ...logData
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
