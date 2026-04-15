import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

function parseArgs(argv) {
  const result = {
    envFile: ".env",
    sqlFile: path.join("app", "lib", "settings.sql"),
    email: null,
    sendTest: false,
  };

  for (let index = 2; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--env" || value === "--env-file") {
      result.envFile = argv[index + 1] ?? result.envFile;
      index += 1;
      continue;
    }

    if (value === "--sql" || value === "--sql-file") {
      result.sqlFile = argv[index + 1] ?? result.sqlFile;
      index += 1;
      continue;
    }

    if (value === "--email") {
      result.email = argv[index + 1] ?? result.email;
      index += 1;
      continue;
    }

    if (value === "--send-test") {
      result.sendTest = true;
      continue;
    }

    if (value === "--help" || value === "-h") {
      result.help = true;
      continue;
    }
  }

  return result;
}

function stripOptionalQuotes(value) {
  const text = String(value ?? "").trim();
  if (!text.length) return "";

  const first = text[0];
  const last = text[text.length - 1];
  if ((first === "'" && last === "'") || (first === '"' && last === '"')) {
    return text.slice(1, -1);
  }

  return text;
}

async function loadEnvFile(envPath) {
  const fullPath = path.resolve(envPath);

  let content;
  try {
    content = await fs.readFile(fullPath, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") return; // File not found is OK
    console.warn(
      `Warning: Could not read env file ${fullPath}: ${err.message}`,
    );
    return;
  }
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line.length) continue;
    if (line.startsWith("#")) continue;

    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = line.slice(0, equalsIndex).trim();
    if (!key.length) continue;

    if (Object.prototype.hasOwnProperty.call(process.env, key)) continue;

    const rawValue = line.slice(equalsIndex + 1);
    const normalizedValue = stripOptionalQuotes(rawValue);

    process.env[key] = normalizedValue;
  }
}

function readDollarQuoteTag(text, startIndex) {
  if (text[startIndex] !== "$") return null;

  let index = startIndex + 1;
  while (index < text.length) {
    const ch = text[index];

    if (ch === "$") {
      return text.slice(startIndex, index + 1);
    }

    if (!/[A-Za-z0-9_]/.test(ch)) {
      return null;
    }

    index += 1;
  }

  return null;
}

function splitSqlStatements(sqlText) {
  const statements = [];

  let current = "";

  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;
  let dollarQuoteTag = null;

  let index = 0;

  while (index < sqlText.length) {
    const ch = sqlText[index];
    const next = sqlText[index + 1];

    if (inLineComment) {
      current += ch;
      if (ch === "\n") inLineComment = false;
      index += 1;
      continue;
    }

    if (inBlockComment) {
      current += ch;
      if (ch === "*" && next === "/") {
        current += next;
        index += 2;
        inBlockComment = false;
        continue;
      }
      index += 1;
      continue;
    }

    if (dollarQuoteTag) {
      if (sqlText.startsWith(dollarQuoteTag, index)) {
        current += dollarQuoteTag;
        index += dollarQuoteTag.length;
        dollarQuoteTag = null;
        continue;
      }

      current += ch;
      index += 1;
      continue;
    }

    if (inSingleQuote) {
      current += ch;

      if (ch === "'") {
        if (next === "'") {
          current += next;
          index += 2;
          continue;
        }

        inSingleQuote = false;
      }

      index += 1;
      continue;
    }

    if (inDoubleQuote) {
      current += ch;

      if (ch === '"') {
        if (next === '"') {
          current += next;
          index += 2;
          continue;
        }

        inDoubleQuote = false;
      }

      index += 1;
      continue;
    }

    if (ch === "-" && next === "-") {
      inLineComment = true;
      current += ch + next;
      index += 2;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      current += ch + next;
      index += 2;
      continue;
    }

    if (ch === "'") {
      inSingleQuote = true;
      current += ch;
      index += 1;
      continue;
    }

    if (ch === '"') {
      inDoubleQuote = true;
      current += ch;
      index += 1;
      continue;
    }

    if (ch === "$") {
      const tag = readDollarQuoteTag(sqlText, index);
      if (tag) {
        dollarQuoteTag = tag;
        current += tag;
        index += tag.length;
        continue;
      }
    }

    if (ch === ";") {
      current += ch;
      const trimmed = current.trim();
      if (trimmed.length) statements.push(trimmed);
      current = "";
      index += 1;
      continue;
    }

    current += ch;
    index += 1;
  }

  const tail = current.trim();
  if (tail.length) statements.push(tail);

  return statements;
}

