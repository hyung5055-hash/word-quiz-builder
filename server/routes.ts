import type { Express } from "express";
import type { Server } from "http";
import fs from "fs";
import path from "path";

export async function registerRoutes(
  app: Express,
  httpServer: Server,
): Promise<Server> {
  // =========================
  // JSON 안전 로드
  // =========================
  let words: any[] = [];

  try {
    const filePath = path.join(process.cwd(), "server", "data", "words.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    words = JSON.parse(raw);

    console.log("✅ words.json loaded:", words.length);
  } catch (err) {
    console.error("❌ Failed to load words.json:", err);
  }

  // =========================
  // 퀴즈 목록
  // =========================
  app.get("/api/quizzes", (_req, res) => {
    res.json([
      { id: "fr", title: "French Vocabulary" },
      { id: "de", title: "German Vocabulary" },
      { id: "it", title: "Italian Vocabulary" },
    ]);
  });

  // =========================
  // 랜덤 문제
  // =========================
  app.get("/api/random/:from/:to", (req, res) => {
    const { from, to } = req.params;

    if (!words.length) {
      return res.status(500).json({ message: "No words available" });
    }

    if (
      !["fr", "de", "it"].includes(from) ||
      !["fr", "de", "it"].includes(to)
    ) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const random = words[Math.floor(Math.random() * words.length)];

    res.json({
      question: random[from],
      answer: random[to],
    });
  });

  // =========================
  // 매칭 게임용
  // =========================
  app.get("/api/match/:from/:to", (req, res) => {
    const { from, to } = req.params;

    if (!words.length) {
      return res.status(500).json({ message: "No words available" });
    }

    if (
      !["fr", "de", "it"].includes(from) ||
      !["fr", "de", "it"].includes(to)
    ) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    const pairs = selected.map((w: any) => ({
      from: w[from],
      to: w[to],
      example: w.example, // ⭐ 이 줄 추가
    }));

    res.json(pairs);
  });

  return httpServer;
}
