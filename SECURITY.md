# Security Policy

## Supported Versions

現在サポートされているバージョンのセキュリティアップデートについて

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

セキュリティ脆弱性を発見した場合は、以下の手順に従って報告してください：

1. **公開のIssueトラッカーには投稿しないでください**
2. プライベートな方法で開発者に連絡してください
3. 脆弱性の詳細、再現手順、影響範囲を含めてください

### 報告後の流れ

- 報告を受けた後、48時間以内に受領確認を行います
- 脆弱性の調査と修正に取り組みます
- 修正が完了次第、セキュリティアップデートをリリースします
- 適切な場合、報告者をクレジットに含めます

## セキュリティのベストプラクティス

### 本番環境での使用時

1. **環境変数の適切な管理**
   - `.env.local`ファイルをバージョン管理に含めない
   - 本番環境では強力なパスワードを使用

2. **HTTPS の使用**
   - 本番環境では必ずHTTPSを使用してください

3. **定期的なアップデート**
   - 依存関係を定期的にアップデートしてください
   - `npm audit`を定期的に実行してください

4. **FileMaker連携時のセキュリティ**
   - FileMaker Server のアクセス制御を適切に設定
   - API キーの定期的な更新
   - 最小権限の原則に従った権限設定

### 推奨されるセキュリティヘッダー

```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ]
}
```

## 既知の制限事項

- 本アプリケーションはデモンストレーション目的で作成されています
- 本番環境での使用には追加のセキュリティ設定が必要です
- FileMaker連携機能は適切な認証設定が必要です
