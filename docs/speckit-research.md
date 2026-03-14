# Spec Kit 調査ノート

## 調査対象と前提

- 対象リポジトリ: `https://github.com/github/spec-kit`
- 調査時点の参照コミット: `4a3234496e9f58ce825cc5ca3a3a9c6fd45df222`
- Python パッケージ名: `specify-cli`
- 参照バージョン: `0.3.0` (`pyproject.toml`)
- 主に確認した範囲: `README.md`, `spec-driven.md`, `docs/`, `templates/`, `scripts/`, `src/specify_cli/`, `extensions/`, `presets/`, `tests/`

> 依頼文では `clarify` / `checklist` / `analyze` を「オプション」と呼んでいるが、upstream の実装上はこれらも `templates/commands/*.md` に置かれた通常コマンドである。ここでは「ワークフロー上の任意ステップ」という意味で「オプション」として整理する。

## 先に結論

- Spec Kit の中核は `specify` CLI ではなく、`specify init ...` によって各 AI エージェント向けに配布される `/speckit.*` コマンドテンプレート群である。
- `/speckit.constitution` から `/speckit.implement` までの実体は `templates/commands/*.md` にあり、ユーザー入力は Markdown 系エージェントでは `$ARGUMENTS`、TOML 系エージェントでは `{{args}}` として埋め込まれる。
- スラッシュコマンド層に「厳密なフラグ体系」はほぼ無く、基本は自然言語の追加指示を引数として後置する。厳密な CLI 引数は、その裏で呼ばれる `scripts/bash/*.sh` / `scripts/powershell/*.ps1` に定義されている。
- `clarify`、`checklist`、`analyze` は「任意ステップ」だが、テンプレート内容を見ると実運用ではかなり重要な品質ゲートとして設計されている。

## リポジトリ構造の全体像

| パス | 役割 | コマンド/オプションとの関係 |
| --- | --- | --- |
| `README.md` | リポジトリの総合入口。対応 AI エージェント、Quick Start、配布物の説明。 | `/speckit.*` の利用者向け説明の最上位ソース。 |
| `spec-driven.md` | Spec-Driven Development 全体の思想・方法論の深掘り。 | コマンド順序の設計思想を理解するのに有用。 |
| `docs/` | 公式のインストール/クイックスタート/ローカル開発ガイド。 | `specify init` と `/speckit.*` の使い方が文章化されている。 |
| `templates/commands/` | 各 `/speckit.*` コマンドの本体テンプレート。 | **最重要**。引数の扱い、補助スクリプト、生成物、処理手順がここにある。 |
| `templates/*.md` | `constitution.md`, `spec.md`, `plan.md`, `tasks.md`, `checklist` などの雛形。 | 各コマンドが最終的に生成/更新するファイル形式を決める。 |
| `scripts/bash/` | Bash 版の補助スクリプト群。 | `specify`, `plan`, `clarify`, `checklist`, `tasks`, `analyze`, `implement` が内部で利用。 |
| `scripts/powershell/` | PowerShell 版の補助スクリプト群。 | 上記 Bash 版の Windows / PowerShell 対応ミラー。 |
| `src/specify_cli/` | `specify` CLI の Python 実装。 | `init`、agent 生成、preset/extension 管理など、テンプレートを配る側の実装。 |
| `extensions/` | 拡張コマンド・フック機構のドキュメントとカタログ。 | `before_tasks`, `after_tasks`, `before_implement`, `after_implement` などのフックに直結。 |
| `presets/` | command/template override の仕組みとカタログ。 | 標準コマンドやテンプレートを差し替える拡張ポイント。 |
| `tests/` | agent 設定、frontmatter、preset/extension 周りの回帰テスト。 | コマンド配布・登録の整合性を担保。 |
| `AGENTS.md` | 新しい AI エージェント追加手順の設計書。 | `/speckit.*` が agent ごとにどう配布されるかの根拠。 |
| `pyproject.toml` | Python パッケージ設定。`specify` エントリポイントを定義。 | `specify init ...` や `specify extension ...` の入口。 |
| `.github/` | ワークフロー、PR テンプレート、CODEOWNERS。 | コマンド実行そのものではなく、リポジトリ運用面。 |
| `.devcontainer/`, `media/`, `newsletters/` | 開発環境、画像、ニュースレター。 | コマンド本体とは直接無関係。 |

