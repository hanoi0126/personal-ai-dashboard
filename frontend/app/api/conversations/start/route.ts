import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { APIError } from "@/types";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
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

    // Check daily conversation limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error: countError } = await supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("started_at", today.toISOString());

    if (countError) {
      throw new Error("Failed to check conversation limit");
    }

    if (count && count >= 1) {
      const apiError: APIError = {
        error: {
          code: "CONV001",
          message: "Daily limit reached",
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(apiError, { status: 429 });
    }

    // Create new conversation
    const conversationId = `conv_${crypto.randomBytes(12).toString("hex")}`;
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const { error: insertError } = await supabase.from("conversations").insert({
      id: conversationId,
      user_id: user.id,
      started_at: new Date().toISOString(),
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      throw new Error("Failed to create conversation");
    }

    return NextResponse.json({
      conversation_id: conversationId,
      websocket_url: `${process.env.NEXT_PUBLIC_WS_URL}/realtime/connect`,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    });
  } catch (error) {
    const apiError: APIError = {
      error: {
        code: "CONV002",
        message: "Failed to start conversation",
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
