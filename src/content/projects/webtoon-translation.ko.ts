import type { Brief } from "../types";

// Anonymized: no title, artwork, studio, affiliate, repo, font or translation-site names; no quote amount.
// Ruling (Q-035): only the 2026 storyboard translator. The 2024 PSD generator and the 2023 template repos are left out.
// Every sentence and number comes from docs/facts/webtoon-translation.md; the figure is 7.1 in docs/reviews/2026-11-11-visuals-wave2.md.
// Not claimed: production use (facts line 69), test counts (not run), "about 3x faster" (no basis), the plan-vs-actual speed-up.
// The facts say no decision card (one recorded pair only), so the judgement lives in `built`, the flow caption and `results`.
export const webtoonTranslationKo: Brief = {
  kind: "brief",
  slug: "webtoon-translation",
  title: "웹툰 스토리보드 번역기",
  tagline: "원고 JPG를 올리면 말풍선 글자를 OCR로 찾아 번역하고, 번역문을 겹쳐 쓴 PDF와 원문·번역문 대응표를 언어별로 내려받는 작업 큐 앱을 만들었습니다.",
  year: 2026,
  domain: "웹툰 번역 업무 도구",
  tags: ["media", "ai-agents"],
  stack: ["Next.js 14", "TypeScript", "Prisma · PostgreSQL", "JWT (jose)", "OpenAI · Gemini", "pdf-lib · exceljs", "Vitest · Playwright"],
  facts: {
    period: "2026.04",
    role: "사람은 본인 1명 · AI 에이전트 팀 설계·운영",
    team: "본인 1명 (커밋 18개 전부 본인 저자, 전부 AI 공저)",
    platforms: "웹 앱 (작업 큐 · 내부 도구)",
    context: "웹툰 스토리보드 번역 운영 업무를 돕는 고객사의 내부 도구",
  },
  metrics: [
    { value: "5종", label: "대상 언어 (원본은 한국어·일본어)" },
    { value: "63블록", label: "샘플 1건에서 인식한 말풍선 블록" },
    { value: "5단계", label: "작업 상태 (대기→완료)" },
  ],
  leads: {
    results: "로컬에서 샘플 한 건이 업로드부터 PDF·XLSX 산출까지 이어졌고, 운영에 투입했다는 기록은 없습니다.",
  },
  problem: [
    "번역 운영팀은 의뢰처가 JPG 묶음으로 보낸 원고를 사람이 PDF로 합치고, GPT와 구글 번역으로 말풍선 글자를 번역해 PDF 위에 겹쳐 쓰고 있었습니다. 이 과정에서 사람의 판단이 꼭 필요한 단계는 말풍선 안 글자 영역을 찾는 일뿐이어서, 그 단계를 비전 모델에 맡길 수 있다고 봤습니다.",
    "위험도 계획서에 적혀 있었습니다. OCR이 찾은 글자 위치가 틀릴 수 있다는 점입니다. 그래서 OCR이 틀렸을 때 사람이 무엇으로 확인하고 고칠지가 설계의 핵심이었습니다.",
  ],
  visuals: [
    {
      kind: "flow",
      at: "visuals",
      title: "번역 작업 하나가 지나가는 길",
      caption: "사람은 원고를 올리고 결과를 내려받기만 하고, OCR이 틀릴 때를 대비해 겹쳐 쓴 PDF에 원문·번역문 대응표를 함께 준다.",
      steps: [
        { id: "create", label: "작업 생성", sub: "원고 JPG 여러 장, 대상 언어 5종 중 여럿, OCR 제공자 선택", actor: "human" },
        { id: "queue", label: "대기열", sub: "앱 안 워커가 행 잠금(SKIP LOCKED)으로 작업을 집는다", actor: "system" },
        { id: "pdf", label: "PDF 만들기", sub: "JPG 묶음을 PDF 하나로", actor: "system" },
        { id: "ocr", label: "OCR·번역", sub: "페이지를 조각 내 비전 모델에 병렬로 보낸다. 5xx는 재시도하고, 말풍선 위치에 8% 여백을 둔다", actor: "external" },
        { id: "compose", label: "합성", sub: "말풍선 위치에 번역문을 겹쳐 쓴 PDF와 블록·원문·번역문 대응표 XLSX. 다시 돌리면 덮어쓴다", actor: "system" },
        { id: "download", label: "내려받기", sub: "언어별 PDF·XLSX. 진행은 2초마다 확인한다", actor: "human" },
      ],
    },
    {
      kind: "timeline",
      at: "results",
      title: "착수에서 업로드·합성 연결까지",
      caption: "첫 커밋 이틀째에 업로드부터 합성까지 커밋이 이어졌고, 운영 투입 기록은 없다.",
      items: [
        { date: "2026-04-22", label: "번역기 착수", note: "계획서·명세·인증" },
        { date: "2026-04-23", label: "업로드 → 합성 연결", note: "작업 생성·업로드, PDF 단계, OCR(Gemini), 합성 커밋. 로컬 샘플 1건: 13조각·63블록·40~90초" },
        { date: "2026-04-24", label: "작업일지 마지막 항목", note: "E2E·배포·관측 단계는 일지에만 있고, 커밋은 합성 단계까지다" },
      ],
    },
  ],
  built: [
    "작업 큐 앱을 만들었습니다. 로그인(JWT) 뒤 JPG 여러 장과 대상 언어 5종 중 여러 개, OCR 제공자를 골라 작업을 만들고, 2초마다 진행을 확인해 언어별 PDF와 XLSX를 내려받습니다.",
    "작업 상태를 대기, PDF 만들기, OCR·번역, 합성, 완료 5단계로 나눴습니다. 앱 안의 워커가 DB 행 잠금(SKIP LOCKED)으로 작업을 집어 가므로 별도 큐 서버가 없습니다.",
    "OCR·번역 어댑터를 제공자 교체형으로 만들었습니다. GPT-4o 비전과 Gemini를 고를 수 있고, 한 페이지를 조각 내 병렬로 호출하며, 5xx는 재시도합니다. 글자 위치는 box_2d 좌표에 8% 여백을 더해 잡습니다.",
    "OCR이 틀릴 때를 대비해 수정 화면 대신 대응표를 안전망으로 골랐습니다. 합성 단계는 말풍선 위치에 번역문을 겹쳐 쓴 PDF와 블록 ID·원문·번역문 대응표 XLSX를 함께 내고, 다시 돌리면 덮어씁니다. 위치를 손으로 고치는 화면은 v1 범위 밖에 두고 위험표에 「OCR 위치 정확도 → XLSX를 안전망으로, 수정 화면은 v2」라고 적었습니다.",
  ],
  results: [
    "로컬에서 스토리보드 샘플 한 건이 업로드부터 PDF·XLSX 산출까지 이어졌습니다. 작업일지에 적힌 스모크 실행은 13조각, 63블록, 40~90초였고, 개발자 로컬의 한 건입니다.",
    "2026-04-22에 착수해 이튿날 작업 생성·업로드, PDF 단계, OCR, 합성까지 커밋했습니다. 커밋 18개 전부에 AI 공저 표기가 있습니다.",
    "운영에 투입했다는 기록은 없습니다.",
  ],
  note: "개발자 로컬에서 샘플 한 건으로 확인한 범위만 적었습니다. 운영 투입 기록과 테스트 통과 수치는 적지 않았습니다.",
  code: [],
  gallery: [],
};
