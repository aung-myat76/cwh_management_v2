import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://llcbrnpthatrqpltnqwt.supabase.co";
const supabaseAnonKey = "sb_publishable__rdCpUrZUPQLm6CJ1femZQ_g-4Sx0KC";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
