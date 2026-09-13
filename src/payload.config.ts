import { buildConfig } from "payload";
import type { CollectionConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// ─── Users (Required for Admin Auth) ───────────────────────────
const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [],
};

// ─── Maintenance Checks (Engineering Side) ─────────────────────
const MaintenanceChecks: CollectionConfig = {
  slug: "maintenance-checks",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "checkLevel",
      type: "select",
      required: true,
      options: [
        { label: "A-Check", value: "A" },
        { label: "B-Check", value: "B" },
        { label: "C-Check", value: "C" },
        { label: "D-Check", value: "D" },
      ],
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "technicalSpecs",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "text", required: true },
      ],
    },
  ],
};

// ─── Brokerage Process (Luxury Side) ──────────────────────────
const BrokerageProcess: CollectionConfig = {
  slug: "brokerage-process",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "steps",
      type: "array",
      fields: [
        { name: "stepNumber", type: "number", required: true },
        { name: "stepTitle", type: "text", required: true },
        { name: "stepDescription", type: "textarea", required: true },
      ],
    },
  ],
};

// ─── Build Config ──────────────────────────────────────────────
export default buildConfig({
  editor: lexicalEditor({}),
  collections: [Users, MaintenanceChecks, BrokerageProcess],
  secret: process.env.PAYLOAD_SECRET || "sky-thrust-dev-secret-change-me",
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./payload.sqlite",
    },
  }),
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, "./src/app/(payload)"),
    },
  },
  onInit: async (payload) => {
    const { docs } = await payload.find({ collection: "users", limit: 1 });
    if (docs.length === 0) {
      await payload.create({
        collection: "users",
        data: {
          email: "admin@skythrust.com",
          password: "password",
        },
      });
      payload.logger.info("Admin user created: admin@skythrust.com / password");
    }
  },
});
