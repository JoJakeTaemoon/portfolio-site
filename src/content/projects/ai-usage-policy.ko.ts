import type { Brief } from "../types";

// Anonymized: no company, headcount, market, trading, in-house system, vendor, tool, plan, price or person names; no seat counts.
// Every sentence and number comes from docs/facts/ai-usage-policy.md; figure from docs/reviews/2026-11-12-visuals-grid-case.md section 2.
// G-M1: the policy was written, then downgraded to a hypothesis the next day; nothing says sent, submitted or approved.
// G-M2: no identifying combination (no market, no trading, no size, no two-language guide). G-M3: no statement about the client's current state.
export const aiUsagePolicyKo: Brief = {
  kind: "brief",
  slug: "ai-usage-policy",
  title: "외부 AI 사용 통제 정책 제안",
  tagline: "외부 AI는 회사 소유 채널로 쓰고 최상위 금지 등급만 분류하는 통제 정책을 승인 요청서로 썼고, 90일 목표인 회사 관리 AI 채널 3개 이상은 달성했습니다(본인 진술). 진단 전에는 정책 본문을 쓰지 않는다는 규칙에 따라 본문은 진단 전 가설로 두었습니다.",
  year: 2026,
  domain: "AI 활용 정책",
  tags: ["ai-agents"],
  stack: ["Markdown", "Static HTML", "CSV", "Shell"],
  facts: {
    period: "2026.07 – 2026.08",
    role: "사람은 본인 1명 · AI 에이전트 팀 설계·운영",
    team: "본인 1명 (정책 저장소 커밋 저자는 본인뿐)",
    platforms: "정책 문서 묶음 · 자산 태깅 보드",
    context: "외부 AI를 회사 차원에서 쓰려던 고객사의 정책 제안 작업",
  },
  metrics: [],
  leads: {
    results: "요청서의 90일 목표인 회사 관리 AI 채널 3개 이상은 달성했고(본인 진술), 정책 본문은 진단 전 가설로 두었습니다.",
  },
  problem: [
    "고객사에는 외부 AI를 회사 차원에서 쓰는 채널과 기준이 필요했습니다. 무엇을 외부 AI에 넣어도 되는지부터 정해야 했고, 저는 이를 출발점으로 승인 요청서를 썼습니다.",
    "정책 본문은 쓴 뒤 곧 가설로 내렸습니다. 차터는 「진단 데이터가 도착하기 전에 정책 본문을 쓰지 않는다」를 순서 규칙으로 두었습니다. 재수립은 3단계 모델, 에이전트 팀 5종, 진단 도구, 규제·계약 사실확정 트래커 6건으로 이루어졌습니다.",
  ],
  visuals: [
    // M-19: the documents in their file-number order (00 → 02·03 → 04), then the downgrade and what followed; no time
    // claim for the numbered ones (spec §6; docs/facts/ai-usage-policy.md:39-43, :20, :27, :76, :79)
    {
      kind: "flow",
      title: "정책 문서가 이어진 순서",
      caption: "정책 문서는 근거 → 통제 → 승인 요청 순으로 번호를 매겨 썼다. 다음 날 가설로 내린 뒤에는 도입 비교·실행 문서가 이어졌다.",
      steps: [
        { id: "evidence", label: "전략 비교 · 규제 검증", sub: "전략 6종(A~F) · 규제·계약 4종 · 검증된 발견 12건" },
        { id: "controls", label: "데이터 통제 정책 · 보안 접근법", sub: "위협 모델 6 · 통제 4계층 · 90일 로드맵" },
        { id: "approval", label: "승인 요청서", sub: "1장 · 리스크 → 제안 → 결정 3가지" },
        { id: "hypothesis", label: "가설로 내림", sub: "7월 23일 · 진단 전에는 정책 본문을 쓰지 않는다" },
        { id: "rollout", label: "도입 비교 · 실행 문서", sub: "시나리오 2개 비교 · 실행 순서 11단계(8월 5~6일)" },
      ],
    },
    {
      kind: "timeline",
      at: "results",
      title: "초안에서 실행 순서표까지 15일", // re-check recommended 9 (M-14 order): ai-usage-policy.md:8, :80
      caption: "정책은 쓴 다음 날 가설로 내려갔고, 진단 데이터가 오기 전에는 정책 본문을 쓰지 않는 순서가 되어 도입 비교와 실행 순서표만 이어졌다.",
      items: [
        { date: "2026-07-22", label: "정책 초안", note: "정책·자산 태깅·보안 접근법" },
        { date: "2026-07-23", label: "가설로 강등, 계획 재수립", note: "초안 5종을 가설로 내리고 차터·에이전트 팀 5종·규제 사실확정 트래커를 세움" },
        { date: "2026-07-27", label: "주간 브리프 1호" },
        { date: "2026-07-29", label: "계정 전환 안내" },
        { date: "2026-08-06", label: "도입 비교와 실행 순서표", note: "두 시나리오를 비교해 하이브리드를 확정하고 실행 순서 11단계를 씀(파일 날짜 8월 5~6일)" },
      ],
      spans: [{ from: "2026-07-22", to: "2026-08-06", label: "정책 초안 → 도입 실행 문서" }],
    },
  ],
  built: [
    "승인 요청서를 썼습니다. 1장에 리스크 → 제안 → 결정 3가지를 담았고, 7월 23일에 가설로 내렸습니다.",
    "데이터 통제 정책과 보안 접근법을 썼습니다. 위협 모델 6개, 통제 4계층, 90일 로드맵입니다.",
    "전략 비교와 규제 검증을 썼습니다. 전략 유형 6종(A~F)을 비교하고 규제·계약 4종을 검토해 검증된 발견 12건을 정리했습니다.",
    "자산 태깅 보드를 만들었습니다. 자산 인벤토리 36개를 등급별로 3초 안에 조회하는 정적 HTML 보드, CSV, 스키마와 「최상위 금지 등급이면 금지」 불변식을 검사하는 셸 스크립트입니다.",
    "도입 비교·실행 문서를 썼습니다. 두 시나리오를 14장과 부록 5장으로 비교하고, 확정안(하이브리드)의 실행 순서 11단계와 신청 폼·공지문·계정 전환 안내·영수증 포워딩 규칙·트래커를 붙였습니다.",
  ],
  decision: {
    title: "채널은 회사가 갖고, 분류는 최상위 금지 등급에만 적용한다",
    problem: "외부 AI 사용을 어떻게 통제할지가 문제였습니다. 모든 자산을 분류해 통제하는 방식은 유지 부담 때문에 무너진 실패 사례가 문서로 남아 있습니다.",
    options: [
      "A 분류 우선 (부분 채택)",
      "B 채널 통제 (척추로 채택)",
      "C 로컬·전용 배포 (탈락)",
      "D 탈식별 프록시 (탈락)",
      "E 용도 허용목록 (부분 채택)",
      "F 하이브리드 (최종 채택)",
    ],
    chosen: 5,
    decision: "전략 유형 6종을 비교해 하이브리드를 골랐습니다. 외부 AI 채널은 회사가 소유하고 자산 분류는 최상위 금지 등급(P3)에만 적용하는 안입니다. 데이터 유출 방지 도구, 미승인 AI 사용 탐지, 인증, 거버넌스 위원회, 탈식별 프록시는 의도적으로 제안에서 뺐고, 승인 요청서의 「이 제안이 하지 않는 것」에 재검토 조건과 함께 적었습니다.",
    result: "7월 23일에 정책 본문 5종을 가설로 낮췄고, 차터에는 「진단 데이터가 오기 전에는 정책 본문을 쓰지 않는다」는 규칙을 두었습니다. 승인 요청서의 90일 목표는 회사가 관리하는 AI 채널을 3개 이상 두는 것이었고, 이 목표를 달성했습니다.",
    cost: "제안대로라면 탐지 도구가 없으므로 통제는 채널 제공과 최상위 등급 금지에 기댑니다. 진단 데이터로 검증하기 전의 가설이기도 합니다.",
  },
  results: [
    "승인 요청서에 적은 90일 목표, 회사가 관리하는 AI 채널 3개 이상은 달성했습니다(본인 진술). 정책 본문은 쓴 다음 날 진단 전 가설로 내렸고, 진단 데이터가 오기 전에는 정책 본문을 쓰지 않는다는 순서 규칙을 두었습니다.",
    "정책 초안(7월 22일)부터 도입 실행 문서(8월 6일)까지 15일 동안 승인 요청서, 통제 정책, 전략 비교, 자산 태깅 보드, 도입 비교·실행 문서를 썼습니다.",
  ],
  note: "정책 문서는 가설로 낮춘 제안입니다. 90일 목표 달성은 본인 진술이고 날짜·채널 구성의 기록이 없어 결과 지표는 적지 않았습니다.",
  code: [],
  gallery: [],
};
