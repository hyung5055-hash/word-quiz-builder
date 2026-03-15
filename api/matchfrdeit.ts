import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "server/data/words.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const words = JSON.parse(raw);

  const shuffled = [...words].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);

  const triples = selected.map((w) => ({
    fr: w.fr, 
    de: w.de,
    it: w.it,
  }));

  res.status(200).json(triples);
}
