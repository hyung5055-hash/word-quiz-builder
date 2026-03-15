export default function handler(req, res) {
  const data = [
    {
      de: "Die Katze",
      fr: "Le chat",
      it: "Il gatto",
    },
    {
      de: "Das Haus",
      fr: "La maison",
      it: "La casa",
    },
    {
      de: "Der Hund",
      fr: "Le chien",
      it: "Il cane",
    },
    {
      de: "Das Buch",
      fr: "Le livre",
      it: "Il libro",
    },
    {
      de: "Das Wasser",
      fr: "L'eau",
      it: "L'acqua",
    },
  ];

  res.status(200).json(data);
}