## Spec Kit のコマンドはどう配布されるか

### 仕組みの要点

1. 利用者はまず `specify init <PROJECT_NAME>` を実行する。
2. `src/specify_cli/__init__.py` の agent 設定に従って、各 AI エージェント用ディレクトリ (`.github/agents/`, `.claude/commands/`, `.gemini/commands/` など) が作られる。
3. `templates/commands/*.md` が agent ごとの形式に変換されて配置される。
4. 以後はユーザーが AI エージェント上で `/speckit.specify` などを呼び出す。

### agent ごとの差分

- Markdown 系エージェント: 引数プレースホルダは `$ARGUMENTS`
- TOML 系エージェント (`gemini`, `tabnine`): 引数プレースホルダは `{{args}}`
- GitHub Copilot: `.github/agents/*.agent.md` に加えて `.github/prompts/*.prompt.md` も生成される

この変換ロジックは `src/specify_cli/agents.py` の `CommandRegistrar` に実装されている。

## コマンド/オプション関連ファイルの対応表

### 1. スラッシュコマンド本体

| コマンド | テンプレート | 内部で使うスクリプト | 主な生成物/更新物 | 補足 |
| --- | --- | --- | --- | --- |
| `constitution` | `templates/commands/constitution.md` | なし | `.specify/memory/constitution.md` | テンプレート穴埋めと version/date 更新が中心。 |
| `specify` | `templates/commands/specify.md` | `scripts/bash/create-new-feature.sh` / `scripts/powershell/create-new-feature.ps1` | `specs/[###-feature]/spec.md`, `checklists/requirements.md` | feature branch 作成と spec 初期化を担当。 |
| `clarify` | `templates/commands/clarify.md` | `scripts/bash/check-prerequisites.sh --json --paths-only` / PowerShell 版 | `spec.md` 更新 | 最大 5 問までの対話で仕様の曖昧さを埋める。 |
| `checklist` | `templates/commands/checklist.md` | `scripts/bash/check-prerequisites.sh --json` / PowerShell 版 | `checklists/*.md` | 要件文書の quality checklist を作る。 |
| `plan` | `templates/commands/plan.md` | `scripts/bash/setup-plan.sh --json`, `scripts/bash/update-agent-context.sh __AGENT__` / PowerShell 版 | `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` | Phase 0/1 設計成果物と agent context 更新。 |
| `tasks` | `templates/commands/tasks.md` | `scripts/bash/check-prerequisites.sh --json` / PowerShell 版 | `tasks.md` | user story 単位の task list 生成。 |
| `analyze` | `templates/commands/analyze.md` | `scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` / PowerShell 版 | read-only analysis report | ファイルは更新しない。 |
| `implement` | `templates/commands/implement.md` | `scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` / PowerShell 版 | 実装コード, テスト, ignore files, `tasks.md` 更新 | 実装前後 hook も参照する。 |

### 2. 生成物テンプレート

| ファイル | 役割 | 関連コマンド |
| --- | --- | --- |
| `templates/constitution-template.md` | constitution のひな形 | `constitution` |
| `templates/spec-template.md` | spec のひな形。`Input: "$ARGUMENTS"` や user stories/requirements/success criteria の枠を持つ | `specify` |
| `templates/plan-template.md` | plan のひな形。`research.md`, `data-model.md`, `contracts/`, `quickstart.md` への関係も明示 | `plan` |
| `templates/tasks-template.md` | story 単位の tasks 書式を定義 | `tasks` |
| `templates/checklist-template.md` | `CHK001` 形式の checklist 雛形 | `checklist` |
| `templates/agent-file-template.md` | plan から抽出した技術/構成を agent 向けガイドへ集約する雛形 | `plan` (`update-agent-context`) |
| `templates/vscode-settings.json` | VS Code 連携用の設定雛形 | 初期セットアップ周辺 |

