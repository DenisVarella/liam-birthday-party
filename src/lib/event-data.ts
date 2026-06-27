/**
 * Dados centralizados do evento — 1º Aninho do Liam.
 * Facilita manutenção e reutilização em toda a landing page.
 */

export const eventInfo = {
  childName: "Liam",
  age: 1,
  title: "1º Aninho do Liam",
  tagline: "Um dia cheio de alegria, carinho e boas lembranças",
  date: "16 de agosto de 2026",
  dateISO: "2026-08-16T14:00:00-03:00",
  time: "14h",
  location: {
    name: "Salão de Festas Adulto — Condomínio Class",
    address: "Rua Primeiro de Maio, 56",
    neighborhood: "Vila Antonieta",
    city: "Guarulhos",
    state: "SP",
    full: "Salão de Festas Adulto do Condomínio Class — Rua Primeiro de Maio, 56, Vila Antonieta, Guarulhos-SP",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rua+Primeiro+de+Maio+56+Vila+Antonieta+Guarulhos+SP",
  },
  whatsappGroupUrl: "#", // Substituir pelo link real do grupo
  photo: "/images/liam.jpg",
} as const;

export const colors = {
  blue: "#2B6CB0",
  blueLight: "#63B3ED",
  blueSoft: "#EBF8FF",
  orange: "#ED8936",
  orangeLight: "#FBD38D",
  coral: "#FC8181",
  coralLight: "#FED7D7",
  cream: "#FFFAF0",
} as const;

export const partyStyle = {
  description:
    "Uma tarde leve e especial para celebrar o Liam — com comidinhas, música e muito carinho.",
  spaces: [
    {
      title: "Comidas & bolo",
      description:
        "Salgadinhos, doces, bolo do aniversário, pipoca e algodão doce.",
      icon: "cake" as const,
    },
    {
      title: "Pula-pula",
      description: "Brinquedo inflável para todas as idades se divertirem.",
      icon: "bounce" as const,
    },
    {
      title: "Cantinho confortável",
      description: "Sofás para relaxar e conversar com calma.",
      icon: "sofa" as const,
    },
  ],
} as const;

export const menu = {
  savory: {
    title: "Salgados",
    items: ["Salgados fritos e assados", "Hot-dog"],
  },
  sweets: {
    title: "Docinhos",
    items: ["Variedade de docinhos tradicionais"],
  },
  cake: {
    title: "Bolo",
    items: ["Ninho com Paçoca"],
  },
  special: {
    title: "Carrinhos de Pipoca & Algodão Doce",
    items: ["Servidos à vontade durante a festa"],
  },
  drinks: {
    title: "Bebidas",
    items: ["Refrigerantes", "Sucos", "Água mineral"],
  },
} as const;

export const entertainment = [
  {
    title: "Desenho com giz",
    description: "Cantinho criativo para colorir e se divertir.",
    icon: "palette" as const,
  },
  {
    title: "Pula-pula",
    description: "Brinquedo inflável para todas as idades.",
    icon: "bounce" as const,
  },
  {
    title: "Música",
    description: "Trilha sonora animada durante toda a festa.",
    icon: "music" as const,
  },
  {
    title: "Bolha de sabão",
    description: "Muita diversão para os pequenos.",
    icon: "bubbles" as const,
  },
] as const;

export const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#timeline", label: "Memórias" },
  { href: "#detalhes", label: "Detalhes" },
  { href: "#espaco", label: "Espaço" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#diversao", label: "Diversão" },
  { href: "#fotos", label: "Fotos" },
] as const;

/** Fotos do varal do desenvolvimento — inspirado no convite opção 2. */
export const developmentPhotos = [
  { label: "Recém nascido", emoji: "👶" },
  { label: "3 meses", emoji: "😊" },
  { label: "6 meses", emoji: "😄" },
  { label: "9 meses", emoji: "🧒", image: "/images/liam.jpg" },
] as const;

/** Trilha sonora da landing — embed YouTube (sem vídeo visível). */
export const partyMusic = {
  youtubeVideoId: "bSC4loy2-3o",
  title: "Bebezinho Bebezinho",
} as const;
