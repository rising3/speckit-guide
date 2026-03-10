---
title: "実装フェーズと使い分けガイド"
description: "implement コマンドの詳細と、どのコマンドをいつ使うかの判断基準をまとめています。"
sidebar:
  order: 6
---

## /speckit.implement

### 目的

tasks.md を順に処理し、実装、テスト、設定ファイル整備、進捗更新まで進めるコマンドです。

### 基本構文

```text
/speckit.implement
/speckit.implement Only execute Phase 1 tasks and stop.
/speckit.implement MVP mode: Only implement User Story 1.
/speckit.implement Run all [P] tasks in Phase 2 in parallel before proceeding.
```

### 実際のプロンプト例

```text
/speckit.implement
```

```text
/speckit.implement Only execute Phase 1 tasks and stop.
```

```text
/speckit.implement MVP mode: Only implement User Story 1. Stop after validation.
```

```text
/speckit.implement Run all [P] tasks in Phase 2 in parallel before proceeding to Phase 3.
```

### 主な処理

- checklists の完了状態を確認する
- tasks.md、plan.md を読み込む
- data-model.md、contracts/、research.md、quickstart.md を参照する
- 必要な ignore ファイルを生成または検証する
- タスク順に実装する
- tests before code の原則で進める
- 完了タスクを tasks.md 上で [X] に更新する
- 最終検証を行う

### 入力として必要なもの

- tasks.md
- plan.md
- spec.md
- constitution.md

### 生成・更新されるもの

- 実装コード
- テストコード
- 設定ファイルや ignore ファイル
- 更新済み tasks.md

### 前後のコマンドとの関係

- 前: /speckit.tasks、できれば /speckit.analyze
- 後: 実装結果のレビュー、追加修正

### 次に進む判断基準

- checklists が完了している
- tasks.md が十分に具体的である
- plan.md と contracts の内容が実装判断に足る

### 実務上のポイント

- [P] は tasks.md の設計に基づく。並列実行したければ tasks 側で設計しておく必要がある
- Phase 2 が終わる前に User Story フェーズへ進めない構造になっている
- テスト先行の順序が守られているかをレビューで確認する

## どのコマンドをどこで使うべきか

### 仕様を固める段階

- /speckit.constitution
- /speckit.specify
- /speckit.clarify
- /speckit.checklist

### 技術設計を固める段階

- /speckit.plan
- /speckit.checklist

### 実装準備を固める段階

- /speckit.tasks
- /speckit.analyze

### 実装する段階

- /speckit.implement

## 実践的な最小フロー

最小でも、次の流れは守ったほうがよいです。

```text
/speckit.constitution
/speckit.specify [機能説明]
/speckit.clarify
/speckit.plan [技術方針]
/speckit.tasks
/speckit.analyze
/speckit.implement
```

checklist は任意ですが、要求品質を上げたいなら spec 後か plan 後の少なくとも一度は挟む価値があります。

## 省略してもよいコマンドと、省略しにくいコマンド

### 省略しにくいもの

- /speckit.specify
- /speckit.plan
- /speckit.tasks
- /speckit.implement

これらは中核フローです。

### 状況によって省略可能なもの

- /speckit.constitution
- /speckit.clarify
- /speckit.checklist
- /speckit.analyze

ただし、実運用では省略可能であっても、品質・手戻り削減の観点では重要です。

## 結論

Spec Kitは、単なるコマンド群ではなく、仕様、設計、タスク、実装を順番に接続するワークフローです。中核となる順序は次の通りです。

```text
constitution -> specify -> clarify -> plan -> tasks -> analyze -> implement
```

checklist はこのフローの途中で品質を点検する補助コマンドです。

要点を一言でまとめると、specify で What を固め、clarify で曖昧さを消し、plan で How を決め、tasks で作業に落とし、analyze で齟齬を潰し、implement で実装する、という流れです。
