---
title: "仕様決定フェーズ: constitution, specify, clarify"
description: "要件定義を支える3つのコマンドの目的、入力、生成物、実務上のポイントをまとめています。"
sidebar:
  order: 3
---

## /speckit.constitution

### 目的

プロジェクト全体で守るべき原則を定義します。以降のすべてのコマンドに対して、品質基準と設計方針を与える土台です。

### 引数の扱い

任意です。引数なしでも実行できますが、重視したい原則や改訂内容を自然言語で渡したほうが constitution の方向性が安定します。

### 典型的な入力

- コード品質の原則
- テスト戦略
- UXやアクセシビリティの基準
- パフォーマンス目標
- セキュリティ方針

### 実際のプロンプト例

```text
/speckit.constitution
/speckit.constitution コード品質、テスト、自動化、アクセシビリティ、パフォーマンス、セキュリティを重視するプロジェクト原則を定義してください
```

```text
/speckit.constitution テストファースト、API互換性維持、監査ログ、レスポンス性能、UI一貫性を必須原則として定義してください
```

```text
/speckit.constitution Library-First、CLI互換、TDD必須、観測性、SemVer遵守を非交渉原則として追加してください
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

### 引数の扱い

必須です。自然言語の feature description を渡します。Who / What / Why / Out of Scope / Success Criteria に当たる内容を書くと安定します。

### 実際のプロンプト例

```text
/speckit.specify Build an application that helps a small team manage projects, tasks, and comments. Users can move tasks between columns and track progress visually. Login is out of scope for this initial phase.
```

```text
/speckit.specify Develop a photo organization application. Users can create albums grouped by date, reorder albums by drag and drop, and preview photos in a tile layout. Nested albums are out of scope.
```

```text
/speckit.specify Create a customer support dashboard where agents can claim tickets, add internal notes, change ticket status, and escalate unresolved issues. Phone integration is out of scope.
```

```text
/speckit.specify Build an internal approval workflow for expense requests. Employees can submit requests, managers can approve or reject them, and finance can export approved items. Reimbursement payment itself is out of scope.
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

### 引数の扱い

任意です。引数なしなら spec 全体の曖昧さを自動スキャンし、引数ありなら特定の曖昧さや重点論点を指定できます。

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

```text
/speckit.clarify Clarify data retention, audit logging, and failure notification behavior.
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
