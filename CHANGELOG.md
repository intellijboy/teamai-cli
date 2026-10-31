# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.22.0-beta.12](https://github.com/Tencent/teamai-cli/compare/v0.22.0...v0.22.0-beta.12) (2026-10-31)


### Features

* **#375:** multi-project P1+P2 — project dimension, learnings isolation ([91df7f0](https://github.com/Tencent/teamai-cli/commit/91df7f0727d6c487fcd6340265a52f13baabf7e9)), closes [#375](https://github.com/Tencent/teamai-cli/issues/375)
* **#375:** multi-project P3 — member roster + projects commands + push --project ([f11e2d1](https://github.com/Tencent/teamai-cli/commit/f11e2d17a3f5eefbc70ad60ce1c107d07d34cdf8)), closes [#375](https://github.com/Tencent/teamai-cli/issues/375)
* a workspace delivers what the repos inside it select ([#1107](https://github.com/Tencent/teamai-cli/issues/1107)) ([304da7c](https://github.com/Tencent/teamai-cli/commit/304da7c7c41629ca895fae0c5c14cca11394511f))
* add first-class Qoder support ([a8db627](https://github.com/Tencent/teamai-cli/commit/a8db627cf6e4e9825bc071876de191a6922d66e2))
* add first-class ZCode support ([8b6c870](https://github.com/Tencent/teamai-cli/commit/8b6c8709293fed5f3329961c894c4c8144976649))
* add GitHub Copilot adapter ([#601](https://github.com/Tencent/teamai-cli/issues/601)) ([761f179](https://github.com/Tencent/teamai-cli/commit/761f17997179d35e2c59fcf4b68fcd7badb3672a))
* add JoyCode agent support ([f2941ab](https://github.com/Tencent/teamai-cli/commit/f2941ab676caec901e22a512c39e011497b47885))
* add privacy-safe Copilot telemetry ([#666](https://github.com/Tencent/teamai-cli/issues/666)) ([a7770e3](https://github.com/Tencent/teamai-cli/commit/a7770e3b9512c242493bd12d3ddacbc8ecde5fae))
* add teamai.yaml language for English agent texts ([#1014](https://github.com/Tencent/teamai-cli/issues/1014)) ([#1042](https://github.com/Tencent/teamai-cli/issues/1042)) ([18494c3](https://github.com/Tencent/teamai-cli/commit/18494c326ebef760fef3eeb5d183e8b838841284))
* **agents:** first-class Kiro adapter — skills, steering rules, agents, and MCP sync ([#542](https://github.com/Tencent/teamai-cli/issues/542)) ([556293e](https://github.com/Tencent/teamai-cli/commit/556293ee42730bf56aecb4d0e8efda2dd5a5348a)), closes [#500](https://github.com/Tencent/teamai-cli/issues/500)
* **agents:** first-class Trae and Trae CN support (for [#904](https://github.com/Tencent/teamai-cli/issues/904)) ([#1002](https://github.com/Tencent/teamai-cli/issues/1002)) ([2cbf556](https://github.com/Tencent/teamai-cli/commit/2cbf55609467e8ff2cf730c98ad63b7bf691679c)), closes [#946](https://github.com/Tencent/teamai-cli/issues/946)
* **agents:** model aliases so one agent works in every tool ([#830](https://github.com/Tencent/teamai-cli/issues/830)) ([#924](https://github.com/Tencent/teamai-cli/issues/924)) ([260f194](https://github.com/Tencent/teamai-cli/commit/260f1945e8199d3be6b725acbc22a56725f297f1))
* **agents:** scope team agents by role and project namespace ([#577](https://github.com/Tencent/teamai-cli/issues/577)) ([cccbe1d](https://github.com/Tencent/teamai-cli/commit/cccbe1d5aa2719a64db7120f598b54114fe2eeba)), closes [#563](https://github.com/Tencent/teamai-cli/issues/563) [#563](https://github.com/Tencent/teamai-cli/issues/563) [#563](https://github.com/Tencent/teamai-cli/issues/563) [#563](https://github.com/Tencent/teamai-cli/issues/563) [#563](https://github.com/Tencent/teamai-cli/issues/563)
* **agents:** support Qoder CN via its .qoder-cn user directory ([#695](https://github.com/Tencent/teamai-cli/issues/695)) ([1e2c029](https://github.com/Tencent/teamai-cli/commit/1e2c02946672473230568506df55ca2aeeee219d))
* **agents:** support WorkBuddy subagent distribution ([#826](https://github.com/Tencent/teamai-cli/issues/826)) ([7d16175](https://github.com/Tencent/teamai-cli/commit/7d16175a7735419fa0e8b764f811e1705926520d))
* **cnb:** guide users to the web UI when the CLI token can't create an org or repo ([#536](https://github.com/Tencent/teamai-cli/issues/536)) ([b5dc534](https://github.com/Tencent/teamai-cli/commit/b5dc53469d2fb5eb5c6f94065e5185d7b70275e4))
* **code-knowledge:** add Swift support to the AST and heuristic tracks ([#842](https://github.com/Tencent/teamai-cli/issues/842)) ([ba04f18](https://github.com/Tencent/teamai-cli/commit/ba04f1820507b612121861123b0849196e0cb9c6)), closes [#712](https://github.com/Tencent/teamai-cli/issues/712)
* **codebase:** expose wiki deep-enrich ([2ddb546](https://github.com/Tencent/teamai-cli/commit/2ddb546029ab086d6200f5ccc375f409374a2aa9))
* **codebase:** expose wiki reconciliation ([8bb0548](https://github.com/Tencent/teamai-cli/commit/8bb054866ca4fd3a5cfe513d183e3d01f923b322))
* **commands:** sync team slash commands to supported AI tools ([f082b4c](https://github.com/Tencent/teamai-cli/commit/f082b4c22db4b37b0c8fac6a7bd5b56706148e43))
* **config:** honor a relocated Claude Code config dir via toolRoots ([#728](https://github.com/Tencent/teamai-cli/issues/728)) ([55b71ef](https://github.com/Tencent/teamai-cli/commit/55b71efb69baacf2bc34e52fbc0dbff5bdd70fca)), closes [#725](https://github.com/Tencent/teamai-cli/issues/725)
* **contribute:** add sharing.contributeHint.enabled to opt out of the share-learnings nudge ([5ff09d6](https://github.com/Tencent/teamai-cli/commit/5ff09d6ad55651c5048c382f15711549f0e28434))
* **contribute:** make the pending queue the write path, and say when it is stuck ([#621](https://github.com/Tencent/teamai-cli/issues/621)) ([1f79b2d](https://github.com/Tencent/teamai-cli/commit/1f79b2d45eca7c969b449ada3f9e282c03325adb)), closes [#615](https://github.com/Tencent/teamai-cli/issues/615)
* **contribute:** recognize Japanese course-correction prompts ([4670f1c](https://github.com/Tencent/teamai-cli/commit/4670f1ce3d2ea92b79824f3e8ef7fef9e71f58d2))
* **contribute:** select an active learnings namespace ([#916](https://github.com/Tencent/teamai-cli/issues/916)) ([#979](https://github.com/Tencent/teamai-cli/issues/979)) ([f287dcb](https://github.com/Tencent/teamai-cli/commit/f287dcb1a3fa247206a5dad9766b5d6ef14e3106))
* **copilot:** deliver instructions and context ([#627](https://github.com/Tencent/teamai-cli/issues/627)) ([da174c9](https://github.com/Tencent/teamai-cli/commit/da174c91c8a72e3efd594cdcbf9fe69341660b88))
* **copilot:** sync custom agents ([#629](https://github.com/Tencent/teamai-cli/issues/629)) ([c60ade9](https://github.com/Tencent/teamai-cli/commit/c60ade9cbdf407d445ed6ecdf0191b671efdc2c3))
* **copilot:** sync MCP servers ([#628](https://github.com/Tencent/teamai-cli/issues/628)) ([e10bbcb](https://github.com/Tencent/teamai-cli/commit/e10bbcbb23e3040377366c91f282139ae7b2ca18))
* **dashboard:** add a Workflow Runs page with HITL answers ([#1088](https://github.com/Tencent/teamai-cli/issues/1088)) ([#1225](https://github.com/Tencent/teamai-cli/issues/1225)) ([8003ec7](https://github.com/Tencent/teamai-cli/commit/8003ec796283cf03b3c40e85417d5b8fc0ea713d))
* **dashboard:** Distribution page for role and project selections ([#1028](https://github.com/Tencent/teamai-cli/issues/1028)) ([#1171](https://github.com/Tencent/teamai-cli/issues/1171)) ([cf03ed3](https://github.com/Tencent/teamai-cli/commit/cf03ed357408f5554253749c420b8b62d9ee66c2))
* **dashboard:** distribution read, preview, and selection APIs ([#1124](https://github.com/Tencent/teamai-cli/issues/1124)) ([#1154](https://github.com/Tencent/teamai-cli/issues/1154)) ([ca88597](https://github.com/Tencent/teamai-cli/commit/ca885977fe5e2f1eb82906e4eca1233f5aeb6a38)), closes [#1028](https://github.com/Tencent/teamai-cli/issues/1028) [#913](https://github.com/Tencent/teamai-cli/issues/913) [#1028](https://github.com/Tencent/teamai-cli/issues/1028)
* **dashboard:** list rule delivery state on a Resources page ([#1028](https://github.com/Tencent/teamai-cli/issues/1028)) ([#1113](https://github.com/Tencent/teamai-cli/issues/1113)) ([bcdb39c](https://github.com/Tencent/teamai-cli/commit/bcdb39c7d8c70a16268c9ba49fb2ab042cd39413))
* **dashboard:** skills inventory, detail, and workspace exclusions on the Resources page ([#1123](https://github.com/Tencent/teamai-cli/issues/1123)) ([#1143](https://github.com/Tencent/teamai-cli/issues/1143)) ([9f0a57c](https://github.com/Tencent/teamai-cli/commit/9f0a57c5c3f5fe1eed6f172d5b03c37ca2ec7f96)), closes [#1113](https://github.com/Tencent/teamai-cli/issues/1113) [#1107](https://github.com/Tencent/teamai-cli/issues/1107) [#707](https://github.com/Tencent/teamai-cli/issues/707)
* **dashboard:** unify workspace views, themes and localization ([#604](https://github.com/Tencent/teamai-cli/issues/604)) ([1ea599a](https://github.com/Tencent/teamai-cli/commit/1ea599adf2caf5da430fa8126b665c407aa25d00)), closes [#1](https://github.com/Tencent/teamai-cli/issues/1) [#3](https://github.com/Tencent/teamai-cli/issues/3) [#4](https://github.com/Tencent/teamai-cli/issues/4) [#5](https://github.com/Tencent/teamai-cli/issues/5) [#6](https://github.com/Tencent/teamai-cli/issues/6)
* **data-layout:** auto-migrate a legacy .teamai into the partition ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-3) ([c04a320](https://github.com/Tencent/teamai-cli/commit/c04a32049084370df81965b083b73a43a543d938))
* **data-layout:** functionize module-load path constants + add `status --all` ([#374](https://github.com/Tencent/teamai-cli/issues/374) P3) ([1bb451d](https://github.com/Tencent/teamai-cli/commit/1bb451d5620e3d6e3970c91c21b73bbc18cef2eb))
* **data-layout:** route managed-mcp.json + project resource cache to the partition ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-2C) ([cb4b4d0](https://github.com/Tencent/teamai-cli/commit/cb4b4d0d6d2531755e0b542844aaf6e772ba5e69)), closes [#406](https://github.com/Tencent/teamai-cli/issues/406)
* **data-layout:** route new project installs to ~/.teamai/projects/<slug>/ + .sync-lock + status ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-2B) ([66e6030](https://github.com/Tencent/teamai-cli/commit/66e60307a48f11c05ab0aa323d2d588f10a4d2d5))
* **data-layout:** slim self mode — relocate A1 machine data to the partition ([#374](https://github.com/Tencent/teamai-cli/issues/374) P2) ([b5435b3](https://github.com/Tencent/teamai-cli/commit/b5435b38c037bfda3169304b6ac90bd203c637f9))
* **doctor:** export the check registry and add --json ([#599](https://github.com/Tencent/teamai-cli/issues/599)) ([0982976](https://github.com/Tencent/teamai-cli/commit/0982976baf6b3a09105f559c368bb8d3f422649e)), closes [#569](https://github.com/Tencent/teamai-cli/issues/569)
* **doctor:** extend the delivery check to rules, agents, MCP and env ([#669](https://github.com/Tencent/teamai-cli/issues/669)) ([52525a9](https://github.com/Tencent/teamai-cli/commit/52525a9402ef792deb8c5cc3ceb5414820f1f361)), closes [#624](https://github.com/Tencent/teamai-cli/issues/624) [#662](https://github.com/Tencent/teamai-cli/issues/662) [#662](https://github.com/Tencent/teamai-cli/issues/662) [#661](https://github.com/Tencent/teamai-cli/issues/661) [#661](https://github.com/Tencent/teamai-cli/issues/661) [#662](https://github.com/Tencent/teamai-cli/issues/662) [#662](https://github.com/Tencent/teamai-cli/issues/662)
* **doctor:** run the checks after a pull, and check what actually landed ([#625](https://github.com/Tencent/teamai-cli/issues/625)) ([701e472](https://github.com/Tencent/teamai-cli/commit/701e472b0b9fae291bf5682c83fcf5854a10cc04)), closes [#574](https://github.com/Tencent/teamai-cli/issues/574) [#525](https://github.com/Tencent/teamai-cli/issues/525) [#342](https://github.com/Tencent/teamai-cli/issues/342) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#574](https://github.com/Tencent/teamai-cli/issues/574) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#574](https://github.com/Tencent/teamai-cli/issues/574) [#525](https://github.com/Tencent/teamai-cli/issues/525) [#342](https://github.com/Tencent/teamai-cli/issues/342) [#372](https://github.com/Tencent/teamai-cli/issues/372) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#372](https://github.com/Tencent/teamai-cli/issues/372) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#621](https://github.com/Tencent/teamai-cli/issues/621) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598)
* **doctor:** surface toolPaths keys a team entry drops ([#1115](https://github.com/Tencent/teamai-cli/issues/1115)) ([#1274](https://github.com/Tencent/teamai-cli/issues/1274)) ([0d57ac4](https://github.com/Tencent/teamai-cli/commit/0d57ac469708a408dfd032176240fd7a10d6d4dc))
* **env:** deliver env vars to the Windows user environment ([63c98e0](https://github.com/Tencent/teamai-cli/commit/63c98e02dafab12da5f73e5fca7b14ca12eab880))
* **env:** team-declared secrets with member-local values ([#875](https://github.com/Tencent/teamai-cli/issues/875)) ([#880](https://github.com/Tencent/teamai-cli/issues/880)) ([7c929a9](https://github.com/Tencent/teamai-cli/commit/7c929a996b7a14bf58a481e578662a1e27e0abac)), closes [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#818](https://github.com/Tencent/teamai-cli/issues/818) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#866](https://github.com/Tencent/teamai-cli/issues/866) [#866](https://github.com/Tencent/teamai-cli/issues/866) [pre-#546](https://github.com/Tencent/pre-/issues/546) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#866](https://github.com/Tencent/teamai-cli/issues/866) [#890](https://github.com/Tencent/teamai-cli/issues/890) [#890](https://github.com/Tencent/teamai-cli/issues/890) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#894](https://github.com/Tencent/teamai-cli/issues/894) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#878](https://github.com/Tencent/teamai-cli/issues/878) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#879](https://github.com/Tencent/teamai-cli/issues/879) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#882](https://github.com/Tencent/teamai-cli/issues/882)
* **gitlab:** support custom API prefix for gateway-proxied instances ([290e904](https://github.com/Tencent/teamai-cli/commit/290e90406faed95639bc2a0ea6861d81e313e0fc))
* **git:** route independent-clone reports onto teamai-reports ([#489](https://github.com/Tencent/teamai-cli/issues/489)) ([9ea3a28](https://github.com/Tencent/teamai-cli/commit/9ea3a2877f517d243ef3cf1b20462a529f8eaa78)), closes [#484](https://github.com/Tencent/teamai-cli/issues/484)
* **hooks:** add a config switch for the SessionStart MR hint ([#1103](https://github.com/Tencent/teamai-cli/issues/1103)) ([#1117](https://github.com/Tencent/teamai-cli/issues/1117)) ([7ba8bcc](https://github.com/Tencent/teamai-cli/commit/7ba8bcc374cfa11e85da54cb75c572f54c687fab))
* **hooks:** add DeepSeek Harness hook bridge ([#689](https://github.com/Tencent/teamai-cli/issues/689)) ([48b3dcb](https://github.com/Tencent/teamai-cli/commit/48b3dcb953957173f2d53198f1410ada8ba2e7c2)), closes [#623](https://github.com/Tencent/teamai-cli/issues/623)
* **hooks:** deliver native hook artifacts from hooks/native/ ([b19a25e](https://github.com/Tencent/teamai-cli/commit/b19a25e28fb1b6c87f4876835cc00ec46b0913ff))
* **hooks:** deliver team hooks to OpenCode, honor install scope, embed CLI invocation ([b6d7555](https://github.com/Tencent/teamai-cli/commit/b6d755508d3eaed545c7b50b526f71d56a628a1d))
* **hooks:** log per-handler dispatch timings ([#998](https://github.com/Tencent/teamai-cli/issues/998)) ([cb26495](https://github.com/Tencent/teamai-cli/commit/cb26495eb398461e6aed42bccafe924f86f3edec))
* **import:** accept several MR URLs in one --from-mr run ([#1122](https://github.com/Tencent/teamai-cli/issues/1122)) ([6147818](https://github.com/Tencent/teamai-cli/commit/6147818345199f2057af2ce9b75de259b663bc63)), closes [#1104](https://github.com/Tencent/teamai-cli/issues/1104)
* **import:** expose --max-files and warn on truncated code collection ([#1196](https://github.com/Tencent/teamai-cli/issues/1196)) ([8ab2027](https://github.com/Tencent/teamai-cli/commit/8ab2027611f3854bff60b7969ecdb0e7e482587a)), closes [#1194](https://github.com/Tencent/teamai-cli/issues/1194)
* **import:** read the MR's review threads into the --from-mr extraction ([#1187](https://github.com/Tencent/teamai-cli/issues/1187)) ([#1190](https://github.com/Tencent/teamai-cli/issues/1190)) ([58706fe](https://github.com/Tencent/teamai-cli/commit/58706fe251ec73e203a3a2802266f411a513a5d9))
* **init,pull,hooks:** manage project tool-dir .gitignore and expand ${VAR} in team hooks ([b8e889d](https://github.com/Tencent/teamai-cli/commit/b8e889d211e370836e3536da96be4d690e5cfdb7))
* **init:** activate every project with --project all ([#518](https://github.com/Tencent/teamai-cli/issues/518)) ([996a818](https://github.com/Tencent/teamai-cli/commit/996a818be3b5abd1ff14b08bf647e3a0d5a376fd))
* **init:** build a CodeGraph index from `teamai init` ([fca47a0](https://github.com/Tencent/teamai-cli/commit/fca47a08f964095cadd8986a55418bf1382fa7f7))
* **init:** let a member choose the git provider with --provider ([#789](https://github.com/Tencent/teamai-cli/issues/789)) ([#844](https://github.com/Tencent/teamai-cli/issues/844)) ([46ffa96](https://github.com/Tencent/teamai-cli/commit/46ffa96f2ccec124648342f44101ccb5f00f71da))
* **init:** prompt for optional projects during interactive setup ([#757](https://github.com/Tencent/teamai-cli/issues/757)) ([#910](https://github.com/Tencent/teamai-cli/issues/910)) ([7bb0652](https://github.com/Tencent/teamai-cli/commit/7bb06525efecc071275b817415f626123e43ad01))
* keep the resources teamai delivers in project scope out of git ([#915](https://github.com/Tencent/teamai-cli/issues/915)) ([#1000](https://github.com/Tencent/teamai-cli/issues/1000)) ([b69f888](https://github.com/Tencent/teamai-cli/commit/b69f88898bb4c369988e02b336db8140c750bde8)), closes [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#886](https://github.com/Tencent/teamai-cli/issues/886) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#995](https://github.com/Tencent/teamai-cli/issues/995) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993) [#993](https://github.com/Tencent/teamai-cli/issues/993)
* **learnings:** write learnings to the teamai-learnings branch ([#616](https://github.com/Tencent/teamai-cli/issues/616)) ([d4c57a0](https://github.com/Tencent/teamai-cli/commit/d4c57a0961b9815a9815418512ee18bbcc24401f)), closes [#485](https://github.com/Tencent/teamai-cli/issues/485) [#485](https://github.com/Tencent/teamai-cli/issues/485) [#458](https://github.com/Tencent/teamai-cli/issues/458) [#485](https://github.com/Tencent/teamai-cli/issues/485) [#486](https://github.com/Tencent/teamai-cli/issues/486) [#486](https://github.com/Tencent/teamai-cli/issues/486) [#615](https://github.com/Tencent/teamai-cli/issues/615) [#485](https://github.com/Tencent/teamai-cli/issues/485) [#485](https://github.com/Tencent/teamai-cli/issues/485)
* **local-agent:** apply WorkBuddy model configs from ClawPro ([470d7c4](https://github.com/Tencent/teamai-cli/commit/470d7c46bd4182a8c166a4d7d8c3003304350704))
* **local-agent:** report machine_id in report and sync payloads ([#1235](https://github.com/Tencent/teamai-cli/issues/1235)) ([8487c34](https://github.com/Tencent/teamai-cli/commit/8487c34d1013f52a232199492a489fea63217de2))
* **local-agent:** sync and report ClawPro model configs ([c173339](https://github.com/Tencent/teamai-cli/commit/c173339e652b3200d81c60969093bc613a65fe0e)), closes [#294](https://github.com/Tencent/teamai-cli/issues/294)
* **locate:** resolve where every tool takes skills, and record homes a variable moves ([#1221](https://github.com/Tencent/teamai-cli/issues/1221)) ([b9e03a9](https://github.com/Tencent/teamai-cli/commit/b9e03a9373e178a2cad93d62cb9361cc99ef7c4d))
* **locate:** rules, blocks, agents, and MCP go through locate ([#1221](https://github.com/Tencent/teamai-cli/issues/1221)) ([#1265](https://github.com/Tencent/teamai-cli/issues/1265)) ([6467c3d](https://github.com/Tencent/teamai-cli/commit/6467c3d752d495ec64a50d03aff78099412ce8bb)), closes [#915](https://github.com/Tencent/teamai-cli/issues/915) [#1223](https://github.com/Tencent/teamai-cli/issues/1223) [#628](https://github.com/Tencent/teamai-cli/issues/628) [#938](https://github.com/Tencent/teamai-cli/issues/938) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#945](https://github.com/Tencent/teamai-cli/issues/945) [#945](https://github.com/Tencent/teamai-cli/issues/945)
* **mcp,hooks:** scope team MCP servers and hooks by role ([#578](https://github.com/Tencent/teamai-cli/issues/578)) ([f7c7bdd](https://github.com/Tencent/teamai-cli/commit/f7c7bdd58c9fc969b2f1cba611627a1ae2dfc87b)), closes [#563](https://github.com/Tencent/teamai-cli/issues/563) [#563](https://github.com/Tencent/teamai-cli/issues/563) [#563](https://github.com/Tencent/teamai-cli/issues/563) [#563](https://github.com/Tencent/teamai-cli/issues/563)
* **mcp:** add Pi Coding Agent MCP support ([#926](https://github.com/Tencent/teamai-cli/issues/926)) ([fe5c3c5](https://github.com/Tencent/teamai-cli/commit/fe5c3c5a2b57218a5503607846dc6e854b301a80))
* **mcp:** keep project MCP configs with resolved tokens out of git ([#882](https://github.com/Tencent/teamai-cli/issues/882)) ([#886](https://github.com/Tencent/teamai-cli/issues/886)) ([fb9f5a2](https://github.com/Tencent/teamai-cli/commit/fb9f5a2c28997cc5ed3ad9e3049faa84cf23088b)), closes [#880](https://github.com/Tencent/teamai-cli/issues/880) [#880](https://github.com/Tencent/teamai-cli/issues/880) [#878](https://github.com/Tencent/teamai-cli/issues/878) [#880](https://github.com/Tencent/teamai-cli/issues/880) [#880](https://github.com/Tencent/teamai-cli/issues/880)
* **metrics:** 增加可信的会话与成本趋势 ([711950a](https://github.com/Tencent/teamai-cli/commit/711950a3e03a0e1d6f4867dc3713d5f832154852))
* **model:** add 'team model set-default' to configure the default model ([3aae6e5](https://github.com/Tencent/teamai-cli/commit/3aae6e5e337d978a747de927410df1ac3d1e6ca1))
* **model:** add ANTHROPIC_DEFAULT_FABLE_MODEL to claude template ([0f97dc0](https://github.com/Tencent/teamai-cli/commit/0f97dc0c7cfa83425bed37a287fc460d81f5a6dc))
* **model:** add Chinese display names and source providers from JSON ([92eeacc](https://github.com/Tencent/teamai-cli/commit/92eeaccc196d52ffe7a7930956c556668843ad2a))
* **model:** add teamai model inject / model list ([58143fb](https://github.com/Tencent/teamai-cli/commit/58143fba58ce2b6c917f3319b5511d878e008429))
* **model:** render thinking-disable options for disablable models ([1eb50ca](https://github.com/Tencent/teamai-cli/commit/1eb50caf2f9332ae8256192312c35e3e691b62e8))
* **models:** merge show into list with an optional profile ([#782](https://github.com/Tencent/teamai-cli/issues/782)) ([57afe76](https://github.com/Tencent/teamai-cli/commit/57afe768105b9be534f4a69867850bc1d11828a5))
* **models:** pick a profile interactively when switch is given none ([#919](https://github.com/Tencent/teamai-cli/issues/919)) ([#922](https://github.com/Tencent/teamai-cli/issues/922)) ([bc800ef](https://github.com/Tencent/teamai-cli/commit/bc800ef80d5f25e844cf738da9899937e331e8ec))
* **models:** share gateway model profiles across agents ([#675](https://github.com/Tencent/teamai-cli/issues/675)) ([da13c11](https://github.com/Tencent/teamai-cli/commit/da13c1119bee662b1706dd136989139bbf81fa1d))
* **models:** support OMP as a model agent ([#990](https://github.com/Tencent/teamai-cli/issues/990)) ([1a15a73](https://github.com/Tencent/teamai-cli/commit/1a15a734b5f0e670264b4722435ac4131d72600a))
* **models:** support Pi Coding Agent ([#918](https://github.com/Tencent/teamai-cli/issues/918)) ([a8ab138](https://github.com/Tencent/teamai-cli/commit/a8ab138b0a7b32d7474c8b0d11947a7589a928a0))
* **model:** support array-shaped provider catalog with per-model tiers ([2b4f068](https://github.com/Tencent/teamai-cli/commit/2b4f068c8a2a654e2b0ba86db959d0517b7a48b5))
* **model:** support openclaw, hermes, qoder and zcode ([324a565](https://github.com/Tencent/teamai-cli/commit/324a5657c554c836e12252c46c5115328a300bd5))
* **muse:** support Muse Code across skills, rules, hooks, MCP, agents, models and sessions ([#1067](https://github.com/Tencent/teamai-cli/issues/1067)) ([376a216](https://github.com/Tencent/teamai-cli/commit/376a21647c375e498978b50e9027a8598dc4092f))
* **omp:** add first-class Oh My Pi (OMP) resource sync ([#643](https://github.com/Tencent/teamai-cli/issues/643)) ([97a0277](https://github.com/Tencent/teamai-cli/commit/97a02777ac4f09e43f98dc55a142e2d664ddb36c))
* **omp:** run lifecycle hooks via the OMP extension runner ([#645](https://github.com/Tencent/teamai-cli/issues/645)) ([3d5f490](https://github.com/Tencent/teamai-cli/commit/3d5f490daff32bf54687a7962b15bf7e6a32aed7)), closes [#550](https://github.com/Tencent/teamai-cli/issues/550) [#643](https://github.com/Tencent/teamai-cli/issues/643)
* one namespace model for every resource type ([#707](https://github.com/Tencent/teamai-cli/issues/707)) ([#816](https://github.com/Tencent/teamai-cli/issues/816)) ([21cb76a](https://github.com/Tencent/teamai-cli/commit/21cb76aa493774df8a8c56641a597aeaca186c1e)), closes [#668](https://github.com/Tencent/teamai-cli/issues/668)
* **opencode:** register project entries in .opencode/opencode.jsonc ([6bf136b](https://github.com/Tencent/teamai-cli/commit/6bf136b21114136266b6f47402002f6c69d5e3b7))
* opt-in git submodule population on pull (teamai.yaml submodules) ([#501](https://github.com/Tencent/teamai-cli/issues/501)) ([ad5dea5](https://github.com/Tencent/teamai-cli/commit/ad5dea5985d777147f636e5fd0d8014a07cec39a))
* opt-out usage reporting (teamai.yaml usageReport: false) ([#505](https://github.com/Tencent/teamai-cli/issues/505)) ([25ff0dc](https://github.com/Tencent/teamai-cli/commit/25ff0dcb49ad441884f8500c13293124aa6cd93c))
* **packages:** add declarative team environment install ([218d13c](https://github.com/Tencent/teamai-cli/commit/218d13c6afe7210ed8b405e0a633713469da4d6c))
* **partition:** encode the full project path into the data-home slug ([#546](https://github.com/Tencent/teamai-cli/issues/546)) ([a3f0b6f](https://github.com/Tencent/teamai-cli/commit/a3f0b6f6c5d314e0ba0d0a02de4c6e984fede55e))
* **pi:** add Pi Coding Agent integration ([#692](https://github.com/Tencent/teamai-cli/issues/692)) ([9d7e50b](https://github.com/Tencent/teamai-cli/commit/9d7e50bb50981b0de0f32a2a834d5c02fe38efa9)), closes [#693](https://github.com/Tencent/teamai-cli/issues/693) [#685](https://github.com/Tencent/teamai-cli/issues/685) [#694](https://github.com/Tencent/teamai-cli/issues/694) [#691](https://github.com/Tencent/teamai-cli/issues/691) [#681](https://github.com/Tencent/teamai-cli/issues/681) [#680](https://github.com/Tencent/teamai-cli/issues/680) [#666](https://github.com/Tencent/teamai-cli/issues/666)
* **projects:** add admin commands to manage the projects manifest ([#756](https://github.com/Tencent/teamai-cli/issues/756)) ([#774](https://github.com/Tencent/teamai-cli/issues/774)) ([97be092](https://github.com/Tencent/teamai-cli/commit/97be092633711de2ac1fbde7402399db31b67dd3))
* **pull:** let a member opt out of usage reporting with usageReportEnabled ([#1037](https://github.com/Tencent/teamai-cli/issues/1037)) ([e3e5f57](https://github.com/Tencent/teamai-cli/commit/e3e5f57b846608f0b8c9c043872335d5dec14e4d))
* **pull:** pin a workspace to a team ref with --team-ref ([#1207](https://github.com/Tencent/teamai-cli/issues/1207)) ([3127b96](https://github.com/Tencent/teamai-cli/commit/3127b965d264337ae93a08f5614559499dd1d3d5)), closes [#1183](https://github.com/Tencent/teamai-cli/issues/1183)
* **pull:** run team scripts.postPull after a pull ([#633](https://github.com/Tencent/teamai-cli/issues/633)) ([d4d2b89](https://github.com/Tencent/teamai-cli/commit/d4d2b8923f4445c12951643370a43c7c5c2fb591))
* **push:** support all namespaced resource types ([#1234](https://github.com/Tencent/teamai-cli/issues/1234)) ([2401d04](https://github.com/Tencent/teamai-cli/commit/2401d047b37de8037efa698ca380abc65e88dca6)), closes [#1101](https://github.com/Tencent/teamai-cli/issues/1101) [#1101](https://github.com/Tencent/teamai-cli/issues/1101) [#649](https://github.com/Tencent/teamai-cli/issues/649) [#1101](https://github.com/Tencent/teamai-cli/issues/1101) [#1085](https://github.com/Tencent/teamai-cli/issues/1085)
* **push:** support explicitly shared-root resources ([#1329](https://github.com/Tencent/teamai-cli/issues/1329)) ([db84604](https://github.com/Tencent/teamai-cli/commit/db8460456039fcd349cbb84e4b4f637316a6813b))
* **recall:** annotate codebase sources with freshness ([#1033](https://github.com/Tencent/teamai-cli/issues/1033)) ([00dc2b7](https://github.com/Tencent/teamai-cli/commit/00dc2b74624447b32d0d9f94c9681155343113a7))
* **recall:** attribute recall and adoption to the agent session in every agent ([#925](https://github.com/Tencent/teamai-cli/issues/925)) ([5fbaa37](https://github.com/Tencent/teamai-cli/commit/5fbaa377c7c673f297c3e3568867d9ef9ab9bf77)), closes [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884) [#884](https://github.com/Tencent/teamai-cli/issues/884)
* **recall:** link an OMP subagent's session to its parent for adoption ([#935](https://github.com/Tencent/teamai-cli/issues/935)) ([85ff72c](https://github.com/Tencent/teamai-cli/commit/85ff72c775fcb9d24792154dc7ec4190ee5b6909))
* **recall:** rename the recall agent, rule and prompts from teamai to dmtn ([eeb1bd7](https://github.com/Tencent/teamai-cli/commit/eeb1bd74440f4afe85eea2e7ca7a42434b37d7eb))
* **recall:** scope teamwiki codebase recall by project/role ([#912](https://github.com/Tencent/teamai-cli/issues/912)) ([#974](https://github.com/Tencent/teamai-cli/issues/974)) ([34f32f0](https://github.com/Tencent/teamai-cli/commit/34f32f033bed1cdf26e559e70beb117716d28912)), closes [#707](https://github.com/Tencent/teamai-cli/issues/707) [#707](https://github.com/Tencent/teamai-cli/issues/707)
* **remove:** add --force to skip the confirmation prompt ([#594](https://github.com/Tencent/teamai-cli/issues/594)) ([3d4353f](https://github.com/Tencent/teamai-cli/commit/3d4353f45e2e0efc1701d0594e3b907428914236)), closes [#576](https://github.com/Tencent/teamai-cli/issues/576) [#591](https://github.com/Tencent/teamai-cli/issues/591)
* **review:** add read-only health checks for pushed branches ([#1058](https://github.com/Tencent/teamai-cli/issues/1058)) ([5bf6259](https://github.com/Tencent/teamai-cli/commit/5bf625983e83f58655f0888ec017683281d1fd34)), closes [#776](https://github.com/Tencent/teamai-cli/issues/776) [#776](https://github.com/Tencent/teamai-cli/issues/776)
* **review:** fail review --branch on an invalid workflow ([608d45f](https://github.com/Tencent/teamai-cli/commit/608d45fb5d2c68b198e6805f548a225d3b62ad6d)), closes [#1085](https://github.com/Tencent/teamai-cli/issues/1085)
* scope hooks, MCP servers and env variables by logical project ([#700](https://github.com/Tencent/teamai-cli/issues/700)) ([2ed17e4](https://github.com/Tencent/teamai-cli/commit/2ed17e4fb29baf2b3ceb09361cd27fafa44de9ea))
* **scope:** rename the project install scope to workspace ([#1106](https://github.com/Tencent/teamai-cli/issues/1106)) ([a1f4e73](https://github.com/Tencent/teamai-cli/commit/a1f4e73acfc6ce7eedef3799c68442a199308a25)), closes [#1099](https://github.com/Tencent/teamai-cli/issues/1099)
* **scorers:** judge workflow steps with team scorers ([#1297](https://github.com/Tencent/teamai-cli/issues/1297)) ([d790b2c](https://github.com/Tencent/teamai-cli/commit/d790b2c353c687cf6b5b02895513d4b7452611c3))
* **score:** score a finished agent session with a team scorer ([#1298](https://github.com/Tencent/teamai-cli/issues/1298)) ([fb17c48](https://github.com/Tencent/teamai-cli/commit/fb17c4885f3d45820f10c6b472099ff13a3b24ce))
* **score:** score finished sessions in the background ([#1364](https://github.com/Tencent/teamai-cli/issues/1364)) ([6e4d8dc](https://github.com/Tencent/teamai-cli/commit/6e4d8dcfaa990d129b848870ce7d2617baa7cefb))
* **scripts:** run team scripts at init, pull, and new checkouts ([#1061](https://github.com/Tencent/teamai-cli/issues/1061)) ([6178064](https://github.com/Tencent/teamai-cli/commit/61780642f473039088577c36a7dad97e89757512))
* **session:** cross-platform session migration and team session archive ([#593](https://github.com/Tencent/teamai-cli/issues/593)) ([4372650](https://github.com/Tencent/teamai-cli/commit/43726500eaeb3bda048bd6f8ef685e96fc81403d))
* **session:** safe session reads and copies for workflows, drivers, scorers, and benchmarks ([#593](https://github.com/Tencent/teamai-cli/issues/593) follow-up) ([#1135](https://github.com/Tencent/teamai-cli/issues/1135)) ([0fff828](https://github.com/Tencent/teamai-cli/commit/0fff82843de89b60a4bded238a27b503aaa6347b))
* **skills:** add teamai onboarding skill ([#572](https://github.com/Tencent/teamai-cli/issues/572)) ([#605](https://github.com/Tencent/teamai-cli/issues/605)) ([5750279](https://github.com/Tencent/teamai-cli/commit/57502794863062127c0f09a3297345d5ad6986aa)), closes [#517](https://github.com/Tencent/teamai-cli/issues/517)
* **skill:** serve builtin skill content from the CLI, deploy a discovery stub ([#699](https://github.com/Tencent/teamai-cli/issues/699)) ([ca6e512](https://github.com/Tencent/teamai-cli/commit/ca6e51251f65392366efa1d032959526f43f3499)), closes [#678](https://github.com/Tencent/teamai-cli/issues/678) [#678](https://github.com/Tencent/teamai-cli/issues/678) [#678](https://github.com/Tencent/teamai-cli/issues/678) [#678](https://github.com/Tencent/teamai-cli/issues/678) [#678](https://github.com/Tencent/teamai-cli/issues/678) [#678](https://github.com/Tencent/teamai-cli/issues/678) [#678](https://github.com/Tencent/teamai-cli/issues/678) [#678](https://github.com/Tencent/teamai-cli/issues/678) [#724](https://github.com/Tencent/teamai-cli/issues/724) [#678](https://github.com/Tencent/teamai-cli/issues/678) [#730](https://github.com/Tencent/teamai-cli/issues/730) [#678](https://github.com/Tencent/teamai-cli/issues/678) [#713](https://github.com/Tencent/teamai-cli/issues/713) [#736](https://github.com/Tencent/teamai-cli/issues/736) [#713](https://github.com/Tencent/teamai-cli/issues/713) [#736](https://github.com/Tencent/teamai-cli/issues/736) [#739](https://github.com/Tencent/teamai-cli/issues/739)
* **source:** warn that a source with no publicSkills will sync 0 skills ([213b3c6](https://github.com/Tencent/teamai-cli/commit/213b3c6ec2f7d4ba589a193b83f839ad787fd1ec)), closes [#416](https://github.com/Tencent/teamai-cli/issues/416) [#416](https://github.com/Tencent/teamai-cli/issues/416)
* substitute any scalar plugin field into install commands ([352e69d](https://github.com/Tencent/teamai-cli/commit/352e69d2cdeffe68a7011dafd0d66ccb8a8f6153))
* **tool-roots:** sync a relocated tool root outside the home directory ([ad1c58d](https://github.com/Tencent/teamai-cli/commit/ad1c58d31cdd5d1861ffd90ac651aac8f36f429d))
* **tools:** per-tool descriptor and skill-use tracking for every tool ([#1221](https://github.com/Tencent/teamai-cli/issues/1221)) ([#1245](https://github.com/Tencent/teamai-cli/issues/1245)) ([22dfe27](https://github.com/Tencent/teamai-cli/commit/22dfe276b6f22b68fc7eeb3d83646028ab4529fb))
* **webhook:** add webhook integration for team notifications ([#665](https://github.com/Tencent/teamai-cli/issues/665)) ([83141be](https://github.com/Tencent/teamai-cli/commit/83141be8f9d08df2606a10c7389f75a370dbf7ce))
* **website:** add standalone TeamAI site and use-case contribution entry ([#1206](https://github.com/Tencent/teamai-cli/issues/1206)) ([841beed](https://github.com/Tencent/teamai-cli/commit/841beed0670cd38243a783f0b2c5f5a4755ff60c))
* **wiki:** collect and extract Scala files in the code graph ([#981](https://github.com/Tencent/teamai-cli/issues/981)) ([#996](https://github.com/Tencent/teamai-cli/issues/996)) ([046a1e6](https://github.com/Tencent/teamai-cli/commit/046a1e63b1161147bf80ce51af0cba1c924c443d))
* **workflow:** add command-only runtime ([#1097](https://github.com/Tencent/teamai-cli/issues/1097)) ([1f42bfa](https://github.com/Tencent/teamai-cli/commit/1f42bfafc213133470a936e37546c1e5d6435bdb))
* **workflow:** add durable pull request delivery ([#1306](https://github.com/Tencent/teamai-cli/issues/1306)) ([f3cd042](https://github.com/Tencent/teamai-cli/commit/f3cd04254194755f9ad3ec46004e9a5c383c68c8)), closes [#1090](https://github.com/Tencent/teamai-cli/issues/1090)
* **workflow:** add HITL steps and manual run controls ([#1205](https://github.com/Tencent/teamai-cli/issues/1205)) ([8dc60b0](https://github.com/Tencent/teamai-cli/commit/8dc60b082f60ed19a735fde6839ffddb59ec5b4b)), closes [#1081](https://github.com/Tencent/teamai-cli/issues/1081)
* **workflow:** add workspace branches ([#1175](https://github.com/Tencent/teamai-cli/issues/1175)) ([28a1b2e](https://github.com/Tencent/teamai-cli/commit/28a1b2e7cb87290b6554d9a7d463d4ba866c8a1f))
* **workflow:** bounded loops, parallel for_each and list expressions ([#1148](https://github.com/Tencent/teamai-cli/issues/1148)) ([c57da5a](https://github.com/Tencent/teamai-cli/commit/c57da5af87e6bafc71b63f135bf75b4215eb7ea2))
* **workflow:** DAG conditions and composable sub-workflows ([#1129](https://github.com/Tencent/teamai-cli/issues/1129)) ([474dfc0](https://github.com/Tencent/teamai-cli/commit/474dfc0af5dcc5798785a449a9b683afc16686b9))
* **workflow:** enforce scoped requirements and execution limits ([#1303](https://github.com/Tencent/teamai-cli/issues/1303)) ([90283a4](https://github.com/Tencent/teamai-cli/commit/90283a4e9d10fb20b05ca1e8ff2a2178d1882aa0)), closes [#1082](https://github.com/Tencent/teamai-cli/issues/1082)
* **workflow:** let a prompt step choose its model ([#1177](https://github.com/Tencent/teamai-cli/issues/1177)) ([#1192](https://github.com/Tencent/teamai-cli/issues/1192)) ([ce4f656](https://github.com/Tencent/teamai-cli/commit/ce4f656ea12b61cabaca2dd874c38fe670cc429f))
* **workflow:** publish and resume workflow runs across machines ([#1084](https://github.com/Tencent/teamai-cli/issues/1084)) ([#1280](https://github.com/Tencent/teamai-cli/issues/1280)) ([f0d8a99](https://github.com/Tencent/teamai-cli/commit/f0d8a99bb4de57bf80583b5c041024e4848e77a7))
* **workflow:** publish privacy-preserving run records to teamai-reports ([#1083](https://github.com/Tencent/teamai-cli/issues/1083)) ([#1126](https://github.com/Tencent/teamai-cli/issues/1126)) ([d25b7ae](https://github.com/Tencent/teamai-cli/commit/d25b7ae504d534859de1932e5c5605c171c1d9ac))
* **workflow:** record team revision ([#1201](https://github.com/Tencent/teamai-cli/issues/1201)) ([c430f21](https://github.com/Tencent/teamai-cli/commit/c430f21155ffbf4a3958031be97ab204c50b6a41)), closes [#1163](https://github.com/Tencent/teamai-cli/issues/1163)
* **workflow:** record the agent each step pass ran as ([#1184](https://github.com/Tencent/teamai-cli/issues/1184)) ([3281eda](https://github.com/Tencent/teamai-cli/commit/3281eda5349f4feb22bd4f1e066c6c83a5a69278)), closes [#1176](https://github.com/Tencent/teamai-cli/issues/1176) [#1176](https://github.com/Tencent/teamai-cli/issues/1176) [#1176](https://github.com/Tencent/teamai-cli/issues/1176) [#1176](https://github.com/Tencent/teamai-cli/issues/1176) [#1176](https://github.com/Tencent/teamai-cli/issues/1176) [#1176](https://github.com/Tencent/teamai-cli/issues/1176) [#1176](https://github.com/Tencent/teamai-cli/issues/1176) [#1176](https://github.com/Tencent/teamai-cli/issues/1176) [#1176](https://github.com/Tencent/teamai-cli/issues/1176) [#1193](https://github.com/Tencent/teamai-cli/issues/1193)
* **workflow:** report unread driver payload fields as ignored ([#1167](https://github.com/Tencent/teamai-cli/issues/1167)) ([41efe92](https://github.com/Tencent/teamai-cli/commit/41efe92a4b2b05ec84041e4bc921b839c5c9a7fc)), closes [#1164](https://github.com/Tencent/teamai-cli/issues/1164) [#1164](https://github.com/Tencent/teamai-cli/issues/1164) [#1164](https://github.com/Tencent/teamai-cli/issues/1164)
* **workflow:** run prompt and agent steps with the local driver ([#1120](https://github.com/Tencent/teamai-cli/issues/1120)) ([a0a27a4](https://github.com/Tencent/teamai-cli/commit/a0a27a4aeb34053db2e36528bc95c1ea4f377c52))


### Bug Fixes

* 修复合并后无法编译的工作区，并升到 0.22.0-beta.9 ([8a0b324](https://github.com/Tencent/teamai-cli/commit/8a0b324d8f116b6eaae5874873d5f449c4f37922))
* **agent-version:** detect npm-installed agent CLIs on Windows ([#595](https://github.com/Tencent/teamai-cli/issues/595)) ([82a7dae](https://github.com/Tencent/teamai-cli/commit/82a7dae3fcf06d8497ef2af97e636d8f17fcd0d8))
* **agents:** carry the agent's model into the Cursor render ([#830](https://github.com/Tencent/teamai-cli/issues/830)) ([#856](https://github.com/Tencent/teamai-cli/issues/856)) ([d319816](https://github.com/Tencent/teamai-cli/commit/d319816c6b5ca7f39bc4c1a8626b4b7562ac8bda))
* **agents:** clean up tombstoned agents under every render extension ([#589](https://github.com/Tencent/teamai-cli/issues/589)) ([d2d1f78](https://github.com/Tencent/teamai-cli/commit/d2d1f78d85e230c4a52ad7bdc0288ba81f54b809)), closes [#576](https://github.com/Tencent/teamai-cli/issues/576)
* **agents:** compare rendered native agent content ([ea0b387](https://github.com/Tencent/teamai-cli/commit/ea0b3875e35f533c18bc38820ce61195161330fe))
* **agents:** render codex TOML with multi-line literal strings ([#754](https://github.com/Tencent/teamai-cli/issues/754)) ([dad371c](https://github.com/Tencent/teamai-cli/commit/dad371c3607980388a594cdd8291ed7013e968dd))
* **ai-client:** mute share hint in AI child sessions ([#746](https://github.com/Tencent/teamai-cli/issues/746)) ([0b9586e](https://github.com/Tencent/teamai-cli/commit/0b9586e9f9af696a5b85d364f99b0a514444ef8c))
* **ai-client:** resolve the AI CLI on Windows with where + cross-spawn ([#496](https://github.com/Tencent/teamai-cli/issues/496)) ([892b940](https://github.com/Tencent/teamai-cli/commit/892b940858a7d50d51522e8d8052e58d82f19c00))
* **ai:** invoke OpenClaw through its agent command ([#1308](https://github.com/Tencent/teamai-cli/issues/1308)) ([dd62c7a](https://github.com/Tencent/teamai-cli/commit/dd62c7a4ed28371e79f121055d2be1c673b352dd)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **ai:** preserve stdout errors and exit diagnostics ([#1342](https://github.com/Tencent/teamai-cli/issues/1342)) ([54622c3](https://github.com/Tencent/teamai-cli/commit/54622c3a8b86e23280171b1e1cda2494ef378095))
* anchor project-relative docs destinations ([#652](https://github.com/Tencent/teamai-cli/issues/652)) ([bd85772](https://github.com/Tencent/teamai-cli/commit/bd857725d829079f2f8d238ac804af74662436d4))
* **cache,import:** print cache and import review output in English ([#836](https://github.com/Tencent/teamai-cli/issues/836)) ([#840](https://github.com/Tencent/teamai-cli/issues/840)) ([a47bb7e](https://github.com/Tencent/teamai-cli/commit/a47bb7eabce4f13025df3603c0893297da3891d2))
* **cache:** reject malformed GC integer options ([#634](https://github.com/Tencent/teamai-cli/issues/634)) ([b9a2b92](https://github.com/Tencent/teamai-cli/commit/b9a2b926ebc8ceb1433af0484af1f9c96e4a4946))
* **ci:** fail closed when comment lookup fails ([#697](https://github.com/Tencent/teamai-cli/issues/697)) ([6d27a11](https://github.com/Tencent/teamai-cli/commit/6d27a11fb91bf8a8a04cd884794b7df123c8ad0d))
* **ci:** fail closed when rejection checks fail ([#674](https://github.com/Tencent/teamai-cli/issues/674)) ([4e334c5](https://github.com/Tencent/teamai-cli/commit/4e334c53894dadd43b1836b22d220ee31d7fb4eb))
* **ci:** make Codex review report all findings and run fork-safe e2e ([#739](https://github.com/Tencent/teamai-cli/issues/739)) ([a52374a](https://github.com/Tencent/teamai-cli/commit/a52374ab0432db48442e72bdcbc29828599b3c3c)), closes [#731](https://github.com/Tencent/teamai-cli/issues/731)
* **ci:** pick an explicit release-notes base on the same lineage ([#512](https://github.com/Tencent/teamai-cli/issues/512)) ([6d4fb28](https://github.com/Tencent/teamai-cli/commit/6d4fb2891afcdc37548f85c173af442a6b37f4e3))
* **cli:** explain unavailable working directories before migration ([#1309](https://github.com/Tencent/teamai-cli/issues/1309)) ([9140a35](https://github.com/Tencent/teamai-cli/commit/9140a35f78a0a76aeaa3b458b3512313dbf2cfb4)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **cli:** report an async command error as one line, not a stack trace ([#1271](https://github.com/Tencent/teamai-cli/issues/1271)) ([6bcdaf3](https://github.com/Tencent/teamai-cli/commit/6bcdaf3bab78fb79c19b8cd2f6d7e26c722dcd9f)), closes [#1270](https://github.com/Tencent/teamai-cli/issues/1270)
* **cli:** report NotInitializedError without a stack trace ([#1228](https://github.com/Tencent/teamai-cli/issues/1228)) ([fa6a361](https://github.com/Tencent/teamai-cli/commit/fa6a361b77814d7ca5daa251988faa2d2d381b5f))
* **cnb:** persist git credential helper after interactive clone ([#528](https://github.com/Tencent/teamai-cli/issues/528)) ([041e6db](https://github.com/Tencent/teamai-cli/commit/041e6dbe250bd66583964c2c5adb56f5cbb59831))
* **cnb:** pin login to CNB_HOST so it ignores the current dir git remote ([#530](https://github.com/Tencent/teamai-cli/issues/530)) ([c593801](https://github.com/Tencent/teamai-cli/commit/c5938012bef9c3a24d408a9ceeab3468b6a2e02b))
* **code-knowledge:** collect Swift shadowing from binding positions ([#928](https://github.com/Tencent/teamai-cli/issues/928)) ([2fcc00b](https://github.com/Tencent/teamai-cli/commit/2fcc00b1d3154d0f30c4ae4c5b958f894af5286d)), closes [#847](https://github.com/Tencent/teamai-cli/issues/847) [#909](https://github.com/Tencent/teamai-cli/issues/909)
* **code-knowledge:** do not resolve a Swift bare call a type member shadows ([#962](https://github.com/Tencent/teamai-cli/issues/962)) ([26016b1](https://github.com/Tencent/teamai-cli/commit/26016b11e13cb0924f616e04c85002c998ebf6d6))
* **code-knowledge:** keep tree-sitter grammars off V8's optimizing Wasm tier on Node 24 ([#860](https://github.com/Tencent/teamai-cli/issues/860)) ([#861](https://github.com/Tencent/teamai-cli/issues/861)) ([5fb316c](https://github.com/Tencent/teamai-cli/commit/5fb316c7b8616f430f4d03f2fda86f9c44755adb)), closes [nodejs/node#63421](https://github.com/nodejs/node/issues/63421) [#842](https://github.com/Tencent/teamai-cli/issues/842) [#842](https://github.com/Tencent/teamai-cli/issues/842)
* **code-knowledge:** resolve Swift symbols across files in the same module ([#847](https://github.com/Tencent/teamai-cli/issues/847)) ([2aaf3db](https://github.com/Tencent/teamai-cli/commit/2aaf3db54320840856a082cd4e2d1baf0846e519)), closes [#843](https://github.com/Tencent/teamai-cli/issues/843) [#843](https://github.com/Tencent/teamai-cli/issues/843) [#861](https://github.com/Tencent/teamai-cli/issues/861) [#861](https://github.com/Tencent/teamai-cli/issues/861) [#909](https://github.com/Tencent/teamai-cli/issues/909)
* **code-knowledge:** veto a Swift bare call only inside a type body ([#966](https://github.com/Tencent/teamai-cli/issues/966)) ([c598925](https://github.com/Tencent/teamai-cli/commit/c598925548099960867126ecf278ada6b7a270d2)), closes [#962](https://github.com/Tencent/teamai-cli/issues/962) [#962](https://github.com/Tencent/teamai-cli/issues/962)
* **codebase:** point builtin wiki skill at teamai extract ([e151d43](https://github.com/Tencent/teamai-cli/commit/e151d434c4048900c98c0e79066dde403624df7d)), closes [#360](https://github.com/Tencent/teamai-cli/issues/360)
* **codebase:** preserve local wiki refresh and lint targets ([1ca43ac](https://github.com/Tencent/teamai-cli/commit/1ca43acc1fa7c322cd490db9e3a9da6b0da98bc2))
* **codebase:** reconcile no longer rejects extractor-generated same-file IMPLEMENTS self-loops ([1278a0d](https://github.com/Tencent/teamai-cli/commit/1278a0dbf89ecbceac73c59b70a95cb1396c79fc)), closes [#475](https://github.com/Tencent/teamai-cli/issues/475)
* **codebase:** write fallback evidence manifest so deep-enrich can start ([#522](https://github.com/Tencent/teamai-cli/issues/522)) ([0c9fcad](https://github.com/Tencent/teamai-cli/commit/0c9fcadf2a590a5ce8266f573f0acfec361196cb)), closes [#508](https://github.com/Tencent/teamai-cli/issues/508)
* **codex-review:** let maintainer-authorized fork PRs re-review on push ([#636](https://github.com/Tencent/teamai-cli/issues/636)) ([470d229](https://github.com/Tencent/teamai-cli/commit/470d229ff830bd83deecfb39c422a129ca3b80a1)), closes [#631](https://github.com/Tencent/teamai-cli/issues/631)
* **codex:** defer Stop hints to the next prompt ([#440](https://github.com/Tencent/teamai-cli/issues/440)) ([09a2efd](https://github.com/Tencent/teamai-cli/commit/09a2efd542d709a15893458026c9eb553fa33afb))
* **codex:** find ChatGPT desktop CLI under codex-cli/bin ([#1360](https://github.com/Tencent/teamai-cli/issues/1360)) ([e3ac431](https://github.com/Tencent/teamai-cli/commit/e3ac431b8234a828f19980fc2ac4a926d3ecc49d))
* **codex:** keep member hook groups at their keys and trust with the newest build ([#1244](https://github.com/Tencent/teamai-cli/issues/1244), [#1250](https://github.com/Tencent/teamai-cli/issues/1250)) ([#1263](https://github.com/Tencent/teamai-cli/issues/1263)) ([7bb2e27](https://github.com/Tencent/teamai-cli/commit/7bb2e27bab2b65f8d6b7dcce0663ff91dddd4e41))
* **codex:** reuse existing shared skills ([fb692a2](https://github.com/Tencent/teamai-cli/commit/fb692a23eb9d1f36be1f37c1082b24fddb3b996e))
* collect Codex token usage ([ba26b03](https://github.com/Tencent/teamai-cli/commit/ba26b03e2f1c75cb3dedf3e32456f89275c48339))
* **config:** honor CODEX_HOME through toolRoots ([#942](https://github.com/Tencent/teamai-cli/issues/942)) ([b2d3598](https://github.com/Tencent/teamai-cli/commit/b2d3598b38927a49f24b492bd9129f894bd0500f)), closes [#725](https://github.com/Tencent/teamai-cli/issues/725) [#939](https://github.com/Tencent/teamai-cli/issues/939)
* **config:** keep config.yaml readable while it is being saved ([#823](https://github.com/Tencent/teamai-cli/issues/823)) ([#831](https://github.com/Tencent/teamai-cli/issues/831)) ([87a606b](https://github.com/Tencent/teamai-cli/commit/87a606b727cc37b7a47952f9590f8acdc00b96c8))
* **config:** merge custom toolPaths tool by tool over defaults ([#1185](https://github.com/Tencent/teamai-cli/issues/1185)) ([#1204](https://github.com/Tencent/teamai-cli/issues/1204)) ([c6bd126](https://github.com/Tencent/teamai-cli/commit/c6bd126466ce85cbc74c2b07d6373b627738f940))
* **config:** refuse unreadable project scope fallback ([#899](https://github.com/Tencent/teamai-cli/issues/899)) ([df940cd](https://github.com/Tencent/teamai-cli/commit/df940cdd18551b0277cf897c5a5d3c2a2bb21938))
* **config:** release only Claude's MCP servers on a root move; read the recorded root in import and skill tracking ([#775](https://github.com/Tencent/teamai-cli/issues/775)) ([a2f93ae](https://github.com/Tencent/teamai-cli/commit/a2f93ae3d2d2fe7b732b344ab7b9f98d5b20ff0c)), closes [#728](https://github.com/Tencent/teamai-cli/issues/728)
* count namespaced skills and nested docs correctly ([#493](https://github.com/Tencent/teamai-cli/issues/493)) ([1830af0](https://github.com/Tencent/teamai-cli/commit/1830af0d85a0de7710ee7df0143cf5a276b2a9e3))
* **cursor:** deliver user-scope rules to workspaces outside the home directory ([#1197](https://github.com/Tencent/teamai-cli/issues/1197)) ([#1198](https://github.com/Tencent/teamai-cli/issues/1198)) ([1e145bf](https://github.com/Tencent/teamai-cli/commit/1e145bf1c2d452b7ab6c9602595bda22541f44af))
* **cursor:** use direct recall for user-scope CLI sessions ([#1222](https://github.com/Tencent/teamai-cli/issues/1222)) ([c125d03](https://github.com/Tencent/teamai-cli/commit/c125d0361538a4f6334cea2e241359f94d4bd620)), closes [#1218](https://github.com/Tencent/teamai-cli/issues/1218) [#1218](https://github.com/Tencent/teamai-cli/issues/1218)
* **dashboard:** attribute cwd-less Copilot events by dataHomeKey ([#1121](https://github.com/Tencent/teamai-cli/issues/1121)) ([#1166](https://github.com/Tencent/teamai-cli/issues/1166)) ([4169fd2](https://github.com/Tencent/teamai-cli/commit/4169fd285ba32050d8f4b79dfec079869eea8634))
* **dashboard:** find Muse session logs under $XDG_DATA_HOME ([#1138](https://github.com/Tencent/teamai-cli/issues/1138) item 2) ([#1168](https://github.com/Tencent/teamai-cli/issues/1168)) ([27aceea](https://github.com/Tencent/teamai-cli/commit/27aceeada8d6fa98b132ce28e31f40976b4e252b))
* **dashboard:** gate the legacy dashboard-report command on a config ([#772](https://github.com/Tencent/teamai-cli/issues/772)) ([34e65e9](https://github.com/Tencent/teamai-cli/commit/34e65e90171a25de1e6c110871626eec1d60bd26)), closes [#748](https://github.com/Tencent/teamai-cli/issues/748)
* **dashboard:** keep SSE live after event log compaction ([#888](https://github.com/Tencent/teamai-cli/issues/888)) ([c787443](https://github.com/Tencent/teamai-cli/commit/c7874434c9d9b2aab2b542e5e31862ce9bd067cf))
* **dashboard:** match correction keywords as whole words, add team keywords ([#567](https://github.com/Tencent/teamai-cli/issues/567)) ([d13780c](https://github.com/Tencent/teamai-cli/commit/d13780c7e589b98cdb06b0bab901a8498a288d36)), closes [#564](https://github.com/Tencent/teamai-cli/issues/564)
* **dashboard:** normalize Unicode correction keywords ([#575](https://github.com/Tencent/teamai-cli/issues/575)) ([8efeaf7](https://github.com/Tencent/teamai-cli/commit/8efeaf73d24c6c2bca4e4a0bf544d8082df59b80))
* **dashboard:** scope Codex token snapshots per rollout ([8c3a0d1](https://github.com/Tencent/teamai-cli/commit/8c3a0d1d068471ed851058fa2466e20fcb4156a5))
* **dashboard:** serialize events.jsonl append and compaction ([#804](https://github.com/Tencent/teamai-cli/issues/804)) ([#841](https://github.com/Tencent/teamai-cli/issues/841)) ([84d8ba7](https://github.com/Tencent/teamai-cli/commit/84d8ba711f9586704d63390f9b45b0ab9ee701e8)), closes [#790](https://github.com/Tencent/teamai-cli/issues/790) [#803](https://github.com/Tencent/teamai-cli/issues/803) [#788](https://github.com/Tencent/teamai-cli/issues/788)
* **dashboard:** show readable session previews and keep Codex dispatcher commands portable ([#1287](https://github.com/Tencent/teamai-cli/issues/1287)) ([c15fc0d](https://github.com/Tencent/teamai-cli/commit/c15fc0dbebec0cc064ecd4d764c16f00b0355e18))
* **dashboard:** style all dropdown menus ([#1296](https://github.com/Tencent/teamai-cli/issues/1296)) ([08c0c2e](https://github.com/Tencent/teamai-cli/commit/08c0c2e4336314b169d220964642a0734c5e7fd7))
* **dashboard:** unwrap question replies for every Codex id ([#1289](https://github.com/Tencent/teamai-cli/issues/1289)) ([a56ce71](https://github.com/Tencent/teamai-cli/commit/a56ce7126e35b91139af10f4804f56309c3cb8b0))
* **data-layout:** address PR [#397](https://github.com/Tencent/teamai-cli/issues/397) review — env backup convergence + preserve historical projectRoot fallback ([8fec475](https://github.com/Tencent/teamai-cli/commit/8fec475b68a2173c15c1f1764d5f365123e0ef12)), closes [#374](https://github.com/Tencent/teamai-cli/issues/374)
* **data-layout:** address PR [#402](https://github.com/Tencent/teamai-cli/issues/402) review — dataHome injection, slug collisions, case-probe volume ([8614f76](https://github.com/Tencent/teamai-cli/commit/8614f7634e7433bb865e39f19fbf67c99e950171)), closes [#374](https://github.com/Tencent/teamai-cli/issues/374)
* **data-layout:** address PR [#406](https://github.com/Tencent/teamai-cli/issues/406) review — cwd-independent detection + full-section sync lock ([e55a58f](https://github.com/Tencent/teamai-cli/commit/e55a58fe732070b0151ea18a220cff2d1781ab36)), closes [#1](https://github.com/Tencent/teamai-cli/issues/1) [#2](https://github.com/Tencent/teamai-cli/issues/2) [#374](https://github.com/Tencent/teamai-cli/issues/374)
* **data-layout:** address PR [#406](https://github.com/Tencent/teamai-cli/issues/406) round-2 review — self-mode precedence + skip deploy on lock contention ([e80ea7e](https://github.com/Tencent/teamai-cli/commit/e80ea7e97dfa042915689de07f6f55ae56e6b2c9)), closes [#1](https://github.com/Tencent/teamai-cli/issues/1) [#2](https://github.com/Tencent/teamai-cli/issues/2) [#374](https://github.com/Tencent/teamai-cli/issues/374)
* **data-layout:** address PR [#406](https://github.com/Tencent/teamai-cli/issues/406) round-3 review — partition authoritative, lock the auto-report clone writes ([9883cdc](https://github.com/Tencent/teamai-cli/commit/9883cdc593d71667cf4e7c4e356472907aac6f27)), closes [#1](https://github.com/Tencent/teamai-cli/issues/1) [#2](https://github.com/Tencent/teamai-cli/issues/2) [#374](https://github.com/Tencent/teamai-cli/issues/374)
* **data-layout:** exclude a contended scope from reconcile/report, not just the fetch ([#374](https://github.com/Tencent/teamai-cli/issues/374)) ([cebc841](https://github.com/Tencent/teamai-cli/commit/cebc8415e79add6ee2fbad8b53f4ca09de0d39e0)), closes [#406](https://github.com/Tencent/teamai-cli/issues/406) [#406](https://github.com/Tencent/teamai-cli/issues/406) [#406](https://github.com/Tencent/teamai-cli/issues/406)
* **data-layout:** exclude a contended scope from the cross-team source stage too ([ae8bed7](https://github.com/Tencent/teamai-cli/commit/ae8bed74b129a9fbcaac8293387a115ab9be5261)), closes [#414](https://github.com/Tencent/teamai-cli/issues/414) [#374](https://github.com/Tencent/teamai-cli/issues/374)
* **data-layout:** finish interrupted migrations + smoke-check the clone + clean failure ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-3 review) ([8da4c4f](https://github.com/Tencent/teamai-cli/commit/8da4c4f2d1b74edbafbf116d528794e540677e89))
* **data-layout:** give each worktree its own managed-mcp file, killing shared-manifest lost updates ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-2C review) ([1fad7a9](https://github.com/Tencent/teamai-cli/commit/1fad7a935972e19babf8747d4e0b453291843d33))
* **data-layout:** hold the sync lock across the whole clone-consuming pull, closing the TOCTOU window ([93736ee](https://github.com/Tencent/teamai-cli/commit/93736ee8df4becaec6242aa77a839bcf7430609e)), closes [#374](https://github.com/Tencent/teamai-cli/issues/374)
* **data-layout:** isolate managed-mcp ownership per worktree ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-2C review) ([e2d5c74](https://github.com/Tencent/teamai-cli/commit/e2d5c74b9afb4be514cf05257ce5408f33bad6f0))
* **data-layout:** let every self-mode worktree publish learnings and keep its queue ([#808](https://github.com/Tencent/teamai-cli/issues/808)) ([#814](https://github.com/Tencent/teamai-cli/issues/814)) ([7c834ce](https://github.com/Tencent/teamai-cli/commit/7c834ce428656e6a2cf6d62bdbf4900c3db12abb))
* **data-layout:** make migration backup non-destructive and git-ignored ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-3 review) ([0fa78fa](https://github.com/Tencent/teamai-cli/commit/0fa78faf9c40a105bc057b8c1a0d46f868a04f32))
* **data-layout:** merge workspaces/ on self relocation + lock self pull/push against migration ([#374](https://github.com/Tencent/teamai-cli/issues/374) P2 review) ([bdcb17c](https://github.com/Tencent/teamai-cli/commit/bdcb17c8a678d62bad8bb4901aec19dc3935bb14)), closes [#1](https://github.com/Tencent/teamai-cli/issues/1) [#2](https://github.com/Tencent/teamai-cli/issues/2)
* **data-layout:** migrate legacy bare managed-mcp keys + fix mcp list reader ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-2C review) ([170c3ff](https://github.com/Tencent/teamai-cli/commit/170c3ff50620ec23d3495018fbf718dac6d08417)), closes [#417](https://github.com/Tencent/teamai-cli/issues/417)
* **data-layout:** migrate MCP ownership from the true old workspace path + isolate the resource cache per worktree ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-2C review) ([44599dc](https://github.com/Tencent/teamai-cli/commit/44599dca5db9e2e1bce93490e4c21340788fcdbf))
* **data-layout:** persist the per-worktree manifest before deleting migrated records ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-2C review) ([d945dcb](https://github.com/Tencent/teamai-cli/commit/d945dcb46f0e719a3111240a7e417fd0bc3bde2e))
* **data-layout:** project uninstall cleans every worktree before deleting the shared partition ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-2C review) ([87f0be8](https://github.com/Tencent/teamai-cli/commit/87f0be80edc4a0379f974f341c7049bcdb9ff972))
* **data-layout:** rebind self localPath/businessRepoRoot to the current worktree ([#374](https://github.com/Tencent/teamai-cli/issues/374) P2 review) ([e1a5dce](https://github.com/Tencent/teamai-cli/commit/e1a5dce1dc3ebaeb7ed0e705a80a169624ef2ee7))
* **data-layout:** route local-agent MCP install/uninstall/report through workspace-scoped ownership ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-2C review) ([5e97ec0](https://github.com/Tencent/teamai-cli/commit/5e97ec0db09a919a01fb230ea5d3662cfdf3e96a))
* **data-layout:** run the pre-dispatch hook migration under the scope lock, not before it ([5b4690d](https://github.com/Tencent/teamai-cli/commit/5b4690d2a6cb138d9fa1e0bdd7baab19d2280b41)), closes [#374](https://github.com/Tencent/teamai-cli/issues/374)
* decode exec and clone output once per stream so split UTF-8 survives ([#1281](https://github.com/Tencent/teamai-cli/issues/1281)) ([8a94438](https://github.com/Tencent/teamai-cli/commit/8a944380b30acf088270dff5743d559ff845c587))
* **deep-enrich:** retry missing AI docs after temporary failures ([#491](https://github.com/Tencent/teamai-cli/issues/491)) ([34e1cfb](https://github.com/Tencent/teamai-cli/commit/34e1cfb35181241902b7058cedf98dedc5037dee)), closes [#488](https://github.com/Tencent/teamai-cli/issues/488)
* deliver the ZCode SessionStart hook through a Node launcher ([#1047](https://github.com/Tencent/teamai-cli/issues/1047)) ([0dd4b1e](https://github.com/Tencent/teamai-cli/commit/0dd4b1e1d16e8f4f9ffa92a1ee38caeb767fb778)), closes [#1030](https://github.com/Tencent/teamai-cli/issues/1030)
* delivery and local-state bugs ([#993](https://github.com/Tencent/teamai-cli/issues/993)) ([#995](https://github.com/Tencent/teamai-cli/issues/995)) ([d89c51e](https://github.com/Tencent/teamai-cli/commit/d89c51e3b6cb8f5bb4ca1389649802a7fe34f68a)), closes [#807](https://github.com/Tencent/teamai-cli/issues/807) [#964](https://github.com/Tencent/teamai-cli/issues/964) [#964](https://github.com/Tencent/teamai-cli/issues/964) [pre-#370](https://github.com/Tencent/pre-/issues/370) [#882](https://github.com/Tencent/teamai-cli/issues/882) [#886](https://github.com/Tencent/teamai-cli/issues/886) [#830](https://github.com/Tencent/teamai-cli/issues/830) [pre-#830](https://github.com/Tencent/pre-/issues/830) [#808](https://github.com/Tencent/teamai-cli/issues/808)
* **docs:** remove stale local documents during pull ([#817](https://github.com/Tencent/teamai-cli/issues/817)) ([49cf3fd](https://github.com/Tencent/teamai-cli/commit/49cf3fdd1022bf720d810f7bfac795254fec1679))
* **doctor:** check that the zcode SessionStart hook actually answers ([#1064](https://github.com/Tencent/teamai-cli/issues/1064)) ([353bc65](https://github.com/Tencent/teamai-cli/commit/353bc65270a7e0a445580196543c7f44070d2b94)), closes [#1050](https://github.com/Tencent/teamai-cli/issues/1050) [#1030](https://github.com/Tencent/teamai-cli/issues/1030) [#1047](https://github.com/Tencent/teamai-cli/issues/1047)
* **doctor:** check the complete Hermes SOUL read budget ([#1331](https://github.com/Tencent/teamai-cli/issues/1331)) ([1266d4d](https://github.com/Tencent/teamai-cli/commit/1266d4d14d50ce85ba0c5c23dd8d092d93c74c43))
* **doctor:** detect OpenClaw bootstrap file truncation ([#1332](https://github.com/Tencent/teamai-cli/issues/1332)) ([d019b5b](https://github.com/Tencent/teamai-cli/commit/d019b5bb64ef8cc3be3d205552cc9981e85bc91b))
* **doctor:** detect oversized ZCode hook rule replies ([#1343](https://github.com/Tencent/teamai-cli/issues/1343)) ([8de97ae](https://github.com/Tencent/teamai-cli/commit/8de97ae4e78e74e195fb54508ba20e80ede3a67d))
* **doctor:** probe the Copilot hooks file where inject writes it ([#732](https://github.com/Tencent/teamai-cli/issues/732)) ([#733](https://github.com/Tencent/teamai-cli/issues/733)) ([ff47714](https://github.com/Tencent/teamai-cli/commit/ff4771490279a36c77739c8d144ad1baf38acd71)), closes [#695](https://github.com/Tencent/teamai-cli/issues/695)
* **doctor:** remove duplicate LocalConfig import breaking the build ([#606](https://github.com/Tencent/teamai-cli/issues/606)) ([d3f8634](https://github.com/Tencent/teamai-cli/commit/d3f86344886bcee02a25481a8cd665bcda210d41)), closes [#599](https://github.com/Tencent/teamai-cli/issues/599)
* **dry-run:** allow stats and recall previews after [#970](https://github.com/Tencent/teamai-cli/issues/970) ([#986](https://github.com/Tencent/teamai-cli/issues/986)) ([3f11504](https://github.com/Tencent/teamai-cli/commit/3f1150408b1afd9f50ab61f3b656b48ba774e8d9)), closes [#969](https://github.com/Tencent/teamai-cli/issues/969)
* **dry-run:** git previews for remove, roles/projects and import --from-repo ([#900](https://github.com/Tencent/teamai-cli/issues/900)) ([#971](https://github.com/Tencent/teamai-cli/issues/971)) ([4b23a57](https://github.com/Tencent/teamai-cli/commit/4b23a570f6a68b7ba5bad350dc7af01401b3d4a3))
* **dry-run:** let --dry-run reach recall maintenance and recall promote ([#900](https://github.com/Tencent/teamai-cli/issues/900)) ([#903](https://github.com/Tencent/teamai-cli/issues/903)) ([ed95357](https://github.com/Tencent/teamai-cli/commit/ed95357fe872626f3e62a5b510d5d072d14fd7d1))
* **dry-run:** refuse --dry-run on commands with no preview ([#900](https://github.com/Tencent/teamai-cli/issues/900)) ([#969](https://github.com/Tencent/teamai-cli/issues/969)) ([222b1ab](https://github.com/Tencent/teamai-cli/commit/222b1ab5a48f1a240015a73bf46f76d7e70d3de9)), closes [#852](https://github.com/Tencent/teamai-cli/issues/852)
* **dry-run:** restore stats and recall previews with shared owner credits ([#900](https://github.com/Tencent/teamai-cli/issues/900)) ([#977](https://github.com/Tencent/teamai-cli/issues/977)) ([e6f7573](https://github.com/Tencent/teamai-cli/commit/e6f757385813c1259e422c043dec4cd7887a5e8c))
* **dry-run:** stats and recall <query> dry runs write no local state ([#900](https://github.com/Tencent/teamai-cli/issues/900)) ([#970](https://github.com/Tencent/teamai-cli/issues/970)) ([6381cb5](https://github.com/Tencent/teamai-cli/commit/6381cb5b5bb1e141f2417b3266273e6604390a4c)), closes [#972](https://github.com/Tencent/teamai-cli/issues/972) [#901](https://github.com/Tencent/teamai-cli/issues/901) [#972](https://github.com/Tencent/teamai-cli/issues/972) [#972](https://github.com/Tencent/teamai-cli/issues/972)
* **dry-run:** stop dry-run and read-only commands persisting config migrations ([#893](https://github.com/Tencent/teamai-cli/issues/893)) ([#901](https://github.com/Tencent/teamai-cli/issues/901)) ([f8335ec](https://github.com/Tencent/teamai-cli/commit/f8335ec40d4af601092bdc9dd3734907be23835f)), closes [#866](https://github.com/Tencent/teamai-cli/issues/866) [#866](https://github.com/Tencent/teamai-cli/issues/866) [pre-#546](https://github.com/Tencent/pre-/issues/546)
* **dry-run:** thread { dryRun } into the queue lock, so a preview writes nothing ([#896](https://github.com/Tencent/teamai-cli/issues/896)) ([671f509](https://github.com/Tencent/teamai-cli/commit/671f509f70567497afe1f3ab81633f25e72de25c)), closes [#866](https://github.com/Tencent/teamai-cli/issues/866)
* **dry-run:** thread { dryRun } through the loaders contribute, session save and recall use ([#853](https://github.com/Tencent/teamai-cli/issues/853)) ([a8ab8e0](https://github.com/Tencent/teamai-cli/commit/a8ab8e00f709bcfd310d86c815b423ef2c15e42f)), closes [pre-#546](https://github.com/Tencent/pre-/issues/546) [#837](https://github.com/Tencent/teamai-cli/issues/837)
* **dry-run:** thread { dryRun } through the loaders pull, push, status and list use ([#866](https://github.com/Tencent/teamai-cli/issues/866)) ([b3b3a0b](https://github.com/Tencent/teamai-cli/commit/b3b3a0b03c446caf15b5b1ec29578ebdd00cb135)), closes [#837](https://github.com/Tencent/teamai-cli/issues/837) [pre-#546](https://github.com/Tencent/pre-/issues/546) [#853](https://github.com/Tencent/teamai-cli/issues/853) [#837](https://github.com/Tencent/teamai-cli/issues/837) [pre-#546](https://github.com/Tencent/pre-/issues/546) [#850](https://github.com/Tencent/teamai-cli/issues/850) [#853](https://github.com/Tencent/teamai-cli/issues/853)
* **dsh:** mount hooks from the default home patch ([#1223](https://github.com/Tencent/teamai-cli/issues/1223)) ([073e6f9](https://github.com/Tencent/teamai-cli/commit/073e6f9812afd0db50bc3c1a7d71b5f21a4c9fe3)), closes [#1219](https://github.com/Tencent/teamai-cli/issues/1219) [#1219](https://github.com/Tencent/teamai-cli/issues/1219) [#1219](https://github.com/Tencent/teamai-cli/issues/1219) [#1219](https://github.com/Tencent/teamai-cli/issues/1219) [#1219](https://github.com/Tencent/teamai-cli/issues/1219)
* **env,hooks,mcp,status:** name the entries that are not delivered ([#822](https://github.com/Tencent/teamai-cli/issues/822)) ([#851](https://github.com/Tencent/teamai-cli/issues/851)) ([3a9a24a](https://github.com/Tencent/teamai-cli/commit/3a9a24a6f439ec63f4de7ed1de0a6459a6c5315b)), closes [#833](https://github.com/Tencent/teamai-cli/issues/833)
* **env:** detect the right shell profile file on Windows ([#682](https://github.com/Tencent/teamai-cli/issues/682)) ([#693](https://github.com/Tencent/teamai-cli/issues/693)) ([cc38871](https://github.com/Tencent/teamai-cli/commit/cc388718184e6c23e87f90b7ce77ba0b4f0cbbed))
* **env:** give each directory its own team env ([#1018](https://github.com/Tencent/teamai-cli/issues/1018)) ([#1023](https://github.com/Tencent/teamai-cli/issues/1023)) ([1ce25ac](https://github.com/Tencent/teamai-cli/commit/1ce25ac6a6709beaec5c35079e135f3c680e18ad))
* **env:** hold env keys to the identifier rule env.sh already assumes ([#740](https://github.com/Tencent/teamai-cli/issues/740)) ([178eca7](https://github.com/Tencent/teamai-cli/commit/178eca705b9ff8a14d225fbc28ce3fce44453e2f)), closes [#738](https://github.com/Tencent/teamai-cli/issues/738)
* **env:** keep an array PROMPT_COMMAND entry whole when it holds a `;` ([5047ca3](https://github.com/Tencent/teamai-cli/commit/5047ca38edda77ae83bc42b2f8a153b6bfd32831))
* **env:** keep the user scope's env block when a project pulls ([#878](https://github.com/Tencent/teamai-cli/issues/878)) ([cd3a914](https://github.com/Tencent/teamai-cli/commit/cd3a91411248452e32761684c763d3285fbd5a62)), closes [#876](https://github.com/Tencent/teamai-cli/issues/876) [#661](https://github.com/Tencent/teamai-cli/issues/661) [#661](https://github.com/Tencent/teamai-cli/issues/661) [#876](https://github.com/Tencent/teamai-cli/issues/876) [#876](https://github.com/Tencent/teamai-cli/issues/876) [#661](https://github.com/Tencent/teamai-cli/issues/661) [#876](https://github.com/Tencent/teamai-cli/issues/876) [#876](https://github.com/Tencent/teamai-cli/issues/876) [#876](https://github.com/Tencent/teamai-cli/issues/876)
* **env:** make the shell-profile block load on Windows ([#680](https://github.com/Tencent/teamai-cli/issues/680)) ([f7d3704](https://github.com/Tencent/teamai-cli/commit/f7d37042cd7dd2fd04ccb4a65d2543e227e1d705)), closes [#661](https://github.com/Tencent/teamai-cli/issues/661) [#661](https://github.com/Tencent/teamai-cli/issues/661)
* **env:** only stick to a candidate the active profile actually reaches ([#682](https://github.com/Tencent/teamai-cli/issues/682)) ([#715](https://github.com/Tencent/teamai-cli/issues/715)) ([94a0d42](https://github.com/Tencent/teamai-cli/commit/94a0d428c1482a751e5b53a794eb9a5772b2a6c9)), closes [pre-#693](https://github.com/Tencent/pre-/issues/693) [#693](https://github.com/Tencent/teamai-cli/issues/693)
* **env:** reconcile MCP after env set and hint undeclared secrets ([#1053](https://github.com/Tencent/teamai-cli/issues/1053)) ([ee384ba](https://github.com/Tencent/teamai-cli/commit/ee384ba2741a6ce0abb704701290b964e972cb9d)), closes [#1011](https://github.com/Tencent/teamai-cli/issues/1011)
* **env:** stop the shell env loader from recursing through a script git ([#1147](https://github.com/Tencent/teamai-cli/issues/1147)) ([450be2a](https://github.com/Tencent/teamai-cli/commit/450be2aa0f4b594c34fc37cef94aaf0d79cb5fb4))
* **env:** warn when env.yaml has no top-level `variables:` key ([#681](https://github.com/Tencent/teamai-cli/issues/681)) ([71b3a5f](https://github.com/Tencent/teamai-cli/commit/71b3a5fab512d537d842a8e400f4774f02e05301)), closes [#662](https://github.com/Tencent/teamai-cli/issues/662) [#662](https://github.com/Tencent/teamai-cli/issues/662)
* **exclude:** honor --dry-run for skill exclude add/remove ([#900](https://github.com/Tencent/teamai-cli/issues/900)) ([#906](https://github.com/Tencent/teamai-cli/issues/906)) ([6b1c9ed](https://github.com/Tencent/teamai-cli/commit/6b1c9ed2c256d9a09cea4ba455ca619cd9c332f9))
* **exec:** decode captureTail streams with StringDecoder for split UTF-8 ([#1313](https://github.com/Tencent/teamai-cli/issues/1313)) ([a6b1a9f](https://github.com/Tencent/teamai-cli/commit/a6b1a9f38805257b8b9dacf5ea7c03cbb2bcf63f))
* **frontmatter:** warn when YAML frontmatter has opening --- but no closing delimiter ([0811bfe](https://github.com/Tencent/teamai-cli/commit/0811bfe0174c8f54d003a59bd7bec43757ce9ffc))
* **git-exclude:** a path the member's own rule ignores in another checkout is not foreign ([#1091](https://github.com/Tencent/teamai-cli/issues/1091)) ([9c88536](https://github.com/Tencent/teamai-cli/commit/9c88536f12b01657c2739b277f80df6ed468507a))
* **git-exclude:** classify internal Claude instruction files ([#1318](https://github.com/Tencent/teamai-cli/issues/1318)) ([c3bf248](https://github.com/Tencent/teamai-cli/commit/c3bf248e02e8ce5b87b22103e8d451e4ec46c3aa)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **git-exclude:** judge the member's rules without teamai's blocks ([#1095](https://github.com/Tencent/teamai-cli/issues/1095)) ([08254d5](https://github.com/Tencent/teamai-cli/commit/08254d5c52a4cf8971c90bc7a9930659bbf65340))
* **github:** keep the token out of the clone's remote URL ([#994](https://github.com/Tencent/teamai-cli/issues/994)) ([14731d1](https://github.com/Tencent/teamai-cli/commit/14731d1cd7fa4931332a2badac4787f806dd67eb)), closes [#978](https://github.com/Tencent/teamai-cli/issues/978) [#978](https://github.com/Tencent/teamai-cli/issues/978) [#978](https://github.com/Tencent/teamai-cli/issues/978) [#978](https://github.com/Tencent/teamai-cli/issues/978)
* **github:** launch gh via ghExec without shell interpolation ([#1361](https://github.com/Tencent/teamai-cli/issues/1361)) ([e87088a](https://github.com/Tencent/teamai-cli/commit/e87088a8cb40dc2cbe7db5a30a4e135e76015413))
* **github:** propagate organization repo fallback errors ([#959](https://github.com/Tencent/teamai-cli/issues/959)) ([ae7a418](https://github.com/Tencent/teamai-cli/commit/ae7a4185dc2435847c1d205d48a6a39fda0bb21f))
* **git:** keep the leading slash of an absolute scp-style repo path ([#1217](https://github.com/Tencent/teamai-cli/issues/1217)) ([4843f67](https://github.com/Tencent/teamai-cli/commit/4843f675ff8d3923751fad89dc698cd479227fec))
* **gitlab:** diagnose unconfigured self-hosted instances ([49efc97](https://github.com/Tencent/teamai-cli/commit/49efc97a813becead8865491376d7aaf902b28d5))
* **gitlab:** honor custom API prefix when listing group repositories ([37a2cca](https://github.com/Tencent/teamai-cli/commit/37a2cca639d615c7da264fa49a9fbdb9f2d2cd33))
* **gitlab:** preserve instance subpath when importing MRs ([#1151](https://github.com/Tencent/teamai-cli/issues/1151)) ([e8c12d7](https://github.com/Tencent/teamai-cli/commit/e8c12d73002de658104fe9510c61b62839ad69bd))
* **git:** preserve clone URLs without appending .git ([#1188](https://github.com/Tencent/teamai-cli/issues/1188)) ([0f83aba](https://github.com/Tencent/teamai-cli/commit/0f83aba0cff471ca757d9a59aae2501c8d6464f6))
* **git:** skip hooks on isolated worktree commits ([4f3fd15](https://github.com/Tencent/teamai-cli/commit/4f3fd153cb304010766026cb17c4a78a2374dac9))
* **git:** spawn git by its resolved path so macOS skips a PATH search per call ([#869](https://github.com/Tencent/teamai-cli/issues/869)) ([53c096e](https://github.com/Tencent/teamai-cli/commit/53c096e02f9abf340d1a55046dd9ae6c479aa637)), closes [#868](https://github.com/Tencent/teamai-cli/issues/868) [#868](https://github.com/Tencent/teamai-cli/issues/868)
* **git:** sweep untracked leftovers in resetToCleanMaster ([#1253](https://github.com/Tencent/teamai-cli/issues/1253)) ([2598121](https://github.com/Tencent/teamai-cli/commit/259812164f71844ef24e60a7b3f69688883206ba))
* harden team package orchestration ([40837dc](https://github.com/Tencent/teamai-cli/commit/40837dc7f39c108d2792ed69b69b5877a49ecccc))
* **hermes:** quote managed hook script paths ([#1311](https://github.com/Tencent/teamai-cli/issues/1311)) ([e1a4217](https://github.com/Tencent/teamai-cli/commit/e1a4217848e378ca457ea99e4a0dfb9aa84ad847)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* hide console windows for detached hook child processes ([#506](https://github.com/Tencent/teamai-cli/issues/506)) ([bdc59f3](https://github.com/Tencent/teamai-cli/commit/bdc59f3b6899e401f0c9ad944b60b17e3d4f2583))
* **home:** expand native Windows home-relative paths ([#1199](https://github.com/Tencent/teamai-cli/issues/1199)) ([f58f315](https://github.com/Tencent/teamai-cli/commit/f58f3154e2d003d2da1fcd7e6e9223cde107f38d))
* **home:** resolve ~ through getUserHome everywhere ([#1046](https://github.com/Tencent/teamai-cli/issues/1046)) ([76eda4d](https://github.com/Tencent/teamai-cli/commit/76eda4dbf1dc1fafd963b47e9016f5f40fd68c44))
* honor enabledAgents on builtin deploy, CLAUDE.md inject, and skip-sync ([#523](https://github.com/Tencent/teamai-cli/issues/523)) ([33b5293](https://github.com/Tencent/teamai-cli/commit/33b52936eeed517cc1ff2ef9fb5bdb27ba6013aa)), closes [#504](https://github.com/Tencent/teamai-cli/issues/504) [#510](https://github.com/Tencent/teamai-cli/issues/510)
* honor enabledAgents scoping in hooks inject and resource sync ([#504](https://github.com/Tencent/teamai-cli/issues/504)) ([38ff067](https://github.com/Tencent/teamai-cli/commit/38ff06765d65698477e5ec7a9308024670be5817))
* **hooks:** deliver self-scope ZCode hooks to its HOME config ([#1330](https://github.com/Tencent/teamai-cli/issues/1330)) ([ebbaae5](https://github.com/Tencent/teamai-cli/commit/ebbaae5a5a850fc1a66e5af1d20a3d6ec94f1b1d))
* **hooks:** find Git Bash on PATH for Windows hook injection ([9381243](https://github.com/Tencent/teamai-cli/commit/93812435831119b9ef776cc5ddd524b0adc4eb76))
* **hooks:** give built-in Codex hooks a cmd.exe commandWindows ([#1231](https://github.com/Tencent/teamai-cli/issues/1231)) ([611f467](https://github.com/Tencent/teamai-cli/commit/611f4670e90d69054b5da229ae5087e8615d4b22)), closes [#1215](https://github.com/Tencent/teamai-cli/issues/1215)
* **hooks:** give the Codex team-hook dispatcher a Windows command ([#1210](https://github.com/Tencent/teamai-cli/issues/1210)) ([0da2be7](https://github.com/Tencent/teamai-cli/commit/0da2be76689cf1a3e0c6d0a198423772eaec9131)), closes [#1074](https://github.com/Tencent/teamai-cli/issues/1074) [#1209](https://github.com/Tencent/teamai-cli/issues/1209)
* **hooks:** give the detached hook child the bundled gits on PATH ([#801](https://github.com/Tencent/teamai-cli/issues/801)) ([b465632](https://github.com/Tencent/teamai-cli/commit/b46563261ca0776e4f0fc9923dfcb4cd24a61fd1))
* **hooks:** honor --dry-run for inject ([#949](https://github.com/Tencent/teamai-cli/issues/949)) ([3abe576](https://github.com/Tencent/teamai-cli/commit/3abe576776ebb70731a9ebceabbbd0199a43035c))
* **hooks:** install Copilot built-ins in user scope ([#1038](https://github.com/Tencent/teamai-cli/issues/1038)) ([987543f](https://github.com/Tencent/teamai-cli/commit/987543fa782a67d063d88d3f7e8262f75b9e3efa))
* **hooks:** keep a removed worktree's hook events in its project ([#810](https://github.com/Tencent/teamai-cli/issues/810)) ([#824](https://github.com/Tencent/teamai-cli/issues/824)) ([c7723d6](https://github.com/Tencent/teamai-cli/commit/c7723d652be19e334e530b6b8526b906f59f9995)), closes [#748](https://github.com/Tencent/teamai-cli/issues/748) [#809](https://github.com/Tencent/teamai-cli/issues/809)
* **hooks:** keep one owner for main-checkout team hooks across worktrees ([#1003](https://github.com/Tencent/teamai-cli/issues/1003)) ([6f85cf8](https://github.com/Tencent/teamai-cli/commit/6f85cf8526d7dfc71bb0b19e5d6e1352daf01bbe))
* **hooks:** keep the Codex project hooks.json identical on every platform ([#1074](https://github.com/Tencent/teamai-cli/issues/1074) follow-up) ([#1127](https://github.com/Tencent/teamai-cli/issues/1127)) ([3865561](https://github.com/Tencent/teamai-cli/commit/38655616faa2319747a96a0c9d7e11832ce78855)), closes [#1075](https://github.com/Tencent/teamai-cli/issues/1075) [#1075](https://github.com/Tencent/teamai-cli/issues/1075)
* **hooks:** keep the Copilot skip guard text fixed across bundler renames ([#1357](https://github.com/Tencent/teamai-cli/issues/1357)) ([afdfe35](https://github.com/Tencent/teamai-cli/commit/afdfe35118726565947fd58219aa40452937f0e7)), closes [#1356](https://github.com/Tencent/teamai-cli/issues/1356)
* **hooks:** keep ZCode replies free of login shell output ([#1316](https://github.com/Tencent/teamai-cli/issues/1316)) ([c69996b](https://github.com/Tencent/teamai-cli/commit/c69996b24fdbc4d6468074aa17d5580352615bc7)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **hooks:** launch OpenCode through the installed Node entry ([#1336](https://github.com/Tencent/teamai-cli/issues/1336)) ([a26f74d](https://github.com/Tencent/teamai-cli/commit/a26f74d5bef51c498cc465b90599faa0130dc666))
* **hooks:** list each tool's own built-in hook set ([#718](https://github.com/Tencent/teamai-cli/issues/718)) ([b91b6df](https://github.com/Tencent/teamai-cli/commit/b91b6dfcaebcbe452b4bd70dce30f52c58fe4cd6)), closes [#717](https://github.com/Tencent/teamai-cli/issues/717)
* **hooks:** map Cursor skill-usage hook matcher to Read ([#1157](https://github.com/Tencent/teamai-cli/issues/1157)) ([7b71316](https://github.com/Tencent/teamai-cli/commit/7b71316b988cadf6fb75964a1998f4e065d1e497)), closes [#1156](https://github.com/Tencent/teamai-cli/issues/1156) [#1156](https://github.com/Tencent/teamai-cli/issues/1156) [#1156](https://github.com/Tencent/teamai-cli/issues/1156) [#1156](https://github.com/Tencent/teamai-cli/issues/1156)
* **hooks:** release stdin after read timeout ([#889](https://github.com/Tencent/teamai-cli/issues/889)) ([a5b36a8](https://github.com/Tencent/teamai-cli/commit/a5b36a8a73a20a2aee6bdf74208f8d2760e63c92))
* **hooks:** render CodeBuddy's Windows hooks in POSIX, not cmd.exe ([#989](https://github.com/Tencent/teamai-cli/issues/989)) ([a7aee94](https://github.com/Tencent/teamai-cli/commit/a7aee948d520f3f3103f0942797cb5a9613b80f1)), closes [#637](https://github.com/Tencent/teamai-cli/issues/637)
* **hooks:** render codex built-in hooks in PowerShell on Windows ([#1074](https://github.com/Tencent/teamai-cli/issues/1074)) ([#1075](https://github.com/Tencent/teamai-cli/issues/1075)) ([218f26a](https://github.com/Tencent/teamai-cli/commit/218f26affa13f971e45cf50952db639e76dad40e)), closes [#1034](https://github.com/Tencent/teamai-cli/issues/1034)
* **hooks:** render Cursor Windows hooks for PowerShell ([#1294](https://github.com/Tencent/teamai-cli/issues/1294)) ([99d21ff](https://github.com/Tencent/teamai-cli/commit/99d21ff35d0c0b72055b5cec82a6165c199e4397))
* **hooks:** render dsh's Windows hook commands in PowerShell syntax ([#1005](https://github.com/Tencent/teamai-cli/issues/1005)) ([#1034](https://github.com/Tencent/teamai-cli/issues/1034)) ([3ae338b](https://github.com/Tencent/teamai-cli/commit/3ae338b6e2bf1bb2476db45ebe4e204bb44f9f30))
* **hooks:** resolve Git Bash by absolute path on Windows ([#639](https://github.com/Tencent/teamai-cli/issues/639)) ([26eb0df](https://github.com/Tencent/teamai-cli/commit/26eb0df20f53a9a778ecb01efd4bbd8fc26b4096))
* **hooks:** run CodeBuddy's Windows hooks through cmd.exe ([#637](https://github.com/Tencent/teamai-cli/issues/637)) ([04b6de2](https://github.com/Tencent/teamai-cli/commit/04b6de2219ce77af78de934c9f5574960ffa487a))
* **hooks:** run every handler in the scope the dispatcher resolved ([#752](https://github.com/Tencent/teamai-cli/issues/752)) ([#769](https://github.com/Tencent/teamai-cli/issues/769)) ([cc27721](https://github.com/Tencent/teamai-cli/commit/cc2772114f5fee8347b80700e2e68357c37dc949))
* **hooks:** run OpenCode team/agent hook commands via resolved Git Bash (no sh -c) ([2786f43](https://github.com/Tencent/teamai-cli/commit/2786f433fd7ba1dac5a293e8678796c2d5c5bcd5))
* **hooks:** run POSIX DSH hooks without login profiles ([#1317](https://github.com/Tencent/teamai-cli/issues/1317)) ([28cba82](https://github.com/Tencent/teamai-cli/commit/28cba82c9a4701c467dda8a86381c5e85ab39c16)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **hooks:** skip Claude hooks when Cursor or Copilot CLI runs them ([#950](https://github.com/Tencent/teamai-cli/issues/950)) ([3459d38](https://github.com/Tencent/teamai-cli/commit/3459d38a36b3f56b1d37099a1976428a8711ee89)), closes [#948](https://github.com/Tencent/teamai-cli/issues/948) [#953](https://github.com/Tencent/teamai-cli/issues/953)
* **hooks:** stop leaving an empty Copilot hooks file ([#1092](https://github.com/Tencent/teamai-cli/issues/1092)) ([588c161](https://github.com/Tencent/teamai-cli/commit/588c1612573d69dde7efd46c47c7f9ecaaa7da7d))
* **hooks:** stop the Stop hook nudge reaching the user twice ([#720](https://github.com/Tencent/teamai-cli/issues/720)) ([cd3e0e6](https://github.com/Tencent/teamai-cli/commit/cd3e0e6ef5fd57a6da3196ed4cb51355f88b17fa))
* **hooks:** survive the Windows job object ([#608](https://github.com/Tencent/teamai-cli/issues/608)) ([6ed2515](https://github.com/Tencent/teamai-cli/commit/6ed25152dec8af8cd7997d4f5ef7a2c5416e4fb0))
* **hooks:** sync after rebase and diagnose disabled git hooks ([#983](https://github.com/Tencent/teamai-cli/issues/983)) ([f502e5a](https://github.com/Tencent/teamai-cli/commit/f502e5a0b8a13ca68dadadabf3cd8a7c9abb0988))
* **hooks:** trust Codex hooks and share project hooks across worktrees ([#958](https://github.com/Tencent/teamai-cli/issues/958)) ([f827487](https://github.com/Tencent/teamai-cli/commit/f82748727cb0794b3efe4fa5c5c50d30d87d2df4)), closes [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955) [#955](https://github.com/Tencent/teamai-cli/issues/955)
* **hooks:** widen track-slash regex to match SKILL_NAME_REGEX ([#737](https://github.com/Tencent/teamai-cli/issues/737)) ([667aed0](https://github.com/Tencent/teamai-cli/commit/667aed0f55b5e764c955c716e622e3d407f73ed5))
* **hooks:** write the declared timeout into Codex's built-in hook entries ([#1070](https://github.com/Tencent/teamai-cli/issues/1070)) ([#1071](https://github.com/Tencent/teamai-cli/issues/1071)) ([3068a0b](https://github.com/Tencent/teamai-cli/commit/3068a0bdb1fd0245114f34d5353a6780f389e7ae))
* **import:** bound GitLab MR requests with a deadline ([#1243](https://github.com/Tencent/teamai-cli/issues/1243)) ([ab2d253](https://github.com/Tencent/teamai-cli/commit/ab2d25395eeddf3f7efa159140653f7855d70ada))
* **import:** expose JSON output for cache commands ([#580](https://github.com/Tencent/teamai-cli/issues/580)) ([4bc8542](https://github.com/Tencent/teamai-cli/commit/4bc8542ddd81ca50c8229185b6baca8987a6ec92))
* **import:** paginate GitHub PR commits in REST fallback ([e11f7f4](https://github.com/Tencent/teamai-cli/commit/e11f7f4febf0c49569400b4f1ca64d9dea4faf43))
* **import:** paginate GitLab MR commits ([#1354](https://github.com/Tencent/teamai-cli/issues/1354)) ([8f8532d](https://github.com/Tencent/teamai-cli/commit/8f8532d703ebd57c5f9e59790db944cf8a48f8c5))
* **import:** preview current organization repositories safely ([#960](https://github.com/Tencent/teamai-cli/issues/960)) ([0481a2b](https://github.com/Tencent/teamai-cli/commit/0481a2bfd6ac6e2004b13a67e6a0dc929578483b))
* **import:** publish the learning `import --from-mr` extracts ([#823](https://github.com/Tencent/teamai-cli/issues/823)) ([#825](https://github.com/Tencent/teamai-cli/issues/825)) ([4a65e3f](https://github.com/Tencent/teamai-cli/commit/4a65e3f676b1a6565b9d76eb56777bb5d3b2d161))
* **import:** reject HTTP errors in GitHub PR REST fallback ([#1150](https://github.com/Tencent/teamai-cli/issues/1150)) ([e259c7b](https://github.com/Tencent/teamai-cli/commit/e259c7b4b5e761e6215f065c70ff224bf9b7abfa))
* **import:** reject interrupted GitHub PR responses ([#1189](https://github.com/Tencent/teamai-cli/issues/1189)) ([a3ac3b4](https://github.com/Tencent/teamai-cli/commit/a3ac3b4e2ab044fe528f753bbcd6df82baf5d037))
* **import:** reject invalid batch concurrency ([#1363](https://github.com/Tencent/teamai-cli/issues/1363)) ([b292f41](https://github.com/Tencent/teamai-cli/commit/b292f4188524092aed11a230bea1219e88ee2e3d))
* **import:** retry failed repository knowledge extraction ([#696](https://github.com/Tencent/teamai-cli/issues/696)) ([9ce8a0e](https://github.com/Tencent/teamai-cli/commit/9ce8a0ed405d4889827829bcca0ea26340e9c254))
* **import:** validate AI learning draft metadata ([#1305](https://github.com/Tencent/teamai-cli/issues/1305)) ([61e51e9](https://github.com/Tencent/teamai-cli/commit/61e51e97a28d052d80fcd94b6f301ebfd9ee94a6))
* **import:** write every import into one teamwiki and drop codebase --extract ([#1100](https://github.com/Tencent/teamai-cli/issues/1100)) ([139729b](https://github.com/Tencent/teamai-cli/commit/139729b4a1ad31656071ee91bf91cda0d7079b14)), closes [#900](https://github.com/Tencent/teamai-cli/issues/900)
* **init:** allow existing HTTP origin safely ([#552](https://github.com/Tencent/teamai-cli/issues/552)) ([b9cd9ea](https://github.com/Tencent/teamai-cli/commit/b9cd9ea6dce4062fe65aa6a212c1ef7bc4c55bb9))
* **init:** anchor workspace onboarding to repository roots ([#1344](https://github.com/Tencent/teamai-cli/issues/1344)) ([5dc075f](https://github.com/Tencent/teamai-cli/commit/5dc075f6b2919b6878306e60ec8b09f74bfdfc20)), closes [#1338](https://github.com/Tencent/teamai-cli/issues/1338)
* **init:** do not pull team resources during init ([#1065](https://github.com/Tencent/teamai-cli/issues/1065)) ([#1069](https://github.com/Tencent/teamai-cli/issues/1069)) ([97dc684](https://github.com/Tencent/teamai-cli/commit/97dc684c7b8413b242680e2a9636b15218aa5cd9))
* **init:** offer OpenCode in the interactive agent picker ([2acd617](https://github.com/Tencent/teamai-cli/commit/2acd6173256b151dbc34d7dfab6c4c1e45592618))
* **init:** preserve additional roles selected at the prompt ([#765](https://github.com/Tencent/teamai-cli/issues/765)) ([5576b38](https://github.com/Tencent/teamai-cli/commit/5576b38db7a710673109d4d915ff034dfa4ffe95))
* **init:** preserve member registration failure reasons ([#1272](https://github.com/Tencent/teamai-cli/issues/1272)) ([b9511c9](https://github.com/Tencent/teamai-cli/commit/b9511c9f58c82b298f5b7fb6656d16c9ba8175f8))
* **init:** push reviewer config via MR and time out hung init pushes ([#1062](https://github.com/Tencent/teamai-cli/issues/1062)) ([88ce6b2](https://github.com/Tencent/teamai-cli/commit/88ce6b20fe37df380ff5750b68995d540982057b))
* **init:** refuse provider logins without a terminal instead of hanging ([#711](https://github.com/Tencent/teamai-cli/issues/711)) ([#713](https://github.com/Tencent/teamai-cli/issues/713)) ([94eb148](https://github.com/Tencent/teamai-cli/commit/94eb1484bc0ec79bc168d0b11f100a1b0d6a8860))
* **init:** retire side worktrees before replacing repo ([#1327](https://github.com/Tencent/teamai-cli/issues/1327)) ([6ebb31c](https://github.com/Tencent/teamai-cli/commit/6ebb31ce19541aee2cf296c5b536555378d654f9))
* **init:** seed a custom agent's configured root dir on regular init, not just self-mode ([#867](https://github.com/Tencent/teamai-cli/issues/867)) ([#873](https://github.com/Tencent/teamai-cli/issues/873)) ([1d945b6](https://github.com/Tencent/teamai-cli/commit/1d945b6f36ca8517bd2c5389d42ffc0aac6b99b6)), closes [#598](https://github.com/Tencent/teamai-cli/issues/598) [#598](https://github.com/Tencent/teamai-cli/issues/598) [#510](https://github.com/Tencent/teamai-cli/issues/510) [#510](https://github.com/Tencent/teamai-cli/issues/510) [#264](https://github.com/Tencent/teamai-cli/issues/264) [#510](https://github.com/Tencent/teamai-cli/issues/510) [#264](https://github.com/Tencent/teamai-cli/issues/264) [#510](https://github.com/Tencent/teamai-cli/issues/510)
* inject hooks for WorkBuddy on Windows via its bundled PortableGit sh ([#503](https://github.com/Tencent/teamai-cli/issues/503)) ([1569f1d](https://github.com/Tencent/teamai-cli/commit/1569f1d7ac02b17dec2f8bffa79b6420ebf1fe83))
* **iwiki:** reject MCP tool execution errors ([#991](https://github.com/Tencent/teamai-cli/issues/991)) ([e3cab4e](https://github.com/Tencent/teamai-cli/commit/e3cab4ebe5843f4e16fda01615c172cbe2fcac10))
* **iwiki:** stop fetchAllPages from rejecting every space walk before it starts ([#849](https://github.com/Tencent/teamai-cli/issues/849)) ([2169f2e](https://github.com/Tencent/teamai-cli/commit/2169f2e7e7851779342e6dff94d1b0ea0b0fa7fa)), closes [#836](https://github.com/Tencent/teamai-cli/issues/836)
* keep self-update off npm link checkouts, and report hook injection only on change ([#871](https://github.com/Tencent/teamai-cli/issues/871)) ([#874](https://github.com/Tencent/teamai-cli/issues/874)) ([facc610](https://github.com/Tencent/teamai-cli/commit/facc6104f6b7862f8c792332711131bb92a6b041))
* keep TeamAI out of projects that never set it up ([#748](https://github.com/Tencent/teamai-cli/issues/748)) ([#753](https://github.com/Tencent/teamai-cli/issues/753)) ([5502d8e](https://github.com/Tencent/teamai-cli/commit/5502d8ec103d6ec1e4839079708380bd9588c6a9))
* **learnings:** find learnings despite a broken manifest and in the dashboard; show the MR import prompt ([#823](https://github.com/Tencent/teamai-cli/issues/823)) ([#834](https://github.com/Tencent/teamai-cli/issues/834)) ([81aa8ea](https://github.com/Tencent/teamai-cli/commit/81aa8ea63e97bf6a54744327cf0fe5ef89403a87)), closes [#825](https://github.com/Tencent/teamai-cli/issues/825) [#808](https://github.com/Tencent/teamai-cli/issues/808)
* **learnings:** propagate user-scope deletions ([#458](https://github.com/Tencent/teamai-cli/issues/458)) ([b036d83](https://github.com/Tencent/teamai-cli/commit/b036d838fabd60fd3431e68ce16418682482358e))
* **learnings:** publish what an older import --from-mr left in the checkout ([#823](https://github.com/Tencent/teamai-cli/issues/823)) ([#838](https://github.com/Tencent/teamai-cli/issues/838)) ([488c307](https://github.com/Tencent/teamai-cli/commit/488c3074cff895c92ea2eb3990e66ce5247b610e)), closes [#814](https://github.com/Tencent/teamai-cli/issues/814) [#831](https://github.com/Tencent/teamai-cli/issues/831)
* **learnings:** refresh knowledge branch on pull, fix recall roots + single-branch checkout ([#704](https://github.com/Tencent/teamai-cli/issues/704), [#705](https://github.com/Tencent/teamai-cli/issues/705), [#706](https://github.com/Tencent/teamai-cli/issues/706)) ([#709](https://github.com/Tencent/teamai-cli/issues/709)) ([3735a46](https://github.com/Tencent/teamai-cli/commit/3735a4672db38619030cbc5f52047ca97e76f8bf))
* **learnings:** stop self-mode contribute from wiping the local cache ([e0e7e48](https://github.com/Tencent/teamai-cli/commit/e0e7e488000f02da84794faa463e26c90f8c8ce6)), closes [#465](https://github.com/Tencent/teamai-cli/issues/465) [#458](https://github.com/Tencent/teamai-cli/issues/458) [#472](https://github.com/Tencent/teamai-cli/issues/472)
* **lint:** use String#endsWith in the Swift extractor ([#846](https://github.com/Tencent/teamai-cli/issues/846)) ([e0bf2e9](https://github.com/Tencent/teamai-cli/commit/e0bf2e967dbe463f53d201740e03db43662fde58))
* **local-agent:** default max_tokens to 4096 when unset ([72e14fe](https://github.com/Tencent/teamai-cli/commit/72e14fe985d5677d2eafcf740c6cb4c080f75ae4))
* **local-agent:** don't let re-injected managed env block Claude reconcile ([8d69446](https://github.com/Tencent/teamai-cli/commit/8d69446d1787a6e4ec851a2d71839aa93c5d5412))
* **local-agent:** don't seize Claude gateway when user configures it via shell env ([ebd846e](https://github.com/Tencent/teamai-cli/commit/ebd846ef9d5fde42160415d7d85370bd9ef6456a))
* **local-agent:** never treat HOME as a workspace ([#1052](https://github.com/Tencent/teamai-cli/issues/1052)) ([ed3c5a4](https://github.com/Tencent/teamai-cli/commit/ed3c5a4e934dcbdeeb73c10ab0f2b83328e8ff67))
* **local-agent:** only prompt project binding for CodeBuddy/WorkBuddy ([#613](https://github.com/Tencent/teamai-cli/issues/613)) ([a06400e](https://github.com/Tencent/teamai-cli/commit/a06400e430dbcf54c188aaae96f5a8cbe587d713))
* **local-agent:** report applied models immediately ([4f27a87](https://github.com/Tencent/teamai-cli/commit/4f27a876484444c2d364e462e1fc338db3833ab6))
* **local-agent:** report only TeamAI-delivered models ([6a90090](https://github.com/Tencent/teamai-cli/commit/6a90090e1c6278f3e1813c5940fc5f424ed1c7f9))
* **local-agent:** report user-scope resources from the right base dir ([#716](https://github.com/Tencent/teamai-cli/issues/716)) ([5d78861](https://github.com/Tencent/teamai-cli/commit/5d78861d9fba503756b443f727f19fc90d6275cf)), closes [#714](https://github.com/Tencent/teamai-cli/issues/714)
* **local-agent:** run plugin install commands with bash, not dash ([bf75fd5](https://github.com/Tencent/teamai-cli/commit/bf75fd5743cc3811323cd730e47b21635c7086ab))
* **local-agent:** write agent hooks where each tool reads them ([#1224](https://github.com/Tencent/teamai-cli/issues/1224)) ([6bd1e8d](https://github.com/Tencent/teamai-cli/commit/6bd1e8dd7487703dea64e6dd89bfbcd9106cf918)), closes [#1220](https://github.com/Tencent/teamai-cli/issues/1220) [#1220](https://github.com/Tencent/teamai-cli/issues/1220) [#1220](https://github.com/Tencent/teamai-cli/issues/1220) [#1220](https://github.com/Tencent/teamai-cli/issues/1220)
* **lock:** clean up zombie locks left by dead processes ([#1027](https://github.com/Tencent/teamai-cli/issues/1027)) ([#1068](https://github.com/Tencent/teamai-cli/issues/1068)) ([db283e8](https://github.com/Tencent/teamai-cli/commit/db283e8ae93f27046b171399300a04444d369124)), closes [#760](https://github.com/Tencent/teamai-cli/issues/760)
* **lock:** never rename over a lock that was just released or is still being written ([#760](https://github.com/Tencent/teamai-cli/issues/760)) ([#761](https://github.com/Tencent/teamai-cli/issues/761)) ([6a53b6f](https://github.com/Tencent/teamai-cli/commit/6a53b6f92553cf1774ee4b653c13025ea7583ab5))
* **lock:** report filesystem failures instead of contention ([#1035](https://github.com/Tencent/teamai-cli/issues/1035)) ([153e9ca](https://github.com/Tencent/teamai-cli/commit/153e9ca3ae2a822d72db3dc3d2fb357ef859ae3f))
* make doctor diagnostics actionable ([#569](https://github.com/Tencent/teamai-cli/issues/569)) ([8ea0612](https://github.com/Tencent/teamai-cli/commit/8ea061217895f36c12721201e1e65daee5fecf40))
* **manifest:** reject namespace strings that are not safe path segments ([#710](https://github.com/Tencent/teamai-cli/issues/710)) ([95cea46](https://github.com/Tencent/teamai-cli/commit/95cea46182ea5d43b8427d64bb54eab7dc935b0f))
* **mcp,doctor:** deliver OpenCode SSE servers and read the Windows user env directly ([7201b2a](https://github.com/Tencent/teamai-cli/commit/7201b2a75d0a649dab4ddd93e8be69e7e6f5c9c7))
* **mcp:** delete a project MCP config the team's last server leaves empty ([#1110](https://github.com/Tencent/teamai-cli/issues/1110)) ([ed93bad](https://github.com/Tencent/teamai-cli/commit/ed93badb99bcaef7ef5538d808794130ffdd5cb4))
* **mcp:** deliver team MCP servers to Codex in project scope ([#954](https://github.com/Tencent/teamai-cli/issues/954)) ([#956](https://github.com/Tencent/teamai-cli/issues/956)) ([40f6ecd](https://github.com/Tencent/teamai-cli/commit/40f6ecd62109edfb01eb9ea8f96902a630c5a558)), closes [#252](https://github.com/Tencent/teamai-cli/issues/252)
* **mcp:** honor --dry-run for remove ([#900](https://github.com/Tencent/teamai-cli/issues/900)) ([#937](https://github.com/Tencent/teamai-cli/issues/937)) ([daa624a](https://github.com/Tencent/teamai-cli/commit/daa624a73a863db4cf36d00a2313323f28705076))
* **mcp:** honour enabledAgents and disabledAgents in MCP reconcile ([#600](https://github.com/Tencent/teamai-cli/issues/600)) ([a2ee3d6](https://github.com/Tencent/teamai-cli/commit/a2ee3d6e63e21ae500a95914774fa2d07ea4a18d)), closes [#504](https://github.com/Tencent/teamai-cli/issues/504) [#523](https://github.com/Tencent/teamai-cli/issues/523) [#592](https://github.com/Tencent/teamai-cli/issues/592)
* **mcp:** keep a config's tracked record when git cannot answer ([#1118](https://github.com/Tencent/teamai-cli/issues/1118)) ([bcabd2b](https://github.com/Tencent/teamai-cli/commit/bcabd2bcc6f3ebfee5a296b1e521c7e0c3f9a449))
* **mcp:** preserve Muse-saved entries during reconciliation ([#1345](https://github.com/Tencent/teamai-cli/issues/1345)) ([59f2d88](https://github.com/Tencent/teamai-cli/commit/59f2d88251bfe11921d8114f66d6cd1b683a72e4)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **mcp:** publish complete ownership migration before cleanup ([#1241](https://github.com/Tencent/teamai-cli/issues/1241)) ([bc69e14](https://github.com/Tencent/teamai-cli/commit/bc69e14ce4b8884761a08512c31d17a4fb313320))
* **mcp:** resolve requires from PATH including Windows PATHEXT ([1331073](https://github.com/Tencent/teamai-cli/commit/1331073cc5d4f66e3d586512dc6655fa7894ee0e)), closes [#539](https://github.com/Tencent/teamai-cli/issues/539)
* **mcp:** resolve requires from PATH including Windows PATHEXT ([#540](https://github.com/Tencent/teamai-cli/issues/540)) ([b5ac40a](https://github.com/Tencent/teamai-cli/commit/b5ac40a60cece3889a5d42480e1daad22389ab58)), closes [#539](https://github.com/Tencent/teamai-cli/issues/539)
* **mcp:** retain Muse ownership after inferred stdio saves ([#1319](https://github.com/Tencent/teamai-cli/issues/1319)) ([6dec7c0](https://github.com/Tencent/teamai-cli/commit/6dec7c0032a2d7a0b7a75d0770398253e05c982b)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **mcp:** stop reporting an unchanged Codex server as updated ([#1111](https://github.com/Tencent/teamai-cli/issues/1111)) ([a8e29d1](https://github.com/Tencent/teamai-cli/commit/a8e29d14e3f721ddb2468f158fba61854f55860a))
* **mcp:** support SSE transport for OpenCode ([#987](https://github.com/Tencent/teamai-cli/issues/987)) ([7b2e091](https://github.com/Tencent/teamai-cli/commit/7b2e091180e3bc681071c1a9f9d1d270fa4f5776))
* **mcp:** use CodeBuddy project configuration path ([57636a2](https://github.com/Tencent/teamai-cli/commit/57636a27686df27272cac9c1954d21432f1254f2))
* **members:** read the default-branch roster as an inherited root after the reports switch ([#741](https://github.com/Tencent/teamai-cli/issues/741)) ([bc6943e](https://github.com/Tencent/teamai-cli/commit/bc6943ea30a74f8ab14c2a24b10c87849d629e9f)), closes [#489](https://github.com/Tencent/teamai-cli/issues/489) [#735](https://github.com/Tencent/teamai-cli/issues/735) [#485](https://github.com/Tencent/teamai-cli/issues/485) [#735](https://github.com/Tencent/teamai-cli/issues/735)
* **metrics:** 按请求日期归档成本明细 ([a2d8448](https://github.com/Tencent/teamai-cli/commit/a2d84485f7f842a0a64933d60122062704124917))
* **metrics:** claw back sessionsSucceeded when a resumed session later fails ([fb12dfa](https://github.com/Tencent/teamai-cli/commit/fb12dfadabdb9f4e5a0e82c40abe342fb97bd3ae)), closes [#473](https://github.com/Tencent/teamai-cli/issues/473)
* **migrate:** keep the legacy .teamai/ while the partition config cannot be read ([#797](https://github.com/Tencent/teamai-cli/issues/797)) ([#799](https://github.com/Tencent/teamai-cli/issues/799)) ([8cee7ab](https://github.com/Tencent/teamai-cli/commit/8cee7ab23e3f5537841cf58a433d777624d2738a))
* **model:** back up symlink targets correctly and tighten config perms ([99a3ed7](https://github.com/Tencent/teamai-cli/commit/99a3ed77abcf27734391011669650515ff14b678))
* **model:** clean model inject errors, guard empty --tool, mask dry-run key ([fb16e49](https://github.com/Tencent/teamai-cli/commit/fb16e49cf35cc1d21b54f9d0762c3f94b170aedb))
* **model:** emit only [1m] as the Claude context suffix ([0871fb7](https://github.com/Tencent/teamai-cli/commit/0871fb7e276bb8fa5f14dfc622dd6327edf5e030))
* **model:** force openai endpoints and allow keyless ollama ([6775a1d](https://github.com/Tencent/teamai-cli/commit/6775a1d4f244f134f6316789c22a0158f9f2e8dd))
* **model:** honor buddy availableModels whitelist and provider id ([dc0e48c](https://github.com/Tencent/teamai-cli/commit/dc0e48ccdc7fa4ec3973d2078a8a4d983e6013d7))
* **model:** report empty --tool cleanly like other input errors ([8c36196](https://github.com/Tencent/teamai-cli/commit/8c3619694906c931a69b03c76a90975962e3f1d8))
* **model:** require contextWindow in the provider catalog ([ab82f2e](https://github.com/Tencent/teamai-cli/commit/ab82f2e7fccb275937857a40962ab69b087164b2))
* **model:** resolve opencode config across .json/.jsonc and write limit.output ([1c5150e](https://github.com/Tencent/teamai-cli/commit/1c5150e7e3aee9cc79df7f031ba3fd344e09fa48))
* **models:** 跟随 Muse 已记录的配置主目录 ([#1366](https://github.com/Tencent/teamai-cli/issues/1366)) ([db9e723](https://github.com/Tencent/teamai-cli/commit/db9e7239f86e1931af9235c7773ea80a69ae62f3))
* **models:** 让 CodeBuddy 模型切换跟随记录的主目录 ([#1373](https://github.com/Tencent/teamai-cli/issues/1373)) ([8d13bc3](https://github.com/Tencent/teamai-cli/commit/8d13bc3d63524ba8ebaf2f0b3add9b3f6f8a2aaf))
* **model:** set claude default model and modelPicker on inject ([c398305](https://github.com/Tencent/teamai-cli/commit/c39830584621e6f39dc3f9d58d05bd34b655c154))
* **models:** key team values by repo identity, migrating legacy slug names ([#894](https://github.com/Tencent/teamai-cli/issues/894)) ([#895](https://github.com/Tencent/teamai-cli/issues/895)) ([92e6e2f](https://github.com/Tencent/teamai-cli/commit/92e6e2f0609cd53e7fc3e28c80a6a442ca55a3ad))
* **model:** treat prototype names as unknown tools ([5a968b0](https://github.com/Tencent/teamai-cli/commit/5a968b0e4809655834a505f45083217863dfc3f2))
* **omp:** 使用安装时的 Node 与 CLI 启动扩展回调 ([#1372](https://github.com/Tencent/teamai-cli/issues/1372)) ([d41d29d](https://github.com/Tencent/teamai-cli/commit/d41d29dbd13bdaa6f451a0b86f6912a72f606a9d))
* **omp:** report the extension status in hooks list ([#648](https://github.com/Tencent/teamai-cli/issues/648)) ([f7205ed](https://github.com/Tencent/teamai-cli/commit/f7205ed2a39d39cdd474b0440d52eb329f953dd9)), closes [#645](https://github.com/Tencent/teamai-cli/issues/645)
* **openclaw:** launch hooks through the installed Node entry ([#1307](https://github.com/Tencent/teamai-cli/issues/1307)) ([562a438](https://github.com/Tencent/teamai-cli/commit/562a438717a378204baf19f3fa499f3270538741)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **opencode:** spawn hook dispatcher without windows popup ([#688](https://github.com/Tencent/teamai-cli/issues/688)) ([2c0ae96](https://github.com/Tencent/teamai-cli/commit/2c0ae96f6a02d96a5de3dd99da5ff6c7f1e20c03))
* **opencode:** team-hook plugins 适配 OpenCode V2 插件 API ([6f28015](https://github.com/Tencent/teamai-cli/commit/6f28015d51fec3acc38ff24a180daffd875dbc5d))
* **packages:** address install review findings ([cce6e81](https://github.com/Tencent/teamai-cli/commit/cce6e81a2c077f479caa6bc888f0045e6e91ec68))
* **packages:** keep targeted dry runs side-effect free ([e70e819](https://github.com/Tencent/teamai-cli/commit/e70e8195838fdae026f00a6b2160f4d7ebff1363))
* **partition:** adopt pre-[#546](https://github.com/Tencent/teamai-cli/issues/546) legacy-named partitions instead of stranding them ([#551](https://github.com/Tencent/teamai-cli/issues/551)) ([d05b9d6](https://github.com/Tencent/teamai-cli/commit/d05b9d6b8fd80069175bd08b68ca44ff1b3e2927))
* **persistence:** write state.json and the search index atomically ([#854](https://github.com/Tencent/teamai-cli/issues/854)) ([#855](https://github.com/Tencent/teamai-cli/issues/855)) ([3ab39d9](https://github.com/Tencent/teamai-cli/commit/3ab39d94ce8ee0735aff3213e44c74960a9a294e)), closes [#827](https://github.com/Tencent/teamai-cli/issues/827) [#831](https://github.com/Tencent/teamai-cli/issues/831) [#812](https://github.com/Tencent/teamai-cli/issues/812)
* **pi:** 使用安装时的 Node 和 CLI 启动扩展调度 ([#1365](https://github.com/Tencent/teamai-cli/issues/1365)) ([a982cec](https://github.com/Tencent/teamai-cli/commit/a982cec0f2238356647f5c62cfaa8f8f097b9bf6))
* **pid-monitor:** query the Windows process table once per process (#N) ([#1174](https://github.com/Tencent/teamai-cli/issues/1174)) ([fe3b906](https://github.com/Tencent/teamai-cli/commit/fe3b906707402837126d157915e2a8041c14875d))
* **pid-monitor:** resolve the process tree on Windows ([#691](https://github.com/Tencent/teamai-cli/issues/691)) ([1f52967](https://github.com/Tencent/teamai-cli/commit/1f52967dbd6d7add7e2bb9e5c6b8af2c109f3c5c))
* **pkg:** route npm package installs through pnpm in pnpm workspaces ([#1211](https://github.com/Tencent/teamai-cli/issues/1211)) ([9cbbc4a](https://github.com/Tencent/teamai-cli/commit/9cbbc4afcec9d8997323f4e08083557e531788a6))
* preserve canonical agent metadata when merging native edits ([5680112](https://github.com/Tencent/teamai-cli/commit/56801122fef7cecf2f4e64f0f0f1756d345654e0))
* preserve OpenCode V1 hooks and support V2 ([#982](https://github.com/Tencent/teamai-cli/issues/982)) ([f6666ce](https://github.com/Tencent/teamai-cli/commit/f6666ceb8f68034757987120f5892a14cdb5916d))
* preserve personal JoyCode rules during cleanup ([5dfd343](https://github.com/Tencent/teamai-cli/commit/5dfd343c9ca1fac82fffeee7d0d3e2f569911944))
* prevent infinite nudge loop when model declares empty referenced-doc-ids ([#614](https://github.com/Tencent/teamai-cli/issues/614)) ([9e8f2ab](https://github.com/Tencent/teamai-cli/commit/9e8f2abf07775644709092326336c625016234a4))
* prevent stale Copilot rules from reverting team updates ([#857](https://github.com/Tencent/teamai-cli/issues/857)) ([4743892](https://github.com/Tencent/teamai-cli/commit/47438926faa9a71e43657fd94d0080ab2fe43085))
* **projects:** honor dry-run when selecting projects ([#905](https://github.com/Tencent/teamai-cli/issues/905)) ([d4d1c64](https://github.com/Tencent/teamai-cli/commit/d4d1c6418e0bc63140e6bda4740d01dc0c934ab5))
* **providers:** resolve and launch the gh/cnb CLIs portably ([#520](https://github.com/Tencent/teamai-cli/issues/520)) ([8a6bf5a](https://github.com/Tencent/teamai-cli/commit/8a6bf5ac4fe58f558dd8567932f3f270443025c9)), closes [#496](https://github.com/Tencent/teamai-cli/issues/496)
* **pull:** deliver each member's team instructions without the shared AGENTS.md ([#945](https://github.com/Tencent/teamai-cli/issues/945)) ([#952](https://github.com/Tencent/teamai-cli/issues/952)) ([0dafce9](https://github.com/Tencent/teamai-cli/commit/0dafce9a3c646611fb90f4256bbf7bd7004b5334)), closes [#940](https://github.com/Tencent/teamai-cli/issues/940) [#940](https://github.com/Tencent/teamai-cli/issues/940) [#940](https://github.com/Tencent/teamai-cli/issues/940) [#940](https://github.com/Tencent/teamai-cli/issues/940) [#940](https://github.com/Tencent/teamai-cli/issues/940) [#947](https://github.com/Tencent/teamai-cli/issues/947) [#947](https://github.com/Tencent/teamai-cli/issues/947) [#938](https://github.com/Tencent/teamai-cli/issues/938)
* **pull:** deliver team resources to a worktree added after the last pull ([#807](https://github.com/Tencent/teamai-cli/issues/807)) ([#811](https://github.com/Tencent/teamai-cli/issues/811)) ([9f81ae6](https://github.com/Tencent/teamai-cli/commit/9f81ae675199b63be554877daea448b1c5e4e73e))
* **pull:** do not deliver an env, hook or MCP entry with a mistyped key ([#822](https://github.com/Tencent/teamai-cli/issues/822)) ([#833](https://github.com/Tencent/teamai-cli/issues/833)) ([b136c9c](https://github.com/Tencent/teamai-cli/commit/b136c9c654847883d99a0444c670e9c70d153ac1)), closes [#337](https://github.com/Tencent/teamai-cli/issues/337) [#832](https://github.com/Tencent/teamai-cli/issues/832)
* **pull:** do not self-heal the .gitignore under --dry-run ([#944](https://github.com/Tencent/teamai-cli/issues/944)) ([b0ce1f2](https://github.com/Tencent/teamai-cli/commit/b0ce1f228fe87b52d209e8f1da7086962df1b6b0)), closes [#866](https://github.com/Tencent/teamai-cli/issues/866) [#896](https://github.com/Tencent/teamai-cli/issues/896)
* **pull:** don't skip sync when a submodule update changed the tree ([#526](https://github.com/Tencent/teamai-cli/issues/526)) ([ba24e80](https://github.com/Tencent/teamai-cli/commit/ba24e801460d3b53517d0a2697868d41bd5b1dc8)), closes [#501](https://github.com/Tencent/teamai-cli/issues/501) [#525](https://github.com/Tencent/teamai-cli/issues/525) [#525](https://github.com/Tencent/teamai-cli/issues/525)
* **pull:** gate the generic sync report on a tool that can receive it ([#751](https://github.com/Tencent/teamai-cli/issues/751)) ([d3637ea](https://github.com/Tencent/teamai-cli/commit/d3637ea2706d8836b970371b6320fd60db6de567)), closes [#585](https://github.com/Tencent/teamai-cli/issues/585) [#585](https://github.com/Tencent/teamai-cli/issues/585) [#597](https://github.com/Tencent/teamai-cli/issues/597) [#585](https://github.com/Tencent/teamai-cli/issues/585)
* **pull:** include root-level claudemd files ([#653](https://github.com/Tencent/teamai-cli/issues/653)) ([437ab2b](https://github.com/Tencent/teamai-cli/commit/437ab2b177bac3ff359eda3e5ff839ab80eae422))
* **pull:** keep a skill, rule or agent you edited instead of overwriting it ([#822](https://github.com/Tencent/teamai-cli/issues/822)) ([#865](https://github.com/Tencent/teamai-cli/issues/865)) ([417e704](https://github.com/Tencent/teamai-cli/commit/417e70427c53729cbfc73cc2631db23b698a8788)), closes [#815](https://github.com/Tencent/teamai-cli/issues/815)
* **pull:** keep an old skills directory any installed or selected tool still reads ([#1221](https://github.com/Tencent/teamai-cli/issues/1221)) ([2d34ca2](https://github.com/Tencent/teamai-cli/commit/2d34ca254380c1a17af431f65e89a5b9d12a70f0))
* **pull:** keep teamai's copies in a skills directory a tool left, and name it once ([#1221](https://github.com/Tencent/teamai-cli/issues/1221)) ([50fb728](https://github.com/Tencent/teamai-cli/commit/50fb72832a5ef5c40b30f2463fdff598b14f6ef5))
* **pull:** name the skills a pull removes because they are no longer delivered ([#911](https://github.com/Tencent/teamai-cli/issues/911)) ([#917](https://github.com/Tencent/teamai-cli/issues/917)) ([128844f](https://github.com/Tencent/teamai-cli/commit/128844fe6c4b2007f5bb4eb59988a13bb78f5f82))
* **pull:** pass force option through MCP reconcile ([#762](https://github.com/Tencent/teamai-cli/issues/762)) ([d729ad1](https://github.com/Tencent/teamai-cli/commit/d729ad175024182657cb55e2cd870ff647869e7f))
* **pull:** refresh the team clone before reading teamai.yaml ([#556](https://github.com/Tencent/teamai-cli/issues/556)) ([c83b9b1](https://github.com/Tencent/teamai-cli/commit/c83b9b13319821fb16de01765222ee59e1900f3b))
* **pull:** report hooks and MCP entry warnings on a dry run ([#832](https://github.com/Tencent/teamai-cli/issues/832)) ([fe03787](https://github.com/Tencent/teamai-cli/commit/fe0378782fcc3946d61c2511ed5a75db4aec270c)), closes [#822](https://github.com/Tencent/teamai-cli/issues/822)
* **pull:** sync nothing in a project whose config cannot be read ([#784](https://github.com/Tencent/teamai-cli/issues/784)) ([#792](https://github.com/Tencent/teamai-cli/issues/792)) ([1fd400e](https://github.com/Tencent/teamai-cli/commit/1fd400ecfa80b464ffabdc06a8e01f8dfd008f63)), closes [#748](https://github.com/Tencent/teamai-cli/issues/748) [#748](https://github.com/Tencent/teamai-cli/issues/748) [#769](https://github.com/Tencent/teamai-cli/issues/769) [#748](https://github.com/Tencent/teamai-cli/issues/748) [#748](https://github.com/Tencent/teamai-cli/issues/748)
* **push:** guard stale self-mode skill directories ([#1333](https://github.com/Tencent/teamai-cli/issues/1333)) ([043bf8c](https://github.com/Tencent/teamai-cli/commit/043bf8ce5d22702ed29bb02f6c67ac5f10697422))
* **push:** honor explicit branch and protect dirty team clones ([#690](https://github.com/Tencent/teamai-cli/issues/690)) ([9d3a91c](https://github.com/Tencent/teamai-cli/commit/9d3a91cf76955af406b4999f902e0f2772805801))
* **push:** keep a teammate's update when pushing from a stale worktree ([#812](https://github.com/Tencent/teamai-cli/issues/812)) ([#819](https://github.com/Tencent/teamai-cli/issues/819)) ([f558b94](https://github.com/Tencent/teamai-cli/commit/f558b9461492a2a94e790f1935976036909b12dc))
* **push:** keep config changes on explicit branch ([#820](https://github.com/Tencent/teamai-cli/issues/820)) ([e733377](https://github.com/Tencent/teamai-cli/commit/e7333778ff60457cb7a8986fd40dc7062d02a258))
* **push:** namespace new rules and agents from --role/--project ([#649](https://github.com/Tencent/teamai-cli/issues/649)) ([#698](https://github.com/Tencent/teamai-cli/issues/698)) ([d80d5a8](https://github.com/Tencent/teamai-cli/commit/d80d5a8678b78fce66b476fe5a9491ea1539b11c)), closes [#654](https://github.com/Tencent/teamai-cli/issues/654) [/github.com/Tencent/teamai-cli/pull/698#issuecomment-5770251793](https://github.com/Tencent//github.com/Tencent/teamai-cli/pull/698/issues/issuecomment-5770251793) [#331](https://github.com/Tencent/teamai-cli/issues/331) [#654](https://github.com/Tencent/teamai-cli/issues/654)
* **push:** preserve empty file additions ([#821](https://github.com/Tencent/teamai-cli/issues/821)) ([306e63f](https://github.com/Tencent/teamai-cli/commit/306e63f3559a96da06ce7517a4351e6a19446273))
* **push:** preserve namespaced rule destinations ([#654](https://github.com/Tencent/teamai-cli/issues/654)) ([9dcd23e](https://github.com/Tencent/teamai-cli/commit/9dcd23e3bb72cde828c2e34d685381a0d92e0503))
* **push:** publish only team-shared skill names in stats ([#1056](https://github.com/Tencent/teamai-cli/issues/1056)) ([d8baaec](https://github.com/Tencent/teamai-cli/commit/d8baaec8d0b4744caabb3be75e702ffd226d3b7b)), closes [#1055](https://github.com/Tencent/teamai-cli/issues/1055) [#1055](https://github.com/Tencent/teamai-cli/issues/1055)
* **push:** publish the env files env add leaves in a standalone clone ([#881](https://github.com/Tencent/teamai-cli/issues/881)) ([#885](https://github.com/Tencent/teamai-cli/issues/885)) ([f836db4](https://github.com/Tencent/teamai-cli/commit/f836db4230864cd0af0c3a3988f155d4dbfdab24))
* **push:** scope skills like pull when no project is active, and say why a skill is left out ([#1094](https://github.com/Tencent/teamai-cli/issues/1094)) ([fce0021](https://github.com/Tencent/teamai-cli/commit/fce002190ebe4ca022d2854f0aa3e83a2be6caeb))
* **push:** send kept skill edits back and place new resources by active projects ([#1020](https://github.com/Tencent/teamai-cli/issues/1020), [#1021](https://github.com/Tencent/teamai-cli/issues/1021)) ([#1022](https://github.com/Tencent/teamai-cli/issues/1022)) ([0ae8d0f](https://github.com/Tencent/teamai-cli/commit/0ae8d0f78d16cd86b0b593c9d44936818b41b264))
* **push:** stop empty skill subdirs from becoming a namespace ([#533](https://github.com/Tencent/teamai-cli/issues/533)) ([c77e66f](https://github.com/Tencent/teamai-cli/commit/c77e66fc24d1f5140430cf85ff6b76659947a84d))
* **push:** stop offering a teammate's update back as a local edit ([#823](https://github.com/Tencent/teamai-cli/issues/823)) ([#827](https://github.com/Tencent/teamai-cli/issues/827)) ([e79db17](https://github.com/Tencent/teamai-cli/commit/e79db174c462e2611bff6d1dfe399f634aace596)), closes [#812](https://github.com/Tencent/teamai-cli/issues/812) [#814](https://github.com/Tencent/teamai-cli/issues/814)
* **push:** stop reverting a teammate's update from HOME or a stale .teamai copy ([#823](https://github.com/Tencent/teamai-cli/issues/823)) ([#835](https://github.com/Tencent/teamai-cli/issues/835)) ([49675a9](https://github.com/Tencent/teamai-cli/commit/49675a9787882fc287f2ef3501fef2b18c4b83f4)), closes [#819](https://github.com/Tencent/teamai-cli/issues/819)
* read the recorded tool root in the installed-tool gate ([#1017](https://github.com/Tencent/teamai-cli/issues/1017)) ([290e6b1](https://github.com/Tencent/teamai-cli/commit/290e6b1c00dd3091a187d979ee4c9c9f4d6cc477))
* **recall:** cap the confidence feedback ratio ([#1256](https://github.com/Tencent/teamai-cli/issues/1256)) ([2aa8a8a](https://github.com/Tencent/teamai-cli/commit/2aa8a8adaa1b2f6d721279ea9ed26ca286da9567))
* **recall:** gate the CLAUDE.md recall block on enabledAgents ([#535](https://github.com/Tencent/teamai-cli/issues/535)) ([c23fd70](https://github.com/Tencent/teamai-cli/commit/c23fd70380a3ae528dce227f9afbeaff8ad7bdc6))
* **recall:** honor --dry-run for enable and disable ([#900](https://github.com/Tencent/teamai-cli/issues/900)) ([#907](https://github.com/Tencent/teamai-cli/issues/907)) ([75a7782](https://github.com/Tencent/teamai-cli/commit/75a7782f74a8e4fe6089f3cf500be9f41b8b4fe8))
* **recall:** honor --dry-run for feedback ([#900](https://github.com/Tencent/teamai-cli/issues/900)) ([#965](https://github.com/Tencent/teamai-cli/issues/965)) ([03367ef](https://github.com/Tencent/teamai-cli/commit/03367ef3b51838dbab4d95a052918a150cf0523c))
* **recall:** include pending local votes in index builds ([#1276](https://github.com/Tencent/teamai-cli/issues/1276)) ([e45baeb](https://github.com/Tencent/teamai-cli/commit/e45baeba7c9845625330125fe59a52cf24a6454b))
* **recall:** keep maintenance --dry-run from creating the learnings checkout ([#1114](https://github.com/Tencent/teamai-cli/issues/1114)) ([435b9f2](https://github.com/Tencent/teamai-cli/commit/435b9f22a898ffddbbb57b80a2b24300fff43702)), closes [#970](https://github.com/Tencent/teamai-cli/issues/970) [#900](https://github.com/Tencent/teamai-cli/issues/900) [#900](https://github.com/Tencent/teamai-cli/issues/900)
* **recall:** keep maintenance report reads fresh ([9da466d](https://github.com/Tencent/teamai-cli/commit/9da466dc215d0bcfdf5474cace241ca1d88fb42b))
* **recall:** keep team votes read-only during negative feedback ([#975](https://github.com/Tencent/teamai-cli/issues/975)) ([cd25412](https://github.com/Tencent/teamai-cli/commit/cd2541268cd80b0d609f93256cfd19dac7098a17))
* **recall:** normalize scores across knowledge sources ([#891](https://github.com/Tencent/teamai-cli/issues/891)) ([479f811](https://github.com/Tencent/teamai-cli/commit/479f811b5258d0f4c8af93ca63c26b9a63b4e673))
* **recall:** preserve confirmed votes in narrow clones ([#1282](https://github.com/Tencent/teamai-cli/issues/1282)) ([c4a61fc](https://github.com/Tencent/teamai-cli/commit/c4a61fc34363d7b0a21c06f6b6b178b9c7449f5b))
* **recall:** read each agent's session variable so recall quality joins its session ([#887](https://github.com/Tencent/teamai-cli/issues/887)) ([11657bc](https://github.com/Tencent/teamai-cli/commit/11657bcfab667cb6c692d41be756938597da9c5d))
* **recall:** rebuild the search index however much smaller it gets ([#1006](https://github.com/Tencent/teamai-cli/issues/1006)) ([#1019](https://github.com/Tencent/teamai-cli/issues/1019)) ([e77e632](https://github.com/Tencent/teamai-cli/commit/e77e6323c869b4d2dada51f60f4c1ce4c22a8a70)), closes [#823](https://github.com/Tencent/teamai-cli/issues/823)
* **recall:** resolve project-scope config in recall commands ([f33eaf1](https://github.com/Tencent/teamai-cli/commit/f33eaf1086ebc01b8c9d4ce5e7f942de3e45356a))
* **recall:** resolve self-mode maintenance reports ([d21cf3a](https://github.com/Tencent/teamai-cli/commit/d21cf3a45ffde2246cc82ef6fc1b7ac4a703cb6f))
* **recall:** search nothing in a project whose config cannot be read ([#796](https://github.com/Tencent/teamai-cli/issues/796)) ([#798](https://github.com/Tencent/teamai-cli/issues/798)) ([ec56a67](https://github.com/Tencent/teamai-cli/commit/ec56a67c1b2d28c953bf519d8638d51dc6899052)), closes [#784](https://github.com/Tencent/teamai-cli/issues/784) [#787](https://github.com/Tencent/teamai-cli/issues/787) [#787](https://github.com/Tencent/teamai-cli/issues/787) [#787](https://github.com/Tencent/teamai-cli/issues/787)
* **recall:** stop maintenance scans rewriting v1 votes files ([#968](https://github.com/Tencent/teamai-cli/issues/968)) ([6c5949f](https://github.com/Tencent/teamai-cli/commit/6c5949f86e5ef9a8051d0454a8c6e3be440b2cf1)), closes [#900](https://github.com/Tencent/teamai-cli/issues/900)
* **recall:** stop teamai-recall subagent from recursing in cursor ([#553](https://github.com/Tencent/teamai-cli/issues/553)) ([0280b91](https://github.com/Tencent/teamai-cli/commit/0280b91c21efd999866ec2b330270cb5ae8400f7))
* **recall:** use upvote time for confidence recency ([#1278](https://github.com/Tencent/teamai-cli/issues/1278)) ([#1285](https://github.com/Tencent/teamai-cli/issues/1285)) ([78ddffb](https://github.com/Tencent/teamai-cli/commit/78ddffb66d5b732cf12882a466b33d4984f3fb59))
* **recall:** write promoted skills in discoverable layout ([#1352](https://github.com/Tencent/teamai-cli/issues/1352)) ([4bf1082](https://github.com/Tencent/teamai-cli/commit/4bf1082ce34312e712f09f5c71ce69555bb73b4a))
* **recommend:** recommend only skills pull delivers to this scope ([#1089](https://github.com/Tencent/teamai-cli/issues/1089)) ([459c360](https://github.com/Tencent/teamai-cli/commit/459c360ceb00ce6979b669060d96b5ab822945ce))
* **reconcile:** migrate legacy bridge edges ([1844641](https://github.com/Tencent/teamai-cli/commit/18446416fe4e7ec86a28fa6d6de73bb2b90462dd))
* redact prompt summaries before local persistence ([#685](https://github.com/Tencent/teamai-cli/issues/685)) ([f4d09c2](https://github.com/Tencent/teamai-cli/commit/f4d09c2cc8c096b25dc8b1662ae2d1d3cd7ecd3e))
* **redact:** keep redaction linear on long tokens ([#1299](https://github.com/Tencent/teamai-cli/issues/1299)) ([d90056d](https://github.com/Tencent/teamai-cli/commit/d90056de0f53f6928fabf9671db70922bfed25ba))
* **remove:** honour enabledAgents when removing rules and skills ([#592](https://github.com/Tencent/teamai-cli/issues/592)) ([c674ffe](https://github.com/Tencent/teamai-cli/commit/c674ffe9b8523698e9f30fd4e62d349ee3330e8c)), closes [#589](https://github.com/Tencent/teamai-cli/issues/589) [#576](https://github.com/Tencent/teamai-cli/issues/576) [#590](https://github.com/Tencent/teamai-cli/issues/590)
* **remove:** remove a root MCP server named 'ambiguous' instead of refusing it silently ([#862](https://github.com/Tencent/teamai-cli/issues/862)) ([#864](https://github.com/Tencent/teamai-cli/issues/864)) ([e2fd0ab](https://github.com/Tencent/teamai-cli/commit/e2fd0abf113f5b928e5a4bbb23adb7e75b5664b8))
* report 'not initialized' cleanly from status, list and push ([#1229](https://github.com/Tencent/teamai-cli/issues/1229)) ([380182a](https://github.com/Tencent/teamai-cli/commit/380182ae6eb00ad2e49fb9295c8a18023039662c)), closes [#1227](https://github.com/Tencent/teamai-cli/issues/1227)
* **report:** each scope keeps its own reported dashboard snapshots ([#786](https://github.com/Tencent/teamai-cli/issues/786)) ([#795](https://github.com/Tencent/teamai-cli/issues/795)) ([352cfc4](https://github.com/Tencent/teamai-cli/commit/352cfc4ccceea0664333e3181106dbd5e1a523a1)), closes [#785](https://github.com/Tencent/teamai-cli/issues/785)
* **report:** each scope reports its own dashboard sessions once, against its own snapshots ([#785](https://github.com/Tencent/teamai-cli/issues/785), [#786](https://github.com/Tencent/teamai-cli/issues/786)) ([#791](https://github.com/Tencent/teamai-cli/issues/791)) ([c73d221](https://github.com/Tencent/teamai-cli/commit/c73d22147d90aa6fb37eeee67aed34611e7f8724)), closes [#666](https://github.com/Tencent/teamai-cli/issues/666) [pre-#748](https://github.com/Tencent/pre-/issues/748) [#771](https://github.com/Tencent/teamai-cli/issues/771) [#795](https://github.com/Tencent/teamai-cli/issues/795) [#795](https://github.com/Tencent/teamai-cli/issues/795) [#666](https://github.com/Tencent/teamai-cli/issues/666) [#795](https://github.com/Tencent/teamai-cli/issues/795)
* **reporter:** scope MCP inventory to the current tool ([a9a6bfa](https://github.com/Tencent/teamai-cli/commit/a9a6bfa3a38bb81e21ce2cd6d0ed8fe2a46f3d1c)), closes [#427](https://github.com/Tencent/teamai-cli/issues/427)
* **reports:** await the late usage report in session-start pull ([#1323](https://github.com/Tencent/teamai-cli/issues/1323)) ([83f6d1d](https://github.com/Tencent/teamai-cli/commit/83f6d1db22cdc21ab801556c5c3d95950d3e5e8e)), closes [#1322](https://github.com/Tencent/teamai-cli/issues/1322)
* **report:** scope usage by path on Windows too ([#630](https://github.com/Tencent/teamai-cli/issues/630)) ([67b6f08](https://github.com/Tencent/teamai-cli/commit/67b6f080a98d008703fe96f905df88ab87deed54))
* **reports:** keep teamai-reports reads fresh and read-only ([#560](https://github.com/Tencent/teamai-cli/issues/560)) ([1734c31](https://github.com/Tencent/teamai-cli/commit/1734c31ec83188d8d50ef63bb0e51a9003a1ee2e)), closes [#489](https://github.com/Tencent/teamai-cli/issues/489) [#558](https://github.com/Tencent/teamai-cli/issues/558) [#557](https://github.com/Tencent/teamai-cli/issues/557) [#557](https://github.com/Tencent/teamai-cli/issues/557) [#558](https://github.com/Tencent/teamai-cli/issues/558) [#557](https://github.com/Tencent/teamai-cli/issues/557) [#558](https://github.com/Tencent/teamai-cli/issues/558) [#561](https://github.com/Tencent/teamai-cli/issues/561) [#561](https://github.com/Tencent/teamai-cli/issues/561)
* **reports:** kill stalled side-branch git with createGitWithBlockTimeout ([#1268](https://github.com/Tencent/teamai-cli/issues/1268)) ([af7e650](https://github.com/Tencent/teamai-cli/commit/af7e6503041276cc978ff59f384dbc5f1a158476))
* **reports:** merge report writes onto origin's latest reports data ([#581](https://github.com/Tencent/teamai-cli/issues/581)) ([57586c9](https://github.com/Tencent/teamai-cli/commit/57586c99e11feba07c47118feefcf31029508469)), closes [#561](https://github.com/Tencent/teamai-cli/issues/561) [#561](https://github.com/Tencent/teamai-cli/issues/561)
* **reports:** retry pushes with existing report content ([#1291](https://github.com/Tencent/teamai-cli/issues/1291)) ([97f1e7b](https://github.com/Tencent/teamai-cli/commit/97f1e7b4021b5268f2f9ae9a8c7af5050c784501))
* resolve npm and install prefix from the running CLI for self-update ([#502](https://github.com/Tencent/teamai-cli/issues/502)) ([067b2c0](https://github.com/Tencent/teamai-cli/commit/067b2c026a25b4757aa6200a3db7921a3d7a1c91))
* resolve the main checkout of submodules and separate git dirs ([#1041](https://github.com/Tencent/teamai-cli/issues/1041)) ([#1043](https://github.com/Tencent/teamai-cli/issues/1043)) ([f723ec5](https://github.com/Tencent/teamai-cli/commit/f723ec5b05cd1318e1688e3461125925a235abdd))
* **review:** honor dry-run for apply, reject and batch decisions ([#930](https://github.com/Tencent/teamai-cli/issues/930)) ([83eb8a8](https://github.com/Tencent/teamai-cli/commit/83eb8a8083221db0afe238f32e480b07771b86be))
* **review:** keep a symlink's target exactly as git stores it ([026042e](https://github.com/Tencent/teamai-cli/commit/026042e46eb9968f517fb1512166e3ec2c201aec))
* **review:** print review reject/apply output in English ([#836](https://github.com/Tencent/teamai-cli/issues/836)) ([#859](https://github.com/Tencent/teamai-cli/issues/859)) ([78477fa](https://github.com/Tencent/teamai-cli/commit/78477fa16ab2d8fdaeb4bd84cd1fbd3091427db3))
* **rules:** address Codex delivery review findings ([#947](https://github.com/Tencent/teamai-cli/issues/947)) ([aabf71c](https://github.com/Tencent/teamai-cli/commit/aabf71c7ff8a62ab8385ca132f5a5c035128da39))
* **rules:** give Codex the team rules: session hooks in a project, its own AGENTS.md in user scope ([#940](https://github.com/Tencent/teamai-cli/issues/940)) ([9bcd53e](https://github.com/Tencent/teamai-cli/commit/9bcd53e915aec3133750e76333c6e1878c745bc2)), closes [#938](https://github.com/Tencent/teamai-cli/issues/938) [#938](https://github.com/Tencent/teamai-cli/issues/938) [pre-#938](https://github.com/Tencent/pre-/issues/938) [#822](https://github.com/Tencent/teamai-cli/issues/822) [#938](https://github.com/Tencent/teamai-cli/issues/938) [pre-#938](https://github.com/Tencent/pre-/issues/938) [#938](https://github.com/Tencent/teamai-cli/issues/938) [#938](https://github.com/Tencent/teamai-cli/issues/938) [#942](https://github.com/Tencent/teamai-cli/issues/942) [#938](https://github.com/Tencent/teamai-cli/issues/938) [#945](https://github.com/Tencent/teamai-cli/issues/945) [#938](https://github.com/Tencent/teamai-cli/issues/938)
* **rules:** give ZCode, DeepSeek Harness and JoyCode the instruction blocks in their user rules file ([#1029](https://github.com/Tencent/teamai-cli/issues/1029)) ([#1031](https://github.com/Tencent/teamai-cli/issues/1031)) ([0ee15d6](https://github.com/Tencent/teamai-cli/commit/0ee15d6d2701bd5c2a010d9cd1d04b46afb91c8e)), closes [#957](https://github.com/Tencent/teamai-cli/issues/957)
* **rules:** preserve rule bodies after empty frontmatter ([#1350](https://github.com/Tencent/teamai-cli/issues/1350)) ([a890d96](https://github.com/Tencent/teamai-cli/commit/a890d9663429d6569c48b392fb6c7583b01336bc))
* **rules:** reclaim delivered team rules when none is selected ([#802](https://github.com/Tencent/teamai-cli/issues/802)) ([#815](https://github.com/Tencent/teamai-cli/issues/815)) ([732c42c](https://github.com/Tencent/teamai-cli/commit/732c42cb6d7a005e9e738b8124aa7e1923150e48))
* **rules:** use native formats and scope-specific delivery ([#957](https://github.com/Tencent/teamai-cli/issues/957)) ([a8957a8](https://github.com/Tencent/teamai-cli/commit/a8957a8943a297b08fbc017b48d9b29c8bb98b98)), closes [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#945](https://github.com/Tencent/teamai-cli/issues/945) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#945](https://github.com/Tencent/teamai-cli/issues/945) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946) [#946](https://github.com/Tencent/teamai-cli/issues/946)
* **score:** count a skill read that may not have run only when its output shows it ([#1358](https://github.com/Tencent/teamai-cli/issues/1358)) ([1e4cec7](https://github.com/Tencent/teamai-cli/commit/1e4cec76aeb3a6c6f6ea8ea345134e29931ac079))
* **search:** isolate IDF statistics by domain ([#902](https://github.com/Tencent/teamai-cli/issues/902)) ([7e6ebae](https://github.com/Tencent/teamai-cli/commit/7e6ebae2a4a7618e08d10041f0d75870f276b04a))
* **session:** Codex counts as installed before its first session; session pull leaves _index.json unchanged ([#1141](https://github.com/Tencent/teamai-cli/issues/1141)) ([61dfbb6](https://github.com/Tencent/teamai-cli/commit/61dfbb62b14b0150e2aa989c8f4544a76310b89f))
* **session:** honor Cursor CLI's two recorded tool roots ([#1165](https://github.com/Tencent/teamai-cli/issues/1165)) ([4f2729f](https://github.com/Tencent/teamai-cli/commit/4f2729f95df24368d2bb6f7c6ff9abaa9a7f7d87))
* **session:** keep Claude Code turns in order when the chain runs through system lines ([#1145](https://github.com/Tencent/teamai-cli/issues/1145)) ([f74c871](https://github.com/Tencent/teamai-cli/commit/f74c871976e57f7c39c2d85224e816d613b228e8))
* **session:** keep images returned by tools in Claude Code and Codex sessions ([#1254](https://github.com/Tencent/teamai-cli/issues/1254)) ([2d507f2](https://github.com/Tencent/teamai-cli/commit/2d507f21fa5b8c9d42ce2306591df41f56b1fb0d))
* **session:** keep the patch of a Codex apply_patch edit ([#1146](https://github.com/Tencent/teamai-cli/issues/1146)) ([ed95a84](https://github.com/Tencent/teamai-cli/commit/ed95a841425833fbab9b77e79a97db909be71fcc))
* **session:** keep the text of a Codex tool output given as a list ([#1202](https://github.com/Tencent/teamai-cli/issues/1202)) ([5fc76d7](https://github.com/Tencent/teamai-cli/commit/5fc76d77f1504173e05c7773d720710f5bb77ea7))
* **session:** keep user images when reading and writing Codex sessions ([#1230](https://github.com/Tencent/teamai-cli/issues/1230)) ([8787405](https://github.com/Tencent/teamai-cli/commit/8787405e59353a8da33f7eaf6b9781b0b3188cd2))
* **session:** match CodeBuddy long project directory names ([#1347](https://github.com/Tencent/teamai-cli/issues/1347)) ([1c84db3](https://github.com/Tencent/teamai-cli/commit/1c84db37351fa9586a62e71f17cebc95f77f7852)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **session:** merge a diverged session index on pull and retry push once ([#1133](https://github.com/Tencent/teamai-cli/issues/1133)) ([#1139](https://github.com/Tencent/teamai-cli/issues/1139)) ([762a888](https://github.com/Tencent/teamai-cli/commit/762a88882d60f6e0146853ece1e64447fb7b9a74))
* **session:** only end a Codex tool round on items that start a message ([#1260](https://github.com/Tencent/teamai-cli/issues/1260)) ([603a7de](https://github.com/Tencent/teamai-cli/commit/603a7dec9fbdb9bb7c53c6fdda6f606656c4dfdc))
* **session:** preserve Buddy drive letters in project directories ([#1315](https://github.com/Tencent/teamai-cli/issues/1315)) ([5974448](https://github.com/Tencent/teamai-cli/commit/5974448e718a078f9b9d348221119a4a392f917a)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **session:** print the resume command each CLI accepts ([#1359](https://github.com/Tencent/teamai-cli/issues/1359)) ([7ffe04f](https://github.com/Tencent/teamai-cli/commit/7ffe04fc1825ee52bbde85c2bc0327816c94fa70))
* **session:** read Codex reasoning from its summary and content ([#1203](https://github.com/Tencent/teamai-cli/issues/1203)) ([208b97b](https://github.com/Tencent/teamai-cli/commit/208b97bb6218573b63d2445ac74f3a09999dd30d))
* **session:** serialize archive publication and roll back failed saves ([#1334](https://github.com/Tencent/teamai-cli/issues/1334)) ([12b80e7](https://github.com/Tencent/teamai-cli/commit/12b80e7f50db78354cfb6d256fbc61b82b05bee4))
* **session:** serialize monthly log updates across processes ([#961](https://github.com/Tencent/teamai-cli/issues/961)) ([01e3c8b](https://github.com/Tencent/teamai-cli/commit/01e3c8bd702678abce069ce0f07844cdea1d6bf3))
* **shell:** count the reads in a shell command list ([#1262](https://github.com/Tencent/teamai-cli/issues/1262)) ([eeff737](https://github.com/Tencent/teamai-cli/commit/eeff737903f3aea357c70ce7f40c976b9249be81))
* **skills:** isolate files blocking tool skill directories ([#1310](https://github.com/Tencent/teamai-cli/issues/1310)) ([e3c6f81](https://github.com/Tencent/teamai-cli/commit/e3c6f81f1075cbc765e7a8cefcc6a83800c53927)), closes [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **skills:** mirror deleted files during push ([#651](https://github.com/Tencent/teamai-cli/issues/651)) ([6e47059](https://github.com/Tencent/teamai-cli/commit/6e47059a8d72664f81e530b8a20966b4516551c5))
* **skills:** name the link that keeps a skill out of a tool ([#1108](https://github.com/Tencent/teamai-cli/issues/1108)) ([bee0ef0](https://github.com/Tencent/teamai-cli/commit/bee0ef04d9545ebcad1d935b007d5fd14408c62f))
* **skills:** one share gate, actionable refusals, and a louder stub deploy ([#747](https://github.com/Tencent/teamai-cli/issues/747)) ([72305c6](https://github.com/Tencent/teamai-cli/commit/72305c68b8d16086feaab1032cbd050dbf7d070e)), closes [#699](https://github.com/Tencent/teamai-cli/issues/699) [#748](https://github.com/Tencent/teamai-cli/issues/748) [#753](https://github.com/Tencent/teamai-cli/issues/753)
* **skills:** remove a file the team deleted from a delivered skill ([#1109](https://github.com/Tencent/teamai-cli/issues/1109)) ([a79833d](https://github.com/Tencent/teamai-cli/commit/a79833d0eb727f95f56873f138982de70914e797))
* **skills:** skip hermes pull when home not installed ([9499c64](https://github.com/Tencent/teamai-cli/commit/9499c6451307cee7594be56e7e283a357edb6dc4))
* **source:** isolate repository caches and installation ownership ([#929](https://github.com/Tencent/teamai-cli/issues/929)) ([e2ca08f](https://github.com/Tencent/teamai-cli/commit/e2ca08f88e0a5a81097bd2d1ecf63b97de96932e))
* **spawn:** hide the remaining Windows console windows on git child launches ([#687](https://github.com/Tencent/teamai-cli/issues/687)) ([c091e54](https://github.com/Tencent/teamai-cli/commit/c091e546947b8b8109557c40572674e48c498a1e))
* **spawn:** hide Windows console windows on the remaining child launches ([#679](https://github.com/Tencent/teamai-cli/issues/679)) ([f04d005](https://github.com/Tencent/teamai-cli/commit/f04d0055d5d6be4ed9fe0400b9e679badbab9b26))
* **stats:** await the async dashboard scope filter ([#795](https://github.com/Tencent/teamai-cli/issues/795)) ([#806](https://github.com/Tencent/teamai-cli/issues/806)) ([fd0e913](https://github.com/Tencent/teamai-cli/commit/fd0e9138143d6eae4c37de9953c9a89f99233eb4)), closes [#771](https://github.com/Tencent/teamai-cli/issues/771) [#771](https://github.com/Tencent/teamai-cli/issues/771) [#786](https://github.com/Tencent/teamai-cli/issues/786)
* **stats:** count each session once and keep other projects out ([#771](https://github.com/Tencent/teamai-cli/issues/771)) ([c3bfef3](https://github.com/Tencent/teamai-cli/commit/c3bfef38f82557dd3aedb411f5007b08d499f1e4))
* **stats:** count every worktree of a repo as that repo ([#809](https://github.com/Tencent/teamai-cli/issues/809)) ([#813](https://github.com/Tencent/teamai-cli/issues/813)) ([5e5b86d](https://github.com/Tencent/teamai-cli/commit/5e5b86d9e9b00749b54a83413fb47088978d0c5c))
* **stats:** finish report bookkeeping after pull timeout ([#562](https://github.com/Tencent/teamai-cli/issues/562)) ([434de41](https://github.com/Tencent/teamai-cli/commit/434de41dd6d1c88c3749a70992414a9ce5b9d87b))
* **stats:** keep workflow totals through an ordinary usage report ([#1172](https://github.com/Tencent/teamai-cli/issues/1172)) ([db0cb20](https://github.com/Tencent/teamai-cli/commit/db0cb20e5ce09edb56f8dd9c3a071a2a34e31b0a))
* **stats:** preserve interventions/prompts/tokens across partial reports ([4caafb7](https://github.com/Tencent/teamai-cli/commit/4caafb7555d2278f5a6c56e9a6ce6990bdbaea34))
* **stats:** split Windows cwds on the backslash in attributeRepo ([#858](https://github.com/Tencent/teamai-cli/issues/858)) ([e936870](https://github.com/Tencent/teamai-cli/commit/e9368701a752843962d83ececb9ca2cddbfe541b)), closes [#810](https://github.com/Tencent/teamai-cli/issues/810) [#810](https://github.com/Tencent/teamai-cli/issues/810)
* **status:** base --all orphan verdict on anchor, not a persisted workspace path ([f66668e](https://github.com/Tencent/teamai-cli/commit/f66668e4cc6f960ca281abc779adeecb2bd258b3))
* **status:** count nested rule files recursively ([0620f16](https://github.com/Tencent/teamai-cli/commit/0620f1696ccfeefd3f8b24b6454c92a2fd1267b6))
* sync team resources before AI sessions start ([#964](https://github.com/Tencent/teamai-cli/issues/964)) ([e1dd70d](https://github.com/Tencent/teamai-cli/commit/e1dd70d01b0f057070ab1847a2b39784e4a8f133))
* **tags,roles:** honor --dry-run and count namespaced skills in tags list ([#836](https://github.com/Tencent/teamai-cli/issues/836)) ([#837](https://github.com/Tencent/teamai-cli/issues/837)) ([be87a57](https://github.com/Tencent/teamai-cli/commit/be87a57534f2811dfcc6a39eeb7a9e0b948cefe3)), closes [pre-#546](https://github.com/Tencent/pre-/issues/546)
* **tags:** invalidate the pull cache when subscriptions change ([#602](https://github.com/Tencent/teamai-cli/issues/602)) ([ed71071](https://github.com/Tencent/teamai-cli/commit/ed71071bd2cac3fffe02e7c78e51ca840c753f4c))
* **test:** eliminate CI flaky tests ([#729](https://github.com/Tencent/teamai-cli/issues/729)) ([595034f](https://github.com/Tencent/teamai-cli/commit/595034f4046ec56072e619152d6192a99225fd8a))
* **test:** give each unit test file its own HOME ([#927](https://github.com/Tencent/teamai-cli/issues/927)) ([3030ffd](https://github.com/Tencent/teamai-cli/commit/3030ffd8a8227804337daaabc3369399d6b8a666)), closes [#924](https://github.com/Tencent/teamai-cli/issues/924)
* **test:** keep CI validate from timing out on the usage lock and an unborn HEAD ([#897](https://github.com/Tencent/teamai-cli/issues/897)) ([5fddf0c](https://github.com/Tencent/teamai-cli/commit/5fddf0c5d1779b1161465382d42cfbfac3be727b))
* **tests:** clear agent root env vars once in the vitest setup file ([#936](https://github.com/Tencent/teamai-cli/issues/936)) ([9d8ef7d](https://github.com/Tencent/teamai-cli/commit/9d8ef7d81f34d440b22056708e6320beede401b2))
* **tests:** isolate Claude config dir from model tests ([#890](https://github.com/Tencent/teamai-cli/issues/890)) ([4284918](https://github.com/Tencent/teamai-cli/commit/4284918b83328bc1d607a3a8140e3363fb4d18c4))
* **test:** skip chmod-based test when running as root ([#727](https://github.com/Tencent/teamai-cli/issues/727)) ([9d8ed1f](https://github.com/Tencent/teamai-cli/commit/9d8ed1faebba069b6c490b50b5820f5cab6d2961))
* **tgit:** fetch gf CLI over HTTPS with checksum verification ([#773](https://github.com/Tencent/teamai-cli/issues/773)) ([ab3f01f](https://github.com/Tencent/teamai-cli/commit/ab3f01f0140734076d147e28a7db17aab1e46262))
* **tool-gitignore:** rewrite existing block instead of duplicating ([b8a9124](https://github.com/Tencent/teamai-cli/commit/b8a9124b29b3c8e3e974a7cd29c349e66efc9b17))
* **tool-home:** resolve a relative tool home variable against the session directory ([#1221](https://github.com/Tencent/teamai-cli/issues/1221)) ([88c8e8b](https://github.com/Tencent/teamai-cli/commit/88c8e8ba7c1657c20a16a37d1d6891e6b117be78))
* **uninstall:** keep a hook running across uninstall from recreating ~/.teamai ([#1160](https://github.com/Tencent/teamai-cli/issues/1160)) ([10f21f5](https://github.com/Tencent/teamai-cli/commit/10f21f519c0444cd86acb4a06ffeb7a7b69a7438))
* **uninstall:** keep initialized projects when uninstalling the user scope ([#1025](https://github.com/Tencent/teamai-cli/issues/1025)) ([#1032](https://github.com/Tencent/teamai-cli/issues/1032)) ([8e7652d](https://github.com/Tencent/teamai-cli/commit/8e7652db034df778f27a391644d31962f2ff594a))
* **update:** hide Windows console windows during self-update ([#559](https://github.com/Tencent/teamai-cli/issues/559)) ([66d2fe3](https://github.com/Tencent/teamai-cli/commit/66d2fe3a5f483fa30b70959dc018ae59494122e2))
* **update:** make --dry-run a read-only version check ([#951](https://github.com/Tencent/teamai-cli/issues/951)) ([6c22726](https://github.com/Tencent/teamai-cli/commit/6c227263c3285c53ecbec7ac13c7d7fa4bd55480))
* **update:** refuse self-update for non-global (vendored) installs ([#544](https://github.com/Tencent/teamai-cli/issues/544)) ([082f40c](https://github.com/Tencent/teamai-cli/commit/082f40c529d184362616a68205ab4f9fefa80340)), closes [#502](https://github.com/Tencent/teamai-cli/issues/502)
* **update:** short-circuit checkForUpdate when cache is valid but no update was found ([#676](https://github.com/Tencent/teamai-cli/issues/676)) ([610ec14](https://github.com/Tencent/teamai-cli/commit/610ec142ddbf72c5409debc0bd64299e421449ed)), closes [#671](https://github.com/Tencent/teamai-cli/issues/671)
* **usage:** cap usage.jsonl in scopes that never report ([#788](https://github.com/Tencent/teamai-cli/issues/788)) ([#790](https://github.com/Tencent/teamai-cli/issues/790)) ([a725574](https://github.com/Tencent/teamai-cli/commit/a725574b34771309832300ced6ca60d0cb3fa6e8))
* **usage:** discard pre-upgrade usage and stop falling back past an unreadable config ([#748](https://github.com/Tencent/teamai-cli/issues/748)) ([#758](https://github.com/Tencent/teamai-cli/issues/758)) ([2ab697d](https://github.com/Tencent/teamai-cli/commit/2ab697d062a43a4e00078935fd20f37bc9a35c95)), closes [#753](https://github.com/Tencent/teamai-cli/issues/753) [#753](https://github.com/Tencent/teamai-cli/issues/753) [#752](https://github.com/Tencent/teamai-cli/issues/752)
* **usage:** do not count paths as slash skills ([#1136](https://github.com/Tencent/teamai-cli/issues/1136)) ([37c1d72](https://github.com/Tencent/teamai-cli/commit/37c1d7215a5189a71a43c6b8cb094793f2a5c56c))
* validate Claude marketplace doctor status ([205a417](https://github.com/Tencent/teamai-cli/commit/205a417811c19591f499ecf8711f92c18f7914b7))
* **votes:** collect upvote adoption from tool-use evidence + opt-in LLM-judge ([#723](https://github.com/Tencent/teamai-cli/issues/723)) ([#744](https://github.com/Tencent/teamai-cli/issues/744)) ([89ac24a](https://github.com/Tencent/teamai-cli/commit/89ac24a3d49de4db114c7e1e614380381525ceaa))
* **votes:** ground the upvote judge from the recall log on the subagent path ([#723](https://github.com/Tencent/teamai-cli/issues/723)) ([#1063](https://github.com/Tencent/teamai-cli/issues/1063)) ([ef10d03](https://github.com/Tencent/teamai-cli/commit/ef10d03e6745e4d4866c87af9a9d89eeed3618d2))
* **votes:** keep local deltas until the reports push lands ([#1027](https://github.com/Tencent/teamai-cli/issues/1027)) ([#1066](https://github.com/Tencent/teamai-cli/issues/1066)) ([6588981](https://github.com/Tencent/teamai-cli/commit/65889818c166eb6a39a682061bb9a978c4b5b9ef))
* **votes:** keep votes with the scope they were cast in ([#787](https://github.com/Tencent/teamai-cli/issues/787)) ([#793](https://github.com/Tencent/teamai-cli/issues/793)) ([dc233e4](https://github.com/Tencent/teamai-cli/commit/dc233e4489a5a0cd1b1afec8de47d0de944e6ba3)), closes [#758](https://github.com/Tencent/teamai-cli/issues/758) [#796](https://github.com/Tencent/teamai-cli/issues/796) [#723](https://github.com/Tencent/teamai-cli/issues/723) [#723](https://github.com/Tencent/teamai-cli/issues/723)
* **votes:** persist upvote counts reliably across merge and hook dispatch ([#565](https://github.com/Tencent/teamai-cli/issues/565)) ([46b7921](https://github.com/Tencent/teamai-cli/commit/46b7921abfcd515d1edfd3935f9a6b0fcc6b01a0))
* **votes:** prove delivery by identity, not by counter equality ([#1027](https://github.com/Tencent/teamai-cli/issues/1027)) ([#1098](https://github.com/Tencent/teamai-cli/issues/1098)) ([9486801](https://github.com/Tencent/teamai-cli/commit/94868017a57216976b721a573ef19f1eb78731cf))
* **votes:** read votes without migrating in viz and hasPendingVoteDeltas ([#972](https://github.com/Tencent/teamai-cli/issues/972)) ([#973](https://github.com/Tencent/teamai-cli/issues/973)) ([e465eec](https://github.com/Tencent/teamai-cli/commit/e465eec2b6bce0c295d61a27674865d0b943aa28))
* **webhook:** preview test endpoints without sending ([#900](https://github.com/Tencent/teamai-cli/issues/900)) ([#941](https://github.com/Tencent/teamai-cli/issues/941)) ([6db9144](https://github.com/Tencent/teamai-cli/commit/6db9144fc2113282d1e26e06fa149fc2e5d1233c))
* **webhook:** report failed deliveries in `webhook test` and log the last attempt ([#777](https://github.com/Tencent/teamai-cli/issues/777)) ([aa6a883](https://github.com/Tencent/teamai-cli/commit/aa6a8830b4d48046be63779e80a25c89ac91e7f6))
* **webhook:** whitelist+redact payload, fix event mapping, preserve secret ([#701](https://github.com/Tencent/teamai-cli/issues/701), [#702](https://github.com/Tencent/teamai-cli/issues/702), [#703](https://github.com/Tencent/teamai-cli/issues/703)) ([#708](https://github.com/Tencent/teamai-cli/issues/708)) ([fa4f298](https://github.com/Tencent/teamai-cli/commit/fa4f2989c4ba2098d97f51f1bd997a7ed3536e05))
* **wiki:** cite each call-chain step's own line in dependency paths ([#1212](https://github.com/Tencent/teamai-cli/issues/1212)) ([52f6930](https://github.com/Tencent/teamai-cli/commit/52f6930d81f55143b5b34d825227b5b49957a349))
* **workflow:** close the [#1080](https://github.com/Tencent/teamai-cli/issues/1080) workspace gaps ([#1246](https://github.com/Tencent/teamai-cli/issues/1246)) ([#1251](https://github.com/Tencent/teamai-cli/issues/1251)) ([33b675d](https://github.com/Tencent/teamai-cli/commit/33b675d9a9ec7110af0cf3f15a39ec582c1f292e))
* **workflow:** detect changes inside untracked directories ([#1149](https://github.com/Tencent/teamai-cli/issues/1149)) ([7ca23dc](https://github.com/Tencent/teamai-cli/commit/7ca23dc70e8ed6cdecc2c2ed2ad7fd5c2db68434))
* **workflow:** honor the usage report opt-out for run records and credit totals to their member ([#1161](https://github.com/Tencent/teamai-cli/issues/1161)) ([d2a570c](https://github.com/Tencent/teamai-cli/commit/d2a570c5aa987e9f9836be877cb271f2c54da352))
* **workflow:** keep the team revision of unchanged workflow bytes ([#1214](https://github.com/Tencent/teamai-cli/issues/1214)) ([42e8f6f](https://github.com/Tencent/teamai-cli/commit/42e8f6f41c8cef8dfd28f6e09227285e24e47986))
* **workflow:** preserve UTF-8 across tool output chunks ([#1242](https://github.com/Tencent/teamai-cli/issues/1242)) ([75396ce](https://github.com/Tencent/teamai-cli/commit/75396ce04cb9a1962a3a55aa639f60f1be61f3f7))
* **workflow:** preserve UTF-8 in command outputs ([#1275](https://github.com/Tencent/teamai-cli/issues/1275)) ([87b546a](https://github.com/Tencent/teamai-cli/commit/87b546a586e14b66ba069f5c76a6cd5c0cd4c3d1))
* **zcode:** keep a team-configured hook timeout instead of the per-event default ([#582](https://github.com/Tencent/teamai-cli/issues/582)) ([78a68d6](https://github.com/Tencent/teamai-cli/commit/78a68d6907ab6f71371bb13d466c9e9c4b22e4e8)), closes [#555](https://github.com/Tencent/teamai-cli/issues/555) [#555](https://github.com/Tencent/teamai-cli/issues/555)
* **zcode:** launch hooks via hidden wscript VBS — no console flash, bounded wait ([#596](https://github.com/Tencent/teamai-cli/issues/596)) ([bea46d1](https://github.com/Tencent/teamai-cli/commit/bea46d110e372f1368c91ee671d2424024da672f))
* **zcode:** normalize team-hook commands and persist the enabled flip ([343a5d8](https://github.com/Tencent/teamai-cli/commit/343a5d81daacb902d5ddac45c80e41e9f6b412bb)), closes [#462](https://github.com/Tencent/teamai-cli/issues/462)
* **zcode:** preserve documented hooks settings during reconcile ([#1054](https://github.com/Tencent/teamai-cli/issues/1054)) ([5b52995](https://github.com/Tencent/teamai-cli/commit/5b52995920b9fdb064c6a9f0a5469b03370a64a3)), closes [#1049](https://github.com/Tencent/teamai-cli/issues/1049) [#1049](https://github.com/Tencent/teamai-cli/issues/1049) [#1055](https://github.com/Tencent/teamai-cli/issues/1055) [#1059](https://github.com/Tencent/teamai-cli/issues/1059)
* **zcode:** preserve the runner state when removing hooks ([cf00e98](https://github.com/Tencent/teamai-cli/commit/cf00e98a6c42b76e1aa0487c1371891100f9bb12))
* **zcode:** strip unknown keys from the hooks block — strict schema rejects the whole config otherwise ([#555](https://github.com/Tencent/teamai-cli/issues/555)) ([6d62429](https://github.com/Tencent/teamai-cli/commit/6d624299b30e628f3737ad97a4b05ca4abf10b8f))


### Performance

* 27% faster CLI, 21-29% faster hooks, 14% faster pull ([#1226](https://github.com/Tencent/teamai-cli/issues/1226)) ([e0f7ecf](https://github.com/Tencent/teamai-cli/commit/e0f7ecfc4fd4f844e7b295b096385638d10f1d1e))
* 30% faster e2e, 2x faster pull, 6x faster typecheck ([#1134](https://github.com/Tencent/teamai-cli/issues/1134)) ([27a026f](https://github.com/Tencent/teamai-cli/commit/27a026fc3073543c77a41a2bf6c0feb4c7b235d0))
* 45% faster init, 31% faster pull, 32% shorter e2e suite ([#1039](https://github.com/Tencent/teamai-cli/issues/1039)) ([2547159](https://github.com/Tencent/teamai-cli/commit/2547159a348642a3f52579c7dbed7aa8d4955548))
* **ci:** cut the E2E critical path by 51% and the macOS unit leg by 15% ([#1283](https://github.com/Tencent/teamai-cli/issues/1283)) ([decdf5b](https://github.com/Tencent/teamai-cli/commit/decdf5baf73ceb957ef686291d2c2efa3af5407c)), closes [#1210](https://github.com/Tencent/teamai-cli/issues/1210) [#1221](https://github.com/Tencent/teamai-cli/issues/1221)
* **e2e:** run the fork-safe E2E suite in three parallel shards (-52% E2E wall time) ([#1237](https://github.com/Tencent/teamai-cli/issues/1237)) ([858ef54](https://github.com/Tencent/teamai-cli/commit/858ef542ff3477eaa30129699b191ad5f08b3605))
* **hooks:** run post-tool-use side effects detached, emptying the inline pass ([#1216](https://github.com/Tencent/teamai-cli/issues/1216)) ([#1232](https://github.com/Tencent/teamai-cli/issues/1232)) ([bed52f1](https://github.com/Tencent/teamai-cli/commit/bed52f1bedc6a0650e01ec9152964752641bc41b))
* prefer Set.has over array membership in perf-category cleanups ([#836](https://github.com/Tencent/teamai-cli/issues/836)) ([#1073](https://github.com/Tencent/teamai-cli/issues/1073)) ([987a746](https://github.com/Tencent/teamai-cli/commit/987a74663a9f9153f5d03cf1ce42b685bfa9a9da))
* **search-index:** read source files concurrently and write the index compact ([#1240](https://github.com/Tencent/teamai-cli/issues/1240)) ([1494bdf](https://github.com/Tencent/teamai-cli/commit/1494bdfb80cbd05bfcbd1b7554f9d00d80068050)), closes [#1239](https://github.com/Tencent/teamai-cli/issues/1239) [#1239](https://github.com/Tencent/teamai-cli/issues/1239)
* **search:** reuse unchanged index source entries ([#1301](https://github.com/Tencent/teamai-cli/issues/1301)) ([3b858a0](https://github.com/Tencent/teamai-cli/commit/3b858a06f4494f20a6ba01a004ce47fbd5c74a4f))


### Refactoring

* **cli:** rename `install` to `packages` with an `install` subcommand ([96835ac](https://github.com/Tencent/teamai-cli/commit/96835ac9a4e275fff2d4f6b3847b47d7155f157e)), closes [#380](https://github.com/Tencent/teamai-cli/issues/380)
* **data-layout:** converge machine-data home onto getDataHome() ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-1) ([42858d4](https://github.com/Tencent/teamai-cli/commit/42858d4f0803533bd601a16bc59e1ed081276ff9))
* **data-layout:** converge state.json onto getDataHome + add partition primitive ([#374](https://github.com/Tencent/teamai-cli/issues/374) P1-2A) ([0d34ef3](https://github.com/Tencent/teamai-cli/commit/0d34ef366a37df585b073b7d3b696922f7660f30))
* **model:** add ApiKey value object and rich ModelProvider ([447eac1](https://github.com/Tencent/teamai-cli/commit/447eac139206f2bed68851f3dff0980bc99cea58))
* **model:** group tool modules by responsibility ([3486050](https://github.com/Tencent/teamai-cli/commit/34860501032e0e574ed9dda2ba91250273f6ef85))
* **model:** guard deepMerge against reserved prototype keys ([a1f088f](https://github.com/Tencent/teamai-cli/commit/a1f088f5303ecafe8a89eb0ca46261b86065b4c3))
* **model:** render tool configs from Handlebars templates ([6499e67](https://github.com/Tencent/teamai-cli/commit/6499e678e9ae9cd1ea6b87bca1db4dd198e57f43))
* **model:** replace config-format switches with codec strategies ([6e7b74e](https://github.com/Tencent/teamai-cli/commit/6e7b74ea158b71692210d9d5016bd0d58a021dfc))
* **model:** split tool targets into per-tool modules ([08b8337](https://github.com/Tencent/teamai-cli/commit/08b8337d697436783114c83e93c91038ac8c9dbd))
* **session:** centralize migration results and archive ownership ([#1302](https://github.com/Tencent/teamai-cli/issues/1302)) ([6c57c3b](https://github.com/Tencent/teamai-cli/commit/6c57c3b70904d3d126ce23425827209ffd165f71))
* **session:** replace MigrationEngine and isolate migrate command ([#1195](https://github.com/Tencent/teamai-cli/issues/1195)) ([9c797b7](https://github.com/Tencent/teamai-cli/commit/9c797b71a39d2b683cfb56f139a2eeac3d4ed689)), closes [#1140](https://github.com/Tencent/teamai-cli/issues/1140)
* **session:** simplify archive write locking ([#1375](https://github.com/Tencent/teamai-cli/issues/1375)) ([99fd56c](https://github.com/Tencent/teamai-cli/commit/99fd56ce33235dfa7e25f8069c0670852881cc72))
* **skill-dirs:** compare recorded skills directories through one sameSkillDir ([#1221](https://github.com/Tencent/teamai-cli/issues/1221)) ([f1d8559](https://github.com/Tencent/teamai-cli/commit/f1d8559768b49830a00bdd419640dbb6f41798d6))

## [0.23.0](https://github.com/Tencent/teamai-cli/compare/v0.22.0...v0.23.0) (2026-09-08)

### ✨ Features

- Declarative team package management with npm and Claude plugin adapters, team distribution, install hints, and doctor checks; the shipped entry point is `teamai packages install` ([#380](https://github.com/Tencent/teamai-cli/pull/380), [#428](https://github.com/Tencent/teamai-cli/pull/428)).
- First-class Qoder and JoyCode support that preserves personal rules and native metadata ([#420](https://github.com/Tencent/teamai-cli/pull/420), [#413](https://github.com/Tencent/teamai-cli/pull/413)).
- ClawPro model configs can be synced, applied, and reported per tool ([#393](https://github.com/Tencent/teamai-cli/pull/393)).
- `contribute` supports Japanese course-correction prompts, and `sharing.contributeHint.enabled` turns the share hint off ([#431](https://github.com/Tencent/teamai-cli/pull/431), [#432](https://github.com/Tencent/teamai-cli/pull/432)).
- Plugin install commands substitute any scalar field ([#400](https://github.com/Tencent/teamai-cli/pull/400)).

### 🔧 Refactoring

- Project data moves into the `~/.teamai/projects/<slug>/` partition, unifying machine data, state, resource cache, and the worktree ownership model ([#397](https://github.com/Tencent/teamai-cli/pull/397), [#402](https://github.com/Tencent/teamai-cli/pull/402), [#406](https://github.com/Tencent/teamai-cli/pull/406)).
- The top-level `install` command from the prereleases is now `packages install` ([#428](https://github.com/Tencent/teamai-cli/pull/428)).

### 🐛 Bug Fixes

- Partition migration adds scope locks, clone race protection, a per-worktree MCP manifest, uninstall cleanup, and legacy ownership migration ([#414](https://github.com/Tencent/teamai-cli/pull/414), [#417](https://github.com/Tencent/teamai-cli/pull/417)).
- Fix project-scope recall configuration and the self-mode maintenance report paths and refresh ([#398](https://github.com/Tencent/teamai-cli/pull/398), [#401](https://github.com/Tencent/teamai-cli/pull/401)).
- Plugin install commands run with Bash, and an unclosed YAML frontmatter delimiter now warns ([#399](https://github.com/Tencent/teamai-cli/pull/399), [#409](https://github.com/Tencent/teamai-cli/pull/409)).
- Agent changes are compared using rendered native content, and commits in isolated worktrees skip repository hooks ([#411](https://github.com/Tencent/teamai-cli/pull/411), [#422](https://github.com/Tencent/teamai-cli/pull/422)).
- Codex token snapshots are kept per rollout, partial reports preserve existing counters, and MCP inventory is scoped to the current tool ([#423](https://github.com/Tencent/teamai-cli/pull/423), [#429](https://github.com/Tencent/teamai-cli/pull/429), [#433](https://github.com/Tencent/teamai-cli/pull/433)).
- push/pull unit tests no longer share the real `.sync-lock`, removing the parallel Vitest race ([#438](https://github.com/Tencent/teamai-cli/pull/438)).

### 📝 Documentation

- Align README and the usage guide with the product architecture, trim the agent instructions, and add Contributors ([#412](https://github.com/Tencent/teamai-cli/pull/412), [#415](https://github.com/Tencent/teamai-cli/pull/415), [#430](https://github.com/Tencent/teamai-cli/pull/430), [#434](https://github.com/Tencent/teamai-cli/pull/434)).

## [0.22.0](https://github.com/Tencent/teamai-cli/compare/v0.21.0...v0.22.0) (2026-09-02)

### ✨ Features

- Add the GitCode provider ([#376](https://github.com/Tencent/teamai-cli/pull/376)).
- Team-controlled commit co-author attribution across AI tools ([#365](https://github.com/Tencent/teamai-cli/pull/365)).
- Dashboard gains a knowledge base health report and collects CodeBuddy `toolReject`/`toolError` friction ([#368](https://github.com/Tencent/teamai-cli/pull/368), [#336](https://github.com/Tencent/teamai-cli/pull/336)).
- The wiki engine adds a WASM tree-sitter AST track for the code knowledge graph ([#304](https://github.com/Tencent/teamai-cli/pull/304)).
- The data layout gains an atomic lock and separates `projectAnchor` from `workspaceRoot` ([#387](https://github.com/Tencent/teamai-cli/pull/387)).

### 🐛 Bug Fixes

- Cursor rules are written as `.mdc` with derived frontmatter, and stale per-tool agent siblings are cleaned up ([#345](https://github.com/Tencent/teamai-cli/pull/345), [#349](https://github.com/Tencent/teamai-cli/pull/349)).
- Fix the project-scope doctor env path and Cursor SessionStart workspace root resolution ([#348](https://github.com/Tencent/teamai-cli/pull/348), [#353](https://github.com/Tencent/teamai-cli/pull/353)).
- push updates the open PR instead of opening duplicates, and `--skill` keeps other resources' open-PR records ([#350](https://github.com/Tencent/teamai-cli/pull/350), [#359](https://github.com/Tencent/teamai-cli/pull/359)).
- `import --dir` runs reconcile and deep enrichment, and init always deploys `team-wiki-codebase` ([#362](https://github.com/Tencent/teamai-cli/pull/362), [#358](https://github.com/Tencent/teamai-cli/pull/358)).
- hook-dispatch no longer blocks on a tty prompt, injection scope is unified, and project hooks are isolated across a shared home ([#366](https://github.com/Tencent/teamai-cli/pull/366), [#370](https://github.com/Tencent/teamai-cli/pull/370), [#377](https://github.com/Tencent/teamai-cli/pull/377)).
- pull reconciles a diverged team-repo clone without data loss ([#367](https://github.com/Tencent/teamai-cli/pull/367)).
- SKILL.md frontmatter handles CRLF, BOM, object values, and malformed metadata ([#378](https://github.com/Tencent/teamai-cli/pull/378), [#383](https://github.com/Tencent/teamai-cli/pull/383)).
- Fix vote/contribute hints clobbering each other, clipped KB Health labels, and repeated ClawPro binding prompts in worktrees ([#384](https://github.com/Tencent/teamai-cli/pull/384), [#389](https://github.com/Tencent/teamai-cli/pull/389), [#392](https://github.com/Tencent/teamai-cli/pull/392)).

### 🔧 CI/CD

- npm publishing moves to trusted publishing ([#381](https://github.com/Tencent/teamai-cli/pull/381)).

## [0.21.0](https://github.com/Tencent/teamai-cli/compare/v0.20.0...v0.21.0) (2026-08-27)

### ✨ Features

- Support generic private Git hosts and a GitLab provider for self-hosted instances ([#301](https://github.com/Tencent/teamai-cli/pull/301), [#307](https://github.com/Tencent/teamai-cli/pull/307)).
- OpenCode syncs skills, rules, subagents, and MCP in both scopes, and receives hooks as a native plugin ([#306](https://github.com/Tencent/teamai-cli/pull/306), [#326](https://github.com/Tencent/teamai-cli/pull/326)).
- Add DeepSeek Harness as a supported agent ([#319](https://github.com/Tencent/teamai-cli/pull/319)).
- local-agent can install and uninstall MCP servers over the HTTP sync channel ([#290](https://github.com/Tencent/teamai-cli/pull/290)).

### 🐛 Bug Fixes

- Harden Git/GitLab credentials: reject embedded credentials, keep the PAT out of clone URLs and MR fetches, and align the clone timeout ([#308](https://github.com/Tencent/teamai-cli/pull/308), [#314](https://github.com/Tencent/teamai-cli/pull/314)).
- Resolve the user home and the built-in agents directory consistently on Windows ([#309](https://github.com/Tencent/teamai-cli/pull/309), [#310](https://github.com/Tencent/teamai-cli/pull/310), [#324](https://github.com/Tencent/teamai-cli/pull/324)).
- Fix silent capability loss when upgrading from old versions, verify a cached clone's remote before reuse, and run `gf auth` from a neutral cwd ([#311](https://github.com/Tencent/teamai-cli/pull/311), [#329](https://github.com/Tencent/teamai-cli/pull/329), [#312](https://github.com/Tencent/teamai-cli/pull/312)).
- push carries `teamai.yaml` and role-scoped skill changes; pull preserves role isolation for tag subscriptions, keeps pending source config, and syncs newly available agent targets ([#323](https://github.com/Tencent/teamai-cli/pull/323), [#338](https://github.com/Tencent/teamai-cli/pull/338), [#337](https://github.com/Tencent/teamai-cli/pull/337), [#340](https://github.com/Tencent/teamai-cli/pull/340), [#343](https://github.com/Tencent/teamai-cli/pull/343)).
- uninstall removes managed agents and OpenClaw skills, and the "no workspace dir" warning is silenced when OpenClaw is absent ([#339](https://github.com/Tencent/teamai-cli/pull/339), [#347](https://github.com/Tencent/teamai-cli/pull/347)).
- Fix the invalid OpenCode agent configuration generated when recall is enabled ([#344](https://github.com/Tencent/teamai-cli/pull/344)).

### 🔒 Security

- Patch runtime advisories in `simple-git` and `js-yaml` ([#316](https://github.com/Tencent/teamai-cli/pull/316)).

### 🔧 CI/CD

- Prereleases publish to their own dist-tag and never to `latest` ([#317](https://github.com/Tencent/teamai-cli/pull/317)).

## [0.20.0](https://github.com/Tencent/teamai-cli/compare/v0.19.0...v0.20.0) (2026-08-20)

### ✨ Features

- Single-repo mode: a business repository can act as the team repository ([#292](https://github.com/Tencent/teamai-cli/pull/292)).
- recall expands keywords bilingually for cross-language retrieval ([#302](https://github.com/Tencent/teamai-cli/pull/302)).

### 🐛 Bug Fixes

- recall reports per-term coverage, and scoring defects, body truncation, and duplicate results are fixed ([#289](https://github.com/Tencent/teamai-cli/pull/289), [#297](https://github.com/Tencent/teamai-cli/pull/297), [#298](https://github.com/Tencent/teamai-cli/pull/298)).
- Guard the self/single-repo report flow against resetting the business repository ([#299](https://github.com/Tencent/teamai-cli/pull/299)).
- Fix the OpenClaw skill path, manifest enrichment import paths, and container agent id/version detection ([#295](https://github.com/Tencent/teamai-cli/pull/295), [#293](https://github.com/Tencent/teamai-cli/pull/293), [#291](https://github.com/Tencent/teamai-cli/pull/291)).
- TGit clone/fetch must use an OAuth token, never a REST-only PAT ([#287](https://github.com/Tencent/teamai-cli/pull/287)).

## [0.19.0](https://github.com/Tencent/teamai-cli/compare/v0.18.0...v0.19.0) (2026-08-06)

### 💥 Breaking Changes

- `teamai init` defaults to project scope and accepts the repository as a positional argument; user scope now requires `--scope user` ([#256](https://github.com/Tencent/teamai-cli/pull/256)).

### ✨ Features

- The local-agent sync/ack channel installs and uninstalls session hooks and runs `uninstall_teamai` ([#238](https://github.com/Tencent/teamai-cli/pull/238), [#249](https://github.com/Tencent/teamai-cli/pull/249), [#265](https://github.com/Tencent/teamai-cli/pull/265)).
- Add Hermes agent sync, hooks, and configuration support ([#269](https://github.com/Tencent/teamai-cli/pull/269)).
- Opt-in inheritance of user-scope resources while keeping scopes isolated by default ([#281](https://github.com/Tencent/teamai-cli/pull/281)).

### 🐛 Bug Fixes

- Simplify project-scope hook injection and dispatch, and skip injection safely when `/bin/sh` is absent ([#272](https://github.com/Tencent/teamai-cli/pull/272), [#274](https://github.com/Tencent/teamai-cli/pull/274)).
- WorkBuddy ephemeral directories no longer re-prompt for binding, and prompts are deduplicated per session ([#270](https://github.com/Tencent/teamai-cli/pull/270), [#271](https://github.com/Tencent/teamai-cli/pull/271)).
- Stop the command loop after uninstall, detect empty hooks residue, and improve recall's CJK inference, relevance threshold, and query quality ([#273](https://github.com/Tencent/teamai-cli/pull/273), [#276](https://github.com/Tencent/teamai-cli/pull/276), [#278](https://github.com/Tencent/teamai-cli/pull/278)).
- Share hints explain the friction that triggered them, and `codebase` drops a stale flag, stale help text, and Chinese strings ([#282](https://github.com/Tencent/teamai-cli/pull/282), [#268](https://github.com/Tencent/teamai-cli/pull/268)).

### ⚡ Performance

- Tighten the hook STDIN timeout, add error guards, and move pull to the background ([#275](https://github.com/Tencent/teamai-cli/pull/275)).

## [0.18.0](https://github.com/Tencent/teamai-cli/compare/v0.17.7...v0.18.0) (2026-07-30)

### ✨ Features

- Add the `mcp` resource: team-declared MCP servers merge into each AI tool's native format, with `teamai mcp list/inject/remove` ([#252](https://github.com/Tencent/teamai-cli/pull/252)).
- `teamai uninstall --agent <tool>` uninstalls a single tool and records the disabled state persistently ([#244](https://github.com/Tencent/teamai-cli/pull/244)).
- local-agent reads a unified `cmds[]` from the sync response ([#261](https://github.com/Tencent/teamai-cli/pull/261)).

### 🐛 Bug Fixes

- MR import tolerates malformed learning frontmatter, and workspace paths are normalized on case-insensitive filesystems ([#241](https://github.com/Tencent/teamai-cli/pull/241), [#243](https://github.com/Tencent/teamai-cli/pull/243)).
- Git-provider-only hints no longer leak to HTTP users or users without a matching remote, and total foreground hook time is bounded ([#247](https://github.com/Tencent/teamai-cli/pull/247), [#248](https://github.com/Tencent/teamai-cli/pull/248)).
- uninstall removes MCP servers before deleting the manifest and lists the removed servers in the summary ([#253](https://github.com/Tencent/teamai-cli/pull/253), [#254](https://github.com/Tencent/teamai-cli/pull/254)).
- `teamai list` covers every resource type, and env values are masked unless `--reveal` is passed ([#255](https://github.com/Tencent/teamai-cli/pull/255)).
- Improve project-scope MCP secret resolution, `requires` command validation, and remote server formats; GUI IDEs receive resolved variable values ([#258](https://github.com/Tencent/teamai-cli/pull/258), [#259](https://github.com/Tencent/teamai-cli/pull/259), [#262](https://github.com/Tencent/teamai-cli/pull/262), [#263](https://github.com/Tencent/teamai-cli/pull/263)).

## [0.17.7](https://github.com/Tencent/teamai-cli/compare/v0.17.6...v0.17.7) (2026-07-27)

### 💥 Breaking Changes

- Complete the move to the teamwiki knowledge graph, removing the old domains subsystem, legacy aggregate/codebase-lint, the hidden `domains drift` command, obsolete flags, and the old CI sync template ([#225](https://github.com/Tencent/teamai-cli/pull/225)).

### ✨ Features

- Add `teamai recall --check`, a side-effect-free relevance pre-check ([#234](https://github.com/Tencent/teamai-cli/pull/234)).
- codebase recall results include `Sources:` anchors to the source files ([#240](https://github.com/Tencent/teamai-cli/pull/240)).
- The local-agent binding prompt is enabled by default ([#237](https://github.com/Tencent/teamai-cli/pull/237)).

### 🐛 Bug Fixes

- pull still refreshes the CLAUDE.md recall block on the "Already synced" fast path ([#223](https://github.com/Tencent/teamai-cli/pull/223)).
- hooks inject/remove no longer create root directories for tools that are not installed, and a non-Git team repo directory is re-cloned ([#224](https://github.com/Tencent/teamai-cli/pull/224), [#236](https://github.com/Tencent/teamai-cli/pull/236)).

### ⚡ Performance

- PostToolUse local-agent sync runs in the background ([#231](https://github.com/Tencent/teamai-cli/pull/231)).

## [0.17.6](https://github.com/Tencent/teamai-cli/compare/v0.17.5...v0.17.6) (2026-07-22)

### 🐛 Bug Fixes

- Fix duplicate binding cards in the CloudStudio sandbox while keeping the workspace binding prompt ([#220](https://github.com/Tencent/teamai-cli/pull/220)).
- Reported workspaces are attributed to the AI tool that installed them, and tool root directories are created before installing workspace resources ([#221](https://github.com/Tencent/teamai-cli/pull/221), [#222](https://github.com/Tencent/teamai-cli/pull/222)).

## [0.17.5](https://github.com/Tencent/teamai-cli/compare/v0.17.4...v0.17.5) (2026-07-22)

### ✨ Features

- `teamai stats` adds `--by-repo` and `--by-time`, and `teamai session save` stores and pushes session summaries ([#193](https://github.com/Tencent/teamai-cli/pull/193), [#192](https://github.com/Tencent/teamai-cli/pull/192)).
- Add the CNB Git provider with interactive login and headless `CNB_TOKEN` auth ([#208](https://github.com/Tencent/teamai-cli/pull/208)).
- local-agent re-runs plugins when the backend-supplied commands change ([#209](https://github.com/Tencent/teamai-cli/pull/209)).

### 🐛 Bug Fixes

- Correct the TGit REST auth scheme and standardize on `TGIT_TOKEN` ([#210](https://github.com/Tencent/teamai-cli/pull/210), [#212](https://github.com/Tencent/teamai-cli/pull/212)).
- push clears its timeout timer, and CodeBuddy hooks no longer keep the event loop alive ([#211](https://github.com/Tencent/teamai-cli/pull/211), [#214](https://github.com/Tencent/teamai-cli/pull/214), [#218](https://github.com/Tencent/teamai-cli/pull/218)).
- The source manifest stores a Git baseline so imports are genuinely incremental ([#215](https://github.com/Tencent/teamai-cli/pull/215)).
- Workspace-scope resources install into project directories and are reported as a full snapshot ([#216](https://github.com/Tencent/teamai-cli/pull/216), [#219](https://github.com/Tencent/teamai-cli/pull/219)).

## [0.17.4](https://github.com/Tencent/teamai-cli/compare/v0.17.3...v0.17.4) (2026-07-20)

### ✨ Features

- The Stop hook asks for a citation when recall ran but no document was declared as used ([#181](https://github.com/Tencent/teamai-cli/pull/181)).
- local-agent installs, updates, runs, and uninstalls backend plugins, including path mapping ([#185](https://github.com/Tencent/teamai-cli/pull/185), [#186](https://github.com/Tencent/teamai-cli/pull/186), [#187](https://github.com/Tencent/teamai-cli/pull/187)).
- Add per-user skill exclusion in local config, applied during pull ([#194](https://github.com/Tencent/teamai-cli/pull/194)).
- Add secret redaction, and `contribute` scores contribution value from session friction ([#191](https://github.com/Tencent/teamai-cli/pull/191), [#204](https://github.com/Tencent/teamai-cli/pull/204)).
- local-agent workspace binding targets a project instead of a group ([#203](https://github.com/Tencent/teamai-cli/pull/203)).

### 🐛 Bug Fixes

- uninstall cleans the built-in recall agent, rule, and skills, and `agent_type` variants are normalized before reporting ([#183](https://github.com/Tencent/teamai-cli/pull/183), [#188](https://github.com/Tencent/teamai-cli/pull/188)).
- Avoid opening a duplicate import MR when only metadata changed ([#190](https://github.com/Tencent/teamai-cli/pull/190)).

## [0.17.3](https://github.com/Tencent/teamai-cli/compare/v0.17.2...v0.17.3) (2026-07-14)

### ✨ Features

- Add the HTTP local-agent lifecycle, project binding prompt, and WorkBuddy/CodeBuddy support ([#152](https://github.com/Tencent/teamai-cli/pull/152)).
- Git users can attach HTTP report/sync/ack sources via `source add-http/remove-http/list` ([#168](https://github.com/Tencent/teamai-cli/pull/168)).
- Add backend request logging, an update cache, a WorkBuddy hook timeout, and a binding-prompt toggle ([#166](https://github.com/Tencent/teamai-cli/pull/166), [#172](https://github.com/Tencent/teamai-cli/pull/172)).

### 🐛 Bug Fixes

- Fix the paths that prevented `contribute-check` hints from firing ([#160](https://github.com/Tencent/teamai-cli/pull/160)).
- Fix local-agent ids, install paths, resource naming, installed-resource scanning, version reporting, and log identity ([#161](https://github.com/Tencent/teamai-cli/pull/161), [#162](https://github.com/Tencent/teamai-cli/pull/162), [#167](https://github.com/Tencent/teamai-cli/pull/167), [#169](https://github.com/Tencent/teamai-cli/pull/169), [#170](https://github.com/Tencent/teamai-cli/pull/170), [#171](https://github.com/Tencent/teamai-cli/pull/171)).
- Scope resource install, uninstall, and hook injection strictly to the requesting tool, and fix hook routing and empty `hook_event_name` handling ([#174](https://github.com/Tencent/teamai-cli/pull/174), [#176](https://github.com/Tencent/teamai-cli/pull/176), [#177](https://github.com/Tencent/teamai-cli/pull/177), [#179](https://github.com/Tencent/teamai-cli/pull/179)).

### 🔧 Refactoring

- Remove the deprecated `/repo` HTTP team repository snapshot path ([#180](https://github.com/Tencent/teamai-cli/pull/180)).

## [0.17.2](https://github.com/Tencent/teamai-cli/compare/v0.17.1...v0.17.2) (2026-07-07)

### 🐛 Bug Fixes

- The team knowledge recall rule relaxes from `MUST` to `SHOULD` with three explicit skip conditions, and the TodoWrite reminder is softened to match ([#158](https://github.com/Tencent/teamai-cli/pull/158)).

## [0.17.1](https://github.com/Tencent/teamai-cli/compare/v0.17.0...v0.17.1) (2026-07-06)

### ✨ Features

- Knowledge base dual-count voting and automated maintenance: adoption detection, multi-device sync, confidence updates, promotion, and pruning ([#137](https://github.com/Tencent/teamai-cli/pull/137)).
- `teamai init --agent <name>` limits hook injection to the given tools and accumulates across runs ([#155](https://github.com/Tencent/teamai-cli/pull/155)).

### 🐛 Bug Fixes

- Coding CI triggers on `main`, and the default Vitest timeout is raised to reduce CI flakiness ([#149](https://github.com/Tencent/teamai-cli/pull/149), [#150](https://github.com/Tencent/teamai-cli/pull/150)).

## [0.17.0](https://github.com/Tencent/teamai-cli/compare/v0.16.9...v0.17.0) (2026-07-03)

### ✨ Features

- Add `teamai hooks list`, and unify team-declared and built-in hooks into one data model and reconcile flow ([#62](https://github.com/Tencent/teamai-cli/pull/62), [#65](https://github.com/Tencent/teamai-cli/pull/65)).
- Build a deterministic codebase knowledge pipeline, plus deep-enrich, graph-aware recall, and the `team-wiki-codebase` skill ([#55](https://github.com/Tencent/teamai-cli/pull/55), [#56](https://github.com/Tencent/teamai-cli/pull/56)).
- Support a git-free HTTP team source with API keys, machine identity, and hooks-driven agent status reporting ([#68](https://github.com/Tencent/teamai-cli/pull/68)).
- Dashboard and stats add Human Intervention, prompt counts, and token usage ([#70](https://github.com/Tencent/teamai-cli/pull/70), [#78](https://github.com/Tencent/teamai-cli/pull/78), [#122](https://github.com/Tencent/teamai-cli/pull/122)).
- Isolate user scope when project scope is installed, and add `tclaude`/`tcodex` plus native Codex hooks ([#77](https://github.com/Tencent/teamai-cli/pull/77), [#64](https://github.com/Tencent/teamai-cli/pull/64), [#103](https://github.com/Tencent/teamai-cli/pull/103)).
- Recall becomes progressive route → context → lookup retrieval with G-document routing and multi-hop analysis ([#102](https://github.com/Tencent/teamai-cli/pull/102)).
- MR import supports incremental updates from a facts cache, and import gains structured progress and English-only output ([#112](https://github.com/Tencent/teamai-cli/pull/112), [#117](https://github.com/Tencent/teamai-cli/pull/117)).
- Recall can be toggled by a team default with a local override ([#126](https://github.com/Tencent/teamai-cli/pull/126)).

### 🐛 Bug Fixes

- Fix TGit argument quoting, CodeBuddy tool-name normalization, batch import races, and path traversal ([#60](https://github.com/Tencent/teamai-cli/pull/60), [#66](https://github.com/Tencent/teamai-cli/pull/66), [#67](https://github.com/Tencent/teamai-cli/pull/67), [#74](https://github.com/Tencent/teamai-cli/pull/74)).
- Fix batches of recall, knowledge graph, reconcile, and scope isolation defects ([#91](https://github.com/Tencent/teamai-cli/pull/91), [#97](https://github.com/Tencent/teamai-cli/pull/97), [#98](https://github.com/Tencent/teamai-cli/pull/98)).
- Fix Dashboard prompt/token counts and duplicate dispatch, and fix project-scope usage/digest reporting ([#105](https://github.com/Tencent/teamai-cli/pull/105), [#107](https://github.com/Tencent/teamai-cli/pull/107), [#108](https://github.com/Tencent/teamai-cli/pull/108), [#109](https://github.com/Tencent/teamai-cli/pull/109), [#111](https://github.com/Tencent/teamai-cli/pull/111), [#118](https://github.com/Tencent/teamai-cli/pull/118)).
- doctor, init, hooks, and built-in skill deployment skip targets that are absent or disabled ([#116](https://github.com/Tencent/teamai-cli/pull/116), [#128](https://github.com/Tencent/teamai-cli/pull/128), [#135](https://github.com/Tencent/teamai-cli/pull/135)).
- Version comparison handles prerelease identifiers correctly ([#147](https://github.com/Tencent/teamai-cli/pull/147)).

### 🔧 Refactoring

- Decommission the old `teamai-wiki` skill and the `wiki/` resource type ([#90](https://github.com/Tencent/teamai-cli/pull/90)).
- Remove the auto-recall PostToolUse hook in favor of the `teamai-recall` subagent ([#106](https://github.com/Tencent/teamai-cli/pull/106)).

## [0.16.9](https://github.com/Tencent/teamai-cli/compare/v0.16.8...v0.16.9) (2026-06-25)

### ✨ Features

- Add `teamai ci extract-mr`: extract learning and codebase suggestions from an MR/PR, with comment, write, and reaction-based rejection modes ([#36](https://github.com/Tencent/teamai-cli/pull/36), [#39](https://github.com/Tencent/teamai-cli/pull/39)).
- `teamai doctor` adds `gh` CLI install and login checks for the GitHub provider ([#45](https://github.com/Tencent/teamai-cli/pull/45)).

### 🐛 Bug Fixes

- `uninstall` cleans every TeamAI section from CLAUDE.md ([#33](https://github.com/Tencent/teamai-cli/pull/33)).
- Values written to `env.sh` are shell-quoted ([#40](https://github.com/Tencent/teamai-cli/pull/40)).
- Remove project-scope hooks left behind in user-level tool settings ([#44](https://github.com/Tencent/teamai-cli/pull/44)).

## [0.16.8](https://github.com/Tencent/teamai-cli/compare/v0.16.7...v0.16.8) (2026-06-18)

### ✨ Features

- Add knowledge import and codebase maintenance covering local directories, workspaces, MR/PR, iWiki, repository lists, and organization-wide imports ([#28](https://github.com/Tencent/teamai-cli/pull/28)).
- Add the `agents` resource and the built-in `teamai-recall` subagent, plus TodoWrite and merged-MR hints ([#28](https://github.com/Tencent/teamai-cli/pull/28)).
- `contribute-check` adds knowledge gap awareness, recall quality scoring, and git-commit down-weighting ([#30](https://github.com/Tencent/teamai-cli/pull/30)).

## [0.16.7](https://github.com/Tencent/teamai-cli/compare/v0.16.6...v0.16.7) (2026-06-12)

### ✨ Features

- Merge the TeamAI commands for one hook event into a single `hook-dispatch` process ([`be158d4`](https://github.com/Tencent/teamai-cli/commit/be158d4)).
- The first session after an upgrade migrates legacy standalone hooks to the dispatch format ([`b0edb75`](https://github.com/Tencent/teamai-cli/commit/b0edb75)).
- `teamai init` shows the actual user/project storage paths before asking for a scope ([`843ed79`](https://github.com/Tencent/teamai-cli/commit/843ed79)).

## [0.16.6](https://github.com/Tencent/teamai-cli/compare/v0.16.5...v0.16.6) (2026-05-27)

### 🐛 Bug Fixes

- The release pipeline moves to Node.js 22, and `NPM_TOKEN` auth is restored after the OIDC trusted publisher attempt so npm publishing works.

## [0.16.5](https://github.com/Tencent/teamai-cli/compare/v0.16.4...v0.16.5) (2026-05-27)

### ✨ Features

- An environment variable disables wiki pull, push, and built-in skill deployment, and `status` shows the disabled state ([#22](https://github.com/Tencent/teamai-cli/pull/22)).

### 🐛 Bug Fixes

- Unify wiki skill path resolution and `teamai push` scope logic, fixing wrong paths under project scope ([#15](https://github.com/Tencent/teamai-cli/pull/15)).

## [0.16.4](https://github.com/Tencent/teamai-cli/compare/v0.16.3...v0.16.4) (2026-05-19)

### 💥 Breaking Changes

- The wiki moves from per-agent directories to a shared location: `~/.teamai/wiki/` for user scope and `<projectRoot>/.teamai/wiki/` for project scope ([#9](https://github.com/Tencent/teamai-cli/pull/9), !186).

### 🐛 Bug Fixes

- Exclude a nested `.git` when copying skills so no gitlink/submodule is created ([#12](https://github.com/Tencent/teamai-cli/pull/12)).
- Disable file-level parallelism in the GitHub E2E run, fixing the missing `dist/index.js` caused by concurrent cleanup ([#5](https://github.com/Tencent/teamai-cli/pull/5)).

### 📝 Documentation

- English is the default README on GitHub, and the Chinese version moves to `README.zh-CN.md` ([#2](https://github.com/Tencent/teamai-cli/pull/2), [#3](https://github.com/Tencent/teamai-cli/pull/3), [#4](https://github.com/Tencent/teamai-cli/pull/4)).

## [0.16.3](https://github.com/Tencent/teamai-cli/compare/v0.16.2...v0.16.3) (2026-05-09)

### 🐛 Bug Fixes

- pull filters rules by the current role's knowledge namespaces; root-level rules are always kept, and everything syncs when no role is configured (!182).

### 🔧 Refactoring

- Normalize npm package metadata: drop the redundant `./` in the `bin` path and standardize the repository URL.

### 📝 Documentation

- Update the project tagline to "The team harness for AI agents" (!180, !181, !184).

## [0.16.2](https://github.com/Tencent/teamai-cli/compare/v0.16.1...v0.16.2) (2026-05-01)

### ⚡ Performance

- Optimize Stop hooks: shorten the update timeout, add a `contribute-check` fast path and score cache, and lower the Dashboard JSONL compaction threshold (!176).

## [0.16.1](https://github.com/Tencent/teamai-cli/compare/v0.16.0...v0.16.1) (2026-04-29)

### 🐛 Bug Fixes

- Ensure `SKILL.md` frontmatter during pull and built-in skill deployment so Codex does not refuse to load them (!177).

### 📝 Documentation

- Update to the Tencent MIT License, remove ROADMAP/TODOS, and add open-source badges plus a full English README (!170, !171, !172, !174, !175).

## [0.16.0](https://github.com/Tencent/teamai-cli/compare/v0.15.0...v0.16.0) (2026-04-27)

### 💥 Breaking Changes

- `teamai list` now shows both the team repository and installed agents; `--source repo` restores the old behavior (!162).

### ✨ Features

- The provider for a bare `owner/repo` is inferred from the installed package name, and `TEAMAI_DEFAULT_PROVIDER` overrides it (!161).
- Add the built-in `/wiki` skill with multi-source ingestion, incremental updates, query, check, and export (!117).
- `teamai list` adds `--source` and `--agent`, plus the `teamai skill list/show` commands (!162).
- `teamai.yaml` adds a team-level `autoUpdate` policy, and `teamai push --skill` supports force-push and recursive skill scanning (!164, !167).

### 🐛 Bug Fixes

- Complete wiki repository push, failure rollback, remove, and tombstone cleanup (!163).
- Fix built-in wiki skill detection, hidden/workspace directory scanning, and false "modified" reports (!168, !169).

## [0.15.0](https://github.com/Tencent/teamai-cli/compare/v0.14.4...v0.15.0) (2026-04-20)

### 💥 Breaking Changes

- The default provider for a bare `owner/repo` becomes GitHub; TGit users need a full URL or an explicit provider (!156).
- The public package is `teamai-cli`; internal tnpm releases restore the `@tencent/teamai-cli` name (!156).

### ✨ Features

- Add the GitHub provider with `gh` / `GITHUB_TOKEN` auth, clone, repository creation, and pull requests (!156).
- Add dual-channel npm/tnpm publishing, and let the update check pick the registry from the package name (!156).

### 🐛 Bug Fixes

- Detect `main`/`master` dynamically, fixing GitHub push, branch cleanup, and PR creation (!156).
- `doctor` reads project-scope config first, and `source add` clones through the matching provider (!156).

### 🔧 CI/CD

- GitHub Actions adds a Node 20/22 × Ubuntu/macOS matrix and E2E coverage for the main commands; Coding CI is hardened to match (!157, !158).

## [0.14.4](https://github.com/Tencent/teamai-cli/compare/v0.14.3...v0.14.4) (2026-04-17)

### ✨ Features

- Dashboard cards show the AI output, first prompt, and last prompt by default, with Markdown rendering (!153, !154).
- Session states become `AI Working`, `Your Turn`, and `Ended` (!153).

### 🐛 Bug Fixes

- push syncs teammates' updates before scanning while keeping real local edits, so resources are no longer reported as modified (!152).
- Dashboard cards sort stably by total runtime (!151).

## [0.14.3](https://github.com/Tencent/teamai-cli/compare/v0.14.2...v0.14.3) (2026-04-17)

### 🐛 Bug Fixes

- The Stop hook waits for user input and monitors the AI tool process, ending the session only after that process exits (!149).
- The CodeBuddy team instruction path is corrected from `.codebuddy/CLAUDE.md` to `.codebuddy/CODEBUDDY.md` (!150).

## [0.14.2] (2026-04-16)

### 🐛 修复

- **pull role filtering**: 修复当团队无 `tags.yaml` 或用户无 tag 订阅时，`teamai pull` 同步角色外命名空间 skills 的问题 (!148)

## [0.14.0] (2026-04-16)

### ✨ 新功能

- **跨团队 Skill 订阅（Cross-team Source）**：`teamai source add/remove/list/browse` 订阅其他团队的公共 skill 仓库，pull 时自动同步订阅源的 skills (!141)
  - `teamai source add <repo> [--name <alias>]` — 添加订阅源
  - `teamai source remove <name>` — 移除订阅源并清理其 skills
  - `teamai source list` — 列出已配置的订阅源
  - `teamai source browse <name>` — 浏览订阅源的公共 skills
- **团队文化注入（Culture Engine Phase 1）**：在团队仓库创建 `culture.md`，`teamai pull` 时自动编译并注入到各 AI 工具的 `CLAUDE.md` 中 (!84)
  - 支持 YAML frontmatter 定义公司/团队信息（name, mission, vision, values, goals）
  - Markdown body 部分作为团队文化指引正文注入
  - 通用 CLAUDE.md section 注入工具（`utils/claudemd.ts`），被 rules 和 culture 共用
- **Uninstall 命令**：`teamai uninstall [--force]` 智能清理所有 teamai 管理的资源（hooks、CLAUDE.md 块、skills、rules、env、docs、~/.teamai/），保留用户自建内容，支持 `--dry-run` 预览 (!137)
- **Dashboard 全生命周期会话展示**：dashboard 新增完整 session 生命周期追踪，支持展开查看会话详情（prompt 摘要、工具调用序列、时间线） (!140)
- **codex-internal 工具支持**：hooks 注入和资源同步新增对 codex-internal 的适配，与 claude-internal 同等待遇 (!143)
- **CLAUDE.md 团队知识库引用**：pull 时自动在 CLAUDE.md 中添加 `~/.teamai/learnings/` 目录引用，AI 工具可直接发现团队知识库 (!139)
- **Init 非交互模式**：新增 `--role <id>` 和 `--force` 参数，支持完全非交互式初始化，适合 CI/CD 和 AI agent 自动化 (!138)
  - `teamai init --repo owner/repo --scope user --role hai_dev --force`
  - 非 TTY 环境下自动使用默认值，不再 hang
- **共享 Prompt 工具**：统一 6 个模块（init/uninstall/update/remove/push/roles-cmd）的 readline 实现为单例模式，修复管道输入兼容性问题 (!138)
- **Push 交互式命名空间选择**：推送新 skill 时，CLI 自动检测团队仓库中的命名空间并提供交互式选择，无需手动指定 `--role` (!128)
  - 有 `primaryRole` 时，从 manifest 展开可用 namespace 列表
  - 无 `primaryRole` 时，自动扫描团队仓库目录结构
  - 单一命名空间时自动选中，`--silent` 模式下使用默认值
- **Push 自动注入 YAML Frontmatter**：推送 skill 时自动检查 `SKILL.md`，缺少 `name`/`description` frontmatter 则自动补全 (!130)
  - 从目录名推导 `name`，从第一个标题或有意义文本行推导 `description`
  - 已有完整 frontmatter 的文件不做任何修改

### 🐛 修复

- **Pull cache 失效修复**：切换 role 后自动清理过期 skills 缓存，确保新角色立即生效 (!142)
- **Learnings 改为扁平共享模型**：learnings 不再按角色 namespace 隔离，全团队共享 (!126)
- **Push role 模式过滤修正**：修复 role 模式下误显示非允许命名空间 skill 的问题 (!127)
- **Push 支持无 role 的 namespaced 仓库**：无 `primaryRole` 配置时也能正确推送到有命名空间结构的团队仓库 (!129)
- **Votes 不再阻塞 push**：votes 改为本地存储（`~/.teamai/votes/`），由 `teamai pull` 的 auto-report 统一同步到团队仓库，不再直接写入 repo 导致脏文件阻塞 git 操作 (!131)
- **Pull 跳过未安装的 AI 工具**：pull 时检测工具是否已安装，跳过未安装工具，不再创建多余的空目录 (!132)
- **Team repo 自动恢复**：push/pull 前自动检测并恢复 team repo 的脏状态（unmerged 文件、残留 push 分支），使用 `git reset --hard` + 切回 master (!133, !134)
- **Auto-recall 误判修复**：修复源代码中的错误关键词被 auto-recall 误判为运行时错误触发搜索的问题 (!135)

## [0.13.2](https://git.woa.com/teamai/teamai-cli/compare/v0.13.1...v0.13.2) (2026-04-10)

### 🐛 修复

- 修复 Cursor hooks.json 中残留已废弃的 `userPromptSubmit` 事件 key 导致 "Invalid hooks.json" 报错的问题 (!122)

## [0.13.3](https://git.woa.com/teamai/teamai-cli/compare/v0.13.2...v0.13.3) (2026-04-10)

### ✨ 新功能

- **Roles CRUD 命令**：新增 `teamai roles add/remove/update`，管理员无需手动编辑 YAML 即可管理团队角色 (!125)
  - `teamai roles add <id> --namespaces <ns> [-d <desc>]` — 添加角色
  - `teamai roles remove <id>` — 删除角色
  - `teamai roles update <id> --add-namespaces/--remove-namespaces` — 修改角色

### 🐛 修复

- **Pull 安全降级**：成员配置的角色被删除后，pull 不再崩溃，改为 warn + 回退全量同步 (!125)
- **Push namespace 解析**：从 manifest 读取实际 namespace 列表，不再错误地将 role id 当作 namespace (!125)

### 🔧 重构

- 抽出 `pushManifestChange()` 和 `pullLatest()` 共用函数，消除 `rolesInit` 中的重复代码 (!125)
- 新增 `saveRolesManifest()` 含写前校验，防止写入非法 manifest (!125)

---

## [0.13.1](https://git.woa.com/teamai/teamai-cli/compare/v0.11.2...v0.13.1) (2026-04-09)

### ✨ 新功能

- **Roles 管理**：新增 `teamai roles` 命令组（`init`/`list`/`set`），支持团队角色的创建、列举和切换 (!113)
- **Role-aware Skill 同步**：`teamai pull/push` 支持按角色过滤 skill，不同角色看到不同的技能集 (!100)
- **Local Pushignore**：skill 目录支持 `.pushignore` 文件，push 时自动排除不需要同步的本地文件 (!114)
- **Marketplace 自动刷新**：skill push/remove 后自动刷新 `.codebuddy-plugin/marketplace.json`，兼容 CodeBuddy 插件市场 (!119)

### 🐛 修复

- 修复 roles manifest 缺失时 `teamai init` role 选择报错的问题 (!112)
- 修复 auto-recall 对自身输出产生递归误报的问题 (!111)
- 修复 auto-recall 搜索精度不足，新增 title/tag 匹配要求，跳过只读命令 (!104)
- 修复 Stop hook 使用错误的 output schema（`hookSpecificOutput` → `stopReason`）(!107, !108)

### ⚡ 性能优化

- **Team Repo 同步加速**：当 team repo HEAD 未变化时跳过资源同步，避免无意义的文件扫描 (!110)
- **Auto-recall 精准匹配**：matcher 从通配符 `*` 收窄为 4 个精确工具，减少不必要的触发 (!106)

### ♻️ 重构

- 统一 recall 机制 — hook 搜索工具，删除 session-recall 和 recall rule (!102)
- `contribute-check` 从 PostToolUse hook 迁移到 Stop hook，减少每次工具调用的开销 (!103)
- `role bucket` 重命名为 `namespace`，语义更清晰 (!105)

### 📝 文档

- 添加 CLAUDE.md 项目说明和发布流程 (!97)
- 文档中 tnpm 替换为标准 npm + --registry (!118)

---

## [0.9.1](https://git.woa.com/teamai/teamai-cli/compare/v0.9.0...v0.9.1) (2026-03-30)

### 🔧 修复 debug.log 始终为空的问题

`~/.teamai/debug.log` 现在能正确记录所有 hook 运行时的调试和错误信息，方便排查 teamai 后台行为。

#### 问题根因

Hook 命令通过 `2>>~/.teamai/debug.log` 捕获 stderr，但代码中所有日志（包括错误）都写到 stdout（`console.log`），且 `--verbose` 默认关闭——三重静默导致 debug.log 永远为空。

#### 修复方案

- **File Transport**：所有 `log.debug()` 和 `log.error()` 调用现在同时写入 `~/.teamai/debug.log`，不再依赖 shell 的 stderr 重定向
- **ISO 时间戳**：每行日志带 `2026-03-30T06:32:14.123Z [DEBUG]` 格式前缀
- **错误级别拆分**：catch 块中的失败信息从 `log.debug` 改为 `log.error`，方便 `grep ERROR ~/.teamai/debug.log` 快速定位问题
- **自动 Rotation**：debug.log 超过 5MB 自动轮转为 `debug.log.1`，总占用不超过 10MB
- **同步写入**：使用 `appendFileSync` 确保短命 hook 进程不丢日志

#### 使用方式

```bash
# 查看最近的调试日志
tail -20 ~/.teamai/debug.log

# 快速找错误
grep ERROR ~/.teamai/debug.log
```

---

## [0.9.0](https://git.woa.com/teamai/teamai-cli/compare/v0.8.1...v0.9.0) (2026-03-29)

### 🔌 内置规则自动部署 — AI 工具零配置接入团队知识库

`teamai pull` 现在会自动将 CLI 内置的 AI 规则（rules）部署到所有已安装的 AI 工具目录中，**团队成员无需手动配置**，pull 一次即可让 Claude Code / Cursor 等工具自动搜索团队知识库。

#### 工作原理

1. `teamai pull` 执行时，自动检测已安装的 AI 工具（Claude Code、Cursor 等）
2. 将内置规则写入各工具的 `rules/` 目录：
   - `~/.claude/rules/teamai-recall.md`
   - `~/.claude-internal/rules/teamai-recall.md`
   - `~/.cursor/rules/teamai-recall.md`
3. 规则内容随 CLI 版本更新，每次 pull 自动同步最新版本

#### 首个内置规则：`teamai-recall`

该规则指导 AI 在遇到错误、部署问题或不熟悉的模式时，**先搜索团队知识库**再从零开始解决：

```bash
teamai recall "API timeout retry"
teamai recall "K8s OOM pod restart"
```

#### 设计要点

- **零配置** — pull 即生效，团队成员不需要手动复制规则文件
- **跳过未安装工具** — 自动检测，只部署到已安装的 AI 工具
- **与团队规则隔离** — `teamai push` 不会误将内置规则推送到团队仓库
- **可扩展** — 后续可轻松添加更多内置规则

#### 完善知识飞轮闭环

```
contribute(写入) → pull(同步+索引+部署规则) → AI 自动 recall(搜索) → upvote(投票)
                                    ↑ NEW
```

## [0.8.1](https://git.woa.com/teamai/teamai-cli/compare/v0.8.0...v0.8.1) (2026-03-28)

### Digest 隐私改进 + Skill 动态展示

#### 隐私改进

* **移除 digest 中的个人可推断信息** — `(142 uses by 3 member(s))` → `(142 uses)`，小团队中不再能反推谁用了什么
* **移除 skill 推荐中的百分比** — `used by 57% of team` → `popular with your team`，同理保护隐私

#### 新功能

* **Digest 新增 Skill 动态** — `teamai digest` 现在展示近 7 天新增和更新的 Skill
  - 🆕 New Skills This Week — 新创建的 skill，显示作者
  - 🔄 Recently Updated Skills — 有内容更新的 skill
  - 数据来源：team repo 的 git log，零额外配置

#### 示例

```
🆕 New Skills This Week:
  • hai-gpu-sold-report (by jeffyxu)
  • hai-prod-db (by keitewang)

🔄 Recently Updated Skills:
  • tke-deploy
  • hai-deploy-quick
  • tapd-tech-design
```

## [0.8.0](https://git.woa.com/teamai/teamai-cli/compare/v0.7.1...v0.8.0) (2026-03-28)

### 🧠 Git-Native Memory — 团队知识回忆系统

借鉴 [vectorize-io/hindsight](https://github.com/vectorize-io/hindsight) 的 retain/recall 记忆模型，为 teamai 补全知识飞轮的"读出路径"。之前通过 `/teamai-share-learnings` 贡献的经验文档写了没人看，现在 AI 可以通过 `teamai recall` 自动搜索和引用。

**知识飞轮闭环：** `contribute(写入) → pull(同步+索引) → recall(搜索) → upvote(投票) → 排序优化`

#### 新功能

* **`teamai recall <query>`** — 搜索团队知识库，返回按相关性排名的结果 ([!81](https://git.woa.com/teamai/teamai-cli/-/merge_requests/81))
* **Pull 自动同步 learnings** — `teamai pull` 现在会同步 `learnings/` 目录到本地，并自动重建搜索索引
* **Hybrid 中英文搜索** — Intl.Segmenter 拆分英文词 + CJK bigrams 捕捉中文复合词（如"超时""排查"），解决纯 Segmenter 把中文拆成单字的问题
* **搜索自动投票** — recall 返回结果时自动为文档投票（`votes/<user>.yaml`），好文档随时间自然浮到顶部
* **Frontmatter 标准化** — SKILL.md 模板要求 AI 生成的文档包含 `title/author/date/tags` YAML frontmatter，提升搜索精准度

#### 搜索评分规则

| 匹配类型 | 分值 | 说明 |
|----------|------|------|
| 标题命中 | ×3 | frontmatter title 中的词匹配 |
| 标签命中 | ×2 | frontmatter tags 中的词匹配 |
| 正文命中 | ×1 | 文档正文（前 2000 字）中的词匹配 |
| 投票加分 | +0.5/票 | 每票 +0.5，上限 5 分 |

#### 示例

```bash
$ teamai recall "fuse 端口"
--- [teamai:recall:start] --- (1 result)

[1/1] MR 审查发现 FUSE 端口冲突 Bug 及 UpdateInferService 接口测试验证 ★1
Author: jeffyxu | Date: 2026-03-28 | Score: 18.5
Tags: troubleshooting, code-review, tdd, hai_flow, fuse, k8s
File: ~/.teamai/learnings/mr审查发现fuse端口冲突bug及...md

--- [teamai:recall:end] ---
```

#### 技术细节

| 文件 | 说明 |
|------|------|
| `src/utils/search-index.ts` | 搜索引擎核心：hybrid tokenize, buildIndex, loadIndex, search |
| `src/recall.ts` | recall CLI 命令 + autoUpvote |
| `src/types.ts` | LearningDoc, SearchIndex, UserVotes 类型 |
| `src/pull.ts` | learnings 同步 + 索引重建（内联实现，不继承 ResourceHandler） |
| `src/team-push.ts` | auto-report 扩展：投票数据随 pull 捎带推送 |

**测试：** 29 个新测试，全量 444 通过。
**设计文档：** `docs/designs/git-native-memory.md`

## [0.7.1](https://git.woa.com/teamai/teamai-cli/compare/v0.7.0...v0.7.1) (2026-03-28)

### 改进 contribute 经验分享系统

**目录重命名：** `ai-docs/` → `learnings/`，语义更清晰。

**smartScore 评分修复：** 之前的评分逻辑导致提醒从未触发（13 个 session，0 个达标）。
- 新增 toolCount 梯度维度（30→10, 50→15, 80+→20，max 20 分）
- Skill/Error 权重从 25 分降至 15 分（大多数有价值 session 不一定用到）
- 阈值从 60 降至 35
- 真实数据验证：7 个历史 session 中 6 个可触发（之前 0 个）

**文件名格式：** `data-<slug>-<random>.md` → `<slug>-<date>-<random>.md`，加入日期便于辨识。

**中文文档模板：** SKILL.md 改为中文模板，AI 生成的经验文档默认中文撰写。

**测试：** 新增 2 个测试用例（toolCount gradient + 典型 session 集成），全量 12 个 contribute-check 测试通过。

## [0.7.0](https://git.woa.com/teamai/teamai-cli/compare/v0.6.2...v0.7.0) (2026-03-28)

### 🚀 `teamai hooks` 子命令 + update 钩子刷新修复

CLI 升级后新钩子永远无法自动注入的 bug 终于修复。根因：`update.ts` 在 `npm install -g` 后直接调用内存中的 `injectHooksToAllTools()`，但 Node.js 进程仍加载旧版代码，新版代码在磁盘上却不会被重新加载。

**新命令：**
- `teamai hooks inject` — 将 teamai 钩子注入所有 AI 工具的 settings 文件（支持 `--silent` 静默模式）
- `teamai hooks remove` — 从所有 AI 工具的 settings 文件中移除 teamai 钩子

**Bug Fix：**
- `teamai update` 安装新版后，改为 spawn `teamai hooks inject --silent` 子进程，确保加载磁盘上的新版代码，而非旧进程内存中的过时代码

**Doctor 增强：**
- `teamai doctor` 钩子检查从只检查 `pull` / description prefix 改为校验全部 6 个子命令（pull, update, track, track-slash, dashboard-report, contribute-check）
- 缺失子命令时建议运行 `teamai hooks inject`

**新 CLI 命令：**
| Command | Description |
|---------|-------------|
| `teamai hooks inject` | 注入 teamai 钩子到所有 AI 工具 settings |
| `teamai hooks remove` | 移除所有 AI 工具 settings 中的 teamai 钩子 |

**测试：**
- 新增 11 个测试用例（hooks-cmd 7 + doctor 4），全量 413 测试通过

**For Existing Users：**
无需手动操作。下次 `teamai update` 时新版代码会正确刷新钩子。如需手动修复，运行 `teamai hooks inject`。

### [0.6.2](https://git.woa.com/teamai/teamai-cli/compare/v0.6.1...v0.6.2) (2026-03-27)


### Improvements

* **contribute-check**: rename `hinted` → `evaluated`, add `smartScore` field ([!78](https://git.woa.com/teamai/teamai-cli/-/merge_requests/78))
  - `hinted` 语义不准确（实际含义是"已评估"而非"已提示用户"），重命名为 `evaluated`
  - 新增 `smartScore` 字段，持久化评估分数便于排查 session 为何未触发 hint
  - `readContributeState` 向后兼容旧格式，自动迁移 `hinted` → `evaluated`
  - Cursor 端补上遗漏的 `contribute-check` hook

### [0.6.1](https://git.woa.com/teamai/teamai-cli/compare/v0.6.0...v0.6.1) (2026-03-27)


### Bug Fixes

* **contribute-check**: per-session state files to prevent multi-window overwrite ([!77](https://git.woa.com/teamai/teamai-cli/-/merge_requests/77))
  - `contribute-state.json` 单文件被多窗口互相覆盖，toolCount 反复归零
  - 改为 `~/.teamai/sessions/{sessionId}.json`，每个 session 独立文件，零竞争
  - 写入时自动清理超过 24h 的旧 session 文件
  - `CONTRIBUTE_BASE_THRESHOLD` 从 100 降到 50，匹配实际 session 工具调用分布

## [0.6.0](https://git.woa.com/teamai/teamai-cli/compare/v0.5.2...v0.6.0) (2026-03-27)

### 🚀 Session 经验自动分享

AI coding session 中使用超过 100 次工具调用时，系统智能评估 session 价值并提示用户分享经验给团队。

**工作原理：**

```
AI coding session
    │
    ▼  PostToolUse hook 每次工具调用自动计数（~1ms）
    │
    ├─ < 100 次 → 静默计数
    │
    ▼  达到 100 次 → 智能评分
    │
    ├─ 分数不够（只是重复调用同一个工具）→ 不打扰
    │
    ▼  分数达标（工具多样、用了 skill、有错误重试、session 够长）
    │
    AI 提示："本次 session 内容丰富，建议运行 /teamai-share-learnings 分享经验"
    │
    ▼  用户同意 → AI sub-agent 生成摘要 → push 到团队仓库 ai-docs/
```

**新命令：**
- `teamai contribute --file <path> --title <title>` — 将经验文档推送到团队仓库 `ai-docs/` 目录
- `teamai contribute-check --stdin` — hook 内部使用，智能阈值检测

**内置 Skill：**
- `/teamai-share-learnings` — AI sub-agent 总结 session 经验并推送到团队仓库
- 随 `teamai pull/init` 自动部署到本地，CLI 升级时 skill 内容跟着更新
- `teamai push` 自动排除内置 skill，不会推到团队 repo

**智能评分机制：**
- 工具多样性（用了多少种不同工具）— 最高 30 分
- Skill 使用（触发了复杂工作流）— 25 分
- 错误和重试（踩坑经验更有价值）— 25 分
- Session 时长（> 30 分钟）— 20 分
- 总分 ≥ 60 才触发提示

**性能设计：**
- 两层检测：前 99 次只读写小 JSON state 文件（~1ms），不读 events.jsonl
- 达到 100 次时一次性读取 events.jsonl 做智能评估
- 每个 session 最多提示一次（去重），用户可忽略

**技术细节：**
- 新增 `contribute-check.ts`（阈值检测 + STDOUT hint）、`contribute.ts`（push 命令）、`builtin-skills.ts`（内置 skill 自动部署）
- 修改 `hooks.ts`（新增 PostToolUse contribute-check hook）、`pull.ts`/`init.ts`（内置 skill 部署）
- 15 个新单测 + 更新现有 hooks 测试

### [0.5.2](https://git.woa.com/teamai/teamai-cli/compare/v0.5.1...v0.5.2) (2026-03-26)

### Bug Fixes

* clean up stale local rule files during pull (merge request !71) ([30a4662](https://git.woa.com/teamai/teamai-cli/commit/30a466271394b2a7b2ca3d229aada3ea8cb57f17))
  - `teamai pull` 现在会自动清理本地已从 team repo 删除的 rule 文件
  - 之前从 team repo 删除 rule 后，本地 `~/.claude/rules/` 等目录会残留过期副本
  - 清理逻辑：对比本地 `.md` 文件与 team repo，删除上游已不存在的文件
  - 自动清理删除后留下的空子目录
  - 仅影响 `.md` 文件，其他文件类型不受影响
  - 新增 5 个测试用例覆盖各种清理场景

## [0.5.1](https://git.woa.com/teamai/teamai-cli/compare/v0.5.0...v0.5.1) (2026-03-25)

### Bug Fixes

* skip tracking slash commands for non-existent skills (merge request !70) ([8eb2778](https://git.woa.com/teamai/teamai-cli/commit/8eb2778))
  - 输入 `/data` 等不存在的 skill 不再被计入 `teamai stats` 统计
  - 新增 `skillExistsOnDisk()` 检查，验证 SKILL.md 存在后才记录
  - 仅影响 slash command 路径，Skill tool 调用不受影响

## [0.5.0](https://git.woa.com/teamai/teamai-cli/compare/v0.4.5...v0.5.0) (2026-03-25)

### 🚀 AI Coding Session Dashboard (Phase 1)

新增 `teamai dashboard` 命令，在浏览器中实时展示所有 AI coding session 的状态。解决多窗口 Alt+Tab 切换的痛点。

**新命令：**
- `teamai dashboard` — 启动本地 Web UI（默认 localhost:3721），展示 session 状态卡片
- `teamai dashboard -p <port>` — 自定义端口
- `teamai dashboard-report --stdin --tool <name>` — hook 内部使用，上报 session 事件

**Dashboard 功能：**
- 🟢🟡🔴⚪ 状态灯：running / waiting / error / idle
- Session 卡片展示：工作目录 (cwd)、首个 prompt 摘要、最后使用工具、活动时间
- SSE 实时推送，延迟 < 3 秒
- Session 识别：session_id 优先 + PID+cwd fallback
- 自动清理：Stop hook + 5 分钟 idle 超时 + 30 分钟移除
- JSONL 事件日志 + 超过 10,000 行自动 compact
- 暗色主题 Web UI，零新依赖（Node.js 内置 http 模块）

**Hook 变更：**
- 新增 4 个独立 dashboard hooks（SessionStart / PostToolUse / UserPromptSubmit / Stop）
- 与现有 usage tracking hooks 完全解耦，可独立开关

### Features

* add AI coding session dashboard (Phase 1) (merge request !69) ([25308dd](https://git.woa.com/teamai/teamai-cli/commit/25308dd08a32ed52a3a43aa661475c0e6893c0ea))


### Bug Fixes

* cleanup all teamai hooks (including outdated descriptions) before re-inject ([8352449](https://git.woa.com/teamai/teamai-cli/commit/8352449fed58398a008440cd80b9760602431bf7))
* usage tracking tool field + auto hook cleanup (merge request !68) ([3086278](https://git.woa.com/teamai/teamai-cli/commit/30862780f86e883de5bd74c710e94ab502b8cf16))
* usage tracking tool field correctly identifies each AI tool (merge request !67) ([dfd51ca](https://git.woa.com/teamai/teamai-cli/commit/dfd51ca197729b14eea5e9977f37114f02c04c42))

## [0.4.7] - 2026-03-24

### Fixed
- **彻底清理重复 hooks**：`cleanupLegacyHooks` 现在清理所有命令含 teamai 的条目（无论有无 description），修复了 description 关键词改名（如 "Check for updates" → "Auto-update"）导致的重复问题

### Tests
- 新增过时 description 清理测试，全量 340 测试通过

## [0.4.6] - 2026-03-24

### Fixed
- **Usage tracking `tool` 字段归因修复**：hook 命令从 `teamai track --stdin` 改为 `teamai track --stdin --tool <name>`，每个工具的 settings.json 注入各自标识（claude / claude-internal / codebuddy 等），usage 数据不再全部记为 `'claude'`
- **清理遗留重复 hooks**：早期版本注入的 hook 无 `description` 字段导致重复堆积，新增 `cleanupLegacyHooks()` 在注入前自动清理，非 teamai hook（如 continuous-learning）不受影响

### Added
- **Update 后自动刷新 hooks**：`teamai update` 成功安装新版后自动调用 `injectHooksToAllTools()`，老用户无需重新 `teamai init`，未初始化则静默跳过
- `track` / `track-slash` CLI 命令新增 `--tool <name>` option，缺省默认 `'claude'`（向后兼容）

### Tests
- 新增 17 个测试：--tool 参数传递、向后兼容、hook 命令字符串验证、遗留 hook 清理、非 teamai hook 保留、update 后 hooks 刷新
- 全量 317 测试通过，零回归

### For Existing Users
无需任何手动操作。下次 session 结束时 Stop hook 触发 `teamai update` → 自动安装新版 → 自动刷新 hooks + 清理重复条目。

## [0.4.5] - 2026-03-24

### Added
- **Slash Command 使用追踪**：新增 `UserPromptSubmit` hook 检测 `/slash-command` 调用（如 `/plan-eng-review`、`/tdd`），自动记录到 `usage.jsonl`
  - 新增 `teamai track-slash --stdin` CLI 命令，解析 Claude Code 的 `UserPromptSubmit` hook JSON
  - 支持冒号命名空间格式（如 `/gstack:tdd`）
  - `teamai init` 自动注入 `UserPromptSubmit` hook 到 Claude Code settings.json

### Fixed
- **Usage 上报竞态条件**：`reportUsageToTeam` 改为先 `git pull` 获取最新远端 stats 再合并本地数据，防止并发 push 时相互覆盖导致数据丢失

### Changed
- **Hooks 注入重构**：`hooks.ts` 从 200+ 行嵌套 if/else 重构为数据驱动的 `CLAUDE_HOOKS[]` 数组 + 通用 `ensureClaudeHook()` 函数，新增 hook 只需加一行定义
- `stats.ts` 和 `team-push.ts` 之间新增交叉引用注释，标注两处 merge 逻辑的关联

### Tests
- 新增 8 个 trackSlashCommand 测试：合法追踪、冒号命名空间、非 slash 忽略、空 prompt、空 STDIN、畸形 JSON、known-skills 更新
- 全量 302 测试通过，零回归

### For Existing Users
存量用户下次 `teamai pull` 或重新运行 `teamai init` 后，`UserPromptSubmit` hook 会自动注入，无需手动操作。

## [0.4.4] - 2026-03-22

### Added
- **Cursor Skill 使用追踪**：通过 postToolUse hook (matcher: `Read`) 检测 SKILL.md 文件读取，自动记录 Cursor 用户的 skill 使用到 `usage.jsonl`
  - `teamai init` 自动注入 postToolUse hook 到 Cursor 的 `hooks.json`
  - `UsageEvent.tool` 字段区分 `cursor` / `claude`，支持按工具来源分析使用数据
  - 适配 Cursor 原生 STDIN 格式（`file_path` 字段），经实际 hook 触发验证
- **Hook 自动更新**：stop hook 从 `teamai update --check` 改为 `teamai update`，支持根据 updatePolicy 自动安装更新（不再仅打印提示）
  - `doUpdate` 通过 TTY 检测区分 hook/手动模式，非 TTY 环境下 prompt 策略自动降级为提示

### Tests
- 新增 7 个测试：Cursor Read + SKILL.md 路径追踪、file_path 原生格式、非 SKILL.md 忽略、工具来源标记验证
- 全量 294 测试通过，零回归

### For Existing Users
存量 Cursor 用户需重新运行 `teamai init` 以注入 postToolUse hook。Claude Code 用户无需操作，hook 会在下次会话结束时自动更新。

## [0.4.3] - 2026-03-22

### Fixed
- **Stats 数据每次上报后丢失（Critical）**：`reportUsageToTeam` 每次 `teamai pull` 时直接覆写 `stats/<user>.yaml`，不与历史数据合并，导致之前累积的统计全部丢失。修复后先读取已有 stats 文件，count 累加、lastUsed 取更新值
- **`teamai stats` 在 pull 后显示空数据**：`showStats` 只读 `usage.jsonl`（每次成功上报后被 truncate 清空），导致用户看到 "No skill usage data yet"。修复后同时读取本地 `usage.jsonl`（未上报事件）+ 团队仓库 `stats/<user>.yaml`（已上报历史），合并展示完整统计
- **Skill 名提取字段兼容性不足**：`extractSkillName` 仅检查 `skill`/`name` 字段，遗漏部分 AI 工具的 hook 格式
  - 新增 `skill_name`、`command` 字段支持
  - 支持从 SKILL.md 文件路径（如 `/root/.cursor/skills/tdd/SKILL.md`）中自动提取 skill 目录名

### Tests
- 新增 17 个测试用例：mergeStats 合并逻辑（4）、extractSkillName 多格式提取（9）、边界条件（4）
- 全量 288 测试通过，零回归

## [0.4.2] - 2026-03-20

### Fixed
- **Skill 使用追踪完全失效**：PostToolUse hook 通过环境变量 (`$CLAUDE_TOOL_NAME`) 读取数据，但 Claude Code 实际通过 STDIN JSON 传递。hook 每次收到空参数，从未记录任何真实 skill 使用事件
  - 新增 `teamai track --stdin` 模式，从 STDIN 读取 Claude Code hook JSON 并解析 `tool_name`/`tool_input`
  - Hook 命令从 `'teamai track "$CLAUDE_TOOL_NAME" ...'` 改为 `'teamai track --stdin'`
  - 旧 CLI 参数方式仍兼容，支持手动测试
- **Skill 推荐始终显示 "you haven't tried it"**：`usage.jsonl` 上报到团队仓库后被 truncate 清空，但推荐引擎只读 `usage.jsonl`，丢失全部历史数据
  - 新增 `~/.teamai/known-skills.json` 持久化已用 skill 集合，不受 truncate 影响
  - 推荐引擎合并 `usage.jsonl`（未上报事件）+ `known-skills.json`（历史记录）两个数据源
- Hook 错误不再静默丢弃：stderr 从 `/dev/null` 改为追加到 `~/.teamai/debug.log`，方便排查

### For Existing Users
存量用户下次 `teamai pull` 时 hook 会自动升级为 `--stdin` 模式，无需手动操作。

## [0.4.1] - 2026-03-20

### Fixed
- `scanLocalForPush()` crash bug：遍历 `toolPaths` 时缺少 `toolPath.skills` null 检查，当工具配置没有 `skills` 字段时 `teamai push` 会崩溃 (TypeError)。该 bug 在 v0.3.13 重构时遗漏 (!61)
- `ToolPathsSchema.skills` 从 required 改为 optional，与运行时防御性检查一致

### Removed
- 清理 `syncTargets` 僵尸配置：v0.3.13 已改为自动检测工具，但 `syncTargets` 残留在 schema、init、28+ 处测试中。全部清除
- `init` 生成的 `teamai.yaml` 不再包含 `sharing.skills.syncTargets` 字段

## [0.4.0] - 2026-03-19

### Added
- **Skill Usage Tracking**: PostToolUse hook 自动追踪 Skill 工具调用，写入 `~/.teamai/usage.jsonl`
  - `teamai track <toolName> [toolInput]` — hook 调用的底层命令，自带 skill name 校验（防 path traversal）
  - `teamai stats` — 查看本地 skill 使用统计（次数 + 最近使用时间）
  - `teamai init` 自动注入 PostToolUse hook 到 Claude Code / Claude Internal / CodeBuddy 的 settings.json
- **团队 Usage 自动上报**: `teamai pull` 时自动聚合本地 usage 数据为 `stats/<user>.yaml` 并 git push 到团队仓库
  - Best-effort 策略，5s 超时，失败不阻塞 session 启动
  - 上报成功后自动截断本地 JSONL，文件永远很小
- **Skill Health Score**: 两维评分 = usage(0-60) + freshness(0-40)，0-100 分显示为 ★★★★★
- **Skill 推荐**: `teamai pull` 后自动推荐团队热门但用户未使用的 skill
- **Session 记录**: `teamai save-session [--summary "..."]` 收集会话工具使用记录并评估价值
  - 有价值（含错误/重试/踩坑）的 session 标记为可推送
  - 按月聚合存储到 `~/.teamai/sessions/<year-month>.md`
- **团队周报**: `teamai digest` 生成团队 AI 工具使用周报（最热 skill、活跃成员、session 摘要）
- 新增设计文档 `docs/designs/team-intelligence-platform.md`
- 新增 `TODOS.md` 记录延迟工作项

### New CLI Commands
| Command | Description |
|---------|-------------|
| `teamai track` | 追踪工具使用（PostToolUse hook 调用） |
| `teamai stats` | 查看本地 skill 使用统计 |
| `teamai save-session` | 保存会话工具使用摘要 |
| `teamai digest` | 生成团队周报 |

### For Existing Users
存量用户需重新运行 `teamai init` 以注入 PostToolUse hook。

## [0.3.14] - 2026-03-19

### Added
- 自动更新功能：新增 `teamai update [--check]` 命令，支持从 tnpm 检查并安装最新版本
  - 24 小时版本检查缓存，避免频繁请求 registry
  - 可配置更新策略：`auto`（自动安装）、`prompt`（提示确认）、`skip`（跳过）
  - PID 文件锁防止并发安装冲突
- Session 结束自动检查更新：`teamai init` 自动注入 Stop/SessionEnd hook，AI 工具会话结束时自动检测新版本

## [0.3.13] - 2026-03-17

### Added
- OpenClaw 支持：skills 和 rules 自动同步到 `~/.openclaw/skills/` 和 `~/.openclaw/rules/` (!57)

### Changed
- Skills sync 改为自动检测已安装工具，不再依赖 `syncTargets` 配置 (!58)
  - 遍历所有 `toolPaths` 并通过 `isToolInstalled` 检测 `~/` 下目录是否存在
  - 新增工具无需修改 `teamai.yaml` 即可自动同步
  - 与 rules sync 行为保持一致

### Fixed
- Cursor skills 路径修正：`.cursor/skills-cursor` → `.cursor/skills` (!56)

## [0.3.12] - 2026-03-12

### Fixed
- `teamai pull` docs 数量显示修复：之前始终显示 "Synced 1 docs"，现在正确显示实际文件数（如 "Synced 2 docs"）
- `teamai status` docs 计数修复：之前用 `listDirs` 统计目录数（结果为 0），改为用 `listFiles` 统计实际文档文件数

## [0.3.11] - 2026-03-12

### Fixed
- 文件系统操作（目录扫描、内容比较、复制、mtime 计算）全局过滤 `__pycache__/`、`.pyc`、`.DS_Store`、`node_modules` 等无关文件，避免 push/pull 时产生误判的"已修改"diff

## [0.3.10] - 2026-03-11

### Added
- Rules 子目录支持：`teamai push`/`pull` 递归扫描 rules 目录，支持按语言/类别组织规则文件（如 `common/`、`python/`、`golang/`）(!52)
- 新增 `listFilesRecursive()` 工具函数用于递归文件遍历
- `teamai push` 默认显示每个资源的源文件路径

### Changed
- CLAUDE.md 引用从逐文件列举改为目录级引用（`~/.claude/rules/`），减少上下文占用
- CLAUDE.md 新增 docs 目录引用（`~/.teamai/docs/`）
- `teamai pull` 日志从 "Merged N rule(s) into CLAUDE.md" 改为 "Synced N rule(s)"

## [0.3.9] - 2026-03-10

### Fixed
- `teamai init --repo group/subgroup/repo` 多级路径支持：`gf repo clone` 不支持三级及以上路径，改为回退到带 OAuth token 的 `git clone`
- `gfCreateRepo` 查找 namespace 时使用 `full_path` 匹配，修复多级 group 下创建仓库 namespace 匹配失败的问题

## [0.3.8] - 2026-03-10

### Added
- `teamai push` skill 推送时自动维护 CONTRIBUTORS 文件，记录每个 skill 的贡献者 (!46)

### Fixed
- `gfGetOAuthToken` 返回用户密码而非 OAuth token (!47)
- OAuth token 改为从 `~/.netrc` 读取，替代不可靠的 `git credential fill` (!48)
- 修正 OAuth token 相关的误导性注释 (!49)
- `gf mr create` MR title/description 使用 shell 单引号，修复换行符丢失问题 (!50)
- 支持多级 group 路径的仓库 URL 解析（如 `group/subgroup/repo`）(!42)

### Changed
- 简化 README，按角色（管理员/成员）分离快速上手指南 (!43, !45)

## [0.3.7] - 2026-03-09

### Fixed
- `gf mr create` 创建 MR 时 PushNotFastForward 错误：`pushRepoBranch` 在 push 后切回 master，导致 gf 内部 push HEAD 时分支不匹配。现在保持 HEAD 在 source branch 直到 MR 创建完成

## [0.3.6] - 2026-03-09

### Fixed
- `teamai remove` 创建 MR 失败（"remote not found"）：`gfMrCreate` 调用缺少 `cwd` 参数，导致 gf CLI 在错误目录下执行

## [0.3.5] - 2026-03-09

### Fixed
- `teamai members` 读取前先 `git pull`，确保能看到远程新注册的成员
- `teamai init` 已配置 reviewer 的团队仓库，新成员加入时不再重复提示配置 reviewer

## [0.3.3] - 2026-03-09

### Fixed
- `teamai init` 新成员注册 push 失败：当团队仓库中缺少某些 `.gitkeep` 文件时，`git add` 报错导致整个 push 失败，成员注册信息无法推送到远程 (!36)

## [0.3.2] - 2026-03-09

### Added
- `teamai push`/`teamai status` 检测本地已修改的 rules，在差异扫描中标记 modified 状态 (!31)
- 新增 `src/utils/fs.ts` 文件内容比对工具函数，支持跨工具目录的内容一致性检查
- 新增 `fs-compare.test.ts`、`rules.test.ts`、`skills.test.ts`、`skip-uninstalled-tools.test.ts` 测试文件

### Fixed
- `teamai pull` 跳过未安装的 AI 工具，不再向不存在的工具目录同步资源 (!34)
- `teamai push` 扫描改为跨所有工具目录比对内容，修复时间戳比较的 timing bug (!33)
- `teamai doctor` 不再误报 Cursor hook 缺失 (!32)

### Changed
- 项目名称由 "Team AI DevKit" 更名为 "团队 AI 经验共享框架 TeamAI" (!35)

## [0.3.1] - 2026-03-08

### Added
- `teamai pull` env 变量注入改为 source 文件引用方式，避免直接修改 shell profile (!30)
- env push 改为 deferred 模式，减少不必要的 MR 创建

## [0.3.0] - 2026-03-08

### Changed
- **重构资源类型**：移除 hooks 和 instincts 资源类型，简化架构 (!26)

### Fixed
- `teamai init` 处理不存在和空仓库的场景 (!27)
- `teamai init` clone path 修复及误判仓库不存在的问题 (!28)

### Removed
- 删除 `teamai sync` 命令（不安全的双向同步） (!29)
- 删除 `src/resources/hooks-config.ts` 和 `src/resources/instincts.ts`

## [0.2.4] - 2026-03-08

### Removed
- 删除 `teamai sync` 命令：该命令在 pull 阶段会无提示覆盖本地修改，存在数据丢失风险。请分别使用 `teamai push` 和 `teamai pull`

## [0.2.3] - 2026-03-08

### Fixed
- `teamai init` clone path 不再交互确认，直接使用默认路径 `~/.teamai/team-repo`
- 修复仓库存在却误判为"不存在"的问题：git 对象统计中的 `reused 404` 被误匹配为 HTTP 404

## [0.2.2] - 2026-03-07

### Fixed
- `teamai init` 不存在的远程仓库自动创建：检测到仓库不存在时询问用户确认，通过 TGit API 自动创建
- `teamai init` 空仓库克隆兜底：克隆空仓库后目录不存在时，自动 `git init` + 配置 remote
- `pushRepoDirectly` 首次 push 设置 upstream (`git push -u origin <branch>`)，兼容 main/master 等分支名

### Added
- `gfGetOAuthToken()` 从 git credential store 提取 OAuth token
- `gfCreateRepo()` 通过 TGit REST API (Bearer auth) 创建远程仓库
- `RepoNotFoundError` 错误类型，区分"仓库不存在"和其他克隆错误
- `initRepo()` 本地 git 初始化 + 添加 remote 的工具函数
- `init.test.ts` 覆盖空仓库兜底、自动创建、用户拒绝、创建失败等场景

## [0.2.1] - 2026-03-07

### Fixed
- 修复 gf CLI 下载地址错误：改为从 `mirrors.tencent.com` 官方源下载
- 修复平台架构名称：x64/arm64（之前误用 amd64）

## [0.2.0] - 2026-03-07

### Changed
- **认证方式改造**：使用工蜂 CLI (`gf`) 替代手动 Private Token 配置
  - `teamai init` 自动安装 gf CLI 到 `~/.teamai/gf/`（无需 sudo）
  - 通过 `gf auth login` 交互式 OAuth 登录（支持 iOA、浏览器设备码、手动 Token）
  - 不再需要手动获取和配置 `TGIT_TOKEN`
- **Clone 方式改造**：使用 `gf repo clone` 替代 simple-git clone
  - gf clone 自动将 OAuth token 嵌入 remote URL，后续 git pull/push 无需额外认证
- **MR 创建改造**：使用 `gf mr create` 替代 TGit v3 REST API
  - reviewer 直接传 username，不再需要查询 user ID
  - 影响 `teamai push`、`teamai remove`、`teamai env add/remove`

### Removed
- 删除 `src/utils/tgit-api.ts`（TGit v3 REST API 客户端）及其测试文件
- 不再需要 `TGIT_TOKEN` 环境变量
- 移除手动 token 配置流程（`askSecret`、`openBrowser`、`saveTokenToEnvFile`）
- 移除 `resolveRepo` 预检查（`getProject`、`isRepoEmpty`、`fileExistsInRepo`）

### Added
- 新增 `src/utils/gf-cli.ts`：gf CLI 安装、认证、clone、MR 创建的完整封装
- `teamai doctor` 新增 gf CLI 安装和认证状态检查

## [0.1.14] - 2026-03-06

### Added
- 团队环境变量同步：新增 `env` 资源类型，支持从团队仓库 `env/env.yaml` 同步环境变量到成员的 shell 配置文件 (!23)
- `teamai env list` — 列出团队环境变量
- `teamai env add <key> <value>` — 添加/更新环境变量（通过 branch + MR 流程）
- `teamai env remove <key>` — 删除环境变量（通过 branch + MR 流程）
- `teamai pull` 自动将 env 变量注入 ~/.bashrc 或 ~/.zshrc，使用标记注释 `[teamai:env:start/end]` 实现幂等更新
- `teamai pull` 同时写入 `~/.teamai/env` 作为 KEY=VALUE 格式备份
- `teamai status` 显示 env 变量计数，`teamai list env` 显示变量详情
- `teamai doctor` 新增 shell profile env 注入检查项
- `teamai init` 创建 `env/` 目录，默认配置含 `env: { injectShellProfile: true }`
- 支持 `sharing.env.shellProfilePath` 自定义注入路径，`sharing.env.injectShellProfile: false` 禁用注入

## [0.1.13] - 2026-03-06

### Added
- `teamai pull` 输出详情：显示 skills/instincts 的新增/更新数量（如 `3 new, 29 updated`），hooks 显示实际条目数 (!20)
- TGit API `fileExistsInRepo` 辅助函数：检查远程仓库文件是否存在 (!18)

### Fixed
- `teamai --version` 从 `package.json` 动态读取版本号，不再硬编码（修复 0.1.12 版本号不一致问题）
- 修复 MR 创建时 `web_url` 返回 undefined 及 reviewer 未设置的问题（TGit v3 API 兼容） (!17)
- `teamai init` 对已有 teamai 仓库/已注册成员跳过多余确认提示 (!18, !19)
- `teamai init` 使用 `default_branch` 替代硬编码 `master` 检查远程文件 (!19)
- Session start hook 去掉 `--silent`，新会话启动时可见 pull 输出；`teamai init` 自动更新旧版 hook command (!20)
- `teamai pull` docs 目录只有 `.gitkeep` 时跳过同步，复制时过滤 dot 文件 (!20)

## [0.1.11] - 2026-03-05

### Added
- CodeBuddy IDE 支持：hooks/skills/rules 同步覆盖 CodeBuddy 工具目录 (!15)
- 分支 + MR 工作流：`teamai push` 改为创建独立分支并自动创建 Merge Request，支持 reviewer 审批 (!14)
- Tombstone 机制：已删除的资源不会被 `teamai push` 重新推送 (!12)

### Changed
- 简化成员管理：移除 readonly/write 角色系统，所有成员统一权限 (!13)

## [0.1.9] - 2026-03-05

### Added
- `teamai remove <type> <name>` 命令：从团队仓库和本地删除 skills/rules 资源 (!10)
- Cursor hooks 支持：`teamai init` 自动注入 `.cursor/hooks.json` 格式的 SessionStart hook (!9)

### Fixed
- 文档与代码对齐 (!11)

## [0.1.7] - 2026-03-05

### Added
- `teamai push` 支持推送 rules 到团队仓库 (!6)
- 成员角色管理：支持 readonly/write 角色区分 (!5)
- `teamai init --repo` 支持短格式 `owner/repo` (!1)

### Changed
- Rules 分发改为独立文件同步到各工具 rules 目录，不再内联到 CLAUDE.md (!7)

### Fixed
- `teamai init` 自动配置 git user (!4)
- TGIT_TOKEN 获取链接更新为 `/profile/account` (!2)

## [0.1.0] - 2026-03-03

### Added
- 初始发布
- `teamai init` — 初始化团队仓库关联、注册成员、注入 SessionStart hooks
- `teamai push` — 推送本地 skills 到团队仓库
- `teamai pull` — 拉取团队资源（skills、rules、hooks、docs）到本地 AI 工具目录
- `teamai sync` — 双向同步（push + pull）
- `teamai status` — 查看本地与团队仓库的差异
- `teamai list` — 列出团队资源
- `teamai members` — 列出团队成员
- `teamai doctor` — 诊断配置问题
- 支持 Claude Code、Codex、Claude Code Internal、Cursor 四种 AI 工具
- SessionStart hook 自动拉取团队最新内容