### 3. 補助スクリプト

| ファイル | 役割 | 主な引数 |
| --- | --- | --- |
| `scripts/bash/common.sh` | repo root / current branch / specs path 解決、template resolution、branch validation 共通処理 | なし |
| `scripts/bash/create-new-feature.sh` | `specify` 用。feature branch と `spec.md` を初期化 | `--json`, `--short-name`, `--number`, `<feature_description>` |
| `scripts/bash/setup-plan.sh` | `plan` 用。feature directory 内に `plan.md` を配置して path を返す | `--json` |
| `scripts/bash/check-prerequisites.sh` | `clarify`, `checklist`, `tasks`, `analyze`, `implement` 共通の事前確認 | `--json`, `--require-tasks`, `--include-tasks`, `--paths-only` |
| `scripts/bash/update-agent-context.sh` | plan から抽出した技術コンテキストを agent 向けファイルへ反映 | `__AGENT__` |
| `scripts/powershell/*.ps1` | 上記 Bash スクリプトの PowerShell ミラー | `-Json`, `-RequireTasks`, `-IncludeTasks`, `-PathsOnly`, `-AgentType` など |

### 4. CLI / 拡張機構 / テスト

| ファイル | 役割 | コマンドとの関係 |
| --- | --- | --- |
| `pyproject.toml` | `specify = "specify_cli:main"` を定義 | `specify init`, `specify extension ...`, `specify preset ...` の入口 |
| `src/specify_cli/__init__.py` | CLI 本体、AI エージェント設定、初期化処理 | `specify init` 実行時に templates/commands を各 agent へ配布 |
| `src/specify_cli/agents.py` | command registrar。agent ごとのディレクトリ/書式/引数プレースホルダ変換を担当 | `$ARGUMENTS` → `{{args}}` 変換、Copilot 用 `.prompt.md` 生成 |
| `src/specify_cli/extensions.py` | extension manifest, registry, catalog, hook executor 実装 | `before_tasks`, `after_tasks`, `after_implement` など hook system |
| `src/specify_cli/presets.py` | preset の install/remove/resolve 実装 | core command/template の override stack を提供 |
| `extensions/README.md` | extension catalog と install 方法 | 任意コマンド追加や hook 配置の入口 |
| `extensions/EXTENSION-API-REFERENCE.md` | manifest schema, hook event, command file format | core commands がどの hook event を発火するかの技術資料 |
| `presets/README.md` | preset の優先順位付き override 仕様 | core command/template を fork せずに差し替える設計 |
| `tests/test_agent_config_consistency.py` ほか | agent 設定、frontmatter、extensions/presets を検証 | command 配布や hook 系の回帰保証 |

## 引数仕様の共通整理

### スラッシュコマンド層の基本ルール

- `constitution`, `plan`, `tasks`, `implement`, `clarify`, `checklist`, `analyze` は **引数なしでも実行可能**。
- `specify` だけは **自然言語による feature description が必須**。空ならエラーになる。
- 引数は厳密な位置引数や `--flag` ではなく、**コマンド名の後ろに続ける自然言語テキスト**。
- 入力テキストの用途はコマンドごとに異なり、`specify` では「何を作るか」、`plan` では「どう作るか」、`tasks` / `implement` では「どこを優先するか」「どこで止めるか」などを指定する。

### 重要な注意点

