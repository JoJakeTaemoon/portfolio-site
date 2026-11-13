
// The common template. Every project fills the same shape, so projects combine
// on one site and a missing section fails the build.

export type Paragraphs = string[];

export type DiagramNode = {
  id: string;
  label: string;
  sub?: string; // second line, e.g. the stack
  col: number; // grid position, 0-based
  row: number;
  group?: "client" | "core" | "data" | "external" | "process" | "human" | "me"; // human = a person in general (the client on /process), me = Jake
  idle?: boolean; // a rule with no record of firing: drawn dotted (task 13a, M-02)
};
export type DiagramEdge = { from: string; to: string; label?: string };
export type Diagram = {
  cols: number;
  rows: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  notes: Record<string, string>; // node id → explanation (all rendered in HTML)
};

/** Who set a decision (D-057 ②): only with a facts-file record, never an estimate; absent = no chip. */
export type SetBy = "agent-default" | "revised" | "own-input" | "own-confirmed" | "client";

export type Decision = {
  setBy?: SetBy;
  id?: string; // e.g. "D-142" — internal register id, optional
  title: string;
  problem: string;
  options?: string[]; // recorded alternatives only (D-031); the row is hidden below 2
  chosen?: number; // index into options: the one that was picked
  decision: string;
  result: string;
  cost?: string; // 대가·남은 위험 / cost & remaining risk
};

export type TraceStep = { step: string; evidence: string };

export type Metric = { value: string; label: string };

export type Frame = "laptop" | "phone";
export type Shot = { src: string; caption: string; frame?: Frame }; // frame: CSS device frame around the image (DeviceFrame); none = plain image

export type Tag = "fintech" | "commerce" | "operations" | "marketplace" | "construction" | "energy"
  | "media" | "education" | "legal" | "manufacturing" | "blockchain" | "logistics"
  | "mobile" | "payments" | "ai-agents";

export type KeyFacts = { period: string; role: string; team: string; platforms: string; context: string };

export type CodeShot = { src: string; path: string; caption: string; alt: string }; // path renders as <code>, caption without it

// Visuals. src/lib/validate.ts checks what the types can't (dates, sources, captions, ko/en match).
export type ArchitectureVisual = Diagram & { kind: "architecture"; title: string; caption: string };
export type FlowStep = { id: string; label: string; sub?: string; actor?: "human" | "agent" | "system" | "external" };
export type FlowVisual = { kind: "flow"; title: string; caption: string; steps: FlowStep[]; loops?: { from: string; to: string; label: string }[] };
export type TimelineSpan = { from: string; to: string; label: string };
export type TimelineStat = { value: string; label: string };
export type TimelineVisual = { kind: "timeline"; title: string; caption: string; items: { date: string; label: string; note?: string }[]; spans?: TimelineSpan[]; stats?: TimelineStat[] /* 1–3 summary chips above the figure; numbers already in title/caption */ }; // date: YYYY-MM or YYYY-MM-DD, ascending
export type BarsVisual = { kind: "bars"; title: string; caption: string; unit: string; source: string; bars: { label: string; value: number; value2?: number }[]; max?: number; series?: [string, string] }; // max: scale top (e.g. 100 for %); default = largest bar. series: two bars per row (value, value2), and only then may values be negative
export type RolesVisual = { kind: "roles"; title: string; caption: string; lanes: { who: "human" | "agent" | "gate"; label: string; stats?: Metric[] /* 1-2 big numbers at the lane's head (R-06) */; items: string[] }[] };
// Case studies place each visual in the section it supports (D-030). Without `at` the kind decides
// (src/lib/template.ts). `after` = a decision id: the visual sits after that decision card.
export type Visual = (ArchitectureVisual | FlowVisual | TimelineVisual | BarsVisual | RolesVisual) & { at?: SectionId; after?: string };

