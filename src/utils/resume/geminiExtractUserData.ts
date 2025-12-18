import { supabase } from "@/integrations/supabase/client";
import type { UserData } from "@/types/userData";

export async function geminiExtractUserData(text: string): Promise<Partial<UserData>> {
  const { data, error } = await supabase.functions.invoke("extract-resume", {
    body: { text },
  });

  if (error) throw error;
  if (!data) throw new Error("No data returned from extractor.");

  // Edge function returns { data: <json> }
  return (data as any).data as Partial<UserData>;
}

