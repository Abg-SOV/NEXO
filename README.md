# NEXO — Tienda Digital Oficial (Robux, Suscripciones, Gift Cards y Más)

Sitio web front-end moderno, mobile-first y 100 % estático (HTML5 semántico, CSS3 con design tokens y JavaScript modular vanilla).  
**No requiere Node.js, npm install, bases de datos ni frameworks pesados para ejecutarse o publicarse.**

---

## 🚀 Inicio Rápido

1. Puedes abrir `index.html` directamente en cualquier navegador moderno (Edge, Chrome, Safari, Firefox), o servirlo con cualquier servidor estático:
   ```bash
   # Opción Python:
   python -m http.server 8080
   # Opción Node:
   npx serve .
   ```
2. Para desplegar en producción:
   - **GitHub Pages:** Sube los archivos al repositorio, ve a `Settings → Pages`, elige rama `main` y carpeta `/ (root)`.
   - **Vercel / Netlify / Cloudflare Pages:** Conecta tu repositorio o arrastra la carpeta.
   - **Hosting tradicional (cPanel / Apache / Nginx):** Sube el contenido a `public_html`. Todo el sitio está protegido y preparado para HTTPS (sin contenido mixto).

---

## ⚙️ El Archivo Central de Configuración: `js/config.js`

