"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  TrendingUp,
  Brain,
  Target,
  Calendar,
  Filter,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";

export default function InsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showRead, setShowRead] = useState(true);

  // ダミーデータ（実際はAPIから取得）
  const insights = [
    {
      id: "1",
      type: "discovery",
      title: "朝の運動後は創造性が40%向上",
      content:
        "過去2週間のデータから、朝の運動後の対話では創造的な発想が増える傾向が見られます。特に7時から9時の間に運動した日は、新しいアイデアについて話す頻度が通常の1.4倍になっています。",
      relevance_score: 95,
      created_at: "2024-03-13",
      is_read: false,
      category: "health",
    },
    {
      id: "2",
      type: "growth",
      title: "プレゼンテーションへの不安が減少",
      content:
        "3週間前と比較して、人前で話すことへの不安が60%減少しています。「緊張」「不安」といったネガティブワードの使用頻度が減り、「楽しみ」「挑戦」といったポジティブワードが増えています。",
      relevance_score: 88,
      created_at: "2024-03-12",
      is_read: false,
      category: "personal",
    },
    {
      id: "3",
      type: "pattern",
      title: "週末の活動が月曜日のモチベーションに影響",
      content:
        "データ分析の結果、週末に創造的な活動（読書、アート、音楽など）を行った週は、月曜日のエネルギーレベルが平均25%高いことがわかりました。",
      relevance_score: 82,
      created_at: "2024-03-11",
      is_read: true,
      category: "lifestyle",
    },
    {
      id: "4",
      type: "recommendation",
      title: "夕方の短い瞑想で睡眠の質が向上する可能性",
      content:
        "あなたの睡眠パターンと日中の活動を分析した結果、17時から18時の間に5-10分の瞑想を行うことで、睡眠の質が改善される可能性があります。",
      relevance_score: 76,
      created_at: "2024-03-10",
      is_read: true,
      category: "health",
    },
  ];

  const categories = [
    { value: "all", label: "すべて", icon: Brain },
    { value: "health", label: "健康", icon: Target },
    { value: "personal", label: "個人", icon: TrendingUp },
    { value: "lifestyle", label: "ライフスタイル", icon: Calendar },
  ];

  const filteredInsights = insights.filter((insight) => {
    const categoryMatch =
      selectedCategory === "all" || insight.category === selectedCategory;
    const readMatch = showRead || !insight.is_read;
    return categoryMatch && readMatch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "discovery":
        return <Lightbulb className="h-4 w-4" />;
      case "growth":
        return <TrendingUp className="h-4 w-4" />;
      case "pattern":
        return <Brain className="h-4 w-4" />;
      case "recommendation":
        return <Target className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "discovery":
        return "発見";
      case "growth":
        return "成長";
      case "pattern":
        return "パターン";
      case "recommendation":
        return "提案";
      default:
        return type;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">インサイト</h1>
            <p className="text-muted-foreground">
              AIが発見したあなたの成長と気づき
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            レポートを出力
          </Button>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">今週の発見</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">先週比 +3</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                成長ポイント
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">順調に成長中</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                識別パターン
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">新規パターン +2</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                未読インサイト
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">2</div>
              <p className="text-xs text-muted-foreground">確認してください</p>
            </CardContent>
          </Card>
        </div>

        {/* フィルター */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="flex-1"
          >
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.value} value={category.value}>
                    <Icon className="h-4 w-4 mr-2" />
                    {category.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRead(!showRead)}
          >
            {showRead ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                既読を表示
              </>
            ) : (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                既読を非表示
              </>
            )}
          </Button>
        </div>

        {/* インサイトリスト */}
        <div className="space-y-4">
          {filteredInsights.map((insight) => (
            <Card
              key={insight.id}
              className={`hover:border-primary/50 transition-colors cursor-pointer ${
                !insight.is_read ? "border-primary/30" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        insight.type === "discovery" ? "default" : "secondary"
                      }
                    >
                      {getTypeIcon(insight.type)}
                      <span className="ml-1">{getTypeLabel(insight.type)}</span>
                    </Badge>
                    {!insight.is_read && (
                      <Badge variant="outline" className="bg-primary/10">
                        新着
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {insight.created_at}
                  </span>
                </div>
                <CardTitle className="text-lg mt-2">{insight.title}</CardTitle>
                <CardDescription className="text-sm flex items-center gap-2 mt-1">
                  <span>関連度: {insight.relevance_score}%</span>
                  <div className="h-1 w-16 bg-primary/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${insight.relevance_score}%` }}
                    />
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{insight.content}</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="ghost">
                    詳細を見る
                  </Button>
                  <Button size="sm" variant="ghost">
                    アクションを設定
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInsights.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                該当するインサイトがありません
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
