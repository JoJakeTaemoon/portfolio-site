import type { Brief } from "../types";

// Anonymized (D-017): no country, no industry beyond "서비스", no client, DB, table or column names, no schema fields.
// The exclusion in D-042 was reversed by Jake in D-049 (B1). Every sentence comes from docs/facts/recsys-data-prep.md.
// Weak facts, stated plainly: no interaction query, no CSV-writing code, no upload record.
export const recsysDataPrepKo: Brief = {
  kind: "brief",
  slug: "recsys-data-prep",
  title: "추천 서비스용 학습 데이터셋 설계",
  tagline: "추천 서비스에 올릴 데이터셋 세 가지의 스키마와 정리·추출 SQL을 3일 동안 설계했습니다.",
  year: 2021,
  domain: "추천 데이터 준비",
  tags: ["commerce"],
  stack: ["SQL", "Node.js", "MySQL client"],
  facts: {
    period: "2021.01 (3일)",
    role: "단독 개발 (설계·SQL)",
    team: "본인 1명 (본인 커밋 8개)",
    platforms: "SQL과 Node.js 스크립트, 설계 문서",
    context: "운영 중인 서비스의 DB에서 추천 서비스용 학습 데이터셋을 만드는 작업",
  },
  metrics: [],
  leads: {
    results: "스키마 3개와 사용자·상품 추출 쿼리까지 썼고, 상호작용 쿼리와 CSV 생성은 만들지 않았습니다.",
  },
  problem: [
    "추천 서비스에 올릴 학습용 데이터가 필요했습니다. 추천 서비스는 상호작용, 사용자, 상품의 세 데이터셋을 CSV로 받았고, 운영 중인 서비스의 회원·주문·상품 표에서 이를 만들어야 했습니다.",
    "원본에는 값이 비어 있거나 정해진 범주 밖인 경우가 있어 먼저 정리해야 했습니다. 원본 표를 로컬 DB로 옮겨 작업하는 절차도 필요했습니다.",
  ],
  visuals: [
    {
      kind: "flow",
      at: "visuals",
      title: "데이터가 추천 서비스에 닿기까지",
      caption: "운영 DB의 표 7개를 로컬로 옮겨 정리하고 추출하는 데까지 썼고, CSV 생성과 업로드는 코드가 없다.",
      steps: [
        { id: "source", label: "운영 DB 표 7개", sub: "회원·주문·상품 원본", actor: "external" },
        { id: "load", label: "내보내기 · 로컬 적재", sub: "원본 표를 로컬 DB로 옮겨 작업하는 절차", actor: "human" },
        { id: "clean", label: "정리 SQL", sub: "빈 값과 범주 밖 값을 null로 바꾼다. 2개", actor: "system" },
        { id: "extract", label: "추출 SQL", sub: "사용자·상품 2개를 썼고, 상호작용은 TODO", actor: "system" },
        { id: "csv", label: "CSV 3개", sub: "생성 코드 없음", actor: "system" },
        { id: "upload", label: "추천 서비스 업로드", sub: "기록 없음", actor: "external" },
      ],
    },
    {
      kind: "timeline",
      at: "results",
      title: "3일 동안의 설계 작업",
      caption: "첫날 설계 문서와 스키마를 쓰고, 둘째 날 ORM을 걷어 냈으며, 셋째 날 스키마를 바로잡아 3일 만에 마쳤다.",
      items: [
        { date: "2021-01-29", label: "시작", note: "설계 문서와 스키마" },
        { date: "2021-01-30", label: "ORM 걷어 냄", note: "DB 클라이언트와 SQL만 남김" },
        { date: "2021-01-31", label: "스키마 정정", note: "문서 링크 정리" },
      ],
      spans: [{ from: "2021-01-29", to: "2021-01-31", label: "시작 → 마지막 커밋" }],
    },
  ],
  built: [
    "데이터셋 스키마 3개를 설계했습니다. 상호작용, 사용자, 상품이며 범주형 항목을 표시했습니다.",
    "빈 값과 범주 밖 값을 null로 바꾸는 정리 SQL 2개를 썼습니다.",
    "사용자용과 상품용 추출 SQL 2개를 썼습니다. 상호작용 쿼리는 TODO로 남았습니다.",
    "원본 표를 로컬 DB로 옮겨 작업하는 절차를 문서로 정리했습니다.",
    "처음에는 ORM과 테스트 도구로 시작했다가, 단순하게 가려고 SQL과 DB 클라이언트만 남기고 걷어 냈습니다.",
  ],
  results: [
    "데이터셋 스키마 3개와 사용자·상품 추출 쿼리까지 3일 동안 썼습니다.",
    "상호작용 쿼리는 작성하지 못했습니다. 실행 코드는 DB 연결을 확인하는 한 줄뿐이고, 실제 CSV를 만들었거나 추천 서비스에 올렸다는 기록은 없습니다.",
  ],
  note: "설계 문서와 골격까지의 짧은 작업입니다. 결과로 내세울 수치는 없어 적지 않았습니다.",
  code: [],
  gallery: [],
};
