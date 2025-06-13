"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Clock,
  TrendingUp,
  Lock,
  Sparkles,
  MessageCircle,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* ナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold gradient-text">
              Personal Insight Dashboard
            </h1>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost">ログイン</Button>
              </Link>
              <Link href="/signup">
                <Button className="gradient-primary text-white">
                  今すぐ始める
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="gradient-text">毎日5分のAI対話で、</span>
            <br />
            <span className="gradient-text">本当の自分を発見</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            あなたの思考、感情、価値観を深く理解し、
            パーソナライズされたインサイトで成長をサポートします
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gradient-primary text-white">
                3日間無料で試す
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              デモを見る
            </Button>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16 text-foreground">
            なぜPersonal Insight Dashboardなのか
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-foreground">
                  AIによる深い対話
                </h4>
                <p className="text-muted-foreground">
                  最先端のAIがあなたの話に耳を傾け、深い理解と共感を持って対話します
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-foreground">
                  1日たった5分
                </h4>
                <p className="text-muted-foreground">
                  忙しい日常でも続けられる、短時間で効果的な振り返りの習慣を構築
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-foreground">
                  成長の可視化
                </h4>
                <p className="text-muted-foreground">
                  あなたの変化と成長を数値化し、明確な改善ポイントを提示します
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16 text-foreground">
            シンプルな3ステップ
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">
                音声で話す
              </h4>
              <p className="text-muted-foreground">
                今日の出来事や感じたことを、自然な会話形式でAIに話しかけます
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">
                AIが分析
              </h4>
              <p className="text-muted-foreground">
                あなたの話から感情、価値観、パターンを抽出し、深い洞察を生成
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">
                インサイトを確認
              </h4>
              <p className="text-muted-foreground">
                パーソナライズされたダッシュボードで、あなたの成長を確認
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* プライバシーセクション */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <Lock className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-6 text-foreground">
            あなたのプライバシーを最優先に
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            すべての会話は暗号化され、あなた以外は誰もアクセスできません。
            <br />
            データの削除も、いつでも簡単に行えます。
          </p>
          <Link href="/privacy">
            <Button variant="outline">プライバシーポリシーを見る</Button>
          </Link>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-6 text-foreground">
            今日から、新しい自分に出会う旅を始めましょう
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            3日間の無料トライアル。クレジットカード不要。
          </p>
          <Link href="/signup">
            <Button size="lg" className="gradient-primary text-white">
              無料で始める
            </Button>
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Personal Insight Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