function requireEnv(name) {
  const value = String(process.env[name] ?? "").trim();
  if (!value.length) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function applySqlFile(sql, filePathToApply) {
  const fullPath = path.resolve(filePathToApply);
  const raw = await fs.readFile(fullPath, "utf8");
  const statements = splitSqlStatements(raw);

  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed.length) continue;
    await sql.query(trimmed);
  }
}

async function ensurePublicEmail(sql, email) {
  const normalizedEmail = String(email ?? "").trim();
  if (!normalizedEmail.length) return;

  // Insert a default row if missing, otherwise only update public_email.
  await sql.query(
    `
      INSERT INTO site_settings (
        singleton_key,
        display_name,
        location,
        public_email,
        hero_headline,
        hero_bio,
        github_url,
        linkedin_url,
        cv_url
      )
      VALUES (
        'default',
        'Emmanuel Pam',
        'Based in Mauritius',
        $1,
        'Full-Stack Developer',
        'I design, build, and ship full-stack products: responsive UI, secure backends, and scalable data — with React/Next.js.',
        'https://github.com/emmanuelpam03',
        NULL,
        '/sample-resume.pdf'
      )
      ON CONFLICT (singleton_key) DO UPDATE
      SET public_email = EXCLUDED.public_email
    `,
    [normalizedEmail],
  );
}

async function getCurrentPublicEmail(sql) {
  const rows = await sql.query(`
    SELECT public_email
    FROM site_settings
    WHERE singleton_key = 'default'
    LIMIT 1
  `);

  const email = rows?.[0]?.public_email ? String(rows[0].public_email) : "";
  return email.trim();
}

async function sendTestContactEmail({ resendApiKey, resendFrom, to }) {
  const resend = new Resend(resendApiKey);

  const from = resendFrom.includes("<")
    ? resendFrom
    : `Portfolio <${resendFrom}>`;

  return resend.emails.send({
    from,
    to,
    subject: "Portfolio contact test (DB-managed)",
    text: "This is an automated test email to confirm the portfolio contact form destination is DB-managed via site_settings.public_email.",
  });
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    console.log(
      `Usage: node scripts/setup-settings-and-test-contact.mjs [options]\n\nOptions:\n  --env-file <path>   Path to .env (default: .env)\n  --sql-file <path>   SQL file to apply (default: app/lib/settings.sql)\n  --email <email>     Upsert site_settings.public_email to this value\n  --send-test         Send a test email via Resend after setup\n`,
    );
    return;
  }

  await loadEnvFile(args.envFile);

  const databaseUrl = requireEnv("DATABASE_URL");
  const sql = neon(databaseUrl);

  console.log(`Applying SQL: ${args.sqlFile}`);
  await applySqlFile(sql, args.sqlFile);
  console.log("Settings schema applied.");

  if (args.email) {
    await ensurePublicEmail(sql, args.email);
  }

  const currentEmail = await getCurrentPublicEmail(sql);
  console.log(`site_settings.public_email = ${currentEmail || "(missing)"}`);

  if (args.sendTest) {
    const resendApiKey = requireEnv("RESEND_API_KEY");
    const resendFrom = requireEnv("RESEND_FROM");

    if (!currentEmail) {
      throw new Error(
        "Cannot send test email because site_settings.public_email is empty.",
      );
    }

    console.log("Sending test email via Resend...");
    const result = await sendTestContactEmail({
      resendApiKey,
      resendFrom,
      to: currentEmail,
    });

    if (result?.error) {
      console.error("Resend rejected test email", result.error);
      process.exitCode = 1;
      return;
    }

    const id = typeof result?.data?.id === "string" ? result.data.id : null;

    if (!id) {
      console.error("Resend returned no message id", result);
      process.exitCode = 1;
      return;
    }

    console.log(`Resend accepted email (id: ${id}).`);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
