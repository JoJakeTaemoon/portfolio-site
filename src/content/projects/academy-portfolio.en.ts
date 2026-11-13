import type { Brief } from "../types";

// Anonymized (D-017): country and "educational institution" at most; no academy name, place, teacher title or student data.
// Minors' data: no student names, codes, writing or real screenshots. Nothing about the system's internals (D-049 B5).
// Not called client/delivery: whether this was paid work is not in the repo (facts, public-risk memo). Every sentence comes from docs/facts/academy-portfolio.md.
export const academyPortfolioEn: Brief = {
  kind: "brief",
  slug: "academy-portfolio",
  title: "Reading and writing portfolio web app for students",
  tagline: "Moved a received single-file app into a deployable Vite project in one day, and added a teacher-side student registration screen and sign-out.",
  year: 2026,
  domain: "Education · student learning records",
  tags: ["education"],
  stack: ["React 18", "Vite 5", "Google Apps Script", "Google Sheets", "Vercel"],
  facts: {
    period: "May 2026 (one day)",
    role: "One developer · AI co-authored",
    team: "Me alone (all 14 commits carry an AI co-author mark)",
    platforms: "Web app (student screens + teacher registration screen)",
    context: "A web app for a teacher at an overseas educational institution who wanted to build up students' reading and writing records as portfolios",
  },
  metrics: [
    { value: "1 day", label: "received app to deployable project" },
    { value: "About 7 h", label: "first commit to teacher screen" },
  ],
  leads: {
    results: "In one day I turned the received app into a deployable project and added a teacher registration screen and sign-out.",
  },
  problem: [
    "The teacher wanted to build up students' reading records and written work as portfolio assets. The design had four principles: centre on the student's own assets; no comparison between students, public sharing or rankings; the same experience on phone, tablet and laptop; and AI only assists the teacher's work and never writes a student's sentences for them.",
    "The app I received worked but had no deployment setup. Registering a student also meant the teacher running a function by hand in the Google script editor.",
  ],
  visuals: [
    {
      kind: "architecture",
      at: "visuals",
      title: "App structure",
      caption: "A React app in the browser calls the Google script web app that came with the job, the data lives in three Google Sheets, and the part I changed is the app side.",
      cols: 3,
      rows: 4,
      nodes: [
        { id: "student", label: "Student screens", sub: "home → lists → write → detail", col: 0, row: 0, group: "client" },
        { id: "teacher", label: "Teacher registration", sub: "register a student by name and grade", col: 2, row: 0, group: "client" },
        { id: "app", label: "React app", sub: "Vite 5 · Vercel auto-deploy setup", col: 1, row: 1, group: "core" },
        { id: "script", label: "Google script web app", sub: "as received · 7 actions", col: 1, row: 2, group: "external" },
        { id: "sheets", label: "3 Google Sheets", sub: "students · reading · writing", col: 1, row: 3, group: "data" },
      ],
      edges: [
        { from: "student", to: "app" },
        { from: "teacher", to: "app" },
        { from: "app", to: "script", label: "action calls" },
        { from: "script", to: "sheets" },
      ],
      notes: {
        student: "Six screens. From home the student sees statistics on books read and pieces written and the latest records, then reading and writing lists, the write and edit forms, and the detail view. Grade sets a basic, intermediate or advanced level automatically, and each level has its own forms.",
        teacher: "The screen added in this job. The teacher registers a student by name and grade and can register several in a row.",
        app: "The received 397-line single-file app was moved into a Vite project. Runtime dependencies are two: react and react-dom. No new server or database was built.",
        script: "The received Google script was used unchanged. Seven actions handle reading, creating, saving and deleting.",
        sheets: "Three sheets hold the data: students, reading and writing.",
      },
    },
    {
      kind: "timeline",
      at: "results",
      title: "One day of work",
      caption: "On May 12, 2026 the app was moved into a deployable project, and about 7 hours later the teacher registration screen and sign-out went up.",
      stats: [{ value: "About 7 h", label: "first commit to teacher screen" }],
      items: [
        { date: "2026-05-12", label: "Vite project set up, app ported", note: "12:11" },
        { date: "2026-05-12", label: "Loading dialog, time display", note: "12:30" },
        { date: "2026-05-12", label: "Browser default popups replaced", note: "12:36" },
        { date: "2026-05-12", label: "Improvement candidates document", note: "13:31 · AI automation stage design" },
        { date: "2026-05-12", label: "Sign-out, teacher registration screen", note: "19:07" },
      ],
    },
  ],
  built: [
    "Organised the received single-file app into a Vite project in a deployable setup, and configured Vercel auto-deploy.",
    "Improved the loading dialog and time display, and replaced the browser's default confirm and alert boxes with the app's own confirmation dialogs in 4 places.",
    "Added a teacher-side student registration screen. The teacher registers a student by name and grade and can register several in a row.",
    "Added sign-out. The teacher asked for it to happen in one step, without a confirmation popup.",
    "Wrote an improvement-candidates document and a work log. The candidates carry priorities and effort estimates with a 3x buffer on effort.",
  ],
  decision: {
    title: "No new server or database: keep the received Google Sheets and script, deploy only the front end",
    problem: "The received app's back end was an already-running Google Sheets file and Google script. To deploy, I had to decide whether to keep it or build a new one.",
    decision: "I built no new server or database; I kept the received sheets and script as they were and deployed only the front end. The reasons the work log gives are that a working sheet already existed and that it could be deployed without extra setup such as environment variables. No other option is recorded as compared. When adding features, I fixed the design principles (no comparison or rankings, AI never writes a student's sentences) as the test, in the spec and in the improvement-candidates document.",
    result: "The Google script was never changed after the first commit, and the app code grew from 397 to 815 lines.",
  },
  results: [
    "Moved the received single-file app into a deployable Vite project in one day, added the teacher registration screen and sign-out, and pushed it to a repository.",
    "The back end is the received Google script, used as it was.",
    "There are no test files, runner or CI. User numbers and operating records are not in the repository, so none are given.",
  ],
  note: "No student names, writing or codes, and no screen captures, are shown. The deployment setup is done; the repository holds no live address or uptime record.",
  code: [],
  gallery: [],
};
