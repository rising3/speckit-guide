---
title: "品質ゲート: checklist"
description: "requirements writing の品質を確認する checklist コマンドの使い方を整理したリファレンスです。"
sidebar:
  order: 4
---

## /speckit.checklist

### 目的

要件記述の品質を検証するチェックリストを作成します。実装の正しさではなく、要求が明確で完全かどうかを確認するためのものです。

### 基本構文

```text
/speckit.checklist
/speckit.checklist Focus on UX requirements quality
/speckit.checklist Create a checklist for the following domain: security
```

### 実際のプロンプト例

```text
/speckit.checklist
```

```text
/speckit.checklist Focus on UX requirements quality
```

```text
/speckit.checklist Security checklist. Must include authentication requirements, data protection, and breach response requirements.
```

```text
/speckit.checklist API contracts completeness and consistency
```

### 主な処理

- spec.md、plan.md、tasks.md を必要に応じて読む
- ドメイン別の観点を整理する
- チェックリストファイルを生成する

### 生成されるもの

- checklists/ux.md
- checklists/api.md
- checklists/security.md
- checklists/performance.md
- その他、指定したドメインのチェックリスト

### 前後のコマンドとの関係

- 前1: /speckit.specify または /speckit.clarify の後
- 前2: /speckit.plan の後
- 後: 仕様や計画の修正、または /speckit.tasks

### 実行タイミング

- spec 完成後に一度
- plan 完成後に必要なドメインで再度
- 仕様や計画を更新したら再実行してよい

### 実務上のポイント

- これは requirements writing の unit tests という位置づけ
- 動作確認やAPIレスポンス検証のような実装テストとは別物
- フォーカスドメインを明示すると質問が減り、結果が安定しやすい
