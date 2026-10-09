const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const ARTIFACTS_DIR = "C:\\Users\\pablo\\.gemini\\antigravity\\brain\\0986fa34-60cc-44cd-b07d-3853a8cc0f7d";
const PORT = 8089;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(ROOT_DIR, ".chrome-test-profile");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".json": "application/json"
};

// 1. Static file HTTP server
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split("?")[0]);
      if (reqPath === "/") reqPath = "/index.html";
      const filePath = path.join(ROOT_DIR, reqPath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found: " + reqPath);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*"
      });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(PORT, "127.0.0.1", () => {
      console.log(`[HTTP] Servidor local listo en http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

// 2. Launch Chrome Headless
function launchChrome() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(USER_DATA)) {
      fs.mkdirSync(USER_DATA, { recursive: true });
    }

    const args = [
      "--headless=new",
      "--remote-debugging-port=9228",
      "--remote-allow-origins=*",
      `--user-data-dir=${USER_DATA}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-sync",
      "--disable-translate",
      "--disable-gpu",
      "--mute-audio"
    ];

    console.log("[Chrome] Iniciando navegador headless en puerto 9228...");
    const chrome = spawn(CHROME_PATH, args, { stdio: "ignore" });

    // Poll for remote debugging port
    let attempts = 0;
    const check = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch("http://127.0.0.1:9228/json/version", { signal: AbortSignal.timeout(400) });
        if (res.ok) {
          clearInterval(check);
          const data = await res.json();
          console.log("[Chrome] CDP conectado:", data.Browser);
          resolve(chrome);
        }
      } catch (err) {
        if (attempts > 30) {
          clearInterval(check);
          chrome.kill();
          reject(new Error("Timeout esperando a Chrome CDP"));
        }
      }
    }, 250);
  });
}

// 3. CDP Client wrapper
class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 0;
    this.callbacks = new Map();
    this.consoleLogs = [];
    this.pageErrors = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        } else if (msg.method) {
          this.onEvent(msg.method, msg.params);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  onEvent(method, params) {
    if (method === "Runtime.consoleAPICalled") {
      const type = params.type;
      const text = (params.args || []).map(a => a.value || JSON.stringify(a)).join(" ");
      this.consoleLogs.push({ type, text });
      if (type === "error") {
        console.error(`  [Console Error] ${text}`);
      }
    } else if (method === "Runtime.exceptionThrown") {
      const desc = params.exceptionDetails.exception?.description || params.exceptionDetails.text;
      this.pageErrors.push(desc);
      console.error(`  [Runtime Exception] ${desc}`);
    }
  }

  async eval(expr) {
    const res = await this.send("Runtime.evaluate", {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  }

  async navigate(url) {
    this.consoleLogs = [];
    this.pageErrors = [];
    await this.send("Page.navigate", { url });
    // Wait for loadEventFired
    return new Promise((resolve) => {
      const timeout = setTimeout(resolve, 3000);
      const listener = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === "Page.loadEventFired") {
          clearTimeout(timeout);
          this.ws.removeEventListener("message", listener);
          setTimeout(resolve, 300); // Small grace period for DOM scripts
        }
      };
      this.ws.addEventListener("message", listener);
    });
  }

  async setViewport(width, height, isMobile = false) {
    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile
    });
  }

  async captureScreenshot(outputPath, fullPage = false) {
    const res = await this.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: fullPage
    });
    const buf = Buffer.from(res.data, "base64");
    fs.writeFileSync(outputPath, buf);
    console.log(`  [Screenshot] Guardado en ${outputPath} (${buf.length} bytes)`);
  }
}

