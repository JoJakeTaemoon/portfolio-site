import type { ProcessPage } from "./types";

// D-035 as amended by D-057 ①: the 2026 EWA platform, plus the six-project harness table. Every sentence traces to docs/facts/_process.md;
// pipeline layout from docs/reviews/2026-11-10-visuals-round1.md §7 (N4).
export const processKo: ProcessPage = {
  title: "일하는 방식",
  lead: "2026년 EWA 플랫폼을 만들며 세우고 운영한 방식과, 프로젝트 6건에서 그 방식이 바뀐 과정을 적었습니다. 고객의 수정 요청은 모두 24시간 안에 반영했습니다. 13개 역할의 AI 에이전트 팀에 8단계 파이프라인으로 설계·구현·QA·리뷰를 맡겼습니다. 요구사항과 결정 시트의 답은 고객 쪽 이해관계자가 댔고, 저는 기본값으로 진행한 결정을 확정하거나 입력하고 운영 반영을 지시했습니다.",
  pipelineTitle: "기능 하나, 명세에서 운영까지",
  mapBand: "에이전트 8단계 · 13개 역할", // ewa.md:242 (8 stages, 13 roles); _process.md:44
  pipeline: {
    intro: "가운데 8단계는 역할 에이전트가 맡는다. 위에서는 고객이 요구사항을 대고 본인이 기본값으로 진행한 결정을 확정·입력하며, 아래에서는 본인이 운영 반영을 지시한다.",
    cols: 4,
    rows: 4,
    // Array order = Tab order = the order work moves in (plan §7.2).
    nodes: [
      { id: "stake", label: "고객", sub: "기획 문서 · 결정 시트", col: 0, row: 0, group: "human" },
      { id: "intake", label: "접수", sub: "스토리 · AC 확인", col: 0, row: 1, group: "process" },
      { id: "architect", label: "아키텍트", sub: "모델 · API 계약", col: 1, row: 1, group: "process" },
      { id: "decide", label: "결정 확정·입력", sub: "199행 중 사람 68 · 본인 37", col: 1, row: 0, group: "me" },
      { id: "design", label: "디자인", sub: "화면 · 흐름 명세", col: 2, row: 1, group: "process" },
      { id: "develop", label: "개발", sub: "TDD · 백엔드·웹·앱", col: 3, row: 1, group: "process" },
      { id: "qa", label: "QA", sub: "AC별 판정", col: 3, row: 2, group: "process" },
      { id: "review", label: "리뷰 게이트", sub: "보안 · 코드 · 계약", col: 2, row: 2, group: "process" },
      { id: "escalate", label: "반려 상한", sub: "같은 지적 2회 초과 시", col: 2, row: 3, group: "me", idle: true },
      { id: "integrate", label: "통합", sub: "로컬 병합 · 충돌 확인", col: 1, row: 2, group: "process" },
      { id: "document", label: "문서화", sub: "README · 런북", col: 0, row: 2, group: "process" },
      { id: "ship", label: "운영 반영 지시", sub: "push · 배포 · 스토어 제출", col: 1, row: 3, group: "me" },
      { id: "deploy", label: "배포", sub: "스테이징 · 운영", col: 0, row: 3, group: "process" },
    ],
    edges: [
      { from: "stake", to: "intake", label: "기획 문서" },
      { from: "intake", to: "architect" },
      { from: "architect", to: "decide", label: "기본값 기록" },
      { from: "architect", to: "design" },
      { from: "design", to: "develop" },
      { from: "develop", to: "qa" },
      { from: "qa", to: "review" },
      { from: "review", to: "develop", label: "반려" },
      { from: "review", to: "escalate", label: "규칙" },
      { from: "review", to: "integrate" },
      { from: "integrate", to: "document" },
      { from: "document", to: "deploy" },
      { from: "ship", to: "deploy", label: "지시로 실행" },
    ],
    notes: {
      stake: "기능의 원천은 고객 쪽 이해관계자 문서 5종이고, 이를 합친 명세가 스토리 ID의 출처다. 7월 3일 이해관계자 결정 시트의 답은 7월 4~5일 결정 D-128~D-131로 한꺼번에 반영했다.",
      intake: "스토리 ID와 수용 기준을 확인한다. 규칙은 「모든 기능은 명세의 스토리 ID로 이어진다」이고, 비병합 커밋 1,855개 중 61.4%에 스토리 ID가 있다.",
      architect: "데이터 모델·API 계약과 ADR을 다룬다. 결정이 필요하면 막히지 않게 추천 기본값으로 진행하고 결정 기록에 남긴다.",
      decide: "사람의 확정·입력이 적힌 행은 199행 중 68행이고, 그중 본인 이름이 적힌 행은 37행이다. 되돌리기 어려운 11건 중 3건은 기록할 때 확정했고, 나머지는 기본값으로 진행하고 나중에 검토하는 방식이다. 앞선 행 26개가 뒤에 쓴 행으로 뒤집혔고(같은 날 뒤집은 것 포함), 뒤집는 행에는 무엇을 뒤집는지 적는다.",
      design: "스토리별 화면과 흐름 명세를 만든다. 디자인 파일이 계기가 되어 앞선 결정을 뒤집은 행도 있다(D-141, D-156).",
      develop: "규칙은 실패하는 테스트를 먼저 쓰는 것이다. 비병합 fix 커밋 398개 중 86.4%가 테스트 파일을 함께 바꿨다. 웹 타입은 OpenAPI 스냅샷에서 생성하고, 앱 모델은 손으로 쓴다(D-009).",
      qa: "수용 기준마다 통과·실패를 판정하고, 실패는 재현 방법과 함께 담당 개발자에게 돌려보낸다.",
      review: "파이프라인에 들어가는 리뷰어는 3종이다. 보안은 돈·인증·개인정보를 건드릴 때, 코드는 항상, API 계약은 계약이나 클라이언트가 바뀔 때 부른다. blocker·major, 또는 보안 CRITICAL·HIGH 지적이 남으면 실패로 보고 개발로 돌려보낸다. 기록이 남은 9월 28일 이후 실행은 24회(코드 12, 보안 10, 계약 2)이고, 명세 충족 감사는 파이프라인 밖에 있고 실행은 0회다.",
      escalate: "같은 지적으로 리뷰와 수정이 두 번을 넘게 되풀이되면 더 돌지 않고 본인에게 올린다. 오케스트레이터 지시문의 규칙이고, 발동한 기록은 없다.",
      integrate: "PR 없이 로컬에서 병합한다(병합 커밋 275개). 병합 순서를 미리 맞추고, 충돌은 git merge-tree로 먼저 확인한다.",
      document: "README·런북·결정 기록을 갱신한다. 「앞선 결정을 뒤집는 행은 무엇을 뒤집는지 적는다」 같은 규칙도 README에 남는다.",
      ship: "push 승인, 운영 배포, 스토어 제출은 본인이 지시할 때 실행하는 것을 규칙으로 두었다. 스테이징의 삭제성 명령은 훅이 실행 전에 매번 확인을 요청한다.",
      deploy: "본인이 지시하면 에이전트 세션이 운영 서버에 반영한다. 배포는 수동(소스 묶음 전송 → 서버에서 다시 빌드)이다.",
    },
  },
  practices: [
    {
      title: "스토리 ID 추적",
      ev: "ewa#trace",
      at: ["intake"],
      body: "규칙은 「모든 기능은 명세의 스토리 ID로 이어지고, 브랜치·커밋·PR에 ID를 적는다」입니다. 비병합 커밋 1,855개 중 61.4%에 스토리 ID가, 70.8%에 스토리 ID나 결정 번호가 있습니다. PR은 쓰지 않았고, 브랜치 200개 중 이름에 스토리 ID가 있는 것은 15개입니다.",
    },
    {
      title: "결정 기록",
      ev: "ewa#decisions",
      at: ["architect", "decide"],
      body: "막히는 대신 추천 기본값으로 진행하고, 기록한 뒤 나중에 한 번에 검토합니다. 199행 중 192행에 되돌리기 난이도를 적었고, 데이터·계약이 고착되는 어려운 결정은 11건입니다. 그중 3건은 기록할 때 사람이 확정했고, 8건은 기본값으로 진행했습니다. 앞선 결정을 뒤집는 행은 무엇을 뒤집는지 적습니다.",
    },
    {
      title: "테스트 먼저",
      ev: "ewa#quality",
      at: ["develop"],
      body: "규칙은 「실패하는 테스트를 먼저 쓴다」입니다. 비병합 fix 커밋 398개 중 86.4%, feat 커밋 764개 중 87.7%가 테스트 파일을 함께 바꿨습니다. 기존 테스트를 고친 경우도 들어간 수치라, 회귀 테스트를 더했다는 뜻은 아닙니다.",
    },
    {
      title: "계약 우선",
      ev: "ewa#architecture",
      at: ["architect"],
      body: "레포 사이의 약속은 백엔드 OpenAPI 스냅샷 하나입니다. 웹은 이 스냅샷에서 타입을 생성하고, 앱은 모델을 손으로 씁니다(D-009, 코드 생성은 미룸). 계약이 바뀌면 API 계약 검사가 웹·앱과 백엔드가 어긋나는지 봅니다.",
    },
    {
      title: "병렬 세션",
      at: ["develop", "integrate"],
      body: "에이전트 세션 여러 개를 동시에 돌립니다. 세션마다 워크트리를 따로 쓰고 건드릴 파일·결정 번호·마이그레이션 이름을 먼저 알립니다. 결정 번호는 쓰는 순간 최댓값+1로 정합니다.",
    },
  ],
  gates: [
    {
      title: "보안 리뷰",
      at: ["review"],
      body: "출금·정산·지급·인증·권한·개인정보를 건드리는 변경을 적대적으로 검토하고, 코드는 고치지 않습니다. 기록이 남은 9월 28일 이후 10회 실행했습니다. 보안 리뷰·보안 수정을 언급한 수정 커밋은 30개(6월 14일~10월 29일)입니다.",
    },
    {
      title: "코드 리뷰",
      at: ["review"],
      body: "모든 변경의 정확성·레포 규칙·단순성·테스트 품질을 봅니다. 지적은 blocker·major·minor·nit로 나누고, APPROVE 또는 REQUEST-CHANGES로 판정합니다. 9월 28일 이후 12회 실행했습니다.",
    },
    {
      title: "API 계약 검사",
      at: ["review"],
      body: "계약이나 클라이언트가 바뀔 때 웹·앱이 백엔드 OpenAPI와 맞는지 봅니다. 9월 28일 이후 2회 실행했습니다.",
    },
    {
      title: "반려와 에스컬레이션",
      at: ["review", "escalate"],
      body: "blocker·major, 또는 보안 CRITICAL·HIGH 지적이 남으면 실패한 게이트로 보고 개발로 돌려보냅니다. 같은 지적으로 리뷰와 수정이 두 번을 넘게 되풀이되면 저에게 올리는 규칙도 있습니다. 둘 다 오케스트레이터 지시문의 규칙이고, 에스컬레이션이 실제로 일어난 기록은 없습니다.",
    },
    {
      title: "안전장치",
      at: ["ship", "deploy"],
      body: "권한 설정에서 force-push, reset --hard, rm -rf를 막고, 레포 4개 중 3개는 .env 읽기도 막습니다. 스테이징 서버로 가는 삭제성 명령은 훅이 실행 전에 매번 확인을 요청합니다.",
    },
  ],
  // M-12 (D-057 ①): the six 2026 projects in time order; each cell from docs/facts/_process.md §17 (:326-331, Task 13c),
  // labels from docs/reviews/2026-11-13-visuals-round2.md §1 where 13c kept them. Title and column heads: spec §1.
  harness: {
    title: "프로젝트마다 바뀐 방식",
    intro: "", // task 13b: left empty — any line puts the en #harness on two screens at 1440 (694 → 749) and three at 390; the lead names the table
    focus: "ewa",
    cols: { project: "프로젝트", roles: "에이전트 역할", enforced: "게이트를 강제한 것", gate: "마지막 관문", changed: "앞 행에서 바뀐 것" },
    rows: [
      { slug: "construction-pmis", roles: "11 · 리뷰어 1종", enforced: "지시문(테스트 먼저 · 커버리지 80% · 리뷰·QA 뒤 커밋)", gate: [{ who: "me", text: "PR 병합 106건" }], changed: "출발점: 7개 역할로 시작해 11개로" },
      { slug: "field-service-ops", roles: "11 · 리뷰어 1종(복사)", enforced: "CI(타입·테스트·빌드) · 통과 뒤 배포 · 삭제에 확인 문구", gate: [{ who: "me", text: "PR 병합 139건" }, { who: "me", text: "실사용 전 운영 초기화 실행" }], changed: "팀은 복사, PR마다 CI · 통과 뒤 배포를 더함" },
      { slug: "ewa", roles: "13 = 9 + 리뷰어 4종", enforced: "지시문 · 권한 차단 목록 · 삭제 명령 확인 훅", gate: [{ who: "me", text: "push·운영 배포·스토어 지시" }], changed: "리뷰어 1 → 4종 · 확인 훅 · 되돌리기 난이도" },
      { slug: "grid-constraint-analysis", roles: "분석가 1 · 검토 2단계", enforced: "첫 실패에서 정지 · 게이트 21종 · 발행 도장", gate: [{ who: "me", text: "가설 채택·되돌림" }], changed: "규칙을 코드 검사로 · 역할 팀 대신 분석가 1" },
      { slug: "screenplay-translation", roles: "11 · 지휘는 스킬", enforced: "지시문 · 도구 종료 코드 · 관문을 망가뜨린 사본으로 시험", gate: [{ who: "me", text: "방향 결정 3건" }, { who: "client", text: "작품별 확인 대기 항목" }], changed: "역할 11 팀으로 · 관문이 스스로를 시험" },
      { slug: "reputation-market", roles: "13, EWA와 같은 이름", enforced: "지시문 · 권한 차단(EWA와 같음) · 민감 영역 1건씩", gate: [{ who: "me", text: "묶음마다 확인 · 요청 시 커밋" }, { who: "client", text: "기획 질문에 답" }], changed: "권한 차단 목록 다시 · 묶음 단위 진행" },
    ],
  },
};