type ProjectBase = {
  slug: string;
  title: string;
  tagline: string;
  year: number;
  domain: string;
  tags: Tag[];
  stack: string[];
  facts: KeyFacts;
  code: CodeShot[];
  gallery: Shot[];
  video?: { src: string; poster?: string; caption: string; frame?: Shot["frame"] }; // frame: phone for portrait app clips
  cover?: { src: string; alt: string; frame?: Frame }; // real screenshot for cards and page top; absent = generated cover (src/lib/cover.ts)
  leads?: Partial<Record<SectionId, string>>; // one claim sentence at the top of a section
};

/** Full case study: needs architecture, flow and timeline visuals (checked by the validator). */
export type CaseStudy = ProjectBase & {
  kind: "case";
  metrics: [Metric, Metric, Metric, Metric] | [Metric, Metric, Metric, Metric, Metric]; // 5th: D-046 turnaround
  visuals: [Visual, Visual, Visual, ...Visual[]];
  problem: Paragraphs;
  myRole: Paragraphs;
  decisions: Decision[];
  quality: Paragraphs;
  trace: { intro: string; steps: TraceStep[] };
  results: string[];
  retro: Paragraphs;
};

/** Short project page (D-032): problem <= 2 paragraphs, built <= 5 (checked by the validator). */
export type Brief = ProjectBase & {
  kind: "brief";
  metrics: Metric[];
  visuals: [Visual, ...Visual[]];
  problem: Paragraphs;
  built: string[];
  decision?: Decision; // one key judgement, only when the facts record it
  results: string[];
  note?: string;
};

export type Project = CaseStudy | Brief;

export type SectionId = "problem" | "visuals" | "built" | "role" | "architecture" | "decisions" | "quality" | "trace" | "code" | "results" | "retro" | "gallery" | "process";

/** The "who" chips (spec §0): Jake or the client. */
export type Who = "me" | "client";
/** One project's row in the /process harness table (M-12): only what was there, no "none" cells. */
export type HarnessRow = {
  slug: string; // a case; the row head is its period and domain, linked
  roles: string;
  enforced: string; // what enforced the gates
  gate: { who: Who; text: string }[]; // 1-2: the last gate a person held
  changed: string; // what changed from the row above (the first row: the starting point)
};

export type ProcessPage = {
  title: string;
  lead: string;
  pipelineTitle: string;
  pipeline: Diagram & { intro: string };
  mapBand: string; // the hero map's one agent band between the people (re-check ①)
  // at: the pipeline nodes a practice or gate works on (node ids); the card draws the pipeline with them lit.
  // ev: where a principle's evidence is shown, "<case slug>#<section id>" (R-05)
  practices: { title: string; body: string; at: string[]; ev?: string }[];
  gates: { title: string; body: string; at: string[] }[];
  harness: {
    title: string;
    intro: string; // copy (task 13b); empty renders nothing
    focus?: string; // the row this page is about (ewa)
    cols: { project: string; roles: string; enforced: string; gate: string; changed: string };
    rows: HarnessRow[];
  };
};

export type Experience = {
  role: string;
  org: string;
  place: string;
  period: string;
  focus?: string;
  points: string[];
  concurrent?: string; // shows the 병행/concurrent badge; the text (may be "") follows it
  early?: boolean; // folded into one "early career" group on the hub, one line in the PDF
};

export type HubSectionId = "featured" | "about" | "lead" | "work";

/** Hub page copy. Every line is a shortened or regrouped form of existing site text (intro, leads, metrics, ui). */
export type HubCopy = {
  title: string; // <title>: "Name: what it is"
  description: string; // meta description, one sentence, not the title's words
  lead: string; // how it works and the main benefit, with the hard fact
  email: string; // the main action, word for word in the nav, the hero and the close
  menu: string; // the phone menu button and the nav's label
  pdf: string; // the second action: download the career-summary PDF (short enough to sit beside the main button)
  floatFact: string; // hero float card: one fact
  work: string; // h2 of the featured projects
  roles: string; // h2 of the roles-and-gates section
  rolesLine: string; // the line under it
  rolesStrong: string; // the one word of leads.lead the statement moment turns to the accent
  career: string; // h2 of the career section
  careerLine: string;
  more: string; // h2 of the other six projects (all twelve are on the hub: six featured, six here)
  close: string; // h2 of the close
  footPage: string; // footer column heads
  footDocs: string;
  otherLang: string; // link to the other language's hub
};

