/* =====================================================================================
   NEXO · Lógica principal de la aplicación
   -------------------------------------------------------------------------------------
   Módulos:
     1. Mensajería automática WhatsApp / Telegram con reemplazo de variables
     2. Navbar flotante con liquid glass e indicador de gota líquida
     3. Catálogo dinámico y NEXO Discover con soporte multimoneda
     4. Grupo de referencias, soporte y administradores
     5. Formulario de contacto con validación y fallback a mailto
     6. Toast, ripple, scroll progress, reveal on scroll
     7. Marcador visual para [PLACEHOLDER...]
   ===================================================================================== */
(function(){
  "use strict";

  var N = window.NEXO || {};
  var C = N.CONFIG || N;
  var CUR = window.NEXO_CURRENCY;
  var DEV = window.NEXO_DEVICE || {};

  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s){
    var d = document.createElement("div");
    d.textContent = s == null ? "" : s;
    return d.innerHTML;
  }

  // Resalta [PLACEHOLDER...] en el HTML para fácil identificación
  function markPlaceholders(htmlString){
    if (typeof htmlString !== "string") return htmlString;
    return htmlString.replace(/\[PLACEHOLDER[^\]]*\]/g, function(match){
      return '<span class="ph">' + esc(match) + '</span>';
    });
  }

  /* ==========================================================================
     1. MENSAJERÍA AUTOMÁTICA WHATSAPP & TELEGRAM
     ========================================================================== */
  function fillTemplate(tpl, vars){
    return String(tpl || "").replace(/\{(\w+)\}/g, function(m, k){
      return vars && vars[k] != null ? vars[k] : m;
    });
  }

  function getMessage(channel, key, vars){
    var channelMsgs = (N.MESSAGES && N.MESSAGES[channel]) || {};
    var template = channelMsgs[key] || channelMsgs.general || "Hola {brand}";
    var context = {
      brand: (N.SITE && N.SITE.name) || "NEXO",
      product: "",
      package: "",
      price: "",
      topic: "",
      admin: ""
    };
    if (vars) {
      for (var k in vars) {
        if (Object.prototype.hasOwnProperty.call(vars, k)) {
          context[k] = vars[k];
        }
      }
    }
    return fillTemplate(template, context);
  }

  function waLink(key, vars, customNumber){
    var num = customNumber || (N.CONTACT && N.CONTACT.whatsapp) || "";
    // Limpieza de caracteres no numéricos excepto si es placeholder
    var cleanNum = /PLACEHOLDER/i.test(num) ? num : num.replace(/\D/g, "");
    var text = getMessage("whatsapp", key || "general", vars);
    return "https://wa.me/" + encodeURIComponent(cleanNum) + "?text=" + encodeURIComponent(text);
  }

  function tgLink(key, vars, customUser){
    var user = customUser || (N.CONTACT && N.CONTACT.telegram) || "";
    var cleanUser = user.replace(/^@/, "");
    var text = getMessage("telegram", key || "general", vars);
    return "https://t.me/" + encodeURIComponent(cleanUser) + "?text=" + encodeURIComponent(text);
  }

  function icon(id){
    return '<svg class="ico" aria-hidden="true"><use href="#i-' + id + '"/></svg>';
  }

  function duoButtons(key, vars, label, customWa, customTg){
    var wHref = waLink(key, vars, customWa);
    var tHref = tgLink(key, vars, customTg);
    var lbl = label || "Consultar";
    var v = vars || {};
    var waData = ' data-wa="' + esc(key) + '"';
    var tgData = ' data-tg="' + esc(key) + '"';
    for (var k in v) {
      if (Object.prototype.hasOwnProperty.call(v, k)) {
        waData += ' data-wa-var-' + esc(k) + '="' + esc(v[k]) + '"';
        tgData += ' data-tg-var-' + esc(k) + '="' + esc(v[k]) + '"';
      }
    }
    if (customWa) waData += ' data-wa-num="' + esc(customWa) + '"';
    if (customTg) tgData += ' data-tg-user="' + esc(customTg) + '"';

    return '<div class="duo">' +
      '<a class="btn wa sm"' + waData + ' href="' + esc(wHref) + '" target="_blank" rel="noopener" aria-label="' + esc(lbl) + ' por WhatsApp">' +
        icon("wa") + '<span>WhatsApp</span>' +
      '</a>' +
      '<a class="btn tg sm"' + tgData + ' href="' + esc(tHref) + '" target="_blank" rel="noopener" aria-label="' + esc(lbl) + ' por Telegram">' +
        icon("tg") + '<span>Telegram</span>' +
      '</a>' +
    '</div>';
  }

  // Exponer generadores de enlace para scripts de páginas específicas
  window.NEXO_LINKS = {
    wa: waLink,
    tg: tgLink,
    duo: duoButtons,
    icon: icon
  };

  /* ==========================================================================
     2. NAVBAR FLOTANTE CON LIQUID GLASS E INDICADOR DE GOTA LÍQUIDA
     ========================================================================== */
  var nav = $("#nav");
  var navLinks = $$(".nav-links a");
  var drop = $(".drop", nav);
  var activeLink = null;
  var isMoving = false;
  var moveTimer = 0;

  function moveDropTo(targetA, animate){
    if (!drop || !targetA) {
      if (drop) drop.classList.remove("on");
      activeLink = null;
      return;
    }
    var parent = targetA.parentElement;
    var pr = parent.getBoundingClientRect();
    var tr = targetA.getBoundingClientRect();

    var left = tr.left - pr.left;
    var right = pr.right - tr.right;

    if (activeLink && activeLink !== targetA && animate) {
      var movingRight = tr.left > activeLink.getBoundingClientRect().left;
      drop.classList.remove("to-right", "to-left");
      drop.classList.add(movingRight ? "to-right" : "to-left", "moving");
      clearTimeout(moveTimer);
      moveTimer = setTimeout(function(){
        drop.classList.remove("moving");
      }, 500);
    }

    drop.style.setProperty("--l", left + "px");
    drop.style.setProperty("--r", right + "px");
    drop.classList.add("on");

    navLinks.forEach(function(a){
      if (a === targetA) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
    activeLink = targetA;
  }

  // Interacción con clics en enlaces del navbar
  navLinks.forEach(function(a){
    a.addEventListener("click", function(){
      moveDropTo(a, true);
    });
  });

  // Detección de sección activa con IntersectionObserver
  var sections = $$("main section[id]");
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          var id = entry.target.id;
          var match = navLinks.filter(function(a){
            var href = a.getAttribute("href") || "";
            return href === "#" + id || href.indexOf("#" + id) > -1;
          })[0];
          if (match) moveDropTo(match, true);
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach(function(sec){ obs.observe(sec); });
  }

  // Inicializa la gota líquida en el primer link activo o según hash
  function initDrop(){
    if (!drop || !navLinks.length) return;
    var hash = window.location.hash;
    var initial = null;
    if (hash) {
      initial = navLinks.filter(function(a){ return a.getAttribute("href") === hash; })[0];
    }
    if (!initial) {
      initial = navLinks.filter(function(a){ return a.getAttribute("aria-current"); })[0] || navLinks[0];
    }
    if (initial) {
      setTimeout(function(){ moveDropTo(initial, false); }, 100);
    }
  }
  window.addEventListener("load", initDrop);
  window.addEventListener("resize", function(){
    if (activeLink) moveDropTo(activeLink, false);
  });

  /* ==========================================================================
     3. MENÚ MÓVIL (PANEL LIQUID GLASS)
     ========================================================================== */
  var burger = $("#burger");
  var mnav = $("#mnav");
  var scrim = $("#scrim");

  function setMenu(open){
    if (!burger || !mnav) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mnav.classList.toggle("open", open);
    if (scrim) scrim.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burger) {
    burger.addEventListener("click", function(){
      var isOpen = burger.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });
  }
  if (scrim) {
    scrim.addEventListener("click", function(){ setMenu(false); });
  }
  if (mnav) {
    mnav.addEventListener("click", function(e){
      if (e.target.closest("a")) setMenu(false);
    });
  }
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && burger && burger.getAttribute("aria-expanded") === "true") {
      setMenu(false);
    }
  });

  /* ==========================================================================
     4. SCROLL PROGRESS & NAVBAR COMPACTO
     ========================================================================== */
  var progressBar = $("#progress");
  var fabs = $("#fabs");
  var footer = $("footer");
  var scrollRaf = 0;

  function onScroll(){
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(function(){
      scrollRaf = 0;
      var h = document.documentElement;
      var y = h.scrollTop || window.pageYOffset;
      var max = h.scrollHeight - h.clientHeight;

      if (progressBar) {
        progressBar.style.transform = "scaleX(" + (max > 0 ? (y / max).toFixed(4) : 0) + ")";
      }
      if (nav) {
        nav.classList.toggle("scrolled", y > 30);
      }

      // Oculta los FABs flotantes cuando se llega al footer para no tapar enlaces ni copyright
      if (fabs && footer) {
        var fr = footer.getBoundingClientRect();
        var nearBottom = fr.top < window.innerHeight - 80;
        fabs.classList.toggle("hide", nearBottom);
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ==========================================================================
     5. RENDERIZADO DEL CATÁLOGO & NEXO DISCOVER (index.html)
     ========================================================================== */
  var catalogGrid = $("#catalog");
  var tabsContainer = $("#tabs");
  var featuredGrid = $("#featured");
  var tilesContainer = $("#tiles");
  var discoverResults = $("#discover-results");

  var STATUS_LABELS = {
    available: "Disponible",
    soon: "Próximamente",
    tbd: "Precio por confirmar",
    unavailable: "No disponible"
  };

  function getPlatformMinPrice(platformId){
    if (!N.PLATFORMS || !N.PLATFORMS[platformId]) return null;
    var plat = N.PLATFORMS[platformId];
    if (!plat.packages || !plat.packages.length) return null;
    var prices = plat.packages
      .map(function(p){ return p.price; })
      .filter(function(pr){ return pr != null && !isNaN(pr); });
    if (!prices.length) return null;
    return Math.min.apply(null, prices);
  }

  function productCard(p, i){
    var st = p.status in STATUS_LABELS ? p.status : "tbd";
    var vis = p.image
      ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">'
      : icon(p.platform === "robux" ? "gamepad" : (p.platform === "suscripciones" ? "tv" : (p.platform === "gift-cards" ? "gift" : "joystick")));

    var platformLink = "";
    var minPrice = null;
    if (p.platform && N.PLATFORMS && N.PLATFORMS[p.platform]) {
      var plat = N.PLATFORMS[p.platform];
      platformLink = plat.page || (p.platform + ".html");
      minPrice = getPlatformMinPrice(p.platform);
    }

    var priceHtml = "";
    if (p.price != null) {
      priceHtml = '<span class="price" data-price-base="' + esc(p.price) + '" data-price-example="' + (p.example ? "true" : "false") + '">' +
        (CUR ? CUR.format(p.price, null, { isExample: p.example }) : "$" + esc(p.price)) +
      '</span>';
    } else if (minPrice != null) {
      priceHtml = '<span class="price" data-price-base="' + esc(minPrice) + '" data-price-prefix="Desde" data-price-example="true">' +
        (CUR ? CUR.format(minPrice, null, { prefix: "Desde", isExample: true }) : "Desde $" + minPrice) +
      '</span>';
    } else {
      priceHtml = '<span class="price"><small>Precio</small> ' + STATUS_LABELS[st] + '</span>';
    }

    var seeMore = platformLink
      ? '<a class="link" href="' + esc(platformLink) + '">Ver apartado ' + icon("arrow") + '</a>'
      : '';

    var ctaText = p.cta || "Consultar";

    return '<article class="card glass-lite" data-cat="' + esc(p.category) + '" style="--i:' + i + '">' +
      '<div class="visual" data-tag="' + esc(p.tag || "") + '">' + vis + '</div>' +
      '<h3>' + esc(p.name) + '</h3>' +
      '<p>' + esc(p.description) + '</p>' +
      '<ul>' + (p.features || []).map(function(f){ return '<li>' + esc(f) + '</li>'; }).join("") + '</ul>' +
      '<div class="card-meta">' +
        '<span class="status s-' + esc(st) + '">' + STATUS_LABELS[st] + '</span>' +
        priceHtml +
      '</div>' +
      (seeMore ? '<div style="margin-top:.2rem">' + seeMore + '</div>' : '') +
      '<div class="card-cta">' +
        '<span class="ask">' + esc(ctaText) + ' por:</span>' +
        duoButtons("product", { product: p.name }, ctaText) +
      '</div>' +
    '</article>';
  }

  function paintList(container, list, emptyHtml){
    if (!container) return;
    if (list && list.length) {
      container.innerHTML = list.map(productCard).join("");
    } else {
      container.innerHTML = '<div class="empty">' + emptyHtml + '</div>';
    }
  }

  // Inicializa catálogo si existe en la página
  if (catalogGrid && N.PRODUCTS) {
    var activeCategory = "all";
    var allProducts = N.PRODUCTS.slice().sort(function(a,b){ return (a.order || 99) - (b.order || 99); });

    if (tabsContainer && N.CATEGORIES) {
      var categories = [{ id: "all", label: "Todo" }].concat(N.CATEGORIES);
      tabsContainer.innerHTML = categories.map(function(c){
        return '<button class="tab" data-id="' + esc(c.id) + '" aria-pressed="' + (c.id === "all" ? "true" : "false") + '">' +
          esc(c.label) +
        '</button>';
      }).join("");

      tabsContainer.addEventListener("click", function(e){
        var btn = e.target.closest(".tab");
        if (!btn || btn.getAttribute("aria-pressed") === "true") return;
        activeCategory = btn.getAttribute("data-id");
        $$(".tab", tabsContainer).forEach(function(t){
          t.setAttribute("aria-pressed", t === btn ? "true" : "false");
        });
        filterCatalog();
      });
    }

    function filterCatalog(){
      var filtered = allProducts.filter(function(p){
        return activeCategory === "all" || p.category === activeCategory;
      });
      paintList(catalogGrid, filtered, '<p>No hay productos en esta categoría por ahora. ¡Pregúntanos por lo que buscas!</p>');
    }

    filterCatalog();

    if (featuredGrid) {
      var featured = allProducts.filter(function(p){ return p.featured || p.order <= 2; });
      paintList(featuredGrid, featured, '<p>Pronto habrá destacados disponibles.</p>');
    }
  }

  // NEXO Discover en index.html
  if (tilesContainer && N.DISCOVER) {
    tilesContainer.innerHTML = N.DISCOVER.map(function(d, i){
      return '<button class="tile glass-lite" data-id="' + esc(d.id) + '" aria-pressed="false" style="--i:' + i + '">' +
        '<b>' + esc(d.label) + '</b>' +
        '<span>' + esc(d.hint) + '</span>' +
      '</button>';
    }).join("");

    tilesContainer.addEventListener("click", function(e){
      var btn = e.target.closest(".tile");
      if (!btn) return;
      var discId = btn.getAttribute("data-id");
      $$(".tile", tilesContainer).forEach(function(t){
        t.setAttribute("aria-pressed", t === btn ? "true" : "false");
      });

      var discItem = N.DISCOVER.filter(function(x){ return x.id === discId; })[0];
      var label = discItem ? discItem.label : discId;
      var matched = (N.PRODUCTS || []).filter(function(p){
        return p.discover && p.discover.indexOf(discId) > -1;
      });

      if (matched.length) {
        paintList(discoverResults, matched, "");
      } else {
        paintList(discoverResults, [],
          '<p>Todavía no hay productos listados para <b>' + esc(label) + '</b>. Escríbenos y te decimos disponibilidad y precios:</p>' +
          duoButtons("discover", { topic: label }, "Consultar " + label)
        );
      }
    });
  }

  /* ==========================================================================
     6. PASOS, PAGOS, REFERENCIAS Y ADMINS
     ========================================================================== */
  // Pasos interactivos
  $$(".steps li").forEach(function(li){
    li.tabIndex = 0;
    li.addEventListener("click", function(){
      $$(".steps li").forEach(function(x){ x.classList.toggle("on", x === li); });
    });
    li.addEventListener("keydown", function(e){
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        li.click();
      }
    });
  });

  // Métodos de pago
  var payUl = $("#pay");
  if (payUl && N.PAYMENTS) {
    var avail = (N.PAYMENTS.available || []).map(function(m){
      return '<li class="glass-lite">' + esc(m) + '<span class="status s-available">Disponible</span></li>';
    });
    var soon = (N.PAYMENTS.soon || []).map(function(m){
      return '<li class="glass-lite soon">' + esc(m) + '<span class="status s-soon">Próximamente</span></li>';
    });
    payUl.innerHTML = avail.concat(soon).join("");
  }

  // Administradores de soporte
  var adminsContainer = $("#admins");
  if (adminsContainer && N.ADMINS) {
    adminsContainer.innerHTML = N.ADMINS.map(function(adm){
      var initial = (adm.name || "A").charAt(0).toUpperCase();
      return '<div class="admin glass-lite">' +
        '<div class="avatar">' + esc(initial) + '</div>' +
        '<b>' + markPlaceholders(adm.name) + '</b>' +
        '<small>' + esc(adm.role) + '</small>' +
        '<div class="num">' +
          '<span>WA: ' + markPlaceholders(adm.whatsapp) + '</span>' +
          '<span>TG: ' + markPlaceholders(adm.telegram) + '</span>' +
        '</div>' +
        duoButtons("admin", { admin: adm.name }, "Hablar con " + adm.name, adm.whatsapp, adm.telegram) +
      '</div>';
    }).join("");
  }

  /* ==========================================================================
     7. FORMULARIO DE CONTACTO
     ========================================================================== */
  var contactForm = $("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e){
      e.preventDefault();
      var form = contactForm;
      var statusEl = $(".form-status", form);
      var submitBtn = $("button[type=submit]", form);

      // Honeypot anti-spam
      var hp = $("input[name=_hp]", form);
      if (hp && hp.value) return;

      var name = (form.name && form.name.value || "").trim();
      var email = (form.email && form.email.value || "").trim();
      var topic = (form.topic && form.topic.value || "").trim();
      var message = (form.message && form.message.value || "").trim();

      if (!name || !email || !message) {
        if (statusEl) {
          statusEl.className = "form-status err";
          statusEl.textContent = "Por favor completa tu nombre, correo y mensaje.";
        }
        return;
      }

      var endpoint = (N.CONTACT && N.CONTACT.formEndpoint) || "";

      if (endpoint && endpoint.indexOf("http") === 0) {
        if (submitBtn) submitBtn.setAttribute("disabled", "true");
        if (statusEl) {
          statusEl.className = "form-status";
          statusEl.textContent = "Enviando mensaje...";
        }

        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ name: name, email: email, topic: topic, message: message })
        }).then(function(res){
          if (res.ok) {
            form.reset();
            if (statusEl) {
              statusEl.className = "form-status ok";
              statusEl.textContent = "¡Mensaje enviado con éxito! Te responderemos muy pronto.";
            }
          } else {
            throw new Error("Error en servidor");
          }
        }).catch(function(){
          if (statusEl) {
            statusEl.className = "form-status err";
            statusEl.textContent = "Hubo un error al enviar. Intentando abrir tu correo...";
          }
          openMailto();
        }).finally(function(){
          if (submitBtn) submitBtn.removeAttribute("disabled");
        });
      } else {
        // Fallback natural a mailto con cuerpo prellenado
        openMailto();
      }

      function openMailto(){
        var targetEmail = (N.CONTACT && N.CONTACT.email) || "contacto@tudominio.com";
        var subject = encodeURIComponent("[NEXO Web] " + (topic ? topic + " - " : "") + name);
        var body = encodeURIComponent(
          "Nombre: " + name + "\n" +
          "Correo: " + email + "\n" +
          "Motivo: " + topic + "\n\n" +
          "Mensaje:\n" + message
        );
        window.location.href = "mailto:" + targetEmail + "?subject=" + subject + "&body=" + body;
        if (statusEl) {
          statusEl.className = "form-status ok";
          statusEl.textContent = "Abriendo tu gestor de correo para enviar el mensaje...";
        }
      }
    });
  }

  /* ==========================================================================
     8. TOAST, RIPPLE & REVEAL ON SCROLL
     ========================================================================== */
  var toast = $("#toast");
  var toastTimer = 0;

  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me"], a[href^="https://t.me"]');
    if (!a || !toast) return;
    var isWa = a.href.indexOf("wa.me") > -1;
    toast.className = "toast show " + (isWa ? "wa" : "tg");
    toast.innerHTML = icon(isWa ? "wa" : "tg") +
      '<span>Abriendo ' + (isWa ? "WhatsApp" : "Telegram") + ' con tu mensaje listo ✨</span>';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){
      toast.classList.remove("show");
    }, 2800);
  });

  // Efecto ripple al hacer clic
  document.addEventListener("pointerdown", function(e){
    if (DEV.reduceMotion) return;
    var b = e.target.closest && e.target.closest(".btn, .tab, .tile, .gbtn");
    if (!b) return;
    var r = b.getBoundingClientRect();
    var s = document.createElement("span");
    s.className = "ripple";
    s.style.left = (e.clientX - r.left) + "px";
    s.style.top = (e.clientY - r.top) + "px";
    b.appendChild(s);
    setTimeout(function(){ s.remove(); }, 650);
  });

  // Reveal escalonado de elementos al entrar al viewport
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -4% 0px" });

    $$(".head, .steps li, .pay li, .pkg, .plat, .badge-item, .ref-box, .about-card, .faq details").forEach(function(n, idx){
      var parent = n.parentElement;
      var pos = parent ? Array.prototype.indexOf.call(parent.children, n) : 0;
      if (pos > 0) {
        n.style.setProperty("--d", (pos * 70) + "ms");
      }
      n.classList.add("rv");
      ro.observe(n);
    });
  }

  function extractElementVars(el, channel){
    var vars = {};
    if (!el || !el.attributes) return vars;
    var pfx = "data-" + channel + "-var-";
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (attr.name.indexOf(pfx) === 0) {
        var k = attr.name.substring(pfx.length);
        vars[k] = attr.value;
      }
    }

    // Si el contenedor tiene data-price-base, formatea el precio dinámico en texto plano
    var card = el.closest ? el.closest(".pkg, .card, [data-price-base]") : null;
    var priceBaseEl = (el.hasAttribute && el.hasAttribute("data-price-base"))
      ? el
      : (card ? (card.hasAttribute("data-price-base") ? card : card.querySelector("[data-price-base]")) : null);

    if (priceBaseEl && priceBaseEl.getAttribute("data-price-base")) {
      var num = parseFloat(priceBaseEl.getAttribute("data-price-base"));
      if (!isNaN(num) && window.NEXO_CURRENCY && window.NEXO_CURRENCY.formatText) {
        vars.price = window.NEXO_CURRENCY.formatText(num);
      }
    }
    return vars;
  }

  function updateDynamicLinks(){
    $$("[data-wa]").forEach(function(a){
      var key = a.getAttribute("data-wa") || "general";
      var customNum = a.getAttribute("data-wa-num") || null;
      var vars = extractElementVars(a, "wa");
      a.href = waLink(key, vars, customNum);
    });

    $$("[data-tg]").forEach(function(a){
      var key = a.getAttribute("data-tg") || "general";
      var customUser = a.getAttribute("data-tg-user") || null;
      var vars = extractElementVars(a, "tg");
      a.href = tgLink(key, vars, customUser);
    });
  }

  // Inicializa enlaces dinámicos y actualiza al cambiar la moneda
  updateDynamicLinks();
  window.addEventListener("nexo:currency-change", function(){
    updateDynamicLinks();
  });

  // Rellena placeholders de texto desde la configuración en el DOM
  $$("[data-cfg]").forEach(function(el){
    var key = el.getAttribute("data-cfg");
    var val = N[key];
    if (val != null) {
      el.textContent = val;
    }
  });

})();
