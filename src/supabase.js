
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// export const isSupabaseConfigured = Boolean(
//   supabaseUrl && supabaseKey
// );

// export const supabase = isSupabaseConfigured
//   ? createClient(supabaseUrl, supabaseKey)
//   : null;

// if (isSupabaseConfigured) {
//   console.log("Supabase client initialized successfully!");
// } else {
//   console.warn("Supabase credentials are missing.");
// }



import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

console.log("Supabase URL:", supabaseUrl);
console.log("Publishable key detected:", !!supabaseKey);
console.log("Key prefix:", supabaseKey?.slice(0, 15));

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;
