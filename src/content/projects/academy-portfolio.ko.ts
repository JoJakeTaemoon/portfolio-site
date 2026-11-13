import type { Brief } from "../types";

// Anonymized (D-017): country and "교육기관" at most; no academy name, place, teacher title or student data.
// Minors' data: no student names, codes, writing or real screenshots. Nothing about the system's internals (D-049 B5).
// Not called 고객/납품: whether this was paid work is not in the repo (facts, public-risk memo). Every sentence comes from docs/facts/academy-portfolio.md.
export const academyPortfolioKo: Brief = {
  kind: "brief",
  slug: "academy-portfolio",
  title: "학생 독서·글쓰기 기록 포트폴리오 웹앱",
  tagline: "받은 단일 파일 앱을 하루 만에 배포 가능한 Vite 프로젝트로 옮기고, 교사용 학생 등록 화면과 로그아웃을 더했습니다.",
  year: 2026,
  domain: "교육 · 학생 학습 기록",
  tags: ["education"],
  stack: ["React 18", "Vite 5", "Google Apps Script", "Google Sheets", "Vercel"],
  facts: {
    period: "2026.05 (하루)",
    role: "개발 1명 · AI 공동 작성",
    team: "본인 1명 (커밋 14개 전부에 AI 공동 작성 표시)",
    platforms: "웹앱 (학생 화면 + 교사용 등록 화면)",
    context: "해외 교육기관의 교사가 학생의 독서·글쓰기 기록을 쌓아 포트폴리오로 쓰려던 웹앱",
  },
  metrics: [
    { value: "1일", label: "받은 앱 → 배포 가능한 프로젝트" },
    { value: "약 7시간", label: "첫 커밋 → 교사 등록 화면" },
  ],
  leads: {
    results: "받은 앱을 하루 안에 배포 가능한 프로젝트로 옮기고 교사용 등록 화면과 로그아웃을 더했습니다.",
  },
  problem: [
    "교사는 학생의 독서 기록과 글쓰기 결과물을 쌓아 포트폴리오 자산으로 쓰려 했습니다. 설계 원칙은 네 가지였습니다. 개인 자산 중심으로 하고, 학생 간 비교·공개 공유·랭킹은 두지 않으며, 모바일·태블릿·노트북에서 같은 경험을 주고, AI는 교사 업무를 보조할 뿐 학생의 문장을 대신 쓰지 않는다는 것입니다.",
    "제가 받은 앱은 동작했지만 배포용 구성이 없었습니다. 학생 등록도 교사가 구글 스크립트 편집기에서 함수를 직접 실행해야 했습니다.",
  ],
  visuals: [
    {
      kind: "architecture",
      at: "visuals",
      title: "앱 구성",
      caption: "브라우저의 React 앱이 받은 구글 스크립트 웹앱을 부르고, 데이터는 구글 시트 3장에 쌓이며, 이번에 바꾼 것은 앱 쪽이다.",
      cols: 3,
      rows: 4,
      nodes: [
        { id: "student", label: "학생 화면", sub: "홈 → 목록 → 작성 → 상세", col: 0, row: 0, group: "client" },
        { id: "teacher", label: "교사 등록 화면", sub: "이름·학년으로 학생 등록", col: 2, row: 0, group: "client" },
        { id: "app", label: "React 앱", sub: "Vite 5 · Vercel 자동 배포 구성", col: 1, row: 1, group: "core" },
        { id: "script", label: "구글 스크립트 웹앱", sub: "받은 그대로 · 액션 7개", col: 1, row: 2, group: "external" },
        { id: "sheets", label: "구글 시트 3장", sub: "학생 · 독서 · 글쓰기", col: 1, row: 3, group: "data" },
      ],
      edges: [
        { from: "student", to: "app" },
        { from: "teacher", to: "app" },
        { from: "app", to: "script", label: "액션 호출" },
        { from: "script", to: "sheets" },
      ],
      notes: {
        student: "화면 6개다. 홈에서 읽은 책과 쓴 글 통계와 최근 기록을 보고, 독서와 글쓰기 목록, 작성·수정 폼, 상세로 이어진다. 학년으로 기초·중급·심화를 자동으로 나누고 단계마다 양식이 다르다.",
        teacher: "이번에 더한 화면이다. 이름과 학년으로 학생을 등록하고 연속으로 등록할 수 있다.",
        app: "받은 397줄짜리 단일 파일 앱을 Vite 프로젝트로 옮겼다. 런타임 의존성은 react와 react-dom 둘이다. 새 서버나 DB는 만들지 않았다.",
        script: "받은 구글 스크립트를 바꾸지 않고 썼다. 액션 7개가 조회·생성·저장·삭제를 맡는다.",
        sheets: "학생, 독서, 글쓰기 시트 3장이 데이터를 담는다.",
      },
    },
    {
      kind: "timeline",
      at: "results",
      title: "하루 동안의 작업",
      caption: "2026년 5월 12일 하루에 앱을 배포 가능한 프로젝트로 옮기고, 약 7시간 뒤 교사용 등록 화면과 로그아웃을 올렸다.",
      stats: [{ value: "약 7시간", label: "첫 커밋 → 교사 등록 화면" }],
      items: [
        { date: "2026-05-12", label: "Vite 프로젝트 구성, 앱 이식", note: "12:11" },
        { date: "2026-05-12", label: "로딩 대화상자, 시각 표기", note: "12:30" },
        { date: "2026-05-12", label: "브라우저 기본 팝업 교체", note: "12:36" },
        { date: "2026-05-12", label: "개선 후보 문서", note: "13:31 · AI 자동화 단계 설계" },
        { date: "2026-05-12", label: "로그아웃, 교사용 학생 등록 화면", note: "19:07" },
      ],
    },
  ],
  built: [
    "받은 단일 파일 앱을 Vite 프로젝트로 정리해 배포 가능한 구성으로 옮겼고, Vercel 자동 배포 구성을 맞췄습니다.",
    "로딩 대화상자와 시각 표기를 개선했고, 브라우저 기본 확인·알림 창을 앱의 확인창 4곳으로 바꿨습니다.",
    "교사용 학생 등록 화면을 더했습니다. 이름과 학년으로 학생을 등록하고 연속으로 등록할 수 있습니다.",
    "로그아웃을 더했습니다. 교사가 확인 팝업 없이 한 번에 로그아웃되게 해 달라고 요청했습니다.",
    "개선 후보 문서와 작업 일지를 썼습니다. 개선 후보에는 우선순위와 공수를 적고 공수에 3배 완충을 두었습니다.",
  ],
  decision: {
    title: "새 서버와 DB 없이, 받은 구글 시트와 스크립트를 그대로 쓰고 프런트만 배포한다",
    problem: "받은 앱의 백엔드는 이미 운영 중인 구글 시트와 구글 스크립트였습니다. 배포하려면 이를 두고 갈지 새로 만들지 정해야 했습니다.",
    decision: "새 서버와 DB를 만들지 않고 받은 시트와 스크립트를 그대로 쓰며 프런트만 배포하기로 했습니다. 이미 운영 중인 시트가 있고, 환경변수 같은 추가 설정 없이 배포할 수 있다는 것이 작업 일지에 적은 이유입니다. 비교한 다른 선택지는 기록에 없습니다. 기능을 더할 때는 설계 원칙(비교·랭킹 없음, AI는 학생 문장을 대신 쓰지 않음)을 판단 기준으로 설계서와 개선 후보 문서에 못 박았습니다.",
    result: "구글 스크립트는 첫 커밋 뒤 한 번도 바뀌지 않았고, 앱 코드는 397줄에서 815줄이 됐습니다.",
  },
  results: [
    "받은 단일 파일 앱을 하루 안에 배포 가능한 Vite 프로젝트로 옮기고, 교사용 학생 등록 화면과 로그아웃을 더해 저장소에 올렸습니다.",
    "백엔드는 받은 구글 스크립트를 그대로 썼습니다.",
    "테스트 파일과 러너, CI는 없습니다. 사용자 수와 운영 기록은 저장소에 없어 적지 않았습니다.",
  ],
  note: "학생 이름·글·코드와 화면 캡처는 싣지 않았습니다. 배포 구성까지 했고, 실제 배포 주소와 가동 기록은 저장소에 없습니다.",
  code: [],
  gallery: [],
};
