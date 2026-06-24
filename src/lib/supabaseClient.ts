import {createClient} from '@supabase/supabase-js';

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || 'https://mrwuorymjtppccjahgto.supabase.co',
    import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_F9w9926GNm-nBEVbhbifXA_Xl9_aa4H'
);