export type Site = {
  name: string;
  headline: string; // the one headline: hub h1, footer, summary PDF, README (M-09)
  roleShort: string; // the role words of the headline, for the PDFs' identity line (M-15)
  intro: Paragraphs;
  github: { publicContributions: number; privateContributions: number; asOf: string };
  now: string; // README "Now": 2-3 sentences
  lead: string[]; // "How I lead" on the hub, README and summary PDF (D-029): 3-4 bullets
  metrics: Metric[]; // hub hero, 4 (the first is the lead tile), from docs/facts/_career.md
  contact: { email: string; phone: string; tel: string };
  experience: Experience[];
  leads?: Partial<Record<HubSectionId, string>>; // one claim sentence at the top of a hub section
  hub: HubCopy; // the hub page's own lines (task 24); each traces to intro / leads / ui above or to docs/facts
  ui: {
    featured: string;
    archive: string;
    archiveCols: { project: string; status: string; domain: string; stack: string }; // status: "period · status" (M-11)
    contact: string;
    contactCta: string; // sticky-header mailto link text
    skip: string; // skip-to-content link text
    lead: string; // section title for site.lead
    earlyCareer: string; // "{n}" = number of early entries
    concurrent: string;
    downloadPdf: string;
    downloadPagePdf: string;
    work: string;
    process: string;
    about: string;
    route: string; // career route map: figure label and caption lead
    filterAll: string;
    filterLabel: string;
    clipPlay: string;
    clipPause: string;
    filterCount: string; // "{n}" = rows shown
    sections: Record<SectionId, string>;
    tags: Record<Tag, string>;
    keyFacts: Record<keyof KeyFacts | "stack", string>;
    visual: {
      actors: Record<NonNullable<FlowStep["actor"]>, string>;
      loops: string;
      source: string;
      scrollHint: string;
      notes: string; // summary of the folded node notes
      days: string; // unit appended to a timeline span's length
      day: string; // the same unit for a span of one day (task 13d)
    };
    decision: { problem: string; options: string; chosen: string; decision: string; result: string; cost: string; setBy: Record<SetBy, string> };
    who: Record<Who | "agent" | "rule", string>; // the who chips (spec §0)
    evidence: string; // a principle card's link to its evidence (R-05)
    diagramHint: string;
    diagramDashed: string; // appended only when the diagram has external nodes
    diagramHuman: string; // appended only when the diagram has human-group nodes and no me-group ones
    diagramClient: string; // in its place when the diagram also has me-group nodes: the heavy boxes are the client (D-057 ③)
    diagramMe: string; // appended only when the diagram has me-group nodes
    diagramIdle: string; // appended only when the diagram has idle nodes
    retroMore: string; // summary of the folded retrospective paragraphs
    proseMore: string; // summary of a case section's folded paragraphs ("{n}" = how many)
    rowsMore: string; // summary of a timeline's folded dated rows
    figsMore: string; // summary of a section's further figures, folded on a phone only ("{s}": an English plural ending)
    codeMore: string; // summary of a case's code excerpts folded under the system drawing
    factsMore: string; // summary of a case's key facts under its results, folded on a phone only
    resultsMore: string; // summary of the results folded after the first 3 ("{n}" = how many)
    prevProject: string;
    nextProject: string;
    processCta: string;
    processOther: string; // end-of-case process blurb for cases that are not the EWA platform
    close: string;
    backToWork: string;
    pipeline: string; // /process section title (the figure keeps pipelineTitle)
    practices: string;
    gates: string;
  };
};
