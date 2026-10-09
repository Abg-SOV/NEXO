/* =====================================================================================
   NEXO · Detección de dispositivo y capacidades
   -------------------------------------------------------------------------------------
   Detecta capacidades de hardware, pantalla, interacción y accesibilidad para:
     - Asignar clases en <html>: .fx-full / .fx-lite, .is-touch, .fx-refract
     - Actualizar variables CSS para brillo especular en navbar (--gx, --gy, --go),
       resplandor de cursor (--mx, --my) y parallax 3D (--px, --py).
     - Aplicar botón magnético solo en desktop con cursor fino.
   ===================================================================================== */
(function(){
  "use strict";

  var docEl = document.documentElement;
  var isTouch = matchMedia("(pointer: coarse)").matches || ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
  var finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reduceTrans = matchMedia("(prefers-reduced-transparency: reduce)").matches;

  // Detección de hardware de gama baja / alta
  var cores = navigator.hardwareConcurrency || 4;
  var memory = navigator.deviceMemory || 4; // GB aproximados en navegadores Chromium
  var isLowEnd = cores <= 2 || memory < 3;
  var isMobileWidth = window.innerWidth < 768;

  // Decisión de efectos visuales: .fx-full vs .fx-lite
  if (reduceMotion || isLowEnd || (isTouch && isMobileWidth)) {
    docEl.classList.add("fx-lite");
  } else {
    docEl.classList.add("fx-full");
  }

  if (isTouch) {
    docEl.classList.add("is-touch");
  }

  // Detección de soporte de SVG displacement map en backdrop-filter (Chromium desktop)
  var isChromium = !!window.chrome && !navigator.userAgent.match(/EdgA|CriOS/i);
  if (isChromium && !isTouch && !isLowEnd && !reduceTrans) {
    docEl.classList.add("fx-refract");
  }

  // Objeto global de capacidades para uso en otros scripts
  window.NEXO_DEVICE = {
    isTouch: isTouch,
    finePointer: finePointer,
    reduceMotion: reduceMotion,
    reduceTrans: reduceTrans,
    isLowEnd: isLowEnd,
    cores: cores,
    memory: memory
  };

  /* ----- Seguimiento del cursor / toque para Liquid Glass y Parallax ----- */
  var nav = null;
  var scene = null;
  var raf = 0;
  var magneticBtn = null;

  function updatePointers(clientX, clientY) {
    if (raf) return;
    raf = requestAnimationFrame(function(){
      raf = 0;
      // Resplandor del cursor general
      docEl.style.setProperty("--mx", clientX + "px");
      docEl.style.setProperty("--my", clientY + "px");

      // Brillo especular del navbar
      if (!nav) nav = document.getElementById("nav");
      if (nav) {
        var nr = nav.getBoundingClientRect();
        var gx = ((clientX - nr.left) / nr.width) * 100;
        var gy = ((clientY - nr.top) / nr.height) * 100;
        // Solo ilumina si el puntero está relativamente cerca del navbar
        var distY = clientY - (nr.top + nr.height / 2);
        var inRange = Math.abs(distY) < 180;
        nav.style.setProperty("--gx", gx.toFixed(1) + "%");
        nav.style.setProperty("--gy", gy.toFixed(1) + "%");
        nav.style.setProperty("--go", inRange ? "0.9" : "0.35");
      }

      // Parallax 3D en la esfera del hero
      if (!scene) scene = document.getElementById("scene");
      if (scene && !reduceMotion) {
        var px = (clientX / window.innerWidth - 0.5).toFixed(3);
        var py = (clientY / window.innerHeight - 0.5).toFixed(3);
        scene.style.setProperty("--px", px);
        scene.style.setProperty("--py", py);
      }
    });
  }

  // Interacción en Desktop (pointermove)
  if (finePointer && !reduceMotion) {
    window.addEventListener("pointermove", function(e) {
      updatePointers(e.clientX, e.clientY);

      // Efecto magnético sutil en botones
      var btn = e.target.closest && e.target.closest(".btn, .fab, .gbtn, .cur button");
      if (magneticBtn && magneticBtn !== btn) {
        magneticBtn.style.translate = "";
        magneticBtn = null;
      }
      if (btn && !isLowEnd) {
        var r = btn.getBoundingClientRect();
        var mx = ((e.clientX - r.left) / r.width - 0.5) * 8;
        var my = ((e.clientY - r.top) / r.height - 0.5) * 6;
        magneticBtn = btn;
        btn.style.translate = mx.toFixed(1) + "px " + my.toFixed(1) + "px";
      }
    }, { passive: true });

    document.addEventListener("pointerleave", function() {
      if (magneticBtn) {
        magneticBtn.style.translate = "";
        magneticBtn = null;
      }
      if (nav) nav.style.setProperty("--go", "0.4");
    });
  }

  // Interacción táctil en móvil: ilumina el navbar al tocar
  if (isTouch) {
    window.addEventListener("touchstart", function(e) {
      if (e.touches && e.touches[0]) {
        updatePointers(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    window.addEventListener("touchmove", function(e) {
      if (e.touches && e.touches[0]) {
        updatePointers(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  // Ajuste en cambio de orientación o redimensionado
  window.addEventListener("resize", function() {
    var newMobile = window.innerWidth < 768;
    if (newMobile !== isMobileWidth) {
      isMobileWidth = newMobile;
      if (isMobileWidth && isTouch) {
        docEl.classList.remove("fx-full");
        docEl.classList.add("fx-lite");
      } else if (!isLowEnd && !reduceMotion) {
        docEl.classList.remove("fx-lite");
        docEl.classList.add("fx-full");
      }
    }
  }, { passive: true });

})();