**Todos los datos editables del sitio están centralizados en un único archivo:**  
[`js/config.js`](file:///C:/Users/pablo/Desktop/nexo/js/config.js)

No necesitas tocar el código HTML de cada página para cambiar enlaces, números o precios de referencia. Solo edita los valores en `window.NEXO`:

| Sección en `config.js` | Qué controla | Qué debes reemplazar |
|---|---|---|
| `SITE` | Nombre de la marca, frase principal, descripción SEO y URL base | Reemplaza `https://tudominio.com` cuando tengas tu dominio |
| `CONTACT` | Canales directos de atención y correo de contacto | Reemplaza `[PLACEHOLDER-WHATSAPP]` por tu número con código de país (ej. `52155...`), `[PLACEHOLDER-TELEGRAM]` por tu usuario sin `@`, y `contacto@tudominio.com` por tu correo real |
| `ADMINS` | Números y usuarios de los administradores encargados | Lista de admins con su nombre, rol, WhatsApp y Telegram |
| `REFERENCES` | Enlace al grupo de referencias y reseñas de clientes | URL del grupo (WhatsApp, Telegram o Discord) |
| `CURRENCY` | Selector dinámico de moneda (`MXN`, `USD`, `COP`), moneda base y tasas de cambio | Tasas de cambio de ejemplo editables (`rates: { MXN: 1, USD: 0.054, COP: 225 }`) |
| `PAYMENTS` | Métodos de pago disponibles y próximos | Nu, Mercado Pago, Spin by OXXO, Binance, etc. |
| `MESSAGES` | Mensajes prellenados automáticos para WhatsApp y Telegram | Mensajes automáticos por tipo de botón con variables dinámicas `{brand}`, `{product}`, `{package}`, `{price}`, `{admin}` |
| `TRUST_BADGES` | Insignias de confianza con íconos | "Entrega rápida", "Pago 100% seguro", "Atención personalizada", "Garantías" |
| `ABOUT` | Información institucional "Sobre NEXO" | Misión, qué hacemos, quiénes somos y por qué confiar |
| `PLATFORMS` | Configuración de cada apartado (Robux, Suscripciones, Gift Cards, Juegos) | Precios base, beneficios, comparación vs. oficial y 6 preguntas frecuentes obligatorias |
| `CATEGORIES` | Catálogo general de productos y Discover | Lista de tarjetas del catálogo, estados, etiquetas y enlaces |
| `LEGAL` | Datos de la empresa para páginas legales | Nombre de razón social o titular, correo de soporte y país |

---

## 🔍 Placeholders que debes completar antes de lanzar

En el proyecto se marcaron claramente todos los datos ficticios o pendientes con la etiqueta `[PLACEHOLDER]`. Busca en tu editor la palabra `PLACEHOLDER` para reemplazarlos con tus datos reales:

1. **Número de WhatsApp principal:**  
   En `js/config.js` → `CONTACT.whatsapp`: pon tu número con lada internacional, solo números (ej: `"5215512345678"`).
2. **Usuario de Telegram principal:**  
   En `js/config.js` → `CONTACT.telegram`: pon tu usuario sin `@` (ej: `"nexo_soporte"`).
3. **Correo empresarial:**  
   En `js/config.js` → `CONTACT.email`: ej. `"contacto@nexo.digital"`.
4. **Enlace al grupo de referencias:**  
   En `js/config.js` → `REFERENCES.url`: pega el enlace de invitación de tu canal de Telegram o grupo de WhatsApp.
5. **Administradores:**  
   En `js/config.js` → `ADMINS`: actualiza los números y nombres de tus admins.
6. **Ciudad y País:**  
   En `js/config.js` → `SITE.location` y `ABOUT.who`.
7. **Páginas legales (`privacidad.html`, `terminos.html`, `reembolsos.html`):**  
   Busca `[PLACEHOLDER]` en los encabezados para colocar el nombre o razón social y el correo de contacto legal.

---

## 🎨 Identidad Visual y Sistema de Diseño

El diseño fue reconstruido desde cero tomando como referencia directa el logo `assets/logonexo.png`:
- **Paleta de color:** Negro profundo (`#03040A`), azul marino (`#08113A`), azul eléctrico (`#1F4BFF`, `#0A2BD6`), cian suave para brillos especulares (`#7FD4FF`) y blanco para destellos.
- **Tipografía y Brand Lockup en Hero:** La letra **N** utiliza el logo oficial de NEXO con cinta angular, corte de cuchilla y estrella de 4 puntas. Las letras **E, X, O** fueron construidas en SVG vectorial afilado con inclinación armónica de -13°, relleno oscuro metálico, borde neón de luz eléctrica y línea afilada de cuchilla.
- **Navbar Flotante Liquid Glass:** Barra centrada en forma de píldora con `backdrop-filter`, refracción SVG fallback, brillo especular que sigue el cursor (`pointermove`), e indicador activo tipo "gota líquida" que se desliza y deforma orgánicamente entre enlaces.
- **Detección de dispositivo (`js/device.js`):** Detecta automáticamente pantallas táctiles (`pointer: coarse`), concurrencia de hardware, memoria del dispositivo y `prefers-reduced-motion`. En equipos móviles o de gama baja activa `.fx-lite` para garantizar 60 fps fluidos sin recargar el procesador.
- **Selector de moneda en vivo (`js/currency.js`):** Selector de divisas para **MXN, USD y COP**. Todos los precios con atributo `data-price-base` se convierten instantáneamente, la preferencia se persiste en `localStorage` y actualiza en tiempo real los mensajes prellenados de WhatsApp y Telegram.

---

## 💬 Mensajes Automáticos en WhatsApp y Telegram

Cumpliendo con el requerimiento principal, **cada botón de contacto escribe de forma automática el mensaje apropiado** según la acción que realiza el cliente:
- Al hacer clic en un paquete (ej. "800 Robux"):
  - WhatsApp: `"¡Hola NEXO! 🛒 Quiero el paquete *800 Robux* de *Robux* ($189.00 MXN). ¿Cómo continúo con el pago?"`
  - Telegram: `"¡Hola NEXO! 🛒 Quiero el paquete **800 Robux** de **Robux** ($189.00 MXN). ¿Cómo continúo con el pago?"`
  *(Si el usuario cambia la moneda a USD o COP, el precio dentro del mensaje de WhatsApp/Telegram se actualiza automáticamente al valor y moneda activa).*
- Al consultar por un producto general o categoría: pregunta por precio y disponibilidad de dicho producto.
- Al contactar soporte o administrador: saluda al administrador específico y solicita asesoría.
- Al hacer clic en botones de contacto aparece una notificación toast de confirmación confirmando la apertura del chat.

---

## 📂 Estructura de Páginas

- [`index.html`](file:///C:/Users/pablo/Desktop/nexo/index.html): Portada principal, hero interactivo, insignias de confianza, apartados, catálogo dinámico, NEXO Discover, pasos del proceso, métodos de pago, referencias, Sobre NEXO, formulario de contacto y pie de página.
- [`robux.html`](file:///C:/Users/pablo/Desktop/nexo/robux.html): Apartado dedicado a Robux (Roblox) con paquetes, comparativa de precios oficial vs. NEXO y las 6 preguntas frecuentes.
- [`suscripciones.html`](file:///C:/Users/pablo/Desktop/nexo/suscripciones.html): Apartado de suscripciones y streaming con planes por duración y comparativa.
- [`gift-cards.html`](file:///C:/Users/pablo/Desktop/nexo/gift-cards.html): Apartado de tarjetas de regalo digitales.
- [`juegos.html`](file:///C:/Users/pablo/Desktop/nexo/juegos.html): Apartado de juegos digitales y pedidos personalizados.
- [`contacto.html`](file:///C:/Users/pablo/Desktop/nexo/contacto.html): Centro de atención con canales oficiales, lista de administradores, acceso al grupo de referencias y formulario web.
- [`privacidad.html`](file:///C:/Users/pablo/Desktop/nexo/privacidad.html): Política de privacidad completa y profesional en español.
- [`terminos.html`](file:///C:/Users/pablo/Desktop/nexo/terminos.html): Términos y condiciones del servicio en español.
- [`reembolsos.html`](file:///C:/Users/pablo/Desktop/nexo/reembolsos.html): Política de cambios, garantías y reembolsos en español.

---

## 🔒 Seguridad y Buenas Prácticas

- **HTTPS sin contenido mixto:** Todos los scripts, fuentes y assets cargan mediante rutas relativas o seguras (`https://`).
- **Sello visual de seguridad:** Insignia de conexión cifrada SSL / HTTPS en el pie de página de todas las vistas.
- **Privacidad de datos de pago:** La web nunca solicita ni almacena datos de tarjetas bancarias. Los pagos se gestionan de forma segura por chat con plataformas oficiales reconocidas (Nu, Mercado Pago, Spin).
