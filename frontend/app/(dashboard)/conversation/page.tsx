"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  AlertCircle,
} from "lucide-react";

export default function ConversationPage() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5分 = 300秒
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // タイマー処理
  useEffect(() => {
    if (isConnected && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && isConnected) {
      handleEndConversation();
    }
  }, [isConnected, timeRemaining]);

  // WebSocket接続
  const connectWebSocket = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/conversation/${token}`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setError("");
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "transcript") {
          setTranscript(data.text);
        } else if (data.type === "error") {
          setError(data.message);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("接続エラーが発生しました");
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Failed to connect:", error);
      setError("接続に失敗しました");
    }
  };

  // 音声録音開始
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setIsRecording(true);

      // ここで音声データをWebSocket経由で送信する処理を実装
      // 実際の実装では、MediaRecorder APIやWeb Audio APIを使用
    } catch (error) {
      console.error("Failed to start recording:", error);
      setError("マイクへのアクセスが拒否されました");
    }
  };

  // 音声録音停止
  const stopRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
  };

  // 対話開始
  const handleStartConversation = async () => {
    await connectWebSocket();
    await startRecording();
  };

  // 対話終了
  const handleEndConversation = () => {
    stopRecording();
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
    setTimeRemaining(300);
  };

  // ミュート切り替え
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // 実際の実装では、音声ストリームのミュート処理を行う
  };

  // 時間のフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI対話</h1>
          <p className="text-muted-foreground">
            5分間、AIと自由に話してください。あなたの思考を整理し、新しい気づきを見つけましょう。
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-card">
          <CardContent className="p-8">
            {!isConnected ? (
              // 対話開始前
              <div className="text-center space-y-6">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mic className="h-16 w-16 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    準備はできましたか？
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    静かな環境で、リラックスして話しかけてください
                  </p>
                  <Button
                    size="lg"
                    onClick={handleStartConversation}
                    className="gradient-primary text-white"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    対話を始める
                  </Button>
                </div>
              </div>
            ) : (
              // 対話中
              <div className="space-y-6">
                {/* タイマー */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">残り時間</p>
                  <p className="text-4xl font-bold text-primary">
                    {formatTime(timeRemaining)}
                  </p>
                  <Progress
                    value={((300 - timeRemaining) / 300) * 100}
                    className="mt-4 h-2"
                  />
                </div>

                {/* 音声波形アニメーション */}
                <div className="flex justify-center items-center h-32">
                  {isRecording && !isMuted ? (
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-primary to-secondary rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 60 + 20}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      {isMuted ? "ミュート中" : "音声を待機中..."}
                    </div>
                  )}
                </div>

                {/* AIの応答 */}
                {transcript && (
                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      AIからの質問:
                    </p>
                    <p className="text-lg">{transcript}</p>
                  </div>
                )}

                {/* コントロールボタン */}
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMute}
                    className="h-12 w-12 rounded-full"
                  >
                    {isMuted ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleEndConversation}
                    className="h-12 w-12 rounded-full"
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* ヒント */}
                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    自然に話しかけてください。AIがあなたの話を聞いています。
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 使い方のヒント */}
        <Card className="mt-6 bg-card/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">対話のヒント</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 今日の出来事や感じたことを素直に話してみましょう</li>
              <li>• AIの質問に答えることで、新しい視点が見つかります</li>
              <li>• 沈黙があっても大丈夫。ゆっくり考えてから話してください</li>
              <li>
                • 5分間はあなただけの時間です。リラックスして楽しんでください
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
