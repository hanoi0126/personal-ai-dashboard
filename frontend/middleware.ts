import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証が必要なパス
const protectedPaths = [
  "/dashboard",
  "/conversation",
  "/insights",
  "/history",
  "/settings",
];

// 認証が不要なパス（ログイン済みの場合リダイレクト）
const authPaths = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // 保護されたルートへのアクセス
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      // トークンがない場合はログインページへリダイレクト
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // 認証ページへのアクセス（ログイン済みの場合）
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (token) {
      // トークンがある場合はダッシュボードへリダイレクト
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).)",
  ],
};
