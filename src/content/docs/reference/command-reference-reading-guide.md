---
title: "コマンド出力の読み方と成果物ガイド"
description: "各コマンドが生成する文書の役割、読む順序、確認ポイントを整理したガイドです。"
sidebar:
  order: 2
---

## コマンドごとの生成ドキュメントの役割と読み方

このセクションは、各コマンドが何を生成し、そのファイルをどう読めば次の意思決定につながるかをまとめたものです。

## 先に押さえる入力例

| コマンド | 引数必須か | 代表例 |
| --- | --- | --- |
| `/speckit.constitution` | 任意 | `Library-First、CLI互換、TDD必須、観測性、SemVer遵守を非交渉原則として追加してください` |
| `/speckit.specify` | 必須 | `Create a customer support dashboard where agents can claim tickets, add internal notes, change ticket status, and escalate unresolved issues...` |
| `/speckit.clarify` | 任意 | `Clarify data retention, audit logging, and failure notification behavior.` |
| `/speckit.checklist` | 任意 | `API contracts completeness and consistency` |
| `/speckit.plan` | 任意 | `Use Next.js for the web app, Supabase for authentication and storage, and background jobs for asynchronous notifications...` |
| `/speckit.tasks` | 任意 | `Focus on User Story 1 only for the MVP. Skip User Stories 2 and 3 for now.` |
| `/speckit.analyze` | 任意 | `Review terminology drift between spec, plan, and tasks.` |
| `/speckit.implement` | 任意 | `Implement only the API and test tasks first. Leave the frontend tasks unchecked.` |

### /speckit.constitution が作るもの

#### constitution.md の役割

プロジェクト全体の判断基準です。設計方針、品質基準、テスト原則、セキュリティ原則などを固定し、後続コマンドの品質ゲートとして機能します。

#### constitution.md の読み方

- まず MUST に相当する強い原則を確認する
- 次にテスト、性能、セキュリティ、UI一貫性などの非機能要求を確認する
- specify や plan の内容がこの原則に反していないかを照合する

#### 読むときの着眼点

- 後続で迷いそうな設計判断が先にルール化されているか
- 抽象論ではなく、レビューで判定可能な記述になっているか

### /speckit.specify が作るもの

#### spec.md の役割

フィーチャー仕様の中心文書です。ユーザー価値、ユーザーストーリー、機能要件、成功基準、スコープ境界を定義します。

#### spec.md の読み方

- 最初にフィーチャーの目的とユーザー像を読む
- 次にユーザーストーリーを優先度順に確認する
- その後、機能要件と成功基準がストーリーを支えているかを見る
- 最後にスコープ外と前提条件を確認する

#### 読むときの着眼点

- What と Why に集中できているか
- 実装方式が混ざっていないか
- 各ユーザーストーリーが独立して価値を持つか
- 成功基準が測定可能で技術非依存か

#### checklists/requirements.md の役割

spec.md の最低限の品質自己点検です。AIが仕様として未完成な点を残していないかを確認する初期チェックリストです。

#### checklists/requirements.md の読み方

- 未チェックの項目がないかを先に確認する
- 未達があれば対応する spec.md の箇所に戻る
- plan に進む前の出発判定として使う

#### 読むときの着眼点

- NEEDS CLARIFICATION が残っていないか
- 曖昧、非測定、実装依存の記述が残っていないか

### /speckit.clarify が更新するもの

#### 更新後の spec.md の役割

clarify 後の spec.md は、単なる草案ではなく、plan に渡すための仕様確定版に近づいた文書です。Clarifications セクションは、なぜその仕様が確定したかの履歴としても使えます。

#### 更新後の spec.md の読み方

- Clarifications セクションを先に見て、何が追加で決まったか把握する
- その後、該当する要件やユーザーストーリー本文に反映されているか確認する
- plan で必要な前提が十分に埋まっているかを見る

#### 読むときの着眼点

- 重要な曖昧さが本当に解消されたか
- Clarifications に書かれた内容が本文へ反映されているか
- plan に必要な非機能要件や制約が不足していないか

### /speckit.checklist が作るもの

#### checklists/*.md の役割

UX、API、security、performance など、特定ドメインの要件品質を検査するためのチェックリストです。実装のテストではなく、要求の書き方そのものをレビューするために使います。

#### checklists/*.md の読み方

- まず対象ドメインが何かを確認する
- 次に各チェック項目が、既存の spec.md や plan.md で満たされているかを確認する
- 満たされない項目があれば、設計や実装に進む前に要求文書へ戻る

#### 読むときの着眼点

- 要求の抜け漏れが見つかるか
- エラー系、境界条件、非機能要求がきちんと問われているか
- 実装確認ではなく、要求の完全性と明確性を見ているか