async function run() {
  let server = null;
  let chrome = null;

  try {
    server = await startServer();
    chrome = await launchChrome();

    // Create target or get existing page
    const listRes = await fetch("http://127.0.0.1:9228/json/list");
    const targets = await listRes.json();
    let pageTarget = targets.find(t => t.type === "page");
    if (!pageTarget) {
      const newRes = await fetch("http://127.0.0.1:9228/json/new", { method: "PUT" });
      pageTarget = await newRes.json();
    }

    const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");

    console.log("\n=======================================================");
    console.log("  INICIANDO VERIFICACIÓN AUTOMATIZADA DE PÁGINAS");
    console.log("=======================================================\n");

    const pages = [
      "index.html",
      "robux.html",
      "suscripciones.html",
      "gift-cards.html",
      "juegos.html",
      "contacto.html",
      "privacidad.html",
      "terminos.html",
      "reembolsos.html"
    ];

    let totalErrors = 0;

    for (const page of pages) {
      console.log(`--> Verificando ${page}...`);
      await cdp.setViewport(1440, 900, false);
      await cdp.navigate(`http://127.0.0.1:${PORT}/${page}`);

      const title = await cdp.eval("document.title");
      const hasNav = await cdp.eval("!!document.querySelector('#nav')");
      const hasCurrency = await cdp.eval("!!window.NEXO_CURRENCY");
      const errors = cdp.pageErrors;
      const consoleErrors = cdp.consoleLogs.filter(l => l.type === "error");

      console.log(`    Título: "${title}"`);
      console.log(`    Nav detectado: ${hasNav} | Currency cargado: ${hasCurrency}`);

      if (errors.length > 0 || consoleErrors.length > 0) {
        console.error(`    ❌ ERRORES DETECTADOS EN ${page}:`, errors, consoleErrors);
        totalErrors += errors.length + consoleErrors.length;
      } else {
        console.log(`    ✅ 0 errores de consola en ${page}`);
      }
    }

    console.log("\n=======================================================");
    console.log("  TEST DE CONVERSIÓN DE MONEDA Y ENLACES DINÁMICOS");
    console.log("=======================================================\n");

    // Test in robux.html
    await cdp.navigate(`http://127.0.0.1:${PORT}/robux.html`);

    // Initial MXN check
    const mxnInitialPrice = await cdp.eval("document.querySelector('[data-price-base=\"189\"]').textContent");
    const waLinkMXN = await cdp.eval("document.querySelector('a[data-wa-var-package=\"800 Robux\"]').href");
    console.log(`  MXN Inicial (800 Robux): "${mxnInitialPrice.trim()}"`);
    console.log(`  Enlace WhatsApp (MXN): ${decodeURIComponent(waLinkMXN)}`);

    // Switch to USD
    await cdp.eval("window.NEXO_CURRENCY.set('USD')");
    const usdPrice = await cdp.eval("document.querySelector('[data-price-base=\"189\"]').textContent");
    const waLinkUSD = await cdp.eval("document.querySelector('a[data-wa-var-package=\"800 Robux\"]').href");
    console.log(`  USD Convertido (800 Robux): "${usdPrice.trim()}"`);
    console.log(`  Enlace WhatsApp (USD): ${decodeURIComponent(waLinkUSD)}`);

    // Switch to COP
    await cdp.eval("window.NEXO_CURRENCY.set('COP')");
    const copPrice = await cdp.eval("document.querySelector('[data-price-base=\"189\"]').textContent");
    const tgLinkCOP = await cdp.eval("document.querySelector('a[data-tg-var-package=\"800 Robux\"]').href");
    console.log(`  COP Convertido (800 Robux): "${copPrice.trim()}"`);
    console.log(`  Enlace Telegram (COP): ${decodeURIComponent(tgLinkCOP)}`);

    // Reset back to MXN
    await cdp.eval("window.NEXO_CURRENCY.set('MXN')");

    console.log("\n=======================================================");
    console.log("  CAPTURANDO CAPTURAS VISUALES (DESKTOP & MOBILE)");
    console.log("=======================================================\n");

    // 1. Index Desktop (1440x900)
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(`http://127.0.0.1:${PORT}/index.html`);
    await new Promise(r => setTimeout(r, 600)); // Allow animations & SVG glow to settle
    await cdp.captureScreenshot(path.join(ARTIFACTS_DIR, "index_desktop.png"));

    // 2. Index Mobile (390x844 - iPhone 14 / modern smartphone)
    await cdp.setViewport(390, 844, true);
    await cdp.navigate(`http://127.0.0.1:${PORT}/index.html`);
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureScreenshot(path.join(ARTIFACTS_DIR, "index_mobile.png"));

    // 3. Robux Desktop (1440x900)
    await cdp.setViewport(1440, 900, false);
    await cdp.navigate(`http://127.0.0.1:${PORT}/robux.html`);
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureScreenshot(path.join(ARTIFACTS_DIR, "robux_desktop.png"));

    // 4. Robux Mobile (390x844)
    await cdp.setViewport(390, 844, true);
    await cdp.navigate(`http://127.0.0.1:${PORT}/robux.html`);
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureScreenshot(path.join(ARTIFACTS_DIR, "robux_mobile.png"));

    console.log(`\nVerificación finalizada con ${totalErrors} errores.`);
  } catch (err) {
    console.error("Fallo general en la verificación:", err);
  } finally {
    if (chrome) {
      console.log("[Chrome] Cerrando navegador...");
      chrome.kill();
    }
    if (server) {
      console.log("[HTTP] Deteniendo servidor...");
      server.close();
    }
    // Clean up profile dir
    try {
      if (fs.existsSync(USER_DATA)) {
        fs.rmSync(USER_DATA, { recursive: true, force: true });
      }
    } catch(e) {}
    process.exit(0);
  }
}

run();
