"use client";

import { useState } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Trash2,
  Save,
  AlertCircle,
  Check,
  Clock,
  Mail,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // フォームの状態
  const [notificationTime, setNotificationTime] = useState("21:00");
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSaveNotifications = async () => {
    setSaving(true);
    setMessage("");

    try {
      // APIコールをシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("通知設定を保存しました");
    } catch (error) {
      setMessage("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("本当にアカウントを削除しますか？この操作は取り消せません。")) {
      try {
        // APIコールをシミュレート
        await new Promise((resolve) => setTimeout(resolve, 1000));
        logout();
      } catch (error) {
        setMessage("アカウントの削除に失敗しました");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">設定</h1>
          <p className="text-muted-foreground">アカウントと通知の管理</p>
        </div>

        {message && (
          <Alert className="mb-6">
            <Check className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              プロフィール
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              通知
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              プライバシー
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              サブスクリプション
            </TabsTrigger>
          </TabsList>

          {/* プロフィール */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>プロフィール情報</CardTitle>
                <CardDescription>
                  アカウントの基本情報を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    メールアドレスは変更できません
                  </p>
                </div>

                <div>
                  <Label htmlFor="created">登録日</Label>
                  <Input
                    id="created"
                    value={
                      user?.created_at
                        ? new Date(user.created_at).toLocaleDateString("ja-JP")
                        : ""
                    }
                    disabled
                    className="mt-1"
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">パスワード変更</h3>
                  <Button variant="outline">パスワードを変更</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 通知設定 */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>
                  リマインダーと通知の設定を管理します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>毎日のリマインダー</Label>
                      <p className="text-sm text-muted-foreground">
                        対話の時間をお知らせします
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationEnabled}
                      onChange={(e) => setNotificationEnabled(e.target.checked)}
                      className="toggle"
                    />
                  </div>

                  {notificationEnabled && (
                    <div>
                      <Label htmlFor="time">通知時間</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="time"
                          type="time"
                          value={notificationTime}
                          onChange={(e) => setNotificationTime(e.target.value)}
                          className="max-w-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>メール通知</Label>
                      <p className="text-sm text-muted-foreground">
                        週次サマリーをメールで受け取る
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="toggle"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveNotifications} disabled={saving}>
                    {saving ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        変更を保存
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* プライバシー */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>プライバシー設定</CardTitle>
                <CardDescription>
                  データの取り扱いとプライバシーに関する設定
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">データの取り扱い</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 mt-0.5" />
                      <p>すべての対話は暗号化されて保存されます</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 mt-0.5" />
                      <p>あなたのデータはAIの学習には使用されません</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 mt-0.5" />
                      <p>いつでもデータの削除をリクエストできます</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">データのエクスポート</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    すべての対話データと分析結果をダウンロードできます
                  </p>
                  <Button variant="outline">データをエクスポート</Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3 text-destructive">
                    危険な操作
                  </h3>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      アカウントを削除すると、すべてのデータが永久に失われます。
                      この操作は取り消せません。
                    </AlertDescription>
                  </Alert>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="mt-4"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    アカウントを削除
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* サブスクリプション */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>サブスクリプション</CardTitle>
                <CardDescription>現在のプランと料金情報</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">現在のプラン</h3>
                    <Badge variant="default">
                      {user?.subscription_status === "trial"
                        ? "無料トライアル"
                        : "プレミアム"}
                    </Badge>
                  </div>
                  {user?.subscription_status === "trial" && (
                    <p className="text-sm text-muted-foreground">
                      残り{user?.trial_days_remaining}日でトライアルが終了します
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">プラン詳細</h3>
                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">無料トライアル</h4>
                          <p className="text-sm text-muted-foreground">3日間</p>
                        </div>
                        <span className="text-lg font-bold">¥0</span>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✓ 毎日5分の対話</li>
                        <li>✓ 基本的なインサイト</li>
                        <li>✓ 対話履歴の保存</li>
                      </ul>
                    </div>

                    <div className="border border-primary rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">プレミアムプラン</h4>
                          <p className="text-sm text-muted-foreground">月額</p>
                        </div>
                        <span className="text-lg font-bold">¥980</span>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✓ 無制限の対話時間</li>
                        <li>✓ 高度な分析とインサイト</li>
                        <li>✓ 優先サポート</li>
                        <li>✓ データのエクスポート</li>
                      </ul>
                      <Button className="w-full mt-4 gradient-primary text-white">
                        プレミアムにアップグレード
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