### /speckit.plan が作るもの

#### plan.md の役割

spec.md を実装可能な技術計画へ変換する中核文書です。採用技術、構成、設計方針、フェーズ進行、constitution との整合をまとめます。

#### plan.md の読み方

- 最初に Summary と Technical Context を読む
- 次に Constitution Check を見て、原則違反がないか確認する
- その後、Project Structure と Phase 方針を確認する
- 最後に補助成果物との関係を照合する

#### 読むときの着眼点

- spec の要求に対して技術選定が妥当か
- NEEDS CLARIFICATION が残っていないか
- テンプレート残骸や投機的な設計がないか

#### research.md の役割

技術選定の根拠を残す調査メモです。代替案、採用理由、制約、比較結果を保持します。

#### research.md の読み方

- どの技術候補を比較したか確認する
- 採用理由が constitution や要求に整合しているかを見る
- plan.md の技術選定と同じ結論になっているか照合する

#### 読むときの着眼点

- 理由のない技術選定になっていないか
- ライセンス、保守性、運用性が抜けていないか

#### data-model.md の役割

エンティティ、属性、制約、関係を定義するデータ設計文書です。

#### data-model.md の読み方

- ユーザーストーリーに必要なエンティティが揃っているか確認する
- 各属性、制約、関係が要件に対応しているかを見る
- contracts や tasks に出てくる概念と名前が一致しているか照合する

#### 読むときの着眼点

- データの責務分割が自然か
- 機密情報や監査項目が必要なら表現されているか

#### contracts/ の役割

APIやイベント境界の定義です。外部との入出力、インターフェース、エラー応答を明文化します。

#### contracts/ の読み方

- まずユースケースに必要なエンドポイントやイベントが揃っているか確認する
- 次に入出力の型、必須項目、エラーケースを読む
- data-model.md や quickstart.md と整合しているかを見る

#### 読むときの着眼点

- 正常系だけでなく失敗系も定義されているか
- 認証、認可、バリデーションの扱いが抜けていないか

#### quickstart.md の役割

設計どおりに動作確認するための手順書です。実装後の検証観点も先に示します。

#### quickstart.md の読み方

- 手順を上から順に追って、何を検証できるか確認する
- MVP に相当する検証が先に置かれているかを見る
- 実装後にそのまま確認シナリオとして使えるか確認する

#### 読むときの着眼点

- 期待結果が具体的か
- 前提条件やセットアップ手順が抜けていないか

### /speckit.tasks が作るもの

#### tasks.md の役割

仕様と設計を、実際に着手できる作業単位へ分解した実装計画です。誰が何をどの順で進めるかを定義します。

#### tasks.md の読み方

- Phase 1 と Phase 2 を見て、共通基盤の整備内容を確認する
- 次に User Story ごとのフェーズを優先度順に読む
- その後、Dependencies と Parallel Opportunities を確認する
- 最後に MVP First や Implementation Strategy を確認する

#### 読むときの着眼点

- タスクが spec と plan を漏れなくカバーしているか
- ファイルパスが具体的か
- [P] が本当に並列実行可能か
- 各ストーリーが独立テスト可能か

### /speckit.analyze が出すもの

#### 分析レポートの役割

spec.md、plan.md、tasks.md の整合性を実装前に点検する read-only レポートです。どこに矛盾、曖昧さ、カバレッジ不足があるかを可視化します。

#### 分析レポートの読み方

- まず CRITICAL と HIGH を優先して読む
- 次に、どの成果物間のズレかを確認する
- 修正先が spec、plan、tasks のどれかを切り分ける

#### 読むときの着眼点

- constitution 違反がないか
- 要件に対応するタスクが抜けていないか
- 同じ概念の用語ぶれが起きていないか

### /speckit.implement が作るもの

#### 実装コードの役割

spec、plan、tasks の内容を実際の動作するシステムへ変換した成果物です。

#### 実装コードの読み方

- tasks.md の順に対応実装を追う
- contracts や data-model の内容がコードに反映されているか確認する
- spec の成功基準を満たす振る舞いになっているかを見る

#### テストコードの役割

実装が要求どおりに動くかを確認する検証コードです。単体、統合、契約、E2E が含まれる場合があります。

#### テストコードの読み方

- どの要求やタスクに対応したテストかを確認する
- 正常系だけでなく失敗系があるかを見る
- quickstart と contracts の期待結果を検証しているか確認する

#### 更新済み tasks.md の役割

進捗記録です。どこまで完了し、どこが未着手かを示します。

#### 更新済み tasks.md の読み方

- [X] と未完了項目を見て実装状態を把握する
- 完了済みタスクに対応するコードやテストが本当にあるか照合する
- フェーズ途中で止まっている場合は、どのブロッカーで止まっているか判断する
