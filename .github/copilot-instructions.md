# Copilot Instructions for this Repository

## リポジトリ概要（参考）:
- ビルドツール: `astro` 
- website framework: `starlight`（`package.json` のスクリプトを参照）
- 主なコンテンツ: `src/content/docs/*` に Markdown/MDX ドキュメント
- Mermaid を利用した図を含む（`astro-mermaid`, `mermaid` が依存に含まれる）
- 生成したドキュメントは、GitHub Pages で公開する

## 基本ルール
- 既存のスタイルやフォーマットを尊重する。余計な再フォーマットは行わない。
- 変更は小さく段階的に。根本的なリファクタはユーザーの明示的指示がある場合のみ提案する。
- 変更を行うときは必ず理由を短くコメントで添える（コミットメッセージ候補を含める）。
- ファイルを新規作成する際は、最小の README または使用例を同梱する。

## コード作成 / 修正時の方針
- TypeScript/ASTRO プロジェクトとして振る舞う（`tsconfig.json` が存在）。
- 依存追加が必要な場合は、`package.json` の `dependencies` / `devDependencies` に追加提案を行い、`npm install` 実行手順を明示する。
- テストやビルド手順が明記できる場合は `scripts` の利用を推奨する（例: `npm run dev`, `npm run build`, `npm run preview`）。
- GitHub Pagesとnpm run devの動作保証を意識する。特に、ビルド後のファイル構成やパスに注意する。

## ドキュメント改善
- ドキュメントは `src/content/docs/` の構成に合わせる。既存のガイドやクイックスタートを参考に統一した見出しとトーンを使う。
- Mermaid 図を追加・修正する場合は、図の説明（キャプション）を添える。

## コミットメッセージとリリース規則
- リポジトリは `semantic-release` を用いた自動リリースの設定があるため、コミットは Conventional Commits 準拠を推奨する（例: `feat: `, `fix: `, `perf: `, `docs: `）。
- ドキュメント中心の変更は `docs:`、小さな修正やリファクタは `chore:` または `refactor:` を使う。

## 質問すべきケース（ユーザーに確認するポイント）
- 大きな API / アーキテクチャ変更を提案する場合は必ず確認する。
- 依存関係の追加やビルドパイプライン変更は事前確認を求める。
- UI/UX に影響する変更（テキスト、表現、レイアウト）では、想定する表示やスクリーンショット例を求める。

出力の形式: 
- 変更提案は必ず以下を含める:
	- 目的（1行）
	- 変更点サマリ（箇条書き）
	- 必要なコマンド（あれば）
	- 影響範囲（ファイルや機能）

## 運用メモ
- 開発手順の簡易コマンド例を示す: `npm install` → `npm run dev` → `npm run build` → `npm run preview`。
- ドキュメント修正や小規模なコード修正は PR ひとつにまとめ、レビューを依頼する旨をメッセージに記載する。
