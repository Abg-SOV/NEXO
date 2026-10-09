/* ===== CATÁLOGO DE NEXO =====
   status: "available" | "soon" | "tbd" (precio por definir) | "unavailable"
   price:  null -> muestra el estado.  "$00 MXN" -> muestra ese texto como precio.
   discover: lista con gaming | entretenimiento | suscripciones | digital
   category: id de NEXO_CATEGORIES.  featured: true -> aparece en Destacados.  order: menor = primero. */
window.NEXO_CATEGORIES = [
  { id: "gaming", label: "Gaming" },
  { id: "suscripciones", label: "Suscripciones" },
  { id: "digital", label: "Digital" },
  { id: "proximamente", label: "Próximamente" }
];
window.NEXO_DISCOVER = [
  { id: "gaming", label: "Gaming", hint: "Robux, juegos y más" },
  { id: "entretenimiento", label: "Entretenimiento", hint: "Streaming, música y ocio" },
  { id: "suscripciones", label: "Suscripciones", hint: "Planes por plataforma" },
  { id: "digital", label: "Digital", hint: "Gift cards y otros productos" }
];
window.NEXO_PRODUCTS = [
  { id: "robux", name: "Robux", category: "gaming", discover: ["gaming"], tag: "Gaming",
    description: "Robux para tu cuenta. Las cantidades se definirán cuando esté confirmado el proveedor.",
    features: ["Cantidad por definir", "Entrega estimada de 3 a 5 días", "Pedido por WhatsApp o Telegram"],
    status: "tbd", price: null, featured: true, order: 1, cta: "Consultar Robux" },
  { id: "suscripciones", name: "Suscripciones", category: "suscripciones", discover: ["suscripciones", "entretenimiento"], tag: "Planes",
    description: "Planes de plataformas digitales. Las plataformas se anunciarán cuando estén confirmadas.",
    features: ["Plataforma por definir", "Duración por definir", "Entrega por definir"],
    status: "tbd", price: null, featured: true, order: 2, cta: "Consultar suscripciones" },
  { id: "juegos", name: "Juegos", category: "gaming", discover: ["gaming", "entretenimiento"], tag: "Gaming",
    description: "Juegos digitales. Catálogo en preparación.",
    features: ["Títulos por definir", "Entrega digital"],
    status: "soon", price: null, featured: false, order: 3, cta: "Preguntar por juegos" },
  { id: "giftcards", name: "Gift cards", category: "digital", discover: ["digital", "entretenimiento"], tag: "Digital",
    description: "Tarjetas de regalo digitales. Servicios y montos por confirmar.",
    features: ["Servicios por definir", "Montos por definir"],
    status: "soon", price: null, featured: false, order: 4, cta: "Preguntar por gift cards" },
  { id: "otros-digital", name: "Otros productos digitales", category: "digital", discover: ["digital"], tag: "Digital",
    description: "Contenido y servicios digitales. ¿Buscas algo específico? Pregúntanos.",
    features: ["Catálogo abierto", "Atención directa"],
    status: "tbd", price: null, featured: false, order: 5, cta: "Preguntar" },
  { id: "nuevas", name: "Nuevas categorías", category: "proximamente", discover: [], tag: "Pronto",
    description: "NEXO está creciendo. Aquí aparecerán los productos nuevos.",
    features: ["En preparación"],
    status: "soon", price: null, featured: false, order: 6, cta: "Preguntar" }
];