- `clarify`, `checklist`, `analyze` は「オプション」というより「任意実行のコマンド」。テンプレートファイル上も独立コマンドとして実装されている。
- 実装名は `implement` であり、`impliment` ではない。
- 形式的な CLI フラグが必要なのは内部補助スクリプトであり、通常の `/speckit.*` 使用者は自然言語引数だけを意識すればよい。

## コマンド: constitution / specify / plan / tasks / implement

### /speckit.constitution

- 引数の要否: 任意
- 引数の意味: constitution に入れたい原則、禁止事項、品質ゲート、改訂内容の自然言語指示
- 何を書くとよいか: コード品質、テスト方針、セキュリティ、性能、レビュー、変更管理、アクセシビリティなど
- 内部処理の要点: `.specify/memory/constitution.md` を更新し、SemVer 的に version を上げ、必要に応じて他テンプレートとの整合も確認する

#### 引数の具体例

1. `コード品質、テスト、自動化、アクセシビリティ、パフォーマンスを重視するプロジェクト原則を定義してください`
2. `テストファースト、API互換性維持、監査ログ、レスポンス性能、UI一貫性を必須原則として定義してください`
3. `Library-First、CLI互換、TDD必須、観測性、SemVer遵守を非交渉原則として追加してください`
4. `セキュリティ優先、個人情報最小化、依存追加最小化、性能予算厳守のガバナンスへ改訂してください`

### /speckit.specify

- 引数の要否: **必須**
- 引数の意味: 作りたい feature の自然言語説明
- 何を書くとよいか: 誰が使うか、何ができる必要があるか、スコープ外は何か、成功条件は何か
- 書かないほうがよいもの: 言語、フレームワーク、DB 製品、API 形式などの実装詳細
- 内部処理の要点: `create-new-feature.sh` が feature branch と `spec.md` を初期化し、command template が spec を埋め、`checklists/requirements.md` を生成する

#### 引数の具体例

1. `Build an application that helps a small team manage projects, tasks, and comments. Users can move tasks between columns and track progress visually. Login is out of scope for this initial phase.`
2. `Develop a photo organization application. Users can create albums grouped by date, reorder albums by drag and drop, and preview photos in a tile layout. Nested albums are out of scope.`
3. `Create a customer support dashboard where agents can claim tickets, add internal notes, change ticket status, and escalate unresolved issues. Phone integration is out of scope.`
4. `Build an internal approval workflow for expense requests. Employees can submit requests, managers can approve or reject them, and finance can export approved items. Reimbursement payment itself is out of scope.`

#### 参考: `create-new-feature.sh` の正式 CLI 引数

- `--json`: JSON で branch/path 情報を返す
- `--short-name <name>`: branch suffix を明示する
- `--number N`: feature number を手動指定する
- `<feature_description>`: 必須の feature 説明

### /speckit.plan

- 引数の要否: 任意
- 引数の意味: 技術スタック、制約、アーキテクチャ方針、性能/運用要件などの自然言語指示
- 何を書くとよいか: 使用言語、フレームワーク、ストレージ、API スタイル、テスト戦略、デプロイ制約、パフォーマンス目標
- 内部処理の要点: `setup-plan.sh --json` で path を確定し、`plan-template.md` を埋めながら `research.md`, `data-model.md`, `contracts/`, `quickstart.md` を生成し、最後に agent context を更新する

#### 引数の具体例

1. `Use FastAPI for backend services, PostgreSQL for storage, and React for the frontend. Prioritize simple deployment and a small number of dependencies.`
2. `The application uses Vite with minimal libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Metadata is stored in a local SQLite database.`
3. `We are going to generate this using .NET Aspire, Postgres as the database, and Blazor Server for the frontend. Provide REST APIs for projects, tasks, and notifications.`
4. `Use Next.js for the web app, Supabase for authentication and storage, and background jobs for asynchronous notifications. Optimize for low operational overhead.`

#### 参考: `setup-plan.sh` の正式 CLI 引数

