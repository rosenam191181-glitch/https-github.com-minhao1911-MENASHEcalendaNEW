import { useState, useEffect } from "react";

export interface Book {
  id: number;
  title: string;
  language: string;
  category: string;
  description: string;
  coverEmoji: string;
  coverColor: string;
  fileUrl: string | null;
  isPremium: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  "All",
  "Siddur",
  "Tehillim",
  "Torah Portions",
  "Kuki Christian Books",
  "Hebrew Learning",
  "Prayer Books",
  "Daily Study",
  "Custom Community Books",
];

const API_BASE = "/api";

interface SiddurPageProps {
  onReadBook: (book: Book) => void;
  onAdmin: () => void;
  adminPin: string;
  refreshKey: number;
}

export default function SiddurPage({ onReadBook, onAdmin, adminPin, refreshKey }: SiddurPageProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBooks();
  }, [refreshKey]);

  async function fetchBooks() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/books`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredBooks = books.filter(book => {
    const matchCat = activeCategory === "All" || book.category === activeCategory;
    const matchSearch = !search || book.title.toLowerCase().includes(search.toLowerCase()) || book.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const recentBook = [...books].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const progressBook = (() => {
    for (const book of books) {
      const p = localStorage.getItem(`siddur-progress-${book.id}`);
      if (p) return { book, page: parseInt(p) };
    }
    return null;
  })();

  return (
    <div style={{ padding: "0 0 4px" }}>
      {/* Header */}
      <div className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="app-icon">📚</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Siddur</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", fontWeight: 600 }}>LIBRARY</div>
          </div>
        </div>
        <button
          onClick={onAdmin}
          style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}
        >
          <span style={{ fontSize: 13 }}>⚙️</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Admin</span>
        </button>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #0f1e38, #1a2a4a)", borderRadius: 16, padding: 18, marginBottom: 14, border: "1px solid rgba(212,168,67,0.2)" }}>
          <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 22, color: "#d4a843", marginBottom: 4 }}>סִפְרִיַּת הַסִּדּוּר</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 6 }}>Siddur Library</div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>Sacred texts, prayers & community publications for Bnei Menashe</div>
        </div>

        {/* Continue reading */}
        {progressBook && (
          <div
            onClick={() => onReadBook(progressBook.book)}
            className="card"
            style={{ padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: "1px solid rgba(212,168,67,0.2)" }}
          >
            <div style={{ width: 44, height: 56, borderRadius: 8, background: progressBook.book.coverColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {progressBook.book.coverEmoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.1em", marginBottom: 2 }}>CONTINUE READING</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{progressBook.book.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Page {progressBook.page}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        )}

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--text-muted)" }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search books…"
            style={{
              width: "100%", padding: "11px 14px 11px 36px", borderRadius: 10,
              background: "var(--elevated)", border: "1px solid var(--border)",
              color: "var(--text-primary)", fontSize: 14, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 12, scrollbarWidth: "none" }}>
          {CATEGORIES.filter(c => {
            if (c === "All") return true;
            return books.some(b => b.category === c);
          }).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                whiteSpace: "nowrap", fontSize: 12, fontWeight: 600,
                background: activeCategory === cat ? "#d4a843" : "var(--elevated)",
                color: activeCategory === cat ? "#1a0f00" : "var(--text-muted)",
                flexShrink: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Books grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
            <div style={{ fontSize: 13 }}>Loading library…</div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 13 }}>No books in this category yet</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} onRead={() => onReadBook(book)} />
            ))}
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

function BookCard({ book, onRead }: { book: Book; onRead: () => void }) {
  return (
    <div className="card" style={{ padding: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
      {/* Cover */}
      <div style={{
        width: 60, height: 80, borderRadius: 8, flexShrink: 0,
        background: `linear-gradient(135deg, ${book.coverColor}, ${book.coverColor}aa)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "2px 3px 12px rgba(0,0,0,0.3)",
        position: "relative",
      }}>
        {book.coverEmoji}
        {book.isPremium && (
          <div style={{ position: "absolute", top: -4, right: -4, background: "#d4a843", color: "#1a0f00", fontSize: 8, fontWeight: 800, padding: "2px 4px", borderRadius: 4 }}>PRO</div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>{book.title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
          <span className="tag tag-blue" style={{ fontSize: 10 }}>{book.category}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{book.language}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {book.description}
        </div>
        <button
          onClick={onRead}
          style={{
            padding: "7px 18px", borderRadius: 8, cursor: "pointer",
            background: book.isPremium ? "linear-gradient(135deg, #b8860b, #d4a843)" : "var(--elevated)",
            color: book.isPremium ? "#1a0f00" : "var(--text-primary)",
            fontSize: 12, fontWeight: 700,
            border: book.isPremium ? "none" : "1px solid var(--border)",
          }}
        >
          {book.isPremium ? "⭐ Read (Premium)" : "📖 Read"}
        </button>
      </div>
    </div>
  );
}
