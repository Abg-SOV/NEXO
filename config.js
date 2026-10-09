/* =====================================================================================
   NEXO · ARCHIVO ÚNICO DE CONFIGURACIÓN
   -------------------------------------------------------------------------------------
   Todo lo editable del sitio vive aquí. No necesitas tocar HTML, CSS ni app.js.
   Busca "[PLACEHOLDER" para encontrar los datos que debes completar.
   En la web, cualquier texto con [PLACEHOLDER...] se resalta en amarillo para que lo veas.

   ÍNDICE
     1. SITE ............ nombre, frase, dominio
     2. CONTACT ......... WhatsApp, Telegram, correo, horario, formulario
     3. ADMINS .......... administradores de soporte
     4. REFERENCES ...... grupo de referencias (WhatsApp / Telegram)
     5. CURRENCY ........ monedas y tasas de cambio
     6. PAYMENTS ........ métodos de pago
     7. MESSAGES ........ mensajes automáticos de WhatsApp / Telegram
     8. TRUST_BADGES .... insignias de confianza
     9. ABOUT ........... sección "Sobre NEXO"
    10. CATALOG ......... categorías, Discover y productos
    11. PLATFORMS ....... apartados por plataforma (paquetes, comparación, ventajas, preguntas)
    12. LEGAL ........... privacidad, términos y reembolsos
   ===================================================================================== */