- `--json`: `FEATURE_SPEC`, `IMPL_PLAN`, `SPECS_DIR`, `BRANCH` を JSON で返す

### /speckit.tasks

- 引数の要否: 任意
- 引数の意味: task 生成時の優先順位、MVP 範囲、テスト戦略、並列化方針などの自然言語指示
- 何を書くとよいか: TDD の有無、何人で並列実装するか、どの user story を先に切り出すか、どこを除外するか
- 内部処理の要点: `check-prerequisites.sh --json` で feature directory を見つけ、`spec.md` / `plan.md` / 補助成果物から `tasks.md` を story 単位で作る

#### 引数の具体例

1. `なし`（`/speckit.tasks` のみで実行）
2. `Please include test tasks using TDD approach. Write tests first before implementation.`
3. `Focus on User Story 1 only for the MVP. Skip User Stories 2 and 3 for now.`
4. `We have 3 developers. Please maximize parallel task opportunities.`
5. `Generate tasks that keep the API contract work separate from the UI work.`

### /speckit.implement

- 引数の要否: 任意
- 引数の意味: 実装フェーズの実行範囲、停止条件、並列実行方針、MVP 制約などの自然言語指示
- 何を書くとよいか: どの Phase まで実行するか、どの User Story に限定するか、`[P]` タスクをどう扱うか、検証後に止めるか
- 内部処理の要点: `check-prerequisites.sh --json --require-tasks --include-tasks` で必要ファイルを確認し、checklist 完了判定・hook 実行・ignore file 整備・task 実行・`tasks.md` の完了更新まで行う

#### 引数の具体例

1. `なし`（`/speckit.implement` のみで実行）
2. `Only execute Phase 1 tasks and stop.`
3. `MVP mode: Only implement User Story 1. Stop after validation.`
4. `Run all [P] tasks in Phase 2 in parallel before proceeding to Phase 3.`
5. `Implement only the API and test tasks first. Leave the frontend tasks unchecked.`

## オプション扱いの任意ステップ: clarify / checklist / analyze

### /speckit.clarify

- 引数の要否: 任意
- 引数の意味: どの曖昧さに重点を置くか、または追加で詰めたい business rule の自然言語指示
- 何を書くとよいか: security/performance、ロール権限、comment behavior、failure handling、data retention など
- 引数なしの挙動: 現在の `spec.md` を自動スキャンして、高影響の曖昧点から最大 5 問まで対話する
- 内部処理の要点: `check-prerequisites.sh --json --paths-only` で `FEATURE_SPEC` の path を特定し、spec を直接更新する

#### 引数の具体例

1. `なし`（`/speckit.clarify` のみで実行）
2. `Focus on security and performance requirements.`
3. `I want to clarify task card details, comment behavior, and project switching flow.`
4. `Clarify data retention, audit logging, and failure notification behavior.`
5. `Focus on user roles, approval limits, and edge cases for duplicate submissions.`

### /speckit.checklist

- 引数の要否: 任意
- 引数の意味: checklist の対象ドメイン、深さ、レビュー観点、must-have 観点の自然言語指示
- 何を書くとよいか: UX / API / security / performance / accessibility / contracts completeness など
- 引数なしの挙動: 現在の feature context から代表的な checklist を生成する
- 内部処理の要点: `check-prerequisites.sh --json` で feature directory を特定し、`spec.md` / `plan.md` / `tasks.md` を必要な範囲だけ読みながら `checklists/<domain>.md` を作る

#### 引数の具体例

1. `なし`（`/speckit.checklist` のみで実行）
2. `Focus on UX requirements quality`
3. `Create a checklist for the following domain: security`
4. `Security checklist. Must include authentication requirements, data protection, and breach response requirements.`
5. `API contracts completeness and consistency`

### /speckit.analyze

