"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Search,
  Filter,
  MessageCircle,
  Clock,
  TrendingUp,
  ChevronRight,
  Download,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");

  // ダミーデータ（実際はAPIから取得）
  const conversations = [
    {
      id: "1",
      date: new Date("2024-03-13"),
      duration: 312, // 秒
      summary:
        "新しいプロジェクトへの不安と期待について話しました。チームとのコミュニケーションを改善する方法を模索。",
      emotional_tone: "mixed",
      energy_level: 7,
      key_topics: ["仕事", "チームワーク", "不安"],
      positive_ratio: 65,
    },
    {
      id: "2",
      date: new Date("2024-03-12"),
      duration: 288,
      summary:
        "朝のランニングの効果について。体調が良く、創造的なアイデアが湧いてきた。",
      emotional_tone: "positive",
      energy_level: 9,
      key_topics: ["運動", "健康", "アイデア"],
      positive_ratio: 85,
    },
    {
      id: "3",
      date: new Date("2024-03-11"),
      duration: 295,
      summary:
        "週末の家族との時間を振り返り。子供の成長を感じ、親としての責任について考えた。",
      emotional_tone: "positive",
      energy_level: 8,
      key_topics: ["家族", "成長", "責任"],
      positive_ratio: 78,
    },
    {
      id: "4",
      date: new Date("2024-03-10"),
      duration: 276,
      summary:
        "プレゼンテーションの準備でストレスを感じた。深呼吸とマインドフルネスで落ち着きを取り戻した。",
      emotional_tone: "negative",
      energy_level: 5,
      key_topics: ["ストレス", "プレゼン", "マインドフルネス"],
      positive_ratio: 45,
    },
  ];

  // フィルタリング
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      searchQuery === "" ||
      conv.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.key_topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesMonth =
      selectedMonth === "all" || format(conv.date, "yyyy-MM") === selectedMonth;

    return matchesSearch && matchesMonth;
  });

  // 統計情報の計算
  const stats = {
    totalConversations: conversations.length,
    totalDuration: conversations.reduce((sum, conv) => sum + conv.duration, 0),
    averagePositivity: Math.round(
      conversations.reduce((sum, conv) => sum + conv.positive_ratio, 0) /
        conversations.length,
    ),
    averageEnergy: (
      conversations.reduce((sum, conv) => sum + conv.energy_level, 0) /
      conversations.length
    ).toFixed(1),
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const getEmotionColor = (tone: string) => {
    switch (tone) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      case "mixed":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getEmotionLabel = (tone: string) => {
    switch (tone) {
      case "positive":
        return "ポジティブ";
      case "negative":
        return "ネガティブ";
      case "mixed":
        return "混合";
      default:
        return tone;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">対話履歴</h1>
            <p className="text-muted-foreground">
              過去の対話を振り返り、成長の軌跡を確認しましょう
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            CSVエクスポート
          </Button>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">総対話数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalConversations}
              </div>
              <p className="text-xs text-muted-foreground">回</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">総対話時間</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(stats.totalDuration / 60)}
              </div>
              <p className="text-xs text-muted-foreground">分</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                平均ポジティブ度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averagePositivity}%
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline text-green-500" />{" "}
                上昇傾向
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                平均エネルギー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageEnergy}/10</div>
              <p className="text-xs text-muted-foreground">良好な状態</p>
            </CardContent>
          </Card>
        </div>

        {/* 検索とフィルター */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="キーワードやトピックで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 rounded-md bg-background border border-input text-sm"
          >
            <option value="all">すべての期間</option>
            <option value="2024-03">2024年3月</option>
            <option value="2024-02">2024年2月</option>
            <option value="2024-01">2024年1月</option>
          </select>
        </div>

        {/* 対話リスト */}
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {format(conversation.date, "yyyy年M月d日（E）", {
                        locale: ja,
                      })}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(conversation.duration)}
                      </span>
                      <span
                        className={`flex items-center gap-1 ${getEmotionColor(conversation.emotional_tone)}`}
                      >
                        <MessageCircle className="h-3 w-3" />
                        {getEmotionLabel(conversation.emotional_tone)}{" "}
                        {conversation.positive_ratio}%
                      </span>
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {conversation.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {conversation.key_topics.map((topic, index) => (
                      <Badge key={index} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      詳細
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                該当する対話履歴がありません
              </p>
            </CardContent>
          </Card>
        )}

        {/* ページネーション（実装する場合） */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="sm">
            もっと見る
          </Button>
        </div>
      </div>
    </div>
  );
}
