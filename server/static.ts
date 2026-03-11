import express, { type Express } from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(`Build folder not found: ${distPath}`);
  }

  app.use(express.static(distPath));

  // SPA fallback (Express 5 safe 방식)
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
