const { spawn } = require("child_process");
const fs = require("fs");

const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  "--remote-debugging-port=9223",
  "--remote-allow-origins=*",
  "--user-data-dir=C:\\Users\\pablo\\AppData\\Local\\Temp\\chrome_debug",
  "file:///C:/Users/pablo/Desktop/nexo/index.html"
]);

setTimeout(async () => {
  try {
    const listRes = await fetch("http://127.0.0.1:9223/json/list");
    const targets = await listRes.json();
    const page = targets.find(t => t.type === "page");
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    ws.onopen = async () => {
      let id = 1;
      function send(m, p = {}) {
        return new Promise(r => {
          const i = id++;
          function onm(e) {
            const d = JSON.parse(e.data);
            if (d.id === i) {
              ws.removeEventListener("message", onm);
              r(d.result);
            }
          }
          ws.addEventListener("message", onm);
          ws.send(JSON.stringify({ id: i, method: m, params: p }));
        });
      }

      await send("Emulation.setDeviceMetricsOverride", {
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true
      });

      const res = await send("Runtime.evaluate", {
        expression: `JSON.stringify({
          nav: document.querySelector('#nav') ? document.querySelector('#nav').getBoundingClientRect() : null,
          navActions: document.querySelector('.nav-actions') ? document.querySelector('.nav-actions').getBoundingClientRect() : null,
          burger: document.querySelector('#burger') ? document.querySelector('#burger').getBoundingClientRect() : null,
          brand: document.querySelector('.brand') ? document.querySelector('.brand').getBoundingClientRect() : null,
          windowW: window.innerWidth
        })`,
        returnByValue: true
      });

      console.log("BOUNDS:", res.result.value);
      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error("ERROR:", err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