- 引数の要否: 任意
- 引数の意味: どの観点の整合性を特に重視して read-only 監査するかの自然言語指示
- 何を書くとよいか: security/performance、NFR coverage、terminology drift、task coverage など
- 引数なしの挙動: `spec.md`, `plan.md`, `tasks.md` を横断して高シグナルな整合性問題を抽出する
- 内部処理の要点: `check-prerequisites.sh --json --require-tasks --include-tasks` で artifact を特定し、**一切ファイルを更新せず** Markdown report を返す

#### 引数の具体例

1. `なし`（`/speckit.analyze` のみで実行）
2. `Focus on security and performance requirements.`
3. `Check if all non-functional requirements have corresponding tasks.`
4. `Review terminology drift between spec, plan, and tasks.`
5. `Audit whether every API contract is covered by at least one task and one quickstart step.`

## 内部スクリプトの正式 CLI 引数まとめ

### `scripts/bash/create-new-feature.sh`

- 用途: `specify` コマンドの branch / `spec.md` 初期化
- 主要引数:
  - `--json`
  - `--short-name <name>`
  - `--number N`
  - `<feature_description>`
- 使用例:
  - `scripts/bash/create-new-feature.sh --json --short-name "user-auth" "Add user authentication"`
  - `scripts/bash/create-new-feature.sh --json --number 5 "Implement OAuth2 integration for API"`
  - `scripts/bash/create-new-feature.sh "Build analytics dashboard"`

### `scripts/bash/setup-plan.sh`

- 用途: `plan` コマンドの path 解決と `plan.md` 配置
- 主要引数:
  - `--json`
- 使用例:
  - `scripts/bash/setup-plan.sh --json`

### `scripts/bash/check-prerequisites.sh`

- 用途: `clarify`, `checklist`, `tasks`, `analyze`, `implement` の共通 prerequisite チェック
- 主要引数:
  - `--json`
  - `--require-tasks`
  - `--include-tasks`
  - `--paths-only`
- 使用例:
  - `scripts/bash/check-prerequisites.sh --json`
  - `scripts/bash/check-prerequisites.sh --json --paths-only`
  - `scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks`

### `scripts/bash/update-agent-context.sh`

- 用途: `plan` 実行後に agent 向け技術コンテキストを更新
- 主要引数:
  - `__AGENT__`（テンプレート置換で agent type が入る）
- 使用例:
  - `scripts/bash/update-agent-context.sh copilot`
  - `scripts/bash/update-agent-context.sh claude`

## 調査から見えた実務上の重要ポイント

1. Spec Kit の「コマンド」は実質的には AI エージェントに配る prompt templates であり、通常の CLI subcommand とは責務が違う。
2. `/speckit.specify` だけは feature description が必須だが、それ以外は「引数なし + 現在の artifact を読む」でも動く設計が多い。
3. `clarify`, `checklist`, `analyze` は optional とされる一方、テンプレートの中ではかなり細かい品質制御が入っており、実運用では省略しにくい。
4. extension / preset で core command を上書きできるため、upstream の説明は「標準実装」として理解するのが正しい。
5. `src/specify_cli/agents.py` を見ると、Copilot/Gemini/Claude など各 agent に合わせて command file format と引数プレースホルダが変換される。このため docs では「自然言語を後ろに足す」という説明が最も本質的で、agent 固有書式の差は補足扱いでよい。

## この調査をローカルドキュメントへ反映する方針

- `specify` は「自然言語の feature description が必須」であることを明示する
- `constitution`, `plan`, `tasks`, `implement`, `clarify`, `checklist`, `analyze` は「引数なしでも実行可能 / 追加指示を渡すと挙動を絞れる」ことを明示する
- 各ドキュメントには「引数の具体例」を 3〜5 件ずつ揃え、単なる full command 例だけでなく「どんな自然言語を載せるべきか」が読み取れるようにする
- Starlight 版には research コンテンツとして同等情報を移植し、トップページとサイドバーから辿れるようにする
