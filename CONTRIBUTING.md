# Contributing to 建設現場向け案件・スケジュール管理システム

このプロジェクトへの貢献をありがとうございます！以下のガイドラインに従って、スムーズな開発プロセスを維持しましょう。

## 開発環境のセットアップ

### 前提条件
- Node.js 18.0.0 以上
- npm または yarn
- Git

### セットアップ手順

1. リポジトリをフォーク
2. ローカルにクローン
```bash
git clone https://github.com/your-username/construction-schedule-management.git
cd construction-schedule-management
```

3. 依存関係をインストール
```bash
npm install
```

4. 環境変数の設定
```bash
cp .env.example .env.local
# .env.local ファイルを適切に編集
```

5. 開発サーバーを起動
```bash
npm run dev
```

## 開発フロー

### ブランチ戦略

- `main`: 本番環境用の安定版
- `develop`: 開発用のメインブランチ
- `feature/*`: 新機能開発用
- `bugfix/*`: バグ修正用
- `hotfix/*`: 緊急修正用

### ワークフロー

1. `develop`ブランチから新しいブランチを作成
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. 変更を実装
3. テストを実行
```bash
npm run lint
npm run build
```

4. コミット
```bash
git add .
git commit -m "feat: add your feature description"
```

5. プッシュしてプルリクエストを作成
```bash
git push origin feature/your-feature-name
```

## コーディング規約

### TypeScript
- 型安全性を重視
- `any`型の使用は避ける
- 適切なインターフェースと型定義を作成

### React
- 関数コンポーネントを使用
- Hooksを適切に活用
- props の型定義を必須とする

### スタイリング
- Tailwind CSS を使用
- shadcn/ui コンポーネントを優先
- レスポンシブデザインを考慮

### ファイル構造
```
components/
  ├── ui/           # 再利用可能なUIコンポーネント
  ├── calendar-view.tsx
  ├── project-form.tsx
  └── ...
app/
  ├── globals.css
  ├── layout.tsx
  └── page.tsx
lib/
  └── utils.ts
hooks/
  └── use-toast.ts
```

## コミットメッセージの規約

Conventional Commits 形式を使用:

- `feat:` 新機能の追加
- `fix:` バグ修正
- `docs:` ドキュメントの更新
- `style:` コードスタイルの変更（機能に影響なし）
- `refactor:` リファクタリング
- `test:` テストの追加・修正
- `chore:` その他のメンテナンス

例:
```
feat: add calendar view drag and drop functionality
fix: resolve mobile navigation overlay issue
docs: update installation instructions
```

## プルリクエストのガイドライン

### プルリクエストを作成する前に

1. `npm run lint` でコードスタイルをチェック
2. `npm run build` でビルドエラーがないことを確認
3. 変更内容に関連するテストを実行
4. 機能追加の場合は適切なドキュメントを更新

### プルリクエストの説明

以下の情報を含めてください：

- 変更内容の簡潔な説明
- 関連するIssue番号（あれば）
- スクリーンショット（UI変更の場合）
- テスト手順
- 破壊的変更の有無

### プルリクエストテンプレート

```markdown
## 概要
<!-- 変更内容を簡潔に説明 -->

## 変更内容
- [ ] 新機能追加
- [ ] バグ修正
- [ ] リファクタリング
- [ ] ドキュメント更新

## 関連Issue
<!-- Fixes #123 -->

## テスト手順
1. 
2. 
3. 

## スクリーンショット
<!-- UI変更がある場合 -->

## チェックリスト
- [ ] コードスタイルガイドに従っている
- [ ] 自分でテストを実行した
- [ ] 適切なドキュメントを更新した
- [ ] 破壊的変更がある場合は明記した
```

## イシューの報告

### バグ報告

以下の情報を含めてください：

- バグの詳細な説明
- 再現手順
- 期待される動作
- 実際の動作
- 環境情報（OS、ブラウザ、Node.jsバージョンなど）
- スクリーンショットやエラーメッセージ

### 機能リクエスト

以下の情報を含めてください：

- 機能の詳細な説明
- 使用例
- なぜその機能が必要なのか
- 代替案があれば記載

## コードレビューについて

### レビュアーへのお願い

- 建設的なフィードバックを提供
- コードの品質、セキュリティ、パフォーマンスを重視
- ドキュメントの更新も確認

### レビューを受ける際の心構え

- フィードバックを素直に受け入れる
- 疑問点があれば遠慮なく質問
- 修正が必要な場合は迅速に対応

## リリースプロセス

1. `develop`ブランチで機能開発とテスト
2. `main`ブランチにマージ
3. バージョンタグを作成
4. リリースノートを作成

## サポートとヘルプ

- 質問やサポートが必要な場合はGitHub Discussionsを利用
- バグ報告や機能リクエストはGitHub Issuesを利用
- 緊急の問題についてはセキュリティポリシーに従って報告

## ライセンス

貢献したコードはMITライセンスの下で公開されることに同意したものとみなします。

---

ご質問やご不明な点がございましたら、お気軽にお尋ねください。皆様の貢献をお待ちしております！
