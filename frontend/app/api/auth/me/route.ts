import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { APIError } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      const apiError: APIError = {
        error: {
          code: "AUTH001",
          message: "Unauthorized access",
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(apiError, { status: 401 });
    }

    // Calculate trial days remaining (14 days from creation)
    const createdAt = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const trialDaysRemaining = Math.max(14 - diffDays, 0);

    return NextResponse.json({
      id: user.id,
      email: user.email!,
      created_at: user.created_at,
      subscription_status: trialDaysRemaining > 0 ? "trial" : "expired",
      trial_days_remaining: trialDaysRemaining,
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
