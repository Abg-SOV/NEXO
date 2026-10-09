/* =====================================================================================
   NEXO · Selector y convertidor dinámico de moneda (MXN, USD, COP)
   -------------------------------------------------------------------------------------
   - Almacena la preferencia del usuario en localStorage ("nexo_currency")
   - Convierte los precios desde la moneda BASE definida en js/config.js
   - Formatea números según el locale de cada moneda (COP sin decimales, USD/MXN con 2)
   - Actualiza automáticamente todos los elementos con atributo data-price-base
   ===================================================================================== */
(function(){
  "use strict";

  var C = (window.NEXO && window.NEXO.CURRENCY) || {
    base: "MXN",
    default: "MXN",
    rates: { MXN: 1, USD: 0.054, COP: 225 },
    list: {
      MXN: { label: "Peso mexicano", locale: "es-MX", decimals: 2 },
      USD: { label: "Dólar estadounidense", locale: "en-US", decimals: 2 },
      COP: { label: "Peso colombiano", locale: "es-CO", decimals: 0 }
    }
  };

  var STORAGE_KEY = "nexo_currency";
  var current = C.default || "MXN";

  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && C.list[saved]) {
      current = saved;
    }
  } catch(e) {
    // localStorage no disponible o bloqueado en modo incógnito estricto
  }

  function getCurrency() {
    return current;
  }

  function convert(amountInBase, targetCur) {
    if (amountInBase == null || isNaN(amountInBase)) return null;
    var cur = targetCur || current;
    var baseRate = C.rates[C.base] || 1;
    var targetRate = C.rates[cur] || 1;
    return (amountInBase / baseRate) * targetRate;
  }

  function format(amountInBase, targetCur, options) {
    if (amountInBase == null || isNaN(amountInBase)) {
      return "Por confirmar";
    }
    var cur = targetCur || current;
    var meta = C.list[cur] || { locale: "es-MX", decimals: 2 };
    var converted = convert(amountInBase, cur);
    var opts = options || {};

    var formattedNumber;
    try {
      formattedNumber = new Intl.NumberFormat(meta.locale, {
        minimumFractionDigits: meta.decimals,
        maximumFractionDigits: meta.decimals
      }).format(converted);
    } catch(e) {
      formattedNumber = converted.toFixed(meta.decimals);
    }

    var symbol = "$";
    var res = symbol + formattedNumber + " " + cur;

    if (opts.prefix) {
      res = '<small>' + opts.prefix + '</small> ' + res;
    }
    if (opts.isExample && window.NEXO && window.NEXO.SHOW_EXAMPLE_PRICES) {
      res += ' <span class="tag-ex" title="Precio de referencia. Se confirma por chat.">Ejemplo</span>';
    }
    return res;
  }

  function formatText(amountInBase, targetCur) {
    if (amountInBase == null || isNaN(amountInBase)) {
      return "Por confirmar";
    }
    var cur = targetCur || current;
    var meta = C.list[cur] || { locale: "es-MX", decimals: 2 };
    var converted = convert(amountInBase, cur);
    var formattedNumber;
    try {
      formattedNumber = new Intl.NumberFormat(meta.locale, {
        minimumFractionDigits: meta.decimals,
        maximumFractionDigits: meta.decimals
      }).format(converted);
    } catch(e) {
      formattedNumber = converted.toFixed(meta.decimals);
    }
    return "$" + formattedNumber + " " + cur;
  }

  function updateDom() {
    // Actualiza botones del selector
    var buttons = document.querySelectorAll(".cur button[data-cur]");
    buttons.forEach(function(btn){
      var code = btn.getAttribute("data-cur");
      var isAct = code === current;
      btn.setAttribute("aria-pressed", isAct ? "true" : "false");
    });

    // Actualiza todos los precios marcados con data-price-base
    var priceEls = document.querySelectorAll("[data-price-base]");
    priceEls.forEach(function(el){
      var raw = el.getAttribute("data-price-base");
      var num = raw === "" || raw === "null" ? null : parseFloat(raw);
      var prefix = el.getAttribute("data-price-prefix") || "";
      var isEx = el.getAttribute("data-price-example") === "true";
      el.innerHTML = format(num, current, { prefix: prefix, isExample: isEx });
    });

    // Notifica a otros módulos
    window.dispatchEvent(new CustomEvent("nexo:currency-change", { detail: { currency: current } }));
  }

  function setCurrency(code) {
    if (!C.list[code]) return;
    current = code;
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch(e) {}
    updateDom();
  }

  // Delegación de clics en selectores de moneda
  document.addEventListener("click", function(e){
    var btn = e.target.closest && e.target.closest(".cur button[data-cur]");
    if (!btn) return;
    var target = btn.getAttribute("data-cur");
    if (target && target !== current) {
      setCurrency(target);
    }
  });

  // Exportar API
  window.NEXO_CURRENCY = {
    get: getCurrency,
    set: setCurrency,
    format: format,
    formatText: formatText,
    convert: convert,
    update: updateDom
  };

  // Inicialización al cargar el DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateDom);
  } else {
    updateDom();
  }

})();
