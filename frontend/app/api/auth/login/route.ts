import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { APIError } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      const error: APIError = {
        error: {
          code: "AUTH001",
          message: "Email and password are required",
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(error, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const apiError: APIError = {
        error: {
          code: "AUTH001",
          message: error.message,
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(apiError, { status: 401 });
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
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
