import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const file = path.join(process.cwd(), "client/public/de90.json");

  const data = JSON.parse(
    fs.readFileSync(file, "utf8")
  );

  res.status(200).json(data);
}
