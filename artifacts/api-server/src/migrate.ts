import { pool } from "@workspace/db";
import { logger } from "./lib/logger";

const SEED_BOOKS = [
  { title: "Siddur Ashkenaz", language: "Hebrew / English", category: "Siddur", description: "The complete Ashkenazic prayer book for weekdays, Shabbat, and holidays with Hebrew text and English translation.", cover_emoji: "🕍", cover_color: "#1a3050", file_url: "https://www.sefaria.org/sheets/print", is_premium: false, published: true, sort_order: 1 },
  { title: "Tehillim — Psalms", language: "Hebrew / English", category: "Tehillim", description: "The complete Book of Psalms (Tehillim) with Hebrew text, transliteration, and English translation. Essential daily reading.", cover_emoji: "📜", cover_color: "#2a1a40", file_url: null, is_premium: false, published: true, sort_order: 2 },
  { title: "Parashat HaShavua", language: "Hebrew / English", category: "Torah Portions", description: "Complete weekly Torah portions with commentary and Haftarah readings for the entire year.", cover_emoji: "📖", cover_color: "#1a2a20", file_url: null, is_premium: false, published: true, sort_order: 3 },
  { title: "Siddur Sefard", language: "Hebrew", category: "Siddur", description: "The Sefardic prayer rite, used by many Bnei Menashe communities and Mizrachi congregations.", cover_emoji: "🌟", cover_color: "#30200a", file_url: null, is_premium: true, published: true, sort_order: 4 },
  { title: "Mishna Yomit", language: "Hebrew / English", category: "Daily Study", description: "One Mishna per day — complete Shisha Sidrei Mishna cycle with commentary.", cover_emoji: "📚", cover_color: "#1a1a30", file_url: null, is_premium: true, published: true, sort_order: 5 },
  { title: "Hebrew Alef-Bet Primer", language: "English", category: "Hebrew Learning", description: "Beginner guide to reading and writing Hebrew — letters, vowels, and basic words for Bnei Menashe newcomers.", cover_emoji: "🔤", cover_color: "#0a2030", file_url: null, is_premium: false, published: true, sort_order: 6 },
  { title: "Bnei Menashe Prayer Guide", language: "Kuki / Hebrew", category: "Kuki Christian Books", description: "Traditional prayers and liturgy adapted for Bnei Menashe communities transitioning to Jewish observance.", cover_emoji: "🙏", cover_color: "#2a1030", file_url: null, is_premium: false, published: true, sort_order: 7 },
  { title: "Shabbat Table Songs", language: "Hebrew / Transliteration", category: "Prayer Books", description: "Complete Zemirot for Friday night and Shabbat day — songs, melodies, and traditions of Bnei Menashe.", cover_emoji: "🎵", cover_color: "#1a2a10", file_url: null, is_premium: false, published: true, sort_order: 8 },
];

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    logger.info("Running startup migrations…");

    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
        id           SERIAL PRIMARY KEY,
        title        TEXT NOT NULL,
        language     TEXT NOT NULL DEFAULT 'English',
        category     TEXT NOT NULL,
        description  TEXT NOT NULL DEFAULT '',
        cover_emoji  TEXT NOT NULL DEFAULT '📖',
        cover_color  TEXT NOT NULL DEFAULT '#1a2540',
        file_url     TEXT,
        is_premium   BOOLEAN NOT NULL DEFAULT false,
        published    BOOLEAN NOT NULL DEFAULT true,
        sort_order   INTEGER NOT NULL DEFAULT 0,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    logger.info("Schema ready");

    const { rows } = await client.query("SELECT COUNT(*) AS cnt FROM books");
    const count = parseInt(rows[0].cnt, 10);

    if (count === 0) {
      logger.info("Seeding default books…");
      for (const book of SEED_BOOKS) {
        await client.query(
          `INSERT INTO books
             (title, language, category, description, cover_emoji, cover_color, file_url, is_premium, published, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            book.title, book.language, book.category, book.description,
            book.cover_emoji, book.cover_color, book.file_url,
            book.is_premium, book.published, book.sort_order,
          ]
        );
      }
      logger.info({ count: SEED_BOOKS.length }, "Default books seeded");
    } else {
      logger.info({ count }, "Books table already has data — skipping seed");
    }
  } finally {
    client.release();
  }
}
