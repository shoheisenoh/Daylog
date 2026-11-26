# DAYLOG v85 — 安定化版

## リリース内容
- v84の分析ラベル色連動機能を含む既存機能を維持。
- PWAのキャッシュ名を `daylog-stability-v85` に更新。
- 更新時に旧v84キャッシュ `daylog-analysis-label-colors-v84` を整理するようService Workerを更新。
- READMEはMarkdown形式（`README.md`）。

## データ互換性
- 保存形式：v6（変更なし）
- 保存キー：`daylog.data.v3`（変更なし）
- JSON v5バックアップはv6へ移行。JSON v6バックアップも読み込み可能。
- ラベル、サブラベル、セッション、日課、履歴、テーマ、分析設定のデータ構造は変更なし。

## インストール・更新
1. ZIPを展開し、`DAYLOG` フォルダーをHTTPS対応のWebサーバーへ配置します。
2. 既存PWAはネットワーク接続時に再読み込みしてください。Service Workerが新しいキャッシュへ更新します。
3. オフライン起動には、少なくとも一度オンラインで新バージョンを読み込み、Service Workerの更新が完了している必要があります。

## 検証範囲
`AUDIT.txt` と `COMPATIBILITY.txt` に、静的検査およびChromium自動テストの結果と未検証環境を記載しています。実機Safari/iOS、Firefox、Android実機での確認は含みません。
