"use client";

import { useAuth } from "@/lib/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  TrendingUp,
  Battery,
  Target,
  Calendar,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  // ダミーデータ（実際はAPIから取得）
  const stats = {
    valueAlignment: 85,
    energyLevel: 7.5,
    growthRate: 12,
    weeklyConversations: 5,
    totalConversations: 23,
    currentStreak: 7,
  };

  const recentInsights = [
    {
      id: "1",
      type: "discovery" as const,
      title: "朝の運動後は創造性が40%向上",
      content:
        "過去2週間のデータから、朝の運動後の対話では創造的な発想が増える傾向が見られます。",
      date: "2日前",
    },
    {
      id: "2",
      type: "growth" as const,
      title: "プレゼンテーションへの不安が減少",
      content: "3週間前と比較して、人前で話すことへの不安が60%減少しています。",
      date: "3日前",
    },
  ];

  const getFirstName = (email: string) => {
    return email.split("@")[0];
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ウェルカムセクション */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            こんにちは、{getFirstName(user?.email || "")}さん
          </h1>
          <p className="text-muted-foreground">
            今日も素晴らしい一日にしましょう。あなたの成長を楽しみにしています。
          </p>
        </div>

        {/* メインアクション */}
        <Card className="mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  今日の振り返りを始めましょう
                </h2>
                <p className="text-muted-foreground">
                  5分間のAI対話で、今日の気づきを深めます
                </p>
              </div>
              <Link href="/conversation">
                <Button size="lg" className="gradient-primary text-white">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  対話を開始
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                価値観一致度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                {stats.valueAlignment}%
              </div>
              <Progress value={stats.valueAlignment} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                あなたの行動と価値観の一致度
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                エネルギーレベル
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                {stats.energyLevel}/10
              </div>
              <div className="flex items-center gap-2">
                <Battery className="h-5 w-5 text-primary" />
                <Progress
                  value={stats.energyLevel * 10}
                  className="h-2 flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                今週の平均エネルギー
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">成長率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                +{stats.growthRate}%
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-500">先月比</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                個人的な成長の進捗
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 最新のインサイト */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">最新のインサイト</h2>
              <Link href="/insights">
                <Button variant="ghost" size="sm">
                  すべて見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentInsights.map((insight) => (
                <Card
                  key={insight.id}
                  className="hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          insight.type === "discovery" ? "default" : "secondary"
                        }
                      >
                        {insight.type === "discovery" ? "発見" : "成長"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {insight.date}
                      </span>
                    </div>
                    <CardTitle className="text-base mt-2">
                      {insight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {insight.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* アクティビティ */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">アクティビティ</h2>
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  履歴を見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">継続日数</p>
                        <p className="text-sm text-muted-foreground">
                          毎日の対話を継続中
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {stats.currentStreak}日
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">今週の対話</p>
                        <p className="text-sm text-muted-foreground">
                          目標: 7回
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {stats.weeklyConversations}/7
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">総対話数</p>
                        <p className="text-sm text-muted-foreground">
                          開始から現在まで
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {stats.totalConversations}回
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* モチベーションメッセージ */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Sparkles className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">今日のヒント</h3>
                <p className="text-muted-foreground">
                  対話の前に深呼吸をして、今日あった良いことを3つ思い出してみましょう。
                  ポジティブな視点から始めることで、より深い気づきが得られます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
