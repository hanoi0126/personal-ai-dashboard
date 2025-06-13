import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { APIError } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      const apiError: APIError = {
        error: {
          code: "AUTH001",
          message: error.message,
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(apiError, { status: 400 });
    }

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    const apiError: APIError = {
      error: {
        code: "AUTH001",
        message: "Internal server error",
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
