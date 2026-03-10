# Spec Kit Guide

Astro Starlight を使って構築した Spec Kit Guide です。

## 開発コマンド

| Command | Action |
| :-- | :-- |
| `npm install` | 依存関係をインストールします。 |
| `npm run dev` | ローカル開発サーバーを起動します。 |
| `npm run build` | 本番用の静的サイトを生成します。 |
| `npm run preview` | ビルド済みサイトをローカルで確認します。 |
| `npm run astro -- --help` | Astro CLI のヘルプを表示します。 |

## コンテンツ配置

- `src/content/docs/guides/`: ガイド系ドキュメント
- `src/content/docs/reference/`: 詳細リファレンス
- `astro.config.mjs`: Starlight とサイドバーの設定

既存の Markdown ドキュメントに含まれる Mermaid 図も、Astro 上でそのまま描画できるように設定しています。

## 自動リリースと GitHub Pages

- `.github/workflows/release.yml` は `main` への push 時に `semantic-release` を実行し、Conventional Commits から次の SemVer を算出して `vX.Y.Z` タグと GitHub Release を自動作成します。
- `.github/workflows/deploy-pages.yml` は `main` への push 時に Astro Starlight サイトを build し、GitHub Pages (`https://rising3.github.io/speckit-guide/`) に公開します。
- リリースルールは `feat` = minor、`fix` / `perf` = patch、`BREAKING CHANGE` = major に加えて、ドキュメント中心のリポジトリとして `docs` / `refactor` も patch release 対象にしています。
- `semantic-release` は Git タグをバージョンの正とみなします。既存の `0.0.1` から継続したい場合は、workflow を有効化する前に対応コミットへ `v0.0.1` タグを付けてください。

### GitHub 側で必要な設定

1. `Settings > Pages > Build and deployment` で Source を `GitHub Actions` にします。
2. `Settings > Actions > General > Workflow permissions` で `Read and write permissions` を有効にします。
