(() => {
  "use strict";

  const body = document.body;
  const page = body?.dataset.page || "";

  const touristSpots = [
    {
      id: "calle-crisologo",
      name: "Calle Crisologo",
      shortName: "Calle Crisologo",
      category: "Historic",
      lat: 17.5714,
      lng: 120.3887,
      description: "Vigan's iconic heritage street, known for ancestral houses, cobblestone streets, and the atmosphere of its preserved historic center.",
      imageUrl: "images/callecrisologo.jpg"
    },
    {
      id: "vigan-cathedral",
      name: "Vigan Cathedral (St. Paul Metropolitan Cathedral)",
      shortName: "Vigan Cathedral",
      category: "Culture",
      lat: 17.5749,
      lng: 120.3889,
      description: "A prominent Baroque-style church beside Vigan's central plazas, with a separate bell tower associated with earthquake-conscious design.",
      imageUrl: "images/vigan_cathedral.jpg"
    },
    {
      id: "plaza-salcedo",
      name: "Plaza Salcedo (Dancing Fountain)",
      shortName: "Plaza Salcedo",
      category: "Historic",
      lat: 17.5755,
      lng: 120.3877,
      description: "A central public square near the cathedral and government buildings, widely known for its evening dancing fountain attraction.",
      imageUrl: "images/plaza_salcedo.jpg"
    },
    {
      id: "plaza-burgos",
      name: "Plaza Burgos",
      shortName: "Plaza Burgos",
      category: "Historic",
      lat: 17.5743,
      lng: 120.3888,
      description: "A lively plaza beside the cathedral where visitors can relax and try local favorites such as Vigan empanada and okoy.",
      imageUrl: "images/plaza_burgos.jpg"
    },
    {
      id: "baluarte-zoo",
      name: "Baluarte Zoo",
      shortName: "Baluarte Zoo",
      category: "Unique",
      lat: 17.5513,
      lng: 120.3771,
      description: "A wildlife-oriented destination known for its variety of animals and safari-style visitor experience.",
      imageUrl: "images/baluarte2.jpg"
    },
    {
      id: "pagburnayan",
      name: "Pagburnayan (Jar Making)",
      shortName: "Pagburnayan",
      category: "Culture",
      lat: 17.5709,
      lng: 120.3820,
      description: "A traditional pottery site where visitors can observe local artisans making burnay earthenware jars by hand.",
      imageUrl: "images/pagburnayan2.jpg"
    },
    {
      id: "hidden-garden",
      name: "Hidden Garden",
      shortName: "Hidden Garden",
      category: "Unique",
      lat: 17.5597,
      lng: 120.3651,
      description: "A tranquil garden, plant nursery, and dining destination offering a relaxed setting and Ilocano food.",
      imageUrl: "images/hiddengarden.jpg"
    },
    {
      id: "ilocos-regional-museum",
      name: "National Museum - Ilocos Regional Museum Complex",
      shortName: "Ilocos Regional Museum",
      category: "Culture",
      lat: 17.5756,
      lng: 120.3858,
      description: "A museum complex presenting Ilocano history, culture, artifacts, heritage stories, and regional collections.",
      imageUrl: "images/national_museum.jpg"
    },
    {
      id: "one-ilocos-sur-cafe",
      name: "One Ilocos Sur Cafe",
      shortName: "One Ilocos Sur Cafe",
      category: "Unique",
      lat: 17.5765,
      lng: 120.3868,
      description: "A modern café and restaurant experience offering local-inspired food, coffee, and a contemporary side of Vigan.",
      imageUrl: "images/oneilocossurcafe.jpg"
    }
  ];

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);

  function initYear() {
    document.querySelectorAll("[data-current-year]").forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  function initMobileMenu() {
    const button = document.querySelector(".mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    if (!button || !menu) return;

    const openIcon = button.querySelector(".menu-open");
    const closeIcon = button.querySelector(".menu-close");
    let navigationTimer = null;

    // Keep the menu in the layout so CSS can animate it smoothly instead of
    // instantly switching display:none on and off with Tailwind's hidden class.
    menu.classList.remove("hidden");
    menu.classList.add("mobile-menu-ready");
    openIcon?.classList.remove("hidden");
    closeIcon?.classList.remove("hidden");

    const setMenuState = (open) => {
      menu.classList.toggle("is-open", open);
      button.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };

    const closeMenu = () => setMenuState(false);

    button.addEventListener("click", () => {
      setMenuState(!menu.classList.contains("is-open"));
    });

    // Let the closing animation finish before changing pages. Without this,
    // the browser navigates immediately and the user never sees the menu close.
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", event => {
        const isPrimaryClick = event.button === 0;
        const hasModifier = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        const opensElsewhere = link.target && link.target.toLowerCase() !== "_self";
        const menuIsOpen = menu.classList.contains("is-open");

        if (!isPrimaryClick || hasModifier || opensElsewhere || !menuIsOpen) {
          closeMenu();
          return;
        }

        event.preventDefault();
        const destination = link.href;
        closeMenu();

        if (navigationTimer) window.clearTimeout(navigationTimer);
        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        navigationTimer = window.setTimeout(() => {
          window.location.href = destination;
        }, reduceMotion ? 20 : 430);
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) closeMenu();
    });

    setMenuState(false);
  }

  function initPageScrollUI() {
    const backToTop = document.querySelector(".back-to-top");
    const root = document.documentElement;

    const update = () => {
      const scrollTop = window.scrollY || root.scrollTop;
      const scrollable = Math.max(1, root.scrollHeight - window.innerHeight);
      const progress = Math.min(100, Math.max(0, (scrollTop / scrollable) * 100));
      root.style.setProperty("--scroll-progress", `${progress}%`);
      backToTop?.classList.toggle("show", scrollTop > 520);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    backToTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initReveal() {
    const items = [...document.querySelectorAll(".reveal")];
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(item => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(item);
    });
  }

  function initImageFallbacks() {
    document.querySelectorAll("img[data-fallback]").forEach(img => {
      img.addEventListener("error", () => {
        if (img.dataset.fallbackApplied === "true") return;
        img.dataset.fallbackApplied = "true";

        const parent = img.parentElement;
        if (!parent) return;

        img.style.visibility = "hidden";
        if (parent.querySelector(".image-fallback")) return;

        const fallback = document.createElement("div");
        fallback.className = "image-fallback";
        fallback.innerHTML = `<span>${escapeHTML(img.dataset.fallback || "Vigan City")}</span>`;
        parent.appendChild(fallback);
      }, { once: true });
    });
  }

  function initPortraitImageFit() {
    const images = document.querySelectorAll(".spot-media > img, .destination-card > img");

    const updateFit = (img) => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      img.classList.toggle("portrait-fit", img.naturalHeight > img.naturalWidth);
    };

    images.forEach(img => {
      if (img.complete) updateFit(img);
      else img.addEventListener("load", () => updateFit(img), { once: true });
    });
  }

  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach(carousel => {
      const images = [...carousel.querySelectorAll(":scope > img")];
      const dots = [...carousel.querySelectorAll(".carousel-dots span")];
      if (images.length < 2) return;

      let index = Number(carousel.dataset.index || 0);

      const render = () => {
        images.forEach((img, i) => img.classList.toggle("active", i === index));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
        carousel.dataset.index = String(index);
      };

      carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
        index = (index - 1 + images.length) % images.length;
        render();
      });

      carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
        index = (index + 1) % images.length;
        render();
      });

      render();
    });
  }

  function getSavedSpots() {
    try {
      const parsed = JSON.parse(localStorage.getItem("viganSavedSpots") || "[]");
      return Array.isArray(parsed) ? new Set(parsed) : new Set();
    } catch {
      return new Set();
    }
  }

  function saveSavedSpots(set) {
    try {
      localStorage.setItem("viganSavedSpots", JSON.stringify([...set]));
    } catch {
      // LocalStorage can be unavailable in strict/private browser modes.
    }
  }

  function initSpotFilters() {
    if (page !== "spots") return;

    const cards = [...document.querySelectorAll("[data-spot-card]")];
    const chips = [...document.querySelectorAll("[data-filter]")];
    const search = document.getElementById("spot-search");
    const count = document.getElementById("saved-count");
    const summary = document.getElementById("results-summary");
    const empty = document.getElementById("empty-state");
    const clear = document.getElementById("clear-filters");
    const favorites = [...document.querySelectorAll("[data-favorite]")];

    let activeFilter = "all";
    let saved = getSavedSpots();

    const updateFavoriteButtons = () => {
      favorites.forEach(btn => {
        const id = btn.dataset.favorite;
        const isSaved = saved.has(id);
        btn.classList.toggle("saved", isSaved);
        btn.setAttribute("aria-pressed", String(isSaved));
        btn.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${id.replaceAll("-", " ")}`);
        btn.querySelector(".heart-outline")?.classList.toggle("hidden", isSaved);
        btn.querySelector(".heart-fill")?.classList.toggle("hidden", !isSaved);
      });
      if (count) count.textContent = String(saved.size);
    };

    const filterTimers = new WeakMap();

    const setCardVisibility = (card, shouldShow, animate = true) => {
      const previousTimer = filterTimers.get(card);
      if (previousTimer) clearTimeout(previousTimer);

      if (shouldShow) {
        const wasHidden = card.hidden;
        card.hidden = false;
        card.classList.remove("filter-leave");

        if (animate && wasHidden) {
          card.classList.add("filter-enter-prep");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.classList.remove("filter-enter-prep");
              card.classList.add("filter-enter");
              const timer = setTimeout(() => {
                card.classList.remove("filter-enter");
                filterTimers.delete(card);
              }, 380);
              filterTimers.set(card, timer);
            });
          });
        } else {
          card.classList.remove("filter-enter-prep", "filter-enter");
        }
        return;
      }

      card.classList.remove("filter-enter-prep", "filter-enter");
      if (card.hidden) return;

      if (!animate) {
        card.hidden = true;
        return;
      }

      card.classList.add("filter-leave");
      const timer = setTimeout(() => {
        card.hidden = true;
        card.classList.remove("filter-leave");
        filterTimers.delete(card);
      }, 240);
      filterTimers.set(card, timer);
    };

    let firstFilterPass = true;
    const applyFilters = () => {
      const query = (search?.value || "").trim().toLowerCase();
      let visible = 0;

      cards.forEach(card => {
        const matchesSearch = !query || (card.dataset.search || "").includes(query) ||
          card.querySelector("h3")?.textContent.toLowerCase().includes(query);

        const matchesFilter =
          activeFilter === "all" ||
          (activeFilter === "saved" && saved.has(card.dataset.id)) ||
          card.dataset.category === activeFilter;

        const shouldShow = Boolean(matchesSearch && matchesFilter);
        setCardVisibility(card, shouldShow, !firstFilterPass);
        if (shouldShow) visible++;
      });

      firstFilterPass = false;
      if (summary) summary.textContent = `Showing ${visible} ${visible === 1 ? "destination" : "destinations"}`;
      empty?.classList.toggle("hidden", visible !== 0);
    };

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        activeFilter = chip.dataset.filter;
        chips.forEach(item => item.classList.toggle("active", item === chip));
        applyFilters();
      });
    });

    search?.addEventListener("input", applyFilters);

    favorites.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.favorite;
        if (saved.has(id)) {
          saved.delete(id);
          showToast("Removed from saved places.");
        } else {
          saved.add(id);
          showToast("Saved to your places.");
        }
        saveSavedSpots(saved);
        updateFavoriteButtons();
        applyFilters();
      });
    });

    clear?.addEventListener("click", () => {
      activeFilter = "all";
      chips.forEach(chip => chip.classList.toggle("active", chip.dataset.filter === "all"));
      if (search) search.value = "";
      applyFilters();
    });

    updateFavoriteButtons();
    applyFilters();
  }

  function initMap() {
    if (page !== "map") return;

    const list = document.getElementById("map-spot-list");
    const search = document.getElementById("map-search");
    const resultCount = document.getElementById("map-result-count");
    const status = document.getElementById("map-status");
    const loading = document.getElementById("map-loading");
    const error = document.getElementById("map-error");
    const emptyDetails = document.getElementById("map-details-empty");
    const details = document.getElementById("map-details-content");
    const locateBtn = document.getElementById("locate-me");
    const resetBtn = document.getElementById("reset-map");

    if (!list || !document.getElementById("map")) return;

    if (typeof window.L === "undefined") {
      loading?.classList.add("hidden");
      error?.classList.remove("hidden");
      error?.classList.add("grid");
      return;
    }

    const viganCenter = [17.565, 120.380];
    const map = L.map("map", {
      // Zoom controls are rendered in our own in-map control dock below.
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false
    }).setView(viganCenter, 14);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(map);

    // Responsive map interaction uses two clear modes on phones/tablets:
    // 1) Page mode (default): one-finger swipes over the map scroll the page.
    // 2) Map mode: the user explicitly taps "Move map" to drag/pinch/zoom.
    // This avoids trapping page scrolling while keeping the map fully navigable.
    const mapElement = document.getElementById("map");
    let compactMapInteractionEnabled = false;
    let mapInteractionButton = null;

    function setMapHandlersEnabled(enabled) {
      if (map.dragging) enabled ? map.dragging.enable() : map.dragging.disable();
      if (map.touchZoom) enabled ? map.touchZoom.enable() : map.touchZoom.disable();
      if (map.doubleClickZoom) enabled ? map.doubleClickZoom.enable() : map.doubleClickZoom.disable();
      if (map.boxZoom) enabled ? map.boxZoom.enable() : map.boxZoom.disable();
      if (map.keyboard) enabled ? map.keyboard.enable() : map.keyboard.disable();
    }

    function updateMapInteractionButton(compactLayout) {
      if (!mapInteractionButton) return;

      mapInteractionButton.hidden = !compactLayout;
      mapInteractionButton.setAttribute("aria-pressed", String(compactMapInteractionEnabled));
      mapInteractionButton.textContent = compactMapInteractionEnabled ? "Scroll page" : "Move map";
      mapInteractionButton.title = compactMapInteractionEnabled
        ? "Return to normal page scrolling"
        : "Enable map dragging and pinch zoom";
    }

    function syncResponsiveMapInteraction() {
      const compactLayout = window.innerWidth <= 1023;

      if (compactLayout) {
        setMapHandlersEnabled(compactMapInteractionEnabled);
        if (mapElement) {
          mapElement.classList.toggle("map-interaction-active", compactMapInteractionEnabled);
          mapElement.classList.toggle("map-page-scroll-mode", !compactMapInteractionEnabled);
          mapElement.setAttribute("data-scroll-mode", compactMapInteractionEnabled ? "map" : "page");
        }
      } else {
        compactMapInteractionEnabled = false;
        setMapHandlersEnabled(true);
        if (mapElement) {
          mapElement.classList.remove("map-page-scroll-mode", "map-interaction-active");
          mapElement.setAttribute("data-scroll-mode", "map");
        }
      }

      updateMapInteractionButton(compactLayout);
    }

    // Keep every navigation control physically inside the Leaflet canvas.
    // On responsive layouts this dock shows Move map / Scroll page together
    // with + and - zoom controls; desktop keeps only the zoom controls.
    const mapControlDock = L.control({ position: "bottomright" });
    mapControlDock.onAdd = () => {
      const wrapper = L.DomUtil.create("div", "leaflet-control map-control-dock");

      mapInteractionButton = L.DomUtil.create("button", "map-interaction-toggle", wrapper);
      mapInteractionButton.type = "button";
      mapInteractionButton.setAttribute("aria-label", "Toggle responsive map movement");
      mapInteractionButton.setAttribute("aria-pressed", "false");

      const zoomGroup = L.DomUtil.create("div", "map-zoom-controls", wrapper);
      const zoomInButton = L.DomUtil.create("button", "map-zoom-button map-zoom-in", zoomGroup);
      const zoomOutButton = L.DomUtil.create("button", "map-zoom-button map-zoom-out", zoomGroup);

      zoomInButton.type = "button";
      zoomInButton.textContent = "+";
      zoomInButton.setAttribute("aria-label", "Zoom in");
      zoomInButton.title = "Zoom in";

      zoomOutButton.type = "button";
      zoomOutButton.textContent = "−";
      zoomOutButton.setAttribute("aria-label", "Zoom out");
      zoomOutButton.title = "Zoom out";

      L.DomEvent.disableClickPropagation(wrapper);
      L.DomEvent.disableScrollPropagation(wrapper);

      L.DomEvent.on(mapInteractionButton, "click", event => {
        L.DomEvent.stop(event);
        if (window.innerWidth > 1023) return;
        compactMapInteractionEnabled = !compactMapInteractionEnabled;
        syncResponsiveMapInteraction();
        if (status) {
          status.textContent = compactMapInteractionEnabled
            ? "Map movement enabled. Drag or pinch the map, then tap Scroll page when finished."
            : "Page scrolling restored. Tap Move map to navigate the map again.";
        }
      });

      L.DomEvent.on(zoomInButton, "click", event => {
        L.DomEvent.stop(event);
        map.zoomIn();
      });

      L.DomEvent.on(zoomOutButton, "click", event => {
        L.DomEvent.stop(event);
        map.zoomOut();
      });

      return wrapper;
    };
    mapControlDock.addTo(map);

    syncResponsiveMapInteraction();

    map.once("load", () => loading?.classList.add("hidden"));
    setTimeout(() => loading?.classList.add("hidden"), 900);

    const markers = new Map();
    let userMarker = null;

    const makeIcon = (index) => L.divIcon({
      className: "custom-map-marker",
      html: `<div class="map-pin"><span>${String(index + 1).padStart(2, "0")}</span></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 30],
      tooltipAnchor: [0, -24]
    });

    touristSpots.forEach((spot, index) => {
      const marker = L.marker([spot.lat, spot.lng], { icon: makeIcon(index) })
        .addTo(map)
        .bindTooltip(spot.shortName, { direction: "top", offset: [0, -6] });

      marker.on("click", () => selectSpot(spot.id, false));
      markers.set(spot.id, marker);
    });

    function renderList(filtered = touristSpots) {
      list.innerHTML = filtered.map(spot => {
        const index = touristSpots.findIndex(item => item.id === spot.id);
        return `
          <button class="map-list-item" type="button" data-map-list-id="${escapeHTML(spot.id)}" role="listitem">
            <span class="map-list-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="map-list-text">
              <strong>${escapeHTML(spot.shortName)}</strong>
              <span>${escapeHTML(spot.category)}</span>
            </span>
            <svg class="map-list-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        `;
      }).join("");

      list.querySelectorAll("[data-map-list-id]").forEach(button => {
        button.addEventListener("click", () => selectSpot(button.dataset.mapListId, true));
      });

      if (resultCount) resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "place" : "places"}`;
    }

    function renderDetails(spot) {
      if (!details || !emptyDetails) return;
      const index = touristSpots.findIndex(item => item.id === spot.id);
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${spot.lat},${spot.lng}`)}`;

      details.innerHTML = `
        <div class="map-detail-image map-photo-natural-ratio" data-map-detail-frame>
          <img src="${escapeHTML(spot.imageUrl)}" alt="${escapeHTML(spot.shortName)}" class="map-image-full-fit" data-map-detail-image style="display:block;width:100%;height:100%;object-fit:contain!important;object-position:center center!important;transform:none!important;">
        </div>
        <div class="map-detail-copy">
          <p class="spot-kicker">${escapeHTML(spot.category)} destination</p>
          <h2 class="mt-1">${escapeHTML(spot.shortName)}</h2>
          <p>${escapeHTML(spot.description)}</p>
          <div class="map-detail-meta">
            <span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s7-4.8 7-11a7 7 0 10-14 0c0 6.2 7 11 7 11z"/><circle cx="12" cy="10" r="2"/></svg>
              ${spot.lat.toFixed(4)}, ${spot.lng.toFixed(4)}
            </span>
            <span>#${String(index + 1).padStart(2, "0")}</span>
          </div>
          <div class="map-detail-actions">
            <a class="directions" href="${directionsUrl}" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l9 9-9 9-9-9 9-9z"/><path d="M8 12h8M13 9l3 3-3 3"/></svg>
              Open directions
            </a>
            <a class="browse" href="tourist-spots.html#${escapeHTML(spot.id)}">
              View full destination card
            </a>
          </div>
        </div>
      `;

      const image = details.querySelector("[data-map-detail-image]");
      if (image) {
        // Match the map photo frame to the ORIGINAL image ratio.
        // This is stronger than a fixed-height contain box: portrait images get a
        // portrait frame, landscape images get a landscape frame, and nothing crops.
        const frame = image.closest("[data-map-detail-frame]");

        const applyNaturalPhotoRatio = () => {
          if (!frame || !image.naturalWidth || !image.naturalHeight) return;
          frame.classList.add("map-photo-natural-ratio");
          frame.style.setProperty("--map-photo-ratio", `${image.naturalWidth} / ${image.naturalHeight}`);
          frame.style.setProperty("height", "auto", "important");
          frame.style.setProperty("min-height", "0", "important");
          frame.style.setProperty("max-height", "none", "important");
          frame.style.setProperty("aspect-ratio", `${image.naturalWidth} / ${image.naturalHeight}`, "important");

          image.classList.add("map-image-full-fit");
          image.classList.toggle("portrait-fit", image.naturalHeight > image.naturalWidth);
          image.style.setProperty("width", "100%", "important");
          image.style.setProperty("height", "100%", "important");
          image.style.setProperty("object-fit", "contain", "important");
          image.style.setProperty("object-position", "center center", "important");
          image.style.setProperty("transform", "none", "important");
        };

        if (image.complete && image.naturalWidth) applyNaturalPhotoRatio();
        else image.addEventListener("load", applyNaturalPhotoRatio, { once: true });

        image.addEventListener("error", () => {
          const parent = image.parentElement;
          image.style.display = "none";
          if (parent && !parent.querySelector(".image-fallback")) {
            const fallback = document.createElement("div");
            fallback.className = "image-fallback";
            fallback.innerHTML = `<span>${escapeHTML(spot.shortName)}</span>`;
            parent.appendChild(fallback);
          }
        }, { once: true });
      }

      emptyDetails.classList.add("hidden");
      details.classList.remove("hidden");
    }

    function selectSpot(id, fly = true) {
      const spot = touristSpots.find(item => item.id === id);
      if (!spot) return;

      document.querySelectorAll("[data-map-list-id]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.mapListId === id);
      });

      renderDetails(spot);
      const marker = markers.get(id);

      if (fly) {
        map.flyTo([spot.lat, spot.lng], 16, { duration: 0.75 });
      } else {
        map.panTo([spot.lat, spot.lng], { animate: true });
      }

      marker?.openTooltip();
      if (status) status.textContent = `Selected ${spot.shortName}.`;
    }

    renderList();

    search?.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      const filtered = touristSpots.filter(spot =>
        `${spot.name} ${spot.shortName} ${spot.category} ${spot.description}`.toLowerCase().includes(query)
      );
      renderList(filtered);
      if (status) status.textContent = filtered.length ? "" : "No matching destinations.";
    });

    resetBtn?.addEventListener("click", () => {
      map.flyTo(viganCenter, 14, { duration: .7 });
      document.querySelectorAll("[data-map-list-id]").forEach(btn => btn.classList.remove("active"));
      if (status) status.textContent = "Map view reset.";
    });

    locateBtn?.addEventListener("click", () => {
      if (!navigator.geolocation) {
        showToast("Geolocation is not supported by this browser.");
        return;
      }

      locateBtn.disabled = true;
      locateBtn.style.opacity = ".6";
      if (status) status.textContent = "Finding your location…";

      navigator.geolocation.getCurrentPosition(position => {
        const coords = [position.coords.latitude, position.coords.longitude];

        if (userMarker) {
          userMarker.setLatLng(coords);
        } else {
          const userIcon = L.divIcon({
            className: "custom-map-marker",
            html: '<div class="user-location-marker"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });
          userMarker = L.marker(coords, { icon: userIcon }).addTo(map).bindTooltip("Your location");
        }

        map.flyTo(coords, 15, { duration: .8 });
        userMarker.openTooltip();
        if (status) status.textContent = "Your approximate location is shown on the map.";
        locateBtn.disabled = false;
        locateBtn.style.opacity = "";
      }, errorObj => {
        const message = errorObj.code === 1
          ? "Location permission was not granted."
          : "Your location could not be determined.";
        showToast(message);
        if (status) status.textContent = message;
        locateBtn.disabled = false;
        locateBtn.style.opacity = "";
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });
    });

    let mapResizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(mapResizeTimer);
      mapResizeTimer = setTimeout(() => {
        syncResponsiveMapInteraction();
        map.invalidateSize({ pan: false });
      }, 120);
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => {
        clearTimeout(mapResizeTimer);
        mapResizeTimer = setTimeout(() => map.invalidateSize({ pan: false }), 120);
      });
    }

    function getQueryParameter(name) {
      if (typeof window.URLSearchParams !== "undefined") {
        return new URLSearchParams(window.location.search).get(name);
      }
      const query = window.location.search.replace(/^\?/, "").split("&");
      for (let i = 0; i < query.length; i += 1) {
        const pair = query[i].split("=");
        if (decodeURIComponent(pair[0] || "") === name) {
          return decodeURIComponent((pair[1] || "").replace(/\+/g, " "));
        }
      }
      return null;
    }

    const requestedSpot = getQueryParameter("spot");
    if (requestedSpot && touristSpots.some(spot => spot.id === requestedSpot)) {
      setTimeout(() => selectSpot(requestedSpot, true), 350);
    }
  }


  /* =========================================================
     SHARED REVIEW + VISITOR DATA
     GitHub Pages remains static. A small writable API stores shared data
     for every device, while localStorage keeps an offline/last-known cache.
     ========================================================= */
  const siteDataKeys = {
    visits: "viganWebsiteVisits",
    reviews: "viganWebsiteReviews",
    session: "viganVisitRecordedForSession",
    visitorId: "viganSharedVisitorId"
  };

  const sharedApiBase = (() => {
    const configured = typeof window.VIGAN_SHARED_API === "string" ? window.VIGAN_SHARED_API.trim() : "";
    if (!configured || configured.includes("PASTE_YOUR_")) return "";
    return configured.replace(/\/+$/, "");
  })();

  function safeStorageGet(storage, key, fallback) {
    try {
      const value = storage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function safeStorageSet(storage, key, value) {
    try {
      storage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function createVisitorId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
    }
    return `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  }

  function getVisitorId() {
    let id = safeStorageGet(window.localStorage, siteDataKeys.visitorId, "");
    if (!id) {
      id = createVisitorId();
      safeStorageSet(window.localStorage, siteDataKeys.visitorId, id);
    }
    return id;
  }

  function getLocalVisitCount() {
    const parsed = Number(safeStorageGet(window.localStorage, siteDataKeys.visits, "0"));
    return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
  }

  function setLocalVisitCount(value) {
    const visits = Math.max(0, Math.floor(Number(value) || 0));
    safeStorageSet(window.localStorage, siteDataKeys.visits, String(visits));
    return visits;
  }

  function recordLocalVisitFallback() {
    const alreadyRecorded = safeStorageGet(window.sessionStorage, siteDataKeys.session, "0") === "1";
    let visits = getLocalVisitCount();
    if (!alreadyRecorded) {
      visits += 1;
      setLocalVisitCount(visits);
      safeStorageSet(window.sessionStorage, siteDataKeys.session, "1");
    }
    return visits;
  }

  function getLocalReviews() {
    try {
      const raw = safeStorageGet(window.localStorage, siteDataKeys.reviews, "[]");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === "object") : [];
    } catch (error) {
      return [];
    }
  }

  function saveLocalReviews(reviews) {
    return safeStorageSet(window.localStorage, siteDataKeys.reviews, JSON.stringify(reviews));
  }

  async function sharedApiRequest(path, options = {}) {
    if (!sharedApiBase || typeof window.fetch !== "function") throw new Error("shared-api-not-configured");
    const response = await window.fetch(`${sharedApiBase}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      mode: "cors",
      cache: "no-store"
    });
    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const payload = await response.json();
        if (payload && payload.error) message = payload.error;
      } catch (error) {}
      throw new Error(message);
    }
    return response.json();
  }

  function cacheSharedSummary(data) {
    if (!data || typeof data !== "object") return;
    if (Array.isArray(data.reviews)) saveLocalReviews(data.reviews);
    if (Number.isFinite(Number(data.visitors))) setLocalVisitCount(data.visitors);
  }

  async function fetchSharedSummary() {
    const data = await sharedApiRequest("/api/summary");
    cacheSharedSummary(data);
    return data;
  }

  async function initVisitTracking() {
    const visitorId = getVisitorId();
    if (!sharedApiBase) {
      recordLocalVisitFallback();
      return;
    }

    try {
      const result = await sharedApiRequest("/api/visit", {
        method: "POST",
        body: { visitorId }
      });
      if (Number.isFinite(Number(result.visitors))) {
        setLocalVisitCount(result.visitors);
        const counter = document.getElementById("visitor-count");
        if (counter) counter.textContent = Math.floor(Number(result.visitors)).toLocaleString();
      }
      safeStorageSet(window.sessionStorage, siteDataKeys.session, "1");
    } catch (error) {
      recordLocalVisitFallback();
    }
  }

  function initReviewsPage() {
    if (page !== "reviews") return;

    const visitorCount = document.getElementById("visitor-count");
    const averageRating = document.getElementById("average-rating");
    const averageStars = document.getElementById("average-stars");
    const reviewCount = document.getElementById("review-count");
    const dataStatus = document.getElementById("review-data-status");
    const form = document.getElementById("website-review-form");
    const nameInput = document.getElementById("review-name");
    const ratingInput = document.getElementById("review-rating");
    const starButtons = Array.from(document.querySelectorAll(".review-star"));
    const feedbackInput = document.getElementById("review-feedback");
    const feedbackCount = document.getElementById("feedback-count");
    const ratingError = document.getElementById("rating-error");
    const feedbackError = document.getElementById("feedback-error");
    const submitStatus = document.getElementById("review-submit-status");
    const submitButton = form?.querySelector("button[type=\"submit\"]");
    const list = document.getElementById("review-list");
    const empty = document.getElementById("review-empty");

    if (!form || !ratingInput || !feedbackInput || !list) return;

    let selectedRating = 0;
    let currentReviews = getLocalReviews();
    let currentVisits = getLocalVisitCount();

    function setDataStatus(message, state = "") {
      if (!dataStatus) return;
      dataStatus.textContent = message;
      dataStatus.dataset.state = state;
    }

    function formatReviewDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "Recently";
      try {
        return new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric"
        }).format(date);
      } catch (error) {
        return date.toLocaleDateString();
      }
    }

    function starString(value) {
      const rounded = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
      return "★".repeat(rounded) + "☆".repeat(5 - rounded);
    }

    function updateStarButtons(value) {
      selectedRating = Number(value) || 0;
      ratingInput.value = String(selectedRating);
      starButtons.forEach(button => {
        const rating = Number(button.getAttribute("data-rating"));
        const active = rating <= selectedRating;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(rating === selectedRating));
      });
      if (selectedRating > 0 && ratingError) ratingError.hidden = true;
    }

    function renderReviews(reviews = currentReviews, visits = currentVisits, averageOverride = null, countOverride = null) {
      currentReviews = Array.isArray(reviews) ? reviews : [];
      currentVisits = Math.max(0, Number(visits) || 0);
      const totalRating = currentReviews.reduce((sum, item) => sum + (Number(item.rating) || 0), 0);
      const calculatedAverage = currentReviews.length ? totalRating / currentReviews.length : 0;
      const average = Number.isFinite(Number(averageOverride)) ? Number(averageOverride) : calculatedAverage;
      const count = Number.isFinite(Number(countOverride)) ? Number(countOverride) : currentReviews.length;

      if (visitorCount) visitorCount.textContent = Math.floor(currentVisits).toLocaleString();
      if (averageRating) averageRating.textContent = average.toFixed(1);
      if (reviewCount) reviewCount.textContent = Math.floor(count).toLocaleString();
      if (averageStars) {
        averageStars.textContent = starString(average);
        averageStars.setAttribute("aria-label", count ? `Average rating ${average.toFixed(1)} out of 5` : "No ratings yet");
      }

      const recent = currentReviews.slice().sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime() || Number(a.createdAt || 0) || 0;
        const bTime = new Date(b.createdAt || 0).getTime() || Number(b.createdAt || 0) || 0;
        return bTime - aTime;
      }).slice(0, 50);

      list.innerHTML = "";
      recent.forEach(review => {
        const article = document.createElement("article");
        article.className = "review-entry";

        const top = document.createElement("div");
        top.className = "review-entry-top";
        const identity = document.createElement("div");
        identity.className = "review-entry-identity";
        const name = document.createElement("strong");
        name.textContent = String(review.name || "Anonymous visitor");
        const date = document.createElement("span");
        date.textContent = formatReviewDate(review.createdAt);
        identity.appendChild(name);
        identity.appendChild(date);

        const stars = document.createElement("span");
        stars.className = "review-entry-stars";
        stars.textContent = starString(review.rating);
        stars.setAttribute("aria-label", `${Number(review.rating) || 0} out of 5 stars`);

        const feedback = document.createElement("p");
        feedback.textContent = String(review.feedback || "");

        top.appendChild(identity);
        top.appendChild(stars);
        article.appendChild(top);
        article.appendChild(feedback);
        list.appendChild(article);
      });

      if (empty) empty.hidden = recent.length > 0;
      list.hidden = recent.length === 0;
    }

    async function refreshSharedReviews() {
      if (!sharedApiBase) {
        setDataStatus("Local preview — deploy the included shared-data backend to sync every device.", "local");
        renderReviews(getLocalReviews(), getLocalVisitCount());
        return;
      }

      setDataStatus("Loading shared visitor and review data…", "loading");
      try {
        const data = await fetchSharedSummary();
        renderReviews(data.reviews || [], data.visitors || 0, data.averageRating, data.reviewCount);
        setDataStatus("Live shared data — reviews and totals are synchronized across devices.", "shared");
      } catch (error) {
        setDataStatus("Connection unavailable — showing the last saved browser cache.", "offline");
        renderReviews(getLocalReviews(), getLocalVisitCount());
      }
    }

    starButtons.forEach(button => {
      button.addEventListener("click", () => updateStarButtons(button.getAttribute("data-rating")));
    });

    feedbackInput.addEventListener("input", () => {
      const length = feedbackInput.value.length;
      if (feedbackCount) feedbackCount.textContent = `${length} / 600`;
      if (length > 0 && feedbackError) feedbackError.hidden = true;
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();
      const feedback = feedbackInput.value.trim();
      const rating = Number(ratingInput.value);
      let valid = true;

      if (!rating || rating < 1 || rating > 5) {
        if (ratingError) ratingError.hidden = false;
        valid = false;
      }
      if (!feedback) {
        if (feedbackError) feedbackError.hidden = false;
        valid = false;
      }
      if (!valid) {
        if (submitStatus) submitStatus.textContent = "Please complete the required review fields.";
        return;
      }

      const reviewPayload = {
        name: nameInput && nameInput.value.trim() ? nameInput.value.trim().slice(0, 60) : "Anonymous visitor",
        rating,
        feedback: feedback.slice(0, 600),
        visitorId: getVisitorId()
      };

      if (submitButton) submitButton.disabled = true;
      if (submitStatus) submitStatus.textContent = sharedApiBase ? "Saving your review…" : "Saving locally…";

      try {
        if (sharedApiBase) {
          await sharedApiRequest("/api/reviews", { method: "POST", body: reviewPayload });
          form.reset();
          updateStarButtons(0);
          if (feedbackCount) feedbackCount.textContent = "0 / 600";
          if (ratingError) ratingError.hidden = true;
          if (feedbackError) feedbackError.hidden = true;
          if (submitStatus) submitStatus.textContent = "Thank you. Your review is now shared with all visitors.";
          showToast("Review published for all visitors.");
          await refreshSharedReviews();
        } else {
          const reviews = getLocalReviews();
          reviews.push({
            id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            ...reviewPayload,
            createdAt: Date.now()
          });
          if (!saveLocalReviews(reviews)) throw new Error("local-storage-blocked");
          form.reset();
          updateStarButtons(0);
          if (feedbackCount) feedbackCount.textContent = "0 / 600";
          if (submitStatus) submitStatus.textContent = "Saved locally. Deploy the included backend to share it across devices.";
          showToast("Review saved in this browser.");
          renderReviews(reviews, getLocalVisitCount());
        }
      } catch (error) {
        if (submitStatus) submitStatus.textContent = "The review could not be saved right now. Please check the connection and try again.";
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });

    window.addEventListener("storage", event => {
      if (event.key === siteDataKeys.reviews || event.key === siteDataKeys.visits) {
        renderReviews(getLocalReviews(), getLocalVisitCount());
      }
    });

    updateStarButtons(0);
    renderReviews(getLocalReviews(), getLocalVisitCount());
    refreshSharedReviews();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initYear();
    initVisitTracking();
    initMobileMenu();
    initPageScrollUI();
    initReveal();
    initImageFallbacks();
    initPortraitImageFit();
    initCarousels();
    initSpotFilters();
    initMap();
    initReviewsPage();
  });
})();