window.NEXO = {

  /* ---------- 1. SITE ---------- */
  SITE: {
    name: "NEXO",
    tagline: "Tu mundo digital, en un solo lugar.",
    description: "Tienda independiente de productos y servicios digitales: Robux, suscripciones, gift cards y más. Atención por WhatsApp y Telegram.",
    url: "https://[PLACEHOLDER-tudominio.com]",      // Dominio final con https://, sin "/" al final
    founded: "[PLACEHOLDER: año]"
  },

  /* ---------- 2. CONTACT ---------- */
  CONTACT: {
    whatsapp: "[PLACEHOLDER-WHATSAPP]",               // Solo dígitos con lada de país. Ej.: "5215512345678"
    telegram: "[PLACEHOLDER-TELEGRAM]",               // Usuario sin @. Ej.: "nexo_store"
    email: "contacto@tudominio.com",                  // Correo empresarial
    hours: "[PLACEHOLDER: Lunes a sábado, 10:00 a 20:00 (hora del centro de México)]",
    location: "[PLACEHOLDER: Ciudad, País] · Tienda 100 % en línea",
    responseTime: "[PLACEHOLDER: menos de 2 horas en horario de atención]",
    // Formulario de contacto: pega aquí un endpoint de Formspree, Getform, Basin, etc.
    // Si lo dejas vacío, el formulario abre la app de correo del cliente con el mensaje listo.
    formEndpoint: ""
  },

  /* ---------- 3. ADMINS (soporte) ---------- */
  ADMINS: [
    { name: "[PLACEHOLDER: Nombre admin 1]", role: "Ventas y pedidos", whatsapp: "[PLACEHOLDER-WHATSAPP-ADMIN-1]", telegram: "[PLACEHOLDER-TELEGRAM-ADMIN-1]" },
    { name: "[PLACEHOLDER: Nombre admin 2]", role: "Soporte y garantías", whatsapp: "[PLACEHOLDER-WHATSAPP-ADMIN-2]", telegram: "[PLACEHOLDER-TELEGRAM-ADMIN-2]" }
  ],

  /* ---------- 4. REFERENCES (grupo de referencias) ---------- */
  REFERENCES: {
    title: "Grupo de referencias",
    text: "Mira compras reales y opiniones de otros clientes antes de comprar. Únete al grupo y pregunta lo que quieras.",
    whatsappGroup: "https://chat.whatsapp.com/[PLACEHOLDER-CODIGO-GRUPO]",
    telegramGroup: "https://t.me/[PLACEHOLDER-GRUPO-REFERENCIAS]"
  },

  SOCIALS: [],                                         // Ej.: [{ name: "Instagram", url: "https://instagram.com/..." }]

  /* ---------- 5. CURRENCY ----------
     Los precios se escriben en la moneda BASE y se convierten con estas tasas.
     ⚠️ TASAS DE EJEMPLO: actualízalas antes de publicar (1 MXN = X de cada moneda). */
  CURRENCY: {
    base: "MXN",
    default: "MXN",
    ratesAreExample: true,                             // Cambia a false cuando pongas tasas reales
    ratesUpdated: "[PLACEHOLDER: fecha de actualización]",
    rates: { MXN: 1, USD: 0.054, COP: 225 },           // EJEMPLO
    list: {
      MXN: { label: "Peso mexicano", locale: "es-MX", decimals: 2 },
      USD: { label: "Dólar estadounidense", locale: "en-US", decimals: 2 },
      COP: { label: "Peso colombiano", locale: "es-CO", decimals: 0 }
    }
  },

  // Muestra los precios marcados con example:true (con etiqueta "Ejemplo").
  // Ponlo en false para ocultarlos y mostrar "Por confirmar" hasta que tengas precios reales.
  SHOW_EXAMPLE_PRICES: true,

  /* ---------- 6. PAYMENTS ---------- */
  PAYMENTS: {
    available: ["Nu", "Mercado Pago", "Spin by OXXO"],
    soon: ["Binance"],
    note: "Los datos de pago se envían por WhatsApp o Telegram al confirmar tu pedido. Nunca pedimos datos de tarjeta en esta web."
  },
  ROBUX_DELIVERY: "3 a 5 días",

  /* ---------- 7. MESSAGES ----------
     Se escriben solos en el chat según el canal y el botón.
     Variables: {brand} {product} {package} {price} {topic} {admin}
     WhatsApp usa *negritas*; Telegram usa **negritas**. */
  MESSAGES: {
    whatsapp: {
      general:  "¡Hola {brand}! 👋 Vengo de su página web y quiero información sobre sus productos.",
      support:  "¡Hola {brand}! 🛟 Necesito ayuda con lo siguiente: ",
      product:  "¡Hola {brand}! 👋 Me interesa *{product}*. ¿Me compartes precio, disponibilidad y métodos de pago?",
      package:  "¡Hola {brand}! 🛒 Quiero el paquete *{package}* de *{product}* ({price}). ¿Cómo continúo con el pago?",
      discover: "¡Hola {brand}! 🔎 Estoy buscando algo de *{topic}*. ¿Qué opciones tienen?",
      admin:    "¡Hola {admin}! 👋 Vengo de la web de {brand} y necesito ayuda con: "
    },
    telegram: {
      general:  "¡Hola {brand}! 👋 Te escribo desde la web por Telegram, quiero información sobre sus productos.",
      support:  "¡Hola {brand}! 🛟 Te escribo por Telegram, necesito ayuda con lo siguiente: ",
      product:  "¡Hola {brand}! 👋 Me interesa **{product}**. ¿Me compartes precio, disponibilidad y métodos de pago?",
      package:  "¡Hola {brand}! 🛒 Quiero el paquete **{package}** de **{product}** ({price}). ¿Cómo continúo con el pago?",
      discover: "¡Hola {brand}! 🔎 Estoy buscando algo de **{topic}**. ¿Qué opciones tienen?",
      admin:    "¡Hola {admin}! 👋 Vengo de la web de {brand} y necesito ayuda con: "
    }
  },

  /* ---------- 8. TRUST_BADGES (icon: bolt | shield | chat | award) ---------- */
  TRUST_BADGES: [
    { icon: "bolt",   title: "Entrega rápida",          text: "Procesamos tu pedido en cuanto se confirma el pago." },
    { icon: "shield", title: "Pago 100% seguro",        text: "Pagas con plataformas reconocidas. Nunca pedimos datos de tarjeta en la web." },
    { icon: "chat",   title: "Atención personalizada",  text: "Te atiende una persona real por WhatsApp o Telegram." },
    { icon: "award",  title: "Garantías",               text: "Reposición o reembolso según nuestra política publicada." }
  ],

  /* ---------- 9. ABOUT ---------- */
  ABOUT: {
    title: "Sobre NEXO",
    lead: "Una tienda digital independiente que junta en un solo lugar lo que buscas para jugar, ver y regalar.",
    who: "NEXO es una tienda en línea con base en [PLACEHOLDER: ciudad, país]. Reunimos productos y servicios digitales —Robux, suscripciones, gift cards y juegos— con atención directa por WhatsApp y Telegram.",
    what: "Te ayudamos a conseguir créditos, planes y códigos digitales pagando con métodos locales, sin tarjeta internacional y con una persona acompañándote en cada paso: desde elegir hasta recibir.",
    mission: "Que comprar en el mundo digital sea simple, claro y seguro.",
    why: [
      "Proceso visible en 5 pasos, antes de que nos escribas.",
      "Comprobante y seguimiento de cada pedido por chat.",
      "Grupo público de referencias con compras de otros clientes.",
      "Privacidad, términos y reembolsos publicados y fáciles de leer.",
      "Personas reales que responden, no bots."
    ]
  },

  /* ---------- 10. CATALOG ----------
     status: "available" | "soon" | "tbd" (precio por definir) | "unavailable"
     platform: id de PLATFORMS (enlaza la tarjeta con su apartado y muestra "Desde ...") */
  CATEGORIES: [
    { id: "gaming", label: "Gaming" },
    { id: "suscripciones", label: "Suscripciones" },
    { id: "digital", label: "Digital" },
    { id: "proximamente", label: "Próximamente" }
  ],
  DISCOVER: [
    { id: "gaming", label: "Gaming", hint: "Robux, juegos y más" },
    { id: "entretenimiento", label: "Entretenimiento", hint: "Streaming, música y ocio" },
    { id: "suscripciones", label: "Suscripciones", hint: "Planes por plataforma" },
    { id: "digital", label: "Digital", hint: "Gift cards y otros productos" }
  ],
  PRODUCTS: [
    { id: "robux", name: "Robux", category: "gaming", platform: "robux", discover: ["gaming"], tag: "Gaming",
      description: "Robux para tu cuenta de Roblox. Paquetes y precios confirmados por chat.",
      features: ["Entrega estimada de 3 a 5 días", "Pago con métodos locales", "Pedido por WhatsApp o Telegram"],
      status: "tbd", order: 1, cta: "Consultar Robux" },
    { id: "suscripciones", name: "Suscripciones", category: "suscripciones", platform: "suscripciones", discover: ["suscripciones", "entretenimiento"], tag: "Planes",
      description: "Planes de plataformas digitales de streaming y música.",
      features: ["Plataformas por confirmar", "Planes de 1, 3 y 12 meses", "Recordatorio de renovación"],
      status: "tbd", order: 2, cta: "Consultar suscripciones" },
    { id: "giftcards", name: "Gift cards", category: "digital", platform: "gift-cards", discover: ["digital", "entretenimiento"], tag: "Digital",
      description: "Tarjetas de regalo digitales para tiendas y servicios.",
      features: ["Servicios por confirmar", "Varios montos"],
      status: "soon", order: 3, cta: "Preguntar por gift cards" },
    { id: "juegos", name: "Juegos", category: "gaming", platform: "juegos", discover: ["gaming", "entretenimiento"], tag: "Gaming",
      description: "Juegos digitales. Catálogo en preparación.",
      features: ["Títulos por confirmar", "Entrega digital"],
      status: "soon", order: 4, cta: "Preguntar por juegos" },
    { id: "otros-digital", name: "Otros productos digitales", category: "digital", discover: ["digital"], tag: "Digital",
      description: "Contenido y servicios digitales. ¿Buscas algo específico? Pregúntanos.",
      features: ["Catálogo abierto", "Atención directa"],
      status: "tbd", order: 5, cta: "Preguntar" },
    { id: "nuevas", name: "Nuevas categorías", category: "proximamente", discover: [], tag: "Pronto",
      description: "NEXO está creciendo. Aquí aparecerán los productos nuevos.",
      features: ["En preparación"],
      status: "soon", order: 6, cta: "Preguntar" }
  ],

  /* ---------- 11. PLATFORMS ----------
     Cada clave genera su apartado (robux.html, suscripciones.html, gift-cards.html, juegos.html).
     packages[].price -> número en moneda BASE o null.  example:true -> se marca como "Ejemplo".
     comparison.official / comparison.nexo -> números en moneda BASE o null ("Por confirmar").
     icon: gamepad | tv | gift | joystick */
  PLATFORMS: {
    robux: {
      name: "Robux", page: "robux.html", icon: "gamepad", eyebrow: "Gaming · Roblox", status: "tbd",
      title: "Robux para tu cuenta, sin complicaciones",
      intro: "Elige tu paquete, paga con el método local que prefieras y recibe tus Robux con seguimiento por chat.",
      highlights: ["Entrega estimada de 3 a 5 días", "Sin tarjeta internacional", "Nunca pedimos tu contraseña"],
      packages: [
        { name: "400 Robux", price: 99, example: true },
        { name: "800 Robux", price: 189, example: true, popular: true },
        { name: "1,700 Robux", price: 379, example: true },
        { name: "4,500 Robux", price: 949, example: true }
      ],
      comparison: {
        reference: "[PLACEHOLDER: paquete de referencia, p. ej. 800 Robux]",
        official: null, nexo: null,
        note: "El precio oficial cambia según la tienda, la región y el método de pago. Lo verificamos contigo antes de cobrar."
      },
      perks: [
        "Paga con Nu, Mercado Pago o Spin by OXXO",
        "No necesitas tarjeta de crédito internacional",
        "Seguimiento de tu pedido por chat",
        "Atención personalizada de principio a fin"
      ],
      faq: [
        { icon: "package",  q: "¿Qué recibo?", a: "Robux acreditados en tu cuenta de Roblox por la cantidad del paquete que elijas. [PLACEHOLDER: describe el método exacto de entrega, p. ej. pase de juego o grupo]." },
        { icon: "truck",    q: "¿Cómo se entrega?", a: "Cuando confirmamos tu pago procesamos la entrega y te avisamos por el mismo chat. Tiempo estimado: 3 a 5 días. Es un estimado, no una garantía." },
        { icon: "calendar", q: "¿Cuánto dura mi paquete?", a: "Los Robux quedan en el saldo de tu cuenta hasta que los uses, de acuerdo con las reglas de Roblox." },
        { icon: "user",     q: "¿Qué necesito proporcionar?", a: "Tu nombre de usuario de Roblox y el comprobante de pago. Nunca te pediremos tu contraseña." },
        { icon: "shield",   q: "¿Tiene garantía?", a: "Sí. Si el pedido no llega en el plazo estimado o llega incompleto, lo reponemos o te devolvemos tu dinero según la Política de cambio y reembolso." },
        { icon: "lifebuoy", q: "¿Qué sucede si tengo un problema?", a: "Escríbenos por WhatsApp o Telegram con tu comprobante y una captura. Un administrador revisa tu caso y te responde en [PLACEHOLDER: tiempo de respuesta]." }
      ]
    },

    suscripciones: {
      name: "Suscripciones", page: "suscripciones.html", icon: "tv", eyebrow: "Streaming · Música", status: "tbd",
      title: "Tus plataformas favoritas, en un solo lugar",
      intro: "Planes de streaming y música pagando en moneda local, con recordatorio antes de que venza tu plan.",
      highlights: ["Planes de 1, 3 y 12 meses", "Pago en moneda local", "Aviso antes del vencimiento"],
      packages: [
        { name: "Plan 1 mes · [PLACEHOLDER: plataforma]", price: 79, example: true },
        { name: "Plan 3 meses · [PLACEHOLDER: plataforma]", price: 219, example: true, popular: true },
        { name: "Plan 12 meses · [PLACEHOLDER: plataforma]", price: 799, example: true }
      ],
      comparison: {
        reference: "[PLACEHOLDER: plataforma y plan de referencia]",
        official: null, nexo: null,
        note: "Las características (anuncios, calidad, pantallas) dependen de la plataforma y del plan elegido."
      },
      perks: [
        "Planes sin anuncios (según plataforma y plan)",
        "Calidad HD o 4K según el plan",
        "Pago en moneda local, sin tarjeta internacional",
        "Te avisamos antes del vencimiento para renovar"
      ],
      faq: [
        { icon: "package",  q: "¿Qué recibo?", a: "Acceso a un plan de la plataforma elegida ([PLACEHOLDER: lista de plataformas]) durante el periodo contratado. Las características dependen del plan." },
        { icon: "truck",    q: "¿Cómo se entrega?", a: "Por chat. [PLACEHOLDER: explica si es activación en tu cuenta, perfil o código]. Te guiamos paso a paso." },
        { icon: "calendar", q: "¿Cuánto dura mi paquete?", a: "Lo que indique el paquete: 1, 3 o 12 meses, contados desde la activación. Te avisamos antes de que termine." },
        { icon: "user",     q: "¿Qué necesito proporcionar?", a: "El comprobante de pago y [PLACEHOLDER: el correo de tu cuenta, si aplica]. No compartas contraseñas por chat." },
        { icon: "shield",   q: "¿Tiene garantía?", a: "Sí, durante todo el periodo contratado. Si el servicio falla por causas atribuibles a NEXO, lo reponemos o reembolsamos la parte proporcional." },
        { icon: "lifebuoy", q: "¿Qué sucede si tengo un problema?", a: "Escríbenos con una captura del error. Lo revisamos y te damos solución o reposición en [PLACEHOLDER: tiempo de respuesta]." }
      ]
    },

    "gift-cards": {
      name: "Gift cards", page: "gift-cards.html", icon: "gift", eyebrow: "Tarjetas de regalo", status: "soon",
      title: "Códigos digitales para regalar o regalarte",
      intro: "Tarjetas de regalo de tiendas y servicios digitales, entregadas como código por chat.",
      highlights: ["Código digital", "Varios montos", "Verificamos la región contigo"],
      packages: [
        { name: "Gift card · monto 1 [PLACEHOLDER]", price: 210, example: true },
        { name: "Gift card · monto 2 [PLACEHOLDER]", price: 420, example: true, popular: true },
        { name: "Gift card · monto 3 [PLACEHOLDER]", price: 1050, example: true }
      ],
      comparison: {
        reference: "[PLACEHOLDER: tienda y monto de referencia]",
        official: null, nexo: null,
        note: "El valor del código es el del emisor. El precio en NEXO incluye el servicio de compra y entrega."
      },
      perks: [
        "Entrega digital del código por chat",
        "Varias denominaciones disponibles",
        "Ideal para regalar, sin envíos físicos",
        "Revisamos contigo la región antes de comprar"
      ],
      faq: [
        { icon: "package",  q: "¿Qué recibo?", a: "Un código digital de la tienda o servicio elegido por el monto seleccionado." },
        { icon: "truck",    q: "¿Cómo se entrega?", a: "Te enviamos el código por chat (o al correo que indiques) en cuanto confirmamos tu pago." },
        { icon: "calendar", q: "¿Cuánto dura mi paquete?", a: "La vigencia depende del emisor de la tarjeta. Te la indicamos al entregarte el código." },
        { icon: "user",     q: "¿Qué necesito proporcionar?", a: "La tienda o servicio, la región de tu cuenta y el monto. Un código de otra región puede no funcionar." },
        { icon: "shield",   q: "¿Tiene garantía?", a: "Entregamos códigos nuevos y sin usar. Si no funciona en el primer canje, repórtalo en [PLACEHOLDER: 24 horas] con captura y lo revisamos para reponerlo." },
        { icon: "lifebuoy", q: "¿Qué sucede si tengo un problema?", a: "Envíanos una captura del mensaje de error y tu comprobante. Un administrador te responde en [PLACEHOLDER: tiempo de respuesta]." }
      ]
    },

    juegos: {
      name: "Juegos", page: "juegos.html", icon: "joystick", eyebrow: "Juegos digitales", status: "soon",
      title: "Juegos digitales, listos para jugar",
      intro: "Títulos digitales para tus plataformas favoritas. Catálogo en preparación: pregúntanos por el que buscas.",
      highlights: ["Entrega digital", "Te ayudamos a canjear", "Pago local"],
      packages: [
        { name: "[PLACEHOLDER: título 1]", price: null },
        { name: "[PLACEHOLDER: título 2]", price: null }
      ],
      comparison: {
        reference: "[PLACEHOLDER: juego de referencia]",
        official: null, nexo: null,
        note: "Precios por confirmar según título, plataforma y región."
      },
      perks: [
        "Entrega digital, sin envíos",
        "Te ayudamos a canjear el código paso a paso",
        "Pago con métodos locales",
        "Asesoría para elegir el título y la región correctos"
      ],
      faq: [
        { icon: "package",  q: "¿Qué recibo?", a: "Un código o licencia digital del juego para la plataforma indicada. [PLACEHOLDER: precisa el formato]." },
        { icon: "truck",    q: "¿Cómo se entrega?", a: "Por chat o correo, en cuanto confirmamos el pago. Te acompañamos en el canje." },
        { icon: "calendar", q: "¿Cuánto dura mi paquete?", a: "Una licencia de juego es permanente en tu cuenta, salvo que la plataforma indique otra cosa." },
        { icon: "user",     q: "¿Qué necesito proporcionar?", a: "La plataforma (PC o consola), la región de tu cuenta y el comprobante de pago." },
        { icon: "shield",   q: "¿Tiene garantía?", a: "Sí: si el código no funciona en el primer canje, lo revisamos y lo reponemos según la Política de cambio y reembolso." },
        { icon: "lifebuoy", q: "¿Qué sucede si tengo un problema?", a: "Escríbenos con una captura del error. Te respondemos en [PLACEHOLDER: tiempo de respuesta]." }
      ]
    }
  },

  /* ---------- 12. LEGAL ----------
     Borradores en español. Complétalos y, de preferencia, haz que los revise un profesional legal.
     Cada sección: { h: "Título", p: ["párrafo", ...], list: ["viñeta", ...] (opcional) } */
  LEGAL: {
    privacy: {
      title: "Política de privacidad",
      updated: "[PLACEHOLDER: fecha de última actualización]",
      intro: "En NEXO respetamos tu privacidad. Esta política explica qué datos personales tratamos, para qué los usamos y cómo puedes ejercer tus derechos.",
      sections: [
        { h: "1. Responsable del tratamiento", p: ["El responsable del tratamiento de tus datos personales es [PLACEHOLDER: nombre completo o razón social], con domicilio en [PLACEHOLDER: domicilio] y correo de contacto contacto@tudominio.com."] },
        { h: "2. Datos que recabamos", p: ["Solo pedimos los datos necesarios para atender tu pedido:"],
          list: ["Datos de contacto: nombre, número de WhatsApp, usuario de Telegram y/o correo electrónico.",
                 "Datos de la compra: producto, monto, fecha y comprobante de pago.",
                 "Datos para la entrega: por ejemplo, tu nombre de usuario en la plataforma correspondiente o la región de tu cuenta.",
                 "Mensajes que nos envías por chat, correo o el formulario de contacto."] },
        { h: "3. Datos que NO pedimos", p: ["No solicitamos contraseñas de tus cuentas ni datos completos de tarjetas bancarias. [PLACEHOLDER: si algún servicio requiere un dato de acceso, descríbelo aquí y explica cómo se protege]."] },
        { h: "4. Finalidades", p: ["Usamos tus datos para: procesar y entregar tu pedido, validar pagos, darte soporte y atender garantías o reembolsos, y cumplir obligaciones legales. De forma secundaria, y solo si lo aceptas, para avisarte de promociones; puedes negarte en cualquier momento escribiéndonos."] },
        { h: "5. Con quién compartimos tus datos", p: ["No vendemos ni rentamos tus datos. Solo se comparten en la medida necesaria con:"],
          list: ["Servicios de mensajería que usas para contactarnos (WhatsApp / Meta, Telegram).",
                 "Plataformas de pago con las que pagas (Nu, Mercado Pago, Spin by OXXO u otras).",
                 "[PLACEHOLDER: proveedor del formulario de contacto o de correo, si aplica].",
                 "Autoridades competentes, cuando la ley lo exija."] },
        { h: "6. Conservación", p: ["Conservamos tus datos durante [PLACEHOLDER: plazo, p. ej. 12 meses] después de tu última compra, o el tiempo que exija la ley. Después los eliminamos o anonimizamos."] },
        { h: "7. Tus derechos", p: ["Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso, así como revocar tu consentimiento. Escríbenos a contacto@tudominio.com indicando tu nombre, el derecho que quieres ejercer y un medio para responderte. Te contestaremos en un plazo máximo de [PLACEHOLDER: 20 días hábiles]. Este aviso se emite conforme a la legislación de protección de datos aplicable en [PLACEHOLDER: país]."] },
        { h: "8. Menores de edad", p: ["Si eres menor de edad, necesitas la autorización de tu madre, padre o tutor para comprar y compartir tus datos con nosotros."] },
        { h: "9. Almacenamiento local y cookies", p: ["Este sitio no usa cookies publicitarias. Guardamos en tu navegador (localStorage) únicamente tu moneda preferida. [PLACEHOLDER: si agregas analítica, menciónala aquí]."] },
        { h: "10. Seguridad", p: ["El sitio se sirve mediante HTTPS y aplicamos medidas razonables para proteger tu información. Ningún sistema es 100 % infalible, pero actuaremos con rapidez ante cualquier incidente."] },
        { h: "11. Cambios a esta política", p: ["Podemos actualizar esta política. Publicaremos la nueva versión en esta página con su fecha de actualización."] }
      ]
    },

    terms: {
      title: "Términos y condiciones",
      updated: "[PLACEHOLDER: fecha de última actualización]",
      intro: "Estos términos regulan el uso del sitio y la compra de productos y servicios digitales en NEXO. Al comprar, aceptas estos términos.",
      sections: [
        { h: "1. Quiénes somos", p: ["NEXO es una tienda independiente operada por [PLACEHOLDER: nombre o razón social]. No está afiliada, patrocinada ni respaldada por Roblox ni por las demás plataformas mencionadas. Las marcas pertenecen a sus respectivos dueños."] },
        { h: "2. Productos y disponibilidad", p: ["La información de cada producto (contenido, tiempos y disponibilidad) se muestra en su apartado. La disponibilidad final se confirma por chat antes de pagar."] },
        { h: "3. Precios y moneda", p: ["Los precios se fijan en [PLACEHOLDER: moneda base, p. ej. MXN]. Las conversiones a otras monedas son referenciales y pueden variar. El precio final es el que te confirmamos por chat antes de que pagues."] },
        { h: "4. Proceso de compra", p: ["1) Eliges el producto, 2) nos contactas por WhatsApp o Telegram, 3) realizas el pago, 4) envías tu comprobante y 5) recibes tu producto una vez validado el pago."] },
        { h: "5. Pagos", p: ["Aceptamos los métodos publicados en la sección de pagos. No procesamos tarjetas en esta web. El pedido se procesa solo cuando el pago está acreditado."] },
        { h: "6. Entrega", p: ["Los tiempos de entrega son estimados y dependen del producto y de que los datos que nos des sean correctos. Si hay un retraso, te avisaremos por el mismo chat."] },
        { h: "7. Responsabilidades del cliente", list: ["Dar datos correctos y completos para la entrega.", "Cumplir los términos de uso de cada plataforma.", "Ser mayor de edad o contar con autorización de tu madre, padre o tutor.", "No usar los productos para fines ilícitos."] },
        { h: "8. Plataformas de terceros", p: ["Los productos se usan dentro de plataformas de terceros que tienen sus propias reglas. NEXO no controla esas plataformas ni responde por cambios en sus políticas, precios o servicios ajenos a nuestra gestión."] },
        { h: "9. Garantías, cambios y reembolsos", p: ["Se rigen por nuestra Política de cambio y reembolso, que forma parte de estos términos."] },
        { h: "10. Fraude y contracargos", p: ["Podemos cancelar pedidos con indicios de fraude. Iniciar un contracargo sin haber contactado antes a soporte puede suspender la atención mientras se resuelve el caso."] },
        { h: "11. Limitación de responsabilidad", p: ["Nuestra responsabilidad se limita al monto pagado por el pedido de que se trate, sin perjuicio de los derechos que la ley te reconoce como consumidor."] },
        { h: "12. Cambios a los términos", p: ["Podemos actualizar estos términos. La versión vigente es la publicada en esta página al momento de tu compra."] },
        { h: "13. Ley aplicable", p: ["Estos términos se rigen por las leyes de [PLACEHOLDER: país]. Cualquier controversia se someterá a [PLACEHOLDER: tribunales o autoridad de protección al consumidor competente]."] }
      ]
    },

    refunds: {
      title: "Política de cambio y reembolso",
      updated: "[PLACEHOLDER: fecha de última actualización]",
      intro: "Los productos digitales son especiales: una vez entregados, normalmente no pueden devolverse. Por eso explicamos con claridad cuándo hay reposición o reembolso.",
      sections: [
        { h: "1. Cuándo procede un reembolso o reposición", list: [
            "El pedido no se entregó en el plazo estimado más [PLACEHOLDER: X días hábiles] de tolerancia.",
            "Recibiste un producto distinto o incompleto respecto a lo confirmado por chat.",
            "El código o servicio no funciona por causas atribuibles a NEXO.",
            "Pagaste dos veces el mismo pedido por error."] },
        { h: "2. Cuándo no procede", list: [
            "Los datos que diste para la entrega eran incorrectos (usuario, región, correo).",
            "El producto ya fue entregado y canjeado o utilizado correctamente.",
            "Cambio de opinión después de la entrega.",
            "Suspensión de tu cuenta por incumplir las reglas de la plataforma."] },
        { h: "3. Garantía por tipo de producto", list: [
            "Robux: reposición o reembolso si no llegan en el plazo estimado más la tolerancia indicada.",
            "Suscripciones: garantía durante el periodo contratado; reembolso proporcional si no podemos reponer.",
            "Gift cards y juegos: reposición si el código no funciona en el primer canje y se reporta en [PLACEHOLDER: 24 horas]."] },
        { h: "4. Cómo solicitarlo", p: ["Escríbenos por WhatsApp, Telegram o a contacto@tudominio.com dentro de [PLACEHOLDER: 48 horas] desde la entrega (o desde que venció el plazo estimado) con: comprobante de pago, producto, fecha y capturas del problema."] },
        { h: "5. Plazos", p: ["Respondemos en un máximo de [PLACEHOLDER: 2 días hábiles]. Si procede, el reembolso se hace por el mismo método de pago en un plazo de [PLACEHOLDER: 5 días hábiles] o, si lo prefieres, reponemos el producto."] },
        { h: "6. Cancelaciones antes de la entrega", p: ["Si aún no procesamos tu pedido, puedes cancelarlo y te devolvemos el total. Si ya está en proceso con el proveedor, te diremos si es posible cancelarlo."] },
        { h: "7. Tus derechos como consumidor", p: ["Esta política no limita los derechos que te otorga la legislación de protección al consumidor de [PLACEHOLDER: país]."] }
      ]
    }
  }
};
