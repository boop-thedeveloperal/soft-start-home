import { supabase } from "@/integrations/supabase/client";

export const emotionalStates = [
  {
    id: 'restless' as const,
    label: 'Stuck & Restless',
    icon: '🌀',
    description: "You're overloaded with energy and nowhere to put it. Your thoughts are sprinting - fingers tapping, feet bouncing, switching tabs, standing up and sitting back down. Your body's ready for motion, but there's no clear outlet. This is sympathetic overdrive - your system saying, 'Move me.'",
    defaultActions: [
      'Cardio release (2-5 min): Do jumping jacks, jog in place, or run a short burst down the hall. Burn off adrenaline before you try to think.',
      'Proprioceptive reset: Push your palms firmly into a wall or squeeze your fists and release 5 times.',
      "Transition breath: Finish with a long exhale - twice as long as your inhale - to tell your body it's safe again."
    ]
  },
  {
    id: 'still' as const,
    label: 'Stuck & Still',
    icon: '🪨',
    description: "You're frozen in place - not resisting, just unable to initiate. You've been sitting or lying there, thinking about getting up, but your body's ignoring commands. This is mild shutdown: your system's too low on activation to move.",
    defaultActions: [
      'Tactile grounding: Put on socks and press your feet into something soft or textured. Feel the warmth, the weight, the pressure.',
      'Sequential motion cue: Lift your right leg, then your left, then your right again. The pattern matters - it restarts motor coordination.',
      'Warm sensory input: Drink something hot and feel it move through your chest - momentum beginning from the inside out.'
    ]
  },
  {
    id: 'scattered' as const,
    label: 'Stuck & Scattered',
    icon: '🌪️',
    description: "You've started ten things and finished none. Your desk's a mosaic of half-tasks - open tabs, coffee cup, notes everywhere. Your focus is fractured, your dopamine chasing novelty. You're not lazy; your working memory is just full.",
    defaultActions: [
      "Cognitive unload: Write every unfinished task somewhere - don't organize, just externalize. ADHD research shows 'brain dumps' restore executive bandwidth.",
      '5-4-3-2-1 grounding: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
      "Single-object anchor: Pick one thing from your list and one thing in your sight - 'I'll start here.' Let movement reassemble your focus."
    ]
  },
  {
    id: 'looping' as const,
    label: 'Stuck & Looping',
    icon: '🔁',
    description: "Your brain is caught replaying - that mistake, that message, that imagined scenario. The loop tightens each time you revisit it. You know you're spiraling, but you can't redirect. This is a hyperfocus trap mixed with emotional replay - your reward system locked on unresolved stress.",
    defaultActions: [
      'Verbal release: Speak your thoughts out loud or record a quick voice note - externalizing them reduces cognitive load.',
      "Expressive writing: Write nonstop for 3 minutes. End with: 'This thought is out of my head and onto the page.'",
      'Soothing touch: Rub slow circles over your chest and heart while exhaling fully. Self-touch here lowers cortisol and signals safety.'
    ]
  },
  {
    id: 'disconnected' as const,
    label: 'Stuck & Disconnected',
    icon: '🫧',
    description: "You're dimmed - scrolling, staring, zoned out. Time blurs, sound dulls. It's the ADHD shutdown: the nervous system pulling back after too much input. You're not broken; you're buffering.",
    defaultActions: [
      'Rhythmic sensory input: Put on music with a steady beat and sway or tap along - vestibular input reawakens body awareness.',
      'Tactile grounding: Rub your arms, trace your fingers over fabric, feel texture come back to life.',
      "Orienting practice: Look around and softly name what's real - 'That's my desk. That's my plant. It's green. It's raining.' This pulls you back into the now."
    ]
  }
];

export const defaultCheckinPhrases = [
  "What is the rhythm of your thoughts today?",
  "What does it feel like to be right here, right now?",
  "What are you thinking about yourself?",
  "What is your heart holding onto today?",
  "What thought/feeling is loudest in you?",
  "If your inner mind was trying to talk, what would it be saying?"
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
