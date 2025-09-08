import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function POST(req: Request) {
  const { refresh_token } = await req.json();

  const { data, error } = await supabase.auth.setSession({
    refresh_token,
    access_token: "",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
