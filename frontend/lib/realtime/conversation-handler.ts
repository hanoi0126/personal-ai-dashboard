import { Message } from "@/types";
import WebSocket from "ws";

const COACHING_PROMPT = `
You are a warm, empathetic coach helping users reflect on their day.
- Listen actively and ask thoughtful follow-up questions
- Help users discover their values and patterns
- Keep the conversation natural and supportive
- End gracefully at the 5-minute mark
- Focus on emotions, motivations, and personal growth
- Speak in Japanese (日本語) if the user speaks in Japanese
`;

export class RealtimeConversationHandler {
  private openaiWS: WebSocket | null = null;
  private clientWS: WebSocket;
  private conversationId: string;
  private userId: string;
  private startTime: Date;
  private transcript: Message[] = [];
  private endTimer: NodeJS.Timeout | null = null;

  constructor(clientWS: WebSocket, conversationId: string, userId: string) {
    this.clientWS = clientWS;
    this.conversationId = conversationId;
    this.userId = userId;
    this.startTime = new Date();
  }

  async initialize() {
    try {
      // 1. Create OpenAI Realtime connection
      this.openaiWS = new WebSocket(
        "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "realtime=v1",
          },
        },
      );

      // 2. Configure AI session when connected
      this.openaiWS.on("open", () => {
        console.log("Connected to OpenAI Realtime API");
        this.openaiWS!.send(
          JSON.stringify({
            type: "session.update",
            session: {
              modalities: ["text", "audio"],
              instructions: COACHING_PROMPT,
              voice: "alloy",
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1",
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 500,
              },
            },
          }),
        );

        // Send initial greeting
        this.openaiWS!.send(
          JSON.stringify({
            type: "response.create",
            response: {
              modalities: ["text", "audio"],
              instructions:
                "Greet the user warmly and ask them how their day was.",
            },
          }),
        );
      });

      // 3. Handle messages from OpenAI
      this.openaiWS.on("message", (data: WebSocket.Data) => {
        const message = JSON.parse(data.toString());
        this.handleOpenAIMessage(message);
      });

      // 4. Handle errors
      this.openaiWS.on("error", (error) => {
        console.error("OpenAI WebSocket error:", error);
        this.sendToClient({
          type: "error",
          data: { message: "Connection error occurred" },
          timestamp: new Date().toISOString(),
        });
      });

      // 5. Set 5-minute timer
      this.endTimer = setTimeout(
        () => {
          this.endConversation();
        },
        5 * 60 * 1000,
      );
    } catch (error) {
      console.error("Failed to initialize conversation:", error);
      throw error;
    }
  }

  handleClientAudio(audioData: string) {
    if (!this.openaiWS || this.openaiWS.readyState !== WebSocket.OPEN) {
      return;
    }

    // Forward audio to OpenAI
    this.openaiWS.send(
      JSON.stringify({
        type: "input_audio_buffer.append",
        audio: audioData,
      }),
    );
  }

  private handleOpenAIMessage(message: any) {
    switch (message.type) {
      case "conversation.item.input_audio_transcription.completed":
        // User's speech transcribed
        this.transcript.push({
          speaker: "user",
          text: message.transcript,
          timestamp: new Date(),
        });
        this.sendToClient({
          type: "transcript",
          data: {
            speaker: "user",
            text: message.transcript,
          },
          timestamp: new Date().toISOString(),
        });
        break;

      case "response.audio_transcript.done":
        // AI's response transcribed
        this.transcript.push({
          speaker: "ai",
          text: message.transcript,
          timestamp: new Date(),
        });
        this.sendToClient({
          type: "transcript",
          data: {
            speaker: "ai",
            text: message.transcript,
          },
          timestamp: new Date().toISOString(),
        });
        break;

      case "response.audio.delta":
        // AI's audio response chunk
        if (message.delta) {
          this.sendToClient({
            type: "ai_response",
            data: {
              audio: message.delta,
              format: "pcm16",
            },
            timestamp: new Date().toISOString(),
          });
        }
        break;

      case "error":
        console.error("OpenAI error:", message.error);
        this.sendToClient({
          type: "error",
          data: { message: message.error.message },
          timestamp: new Date().toISOString(),
        });
        break;
    }
  }

  private sendToClient(message: any) {
    if (this.clientWS.readyState === WebSocket.OPEN) {
      this.clientWS.send(JSON.stringify(message));
    }
  }

  async endConversation() {
    try {
      // 1. Clear timer
      if (this.endTimer) {
        clearTimeout(this.endTimer);
      }

      // 2. Close OpenAI connection
      if (this.openaiWS) {
        this.openaiWS.close();
      }

      // 3. Notify client
      this.sendToClient({
        type: "status",
        data: {
          message: "Session ended",
          final: true,
          duration: Math.floor(
            (new Date().getTime() - this.startTime.getTime()) / 1000,
          ),
        },
        timestamp: new Date().toISOString(),
      });

      // 4. Save conversation data
      await this.saveConversation();

      // 5. Close client connection
      this.clientWS.close();
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  }

  private async saveConversation() {
    // This would save to Supabase in a real implementation
    // For now, we'll just log it
    console.log("Saving conversation:", {
      conversationId: this.conversationId,
      userId: this.userId,
      duration: Math.floor(
        (new Date().getTime() - this.startTime.getTime()) / 1000,
      ),
      messageCount: this.transcript.length,
      transcript: this.transcript,
    });
  }
}
