# 建設現場向け案件・スケジュール管理システム

Construction Project & Schedule Management System

## 概要

建設現場の担当者がスマートフォンから簡単に案件情報を入力・管理できるWebアプリケーションです。TimeTreeとFileMakerの手動転記作業を自動化し、効率的なスケジュール管理を実現します。

## 主な機能

### 📅 カレンダー機能
- 全担当者のスケジュールを一元表示
- 担当者ごとの色分け表示
- 複数担当者プロジェクトの視覚的表示
- 年度・月選択機能
- 高度な検索・フィルタリング機能

### 📝 案件登録
- モバイルフレンドリーな入力フォーム
- 期間選択（開始日〜終了日）
- 複数担当者選択機能
- 写真添付機能
- FileMakerデータベース連携設計

### 👥 担当者管理
- 担当者の追加・編集・削除
- カスタム色設定
- 連絡先情報管理

### 📊 データ出力
- CSV、Excel、JSON形式での出力
- FileMaker連携対応
- 日付・担当者フィルタリング

## 技術スタック

- **Frontend**: Next.js 14, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React
- **Fonts**: DM Sans, Geist

## セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

\`\`\`bash
# リポジトリをクローン
git clone https://github.com/yourusername/construction-schedule-management.git
cd construction-schedule-management

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
\`\`\`

アプリケーションは http://localhost:3000 で起動します。

### 環境変数設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

\`\`\`bash
# FileMaker連携用（オプション）
FILEMAKER_SERVER_URL=your_filemaker_server_url
FILEMAKER_DATABASE=your_database_name
FILEMAKER_USERNAME=your_username
FILEMAKER_PASSWORD=your_password

# その他の設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## 使用方法

### 基本操作
1. **カレンダー表示**: メイン画面でスケジュール全体を確認
2. **新規登録**: 「新規登録」ボタンから案件を追加
3. **担当者管理**: 「担当者」メニューから担当者を管理
4. **データ出力**: 「データ出力」から各種形式でエクスポート

### モバイル対応
- レスポンシブデザインでスマートフォンに最適化
- ボトムナビゲーションで片手操作に対応
- タッチフレンドリーなUI設計

## FileMaker連携

### 必要な手順
1. FileMaker Server でData APIを有効化
2. 案件管理テーブルの作成
3. REST APIエンドポイントの設定
4. 認証情報の環境変数設定

詳細な連携手順については、[FileMaker連携ガイド](docs/filemaker-integration.md)を参照してください。

## 開発

### ビルド
\`\`\`bash
npm run build
\`\`\`

### 本番環境での起動
\`\`\`bash
npm start
\`\`\`

### リント
\`\`\`bash
npm run lint
\`\`\`

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 貢献

プルリクエストや Issue の報告を歓迎します。

## サポート

質問や問題がある場合は、GitHub Issues でお知らせください。
