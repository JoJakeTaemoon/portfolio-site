import type { Brief } from "../types";

// Anonymized (D-017): no country, no industry beyond "service", no client, DB, table or column names, no schema fields.
// The exclusion in D-042 was reversed by Jake in D-049 (B1). Every sentence comes from docs/facts/recsys-data-prep.md.
// Weak facts, stated plainly: no interaction query, no CSV-writing code, no upload record.
export const recsysDataPrepEn: Brief = {
  kind: "brief",
  slug: "recsys-data-prep",
  title: "Training dataset design for a recommendation service",
  tagline: "Designed the schemas and the cleaning and extraction SQL for three datasets to upload to a recommendation service, in three days.",
  year: 2021,
  domain: "Recommendation data preparation",
  tags: ["commerce"],
  stack: ["SQL", "Node.js", "MySQL client"],
  facts: {
    period: "Jan 2021 (3 days)",
    role: "Sole developer (design and SQL)",
    team: "Me alone (8 of the commits)",
    platforms: "SQL and Node.js scripts, design document",
    context: "Building training datasets for a recommendation service from the database of a service in operation",
  },
  metrics: [],
  leads: {
    results: "I got as far as three schemas and the user and item extraction queries; the interaction query and the CSV generation were not built.",
  },
  problem: [
    "A recommendation service needed training data. It took three datasets as CSV files: interactions, users and items. They had to be built from the member, order and product tables of a service in operation.",
    "The source held values that were empty or outside the expected categories, so it had to be cleaned first. The work also needed a procedure for moving the source tables into a local database.",
  ],
  visuals: [
    {
      kind: "flow",
      at: "visuals",
      title: "How the data was meant to reach the recommendation service",
      caption: "The work went as far as moving seven production tables locally, cleaning them and extracting from them; CSV generation and upload have no code.",
      steps: [
        { id: "source", label: "7 production tables", sub: "Member, order and product sources", actor: "external" },
        { id: "load", label: "Export and local load", sub: "A procedure for moving the source tables into a local database", actor: "human" },
        { id: "clean", label: "Cleaning SQL", sub: "Turns empty and out-of-category values into null; 2 queries", actor: "system" },
        { id: "extract", label: "Extraction SQL", sub: "Users and items written; interactions left as a TODO", actor: "system" },
        { id: "csv", label: "3 CSV files", sub: "No generation code", actor: "system" },
        { id: "upload", label: "Upload to the recommendation service", sub: "No record", actor: "external" },
      ],
    },
    {
      kind: "timeline",
      at: "results",
      title: "Three days of design work",
      caption: "The first day produced the design document and schemas, the second removed the ORM, and the third corrected the schemas, finishing in three days.",
      items: [
        { date: "2021-01-29", label: "Start", note: "Design document and schemas" },
        { date: "2021-01-30", label: "ORM removed", note: "Only the DB client and SQL left" },
        { date: "2021-01-31", label: "Schema corrections", note: "Document links tidied" },
      ],
      spans: [{ from: "2021-01-29", to: "2021-01-31", label: "Start to last commit" }],
    },
  ],
  built: [
    "Designed three dataset schemas: interactions, users and items, with the categorical fields marked.",
    "Wrote two cleaning queries that turn empty and out-of-category values into null.",
    "Wrote two extraction queries, one for users and one for items. The interaction query was left as a TODO.",
    "Documented the procedure for moving the source tables into a local database.",
    "Started with an ORM and test tooling, then removed them to keep things simple, leaving only SQL and a DB client.",
  ],
  results: [
    "Wrote three dataset schemas and the user and item extraction queries in three days.",
    "The interaction query was not written. The only runnable code checks the database connection, and no record shows a CSV being produced or uploaded to the recommendation service.",
  ],
  note: "A short job that stopped at the design document and a skeleton. There is no figure to claim as a result, so none is given.",
  code: [],
  gallery: [],
};
