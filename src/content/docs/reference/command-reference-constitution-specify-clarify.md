---
title: "仕様決定フェーズ: constitution, specify, clarify"
description: "要件定義を支える3つのコマンドの目的、入力、生成物、実務上のポイントをまとめています。"
sidebar:
  order: 3
---

## /speckit.constitution

### 目的

プロジェクト全体で守るべき原則を定義します。以降のすべてのコマンドに対して、品質基準と設計方針を与える土台です。

### 典型的な入力

- コード品質の原則
- テスト戦略
- UXやアクセシビリティの基準
- パフォーマンス目標
- セキュリティ方針

### 実際のプロンプト例

```text
/speckit.constitution コード品質、テスト、自動化、アクセシビリティ、パフォーマンス、セキュリティを重視するプロジェクト原則を定義してください
```

```text
/speckit.constitution テストファースト、API互換性維持、監査ログ、レスポンス性能、UI一貫性を必須原則として定義してください
```

### 生成・更新されるもの

- constitution.md

### 前後のコマンドとの関係

- 前: なし
- 後: /speckit.specify, /speckit.plan がこの内容を参照する

### 実務上のポイント

- 曖昧なスローガンではなく、判断に使える原則を書く
- 後続のレビューでは constitution 違反が重大な問題になる

## /speckit.specify

### 目的

フィーチャーの仕様を作るコマンドです。ユーザー価値、業務価値、ユースケース、機能要件、成功基準を spec.md にまとめます。

### 基本構文

```text
/speckit.specify <自然言語によるフィーチャー説明>
```

### 実際のプロンプト例

```text
/speckit.specify Build an application that helps a small team manage projects, tasks, and comments. Users can move tasks between columns and track progress visually. Login is out of scope for this initial phase.
```

```text
/speckit.specify Develop a photo organization application. Users can create albums grouped by date, reorder albums by drag and drop, and preview photos in a tile layout. Nested albums are out of scope.
```

### この段階で書くべきこと

- 何を実現したいか
- どのユーザーが使うか
- ユーザーが何をできる必要があるか
- どのような制約やスコープ境界があるか
- 成功をどう判断するか

### この段階で書くべきではないこと

- 言語やフレームワーク
- API形式
- DB製品名
- 実装方式

### 主な処理

- フィーチャー名から短いブランチ名を生成する
- 重複ブランチや重複ディレクトリを確認する
- spec.md を生成する
- requirements.md を生成して品質チェックする
- NEEDS CLARIFICATION を最大3件提示する

### 生成されるもの

```text
specs/[###-feature-name]/
  spec.md
  checklists/
    requirements.md
```

### 前後のコマンドとの関係

- 前: /speckit.constitution があると望ましい
- 後: /speckit.clarify または /speckit.plan

### 次に進む判断基準

- spec.md に実装詳細が混ざっていない
- 成功基準が測定可能で技術非依存
- NEEDS CLARIFICATION が残っていないか、残っていても解消方針がある

## /speckit.clarify

### 目的

spec.md の曖昧さや抜けを減らすための対話型コマンドです。plan に進む前に仕様の解像度を上げます。

### 基本構文

```text
/speckit.clarify
/speckit.clarify Focus on security and performance requirements.
```

### 実際のプロンプト例

```text
/speckit.clarify
```

```text
/speckit.clarify Focus on security and performance requirements.
```

```text
/speckit.clarify I want to clarify task card details, comment behavior, and project switching flow.
```

### 主な処理

- spec.md を自動スキャンする
- 10カテゴリ程度の観点で不足を探す
- 最大5問までの対話で重要な不明点を詰める
- spec.md の Clarifications セクションと関連箇所を更新する

### 生成・更新されるもの

- spec.md の更新

### 前後のコマンドとの関係

- 前: /speckit.specify
- 後: /speckit.plan

### 実行すべきタイミング

- specify の直後
- plan の前
- 仕様に曖昧さ、矛盾、未決事項があるとき

### スキップできるケース

- スパイクや探索的プロトタイプ
- 後で手戻りが発生しても構わない短期検証

### 実務上のポイント

- 原則として plan 前に終わらせる
- 技術選定の質問はここでは最小限にする
- 一度で足りなければ複数回実行する
