function getApiUrl(path) {
  const p = window.location.pathname;
  if (p.startsWith("/lawrence-hill")) return "/lawrence-hill" + path;
  if (p.startsWith("/lawrencehill")) return "/lawrencehill" + path;
  return path;
}

// Lawrence Hill Luxury Urban Towns — Interaction Controller
// Editorial gallery engine, plan inspector, and 2-step tour reservation flow

document.addEventListener('DOMContentLoaded', () => {
  initSubNavTabs();
  initInteractiveMap();
  initFaqAccordion();
  initGallery();
  initFloorplanTabs();
  initPlanModal();
  initBookingForm();
  initMortgageCalculator();
  initNearbyTabs();
  initAmenitiesAccordion();
  initTourBookingInteractions();
  initPriceSheetModal();
  initNewsletterForm();
  initOpenHouseSign();
  initHalloweenPopup();
});

// --- Gallery Engine ---
const totalPhotos = 19;
const photos = [];
for (let i = 1; i <= totalPhotos; i++) {
  const pad = i.toString().padStart(2, '0');
  photos.push({
    src: `assets/model-suite-photos/unit62-photo-${pad}.jpg`,
    alt: `Model Suite 62 · 73 Curlew Drive, North York - Photograph ${i} of ${totalPhotos}`,
    caption: `Model Suite 62 · Interior & Architectural Detail (${i} / ${totalPhotos})`
  });
}

let currentIndex = 0;

function initGallery() {
  const activeImg = document.getElementById('active-gallery-image');
  const counter = document.getElementById('gallery-counter');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');
  const ribbon = document.getElementById('thumbnail-ribbon');

  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const lightboxPrev = document.getElementById('lightbox-prev-btn');
  const lightboxNext = document.getElementById('lightbox-next-btn');
  const openLightboxBtn = document.getElementById('open-lightbox-btn');

  // Build Thumbnail Ribbon
  ribbon.innerHTML = '';
  photos.forEach((photo, idx) => {
    const item = document.createElement('div');
    item.className = `thumbnail-item ${idx === 0 ? 'active' : ''}`;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `View photo ${idx + 1}`);

    const thumbImg = document.createElement('img');
    thumbImg.src = photo.src;
    thumbImg.alt = `Thumbnail ${idx + 1}`;
    thumbImg.loading = 'lazy';

    item.appendChild(thumbImg);
    item.addEventListener('click', () => switchPhoto(idx));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchPhoto(idx);
      }
    });

    ribbon.appendChild(item);
  });

  function switchPhoto(index) {
    currentIndex = (index + photos.length) % photos.length;
    activeImg.style.opacity = '0.3';
    setTimeout(() => {
      activeImg.src = photos[currentIndex].src;
      activeImg.alt = photos[currentIndex].alt;
      activeImg.style.opacity = '1';
    }, 120);

    const counterFull = counter.querySelector(".counter-full");
    const counterShort = counter.querySelector(".counter-short");
    if (counterFull && counterShort) {
      counterFull.textContent = `Photo ${currentIndex + 1} of ${totalPhotos}`;
      counterShort.textContent = `${currentIndex + 1} / ${totalPhotos}`;
    } else {
      counter.textContent = `Photo ${currentIndex + 1} of ${totalPhotos}`;
    }

    // Update Ribbon active state
    const thumbItems = ribbon.querySelectorAll('.thumbnail-item');
    thumbItems.forEach((el, i) => {
      if (i === currentIndex) {
        el.classList.add('active');
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        el.classList.remove('active');
      }
    });

    // Update Lightbox if open
    if (lightbox.classList.contains('active')) {
      lightboxImg.src = photos[currentIndex].src;
      lightboxImg.alt = photos[currentIndex].alt;
      lightboxCaption.textContent = photos[currentIndex].caption;
    }
  }

  prevBtn.addEventListener('click', () => switchPhoto(currentIndex - 1));
  nextBtn.addEventListener('click', () => switchPhoto(currentIndex + 1));

  // Lightbox Handlers (button + tap on main image)
  activeImg.style.cursor = "pointer";
  activeImg.addEventListener("click", () => {
    lightboxImg.src = photos[currentIndex].src;
    lightboxImg.alt = photos[currentIndex].alt;
    lightboxCaption.textContent = photos[currentIndex].caption;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  openLightboxBtn.addEventListener('click', () => {
    lightboxImg.src = photos[currentIndex].src;
    lightboxImg.alt = photos[currentIndex].alt;
    lightboxCaption.textContent = photos[currentIndex].caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  lightboxPrev.addEventListener('click', () => switchPhoto(currentIndex - 1));
  lightboxNext.addEventListener('click', () => switchPhoto(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      } else if (e.key === 'ArrowLeft') {
        switchPhoto(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        switchPhoto(currentIndex + 1);
      }
    }
  });
}

// --- Floor Plan Tabs ---
function initFloorplanTabs() {
  const tabs = document.querySelectorAll('.floorplan-tabs .tab-btn');
  const panels = document.querySelectorAll('.floorplan-content-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const targetId = tab.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// --- Plan Zoom Lightbox Modal ---
function initPlanModal() {
  const planModal = document.getElementById('plan-modal');
  const planClose = document.getElementById('plan-close-btn');

  planClose.addEventListener('click', () => {
    planModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  planModal.addEventListener('click', (e) => {
    if (e.target === planModal) {
      planModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  window.openPlanModal = function(src, caption) {
    const modalImg = document.getElementById('plan-modal-image');
    const modalCap = document.getElementById('plan-modal-caption');
    modalImg.src = src;
    modalCap.textContent = caption;
    planModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
}

// --- Direct Contact Form ---
function initBookingForm() {
  const form = document.getElementById("lead-submit-form");
  if (!form) return;
  const successBox = document.getElementById("form-success");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("lead-fullname");
    const emailInput = document.getElementById("lead-email");
    const phoneInput = document.getElementById("lead-phone");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const realtorStatus = document.getElementById("buyer-status") ? document.getElementById("buyer-status").value : "Direct Buyer";
    const suitePreference = document.getElementById("suite-preference") ? document.getElementById("suite-preference").value : "Model Suite 62";
    const newsletterOptin = document.getElementById("lead-newsletter-optin");
    const subscribeNewsletter = newsletterOptin ? Boolean(newsletterOptin.checked) : false;

    if (!name || !email || !phone) {
      if (!name && nameInput) nameInput.focus();
      else if (!email && emailInput) emailInput.focus();
      else if (!phone && phoneInput) phoneInput.focus();
      return;
    }

    const payload = {
      fullName: name,
      email: email,
      phone: phone,
      realtorStatus: realtorStatus,
      suitePreference: suitePreference,
      suiteInterest: suitePreference,
      subscribeNewsletter: subscribeNewsletter,
      source: "Direct Contact Form",
      timestamp: new Date().toISOString()
    };

    const submitBtn = document.getElementById("btn-submit-lead");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending Message...";
    }

    try {
      const response = await fetch(getApiUrl("/api/leads"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Server responded with " + response.status);
      }
    } catch (err) {
      console.warn("Network issue saving lead, storing locally:", err);
      try {
        const stored = JSON.parse(localStorage.getItem("lawrence_hill_leads") || "[]");
        stored.push(payload);
        localStorage.setItem("lawrence_hill_leads", JSON.stringify(stored));
      } catch (localErr) {
        console.error("Local storage fallback error:", localErr);
      }
    }

    // Display Success
    const formGroups = form.querySelectorAll(".form-group, #btn-submit-lead");
    formGroups.forEach(el => el.style.display = "none");
    if (successBox) {
      successBox.classList.add("active");
      successBox.style.display = "block";
    }
    const successMsg = document.getElementById("success-message");
    if (successMsg) {
      const newsletterNote = subscribeNewsletter
        ? `<div style="margin-top: 12px; font-size: 0.8125rem; color: #575249; background: #f6f3ee; padding: 10px 14px; border-radius: 4px; border-left: 3px solid #b87333;">You have also been subscribed to Jeffrey Shew's Private Pre-Construction &amp; Investor Briefing.</div>`
        : '';
      const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
      successMsg.innerHTML = `
        Thank you, <strong>${esc(name)}</strong>. Your inquiry has been directly registered.<br><br>
        Jeffrey Shew, Broker (647-503-2768) will contact you directly to discuss suite allocations and private viewing access to Model Suite 62.
        ${newsletterNote}
      `;
    }
  });
}
// --- Mortgage & Monthly Carrying Cost Calculator ---
function initMortgageCalculator() {
  const priceSlider = document.getElementById('calc-price-slider');
  const priceDisplay = document.getElementById('calc-price-display');
  const rateSlider = document.getElementById('calc-rate-slider');
  const rateDisplay = document.getElementById('calc-rate-display');
  const downPercentLabel = document.getElementById('calc-down-percent-label');
  const downAmountDisplay = document.getElementById('calc-down-amount-display');
  const amortDisplay = document.getElementById('calc-amort-display');

  const totalMonthlyDisplay = document.getElementById('calc-total-monthly');
  const mortgageMonthlyDisplay = document.getElementById('calc-mortgage-monthly');
  const maintenanceDisplay = document.getElementById('calc-maintenance-monthly');
  const taxMonthlyDisplay = document.getElementById('calc-tax-monthly');
  const loanTotalDisplay = document.getElementById('calc-loan-total');
  const depositCalloutVal = document.getElementById('calc-deposit-callout-val');

  if (!priceSlider) return;

  let currentDownPercent = 5;
  let currentAmortYears = 25;

  const fmt = (num) => '$' + Math.round(num).toLocaleString('en-US');

  function calculate() {
    const price = parseFloat(priceSlider.value);
    const rate = parseFloat(rateSlider.value);
    const downAmount = price * (currentDownPercent / 100);
    const principal = price - downAmount;

    // Monthly interest calculation
    const monthlyRate = (rate / 100) / 12;
    const totalPayments = currentAmortYears * 12;
    const monthlyMortgage = (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
                            (Math.pow(1 + monthlyRate, totalPayments) - 1);

    const monthlyMaintenance = 178.60; // 2-bed suite baseline maintenance fee
    const monthlyTax = (price * 0.0065) / 12; // Approx 0.65% Toronto mill rate
    const totalMonthly = monthlyMortgage + monthlyMaintenance + monthlyTax;

    // Update displays
    priceDisplay.textContent = fmt(price);
    rateDisplay.textContent = rate.toFixed(2) + '%';
    downPercentLabel.textContent = currentDownPercent + '%';
    downAmountDisplay.textContent = fmt(downAmount);
    amortDisplay.textContent = currentAmortYears + ' Years';

    totalMonthlyDisplay.innerHTML = fmt(totalMonthly) + ' <span style="font-size: 1rem; font-weight: 500; color: var(--color-ink-muted);">/ mo</span>';
    mortgageMonthlyDisplay.textContent = fmt(monthlyMortgage) + ' / mo';
    maintenanceDisplay.textContent = '$' + monthlyMaintenance.toFixed(2) + ' / mo';
    taxMonthlyDisplay.textContent = '$' + monthlyTax.toFixed(2) + ' / mo';
    loanTotalDisplay.textContent = fmt(principal);
    depositCalloutVal.textContent = fmt(price * 0.05);
  }

  // Event Listeners for Sliders
  priceSlider.addEventListener('input', calculate);
  rateSlider.addEventListener('input', calculate);

  // Down Payment Pills
  const downPills = document.querySelectorAll('[data-percent]');
  downPills.forEach(pill => {
    pill.addEventListener('click', () => {
      downPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentDownPercent = parseInt(pill.getAttribute('data-percent'), 10);
      calculate();
    });
  });

  // Amortization Pills
  const amortPills = document.querySelectorAll('[data-amort]');
  amortPills.forEach(pill => {
    pill.addEventListener('click', () => {
      amortPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentAmortYears = parseInt(pill.getAttribute('data-amort'), 10);
      calculate();
    });
  });

  // Initial calculation
  calculate();
}

// --- What's Nearby Category Tabs ---
function initNearbyTabs() {
  const tabs = document.querySelectorAll('.nearby-tab-btn');
  const panels = document.querySelectorAll('.nearby-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const category = tab.getAttribute('data-category');
      const targetPanel = document.getElementById('nearby-' + category);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// --- Amenities Accordion Drawer Toggles ---
function initAmenitiesAccordion() {
  const triggers = document.querySelectorAll('.amenity-accordion-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-target');
      const body = document.getElementById(targetId);
      if (body) {
        const isOpen = body.classList.contains('open');
        body.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen);
      }
    });
  });
}


// --- Sub-Navigation Controller (Scrolling Fatigue Elimination) ---
function initSubNavTabs() {
  const tabs = document.querySelectorAll('.sub-nav-btn');
  const panels = document.querySelectorAll('.editorial-tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      activateTab(targetTab);
    });
  });

  function activateTab(tabName) {
    tabs.forEach(t => {
      const isMatch = t.getAttribute('data-tab') === tabName;
      t.classList.toggle('active', isMatch);
      t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    panels.forEach(p => {
      const isMatch = p.id === `panel-${tabName}`;
      p.classList.toggle('active', isMatch);
    });

    if (tabName === 'neighborhood') {
      window.dispatchEvent(new Event('resize'));
      if (window.curlewMap) {
        setTimeout(() => {
          window.curlewMap.invalidateSize();
        }, 100);
      }
    }
  }

  // Handle external or in-page hash links targeting specific panels
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#floorplans' || href === '#mortgage-calculator') {
        activateTab('suites');
      } else if (href === '#location-map' || href === '#whats-nearby' || href === '#neighborhood') {
        activateTab('neighborhood');
      } else if (href === '#incentives' || href === '#overview') {
        activateTab('overview');
      } else if (href === '#concrete' || href === '#specs') {
        activateTab('building');
      }
    });
  });
}

// --- Unified Interactive Neighborhood & Transit Map Control Center ---
const nearbyLocations = [
  // Transit & Commute
  {
    id: 'ttc-54',
    name: 'TTC Route 54 / 54A Bus',
    category: 'transit',
    categoryLabel: 'Transit',
    distance: 'At Doorstep',
    lat: 43.7445,
    lng: -79.3242,
    desc: 'Direct frequent bus along Lawrence Ave E connecting to Lawrence East Station & Line 1 Subway.'
  },
  {
    id: 'dvp',
    name: 'Don Valley Parkway (DVP)',
    category: 'transit',
    categoryLabel: 'Highway',
    distance: '3 Min Drive',
    lat: 43.7420,
    lng: -79.3140,
    desc: 'Express highway corridor taking you into downtown Toronto Financial District in ~18 minutes.'
  },
  {
    id: 'hwy-401',
    name: 'Highway 401 Corridor',
    category: 'transit',
    categoryLabel: 'Highway',
    distance: '5 Min Drive',
    lat: 43.7650,
    lng: -79.3300,
    desc: 'Rapid east-west highway connecting to Pearson International Airport, Markham, and York Region.'
  },
  {
    id: 'oriole-go',
    name: 'Oriole GO Train Station',
    category: 'transit',
    categoryLabel: 'Commuter Rail',
    distance: '8 Min Drive',
    lat: 43.7658,
    lng: -79.3648,
    desc: 'Richmond Hill GO line connecting to Union Station in downtown Toronto in just 2 stops.'
  },

  // Parks & Ravines
  {
    id: 'charles-sauriol',
    name: 'Charles Sauriol Conservation Reserve',
    category: 'parks',
    categoryLabel: 'Conservation',
    distance: '500 M Walk',
    lat: 43.7380,
    lng: -79.3180,
    desc: 'Pristine Don River ravine forest with paved walking trails, cycling paths, and scenic lookouts.'
  },
  {
    id: 'moccasin-trail',
    name: 'Moccasin Trail Park & Rainbow Tunnel',
    category: 'parks',
    categoryLabel: 'Park & Trail',
    distance: '4 Min Drive',
    lat: 43.7350,
    lng: -79.3280,
    desc: 'Picturesque park system renowned for Toronto’s painted rainbow tunnel and woodland canopy paths.'
  },
  {
    id: 'brookbanks-park',
    name: 'Brookbanks Park & Nature Trails',
    category: 'parks',
    categoryLabel: 'Park & Trail',
    distance: '3 Min Drive',
    lat: 43.7510,
    lng: -79.3260,
    desc: 'Sprawling community green space featuring running tracks, play areas, and shaded walking loops.'
  },
  {
    id: 'donalda-golf',
    name: 'Donalda Golf & Country Club',
    category: 'parks',
    categoryLabel: 'Private Club',
    distance: '5 Min Drive',
    lat: 43.7480,
    lng: -79.3380,
    desc: 'Prestigious championship 18-hole private golf course nestled in the scenic Don Valley.'
  },

  // Shopping & Dining
  {
    id: 'shops-don-mills',
    name: 'CF Shops at Don Mills',
    category: 'shopping',
    categoryLabel: 'Luxury Retail',
    distance: '4 Min Drive',
    lat: 43.7352,
    lng: -79.3444,
    desc: 'Toronto’s premier open-air lifestyle center with VIP Cineplex Cinemas, McEwan Gourmet Food Hall & Joey.'
  },
  {
    id: 'parkway-mall',
    name: 'Parkway Mall (Metro & LCBO)',
    category: 'shopping',
    categoryLabel: 'Groceries & Daily',
    distance: '3 Min Drive',
    lat: 43.7540,
    lng: -79.3130,
    desc: 'Convenient daily essentials mall featuring Metro supermarket, LCBO, pharmacy, and medical clinics.'
  },
  {
    id: 'fairview-mall',
    name: 'CF Fairview Mall & Subway',
    category: 'shopping',
    categoryLabel: 'Major Mall',
    distance: '8 Min Drive',
    lat: 43.7780,
    lng: -79.3440,
    desc: 'Major shopping center with 160+ stores, dining terrace, and direct Line 4 subway connection.'
  },

  // Schools
  {
    id: 'norman-ingram',
    name: 'Norman Ingram Public School',
    category: 'schools',
    categoryLabel: 'Elementary',
    distance: 'Top 5% Toronto',
    lat: 43.7400,
    lng: -79.3400,
    desc: 'Consistently top-ranked public elementary school with stellar academic ratings and sports programs.'
  },
  {
    id: 'don-mills-ci',
    name: 'Don Mills Collegiate Institute',
    category: 'schools',
    categoryLabel: 'Secondary',
    distance: 'Renowned Gifted',
    lat: 43.7370,
    lng: -79.3420,
    desc: 'Acclaimed public high school featuring specialized Gifted and CyberArts academic programs.'
  },
  {
    id: 'crestwood',
    name: 'Crestwood Preparatory College',
    category: 'schools',
    categoryLabel: 'Private Prep',
    distance: 'Private Elite',
    lat: 43.7490,
    lng: -79.3350,
    desc: 'Prestigious non-denominational university preparatory private day school.'
  }
];

function initInteractiveMap() {
  const mapElement = document.getElementById('interactive-leaflet-map');
  const sidebar = document.getElementById('map-locations-sidebar');
  const filterBtns = document.querySelectorAll('.map-chip-btn');
  const destName = document.getElementById('selected-dest-name');
  const destDetails = document.getElementById('selected-dest-details');
  const resetBtn = document.getElementById('btn-reset-map');
  const directionsBtn = document.getElementById('btn-google-directions');

  if (!mapElement || typeof L === 'undefined') return;

  const curlewCoords = [43.7431, -79.3248];

  // Initialize Leaflet Map with attribution tag removed
  const map = L.map('interactive-leaflet-map', {
    center: curlewCoords,
    zoom: 14,
    scrollWheelZoom: false,
    attributionControl: false // Completely removes Leaflet tag & watermark
  });
  window.curlewMap = map;

  // View Mode Tile Layers (Zero Watermarks, Zero API Keys, Ultra-Clean Luxury Cartography)
  const tileLayers = {
    architectural: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }),
    streets: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    })
  };

  let activeTileLayer = tileLayers.architectural;
  activeTileLayer.addTo(map);

  // Map View Switcher Controls
  const viewBtns = document.querySelectorAll('.map-view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const viewMode = btn.getAttribute('data-view');
      if (tileLayers[viewMode] && tileLayers[viewMode] !== activeTileLayer) {
        map.removeLayer(activeTileLayer);
        activeTileLayer = tileLayers[viewMode];
        activeTileLayer.addTo(map);
      }
    });
  });

  // Model Suite Anchor Marker
  const curlewIcon = L.divIcon({
    className: 'custom-leaflet-div',
    html: '<div class="map-curlew-pin" title="73 Curlew Dr · Model Suites 62 & 63">★</div>',
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  const curlewMarker = L.marker(curlewCoords, { icon: curlewIcon, zIndexOffset: 1000 }).addTo(map);
  curlewMarker.bindPopup('<strong>73 Curlew Drive · Model Suites 62 &amp; 63</strong><br>Starting from the Mid $500Ks · Fully Concrete');

  // Markers Dictionary
  const markers = {};

  // Build Amenity Markers
  nearbyLocations.forEach(loc => {
    const amenityIcon = L.divIcon({
      className: 'custom-leaflet-div',
      html: `<div class="map-amenity-pin" id="pin-${loc.id}" title="${loc.name} (${loc.distance})">●</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([loc.lat, loc.lng], { icon: amenityIcon }).addTo(map);
    marker.bindPopup(`<strong>${loc.name}</strong><br><span style="color:#2d5a37; font-weight:700;">${loc.distance}</span> · ${loc.categoryLabel}<br><small>${loc.desc}</small>`);
    
    marker.on('click', () => {
      selectLocation(loc);
    });

    markers[loc.id] = marker;
  });

  let activeFilter = 'all';

  function renderSidebarCards() {
    if (!sidebar) return;
    sidebar.innerHTML = '';

    const filtered = activeFilter === 'all' 
      ? nearbyLocations 
      : nearbyLocations.filter(loc => loc.category === activeFilter);

    filtered.forEach(loc => {
      const card = document.createElement('div');
      card.className = 'map-location-card';
      card.id = `card-${loc.id}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div>
          <div class="loc-title">${loc.name}</div>
          <div class="loc-type">${loc.categoryLabel} &middot; ${loc.desc.substring(0, 48)}...</div>
        </div>
        <span class="loc-dist">${loc.distance}</span>
      `;

      card.addEventListener('click', () => {
        selectLocation(loc);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectLocation(loc);
        }
      });

      sidebar.appendChild(card);
    });
  }

  function selectLocation(loc) {
    // Highlight sidebar card
    document.querySelectorAll('.map-location-card').forEach(c => c.classList.remove('active'));
    const targetCard = document.getElementById(`card-${loc.id}`);
    if (targetCard) {
      targetCard.classList.add('active');
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Pan map & open popup
    map.flyTo([loc.lat, loc.lng], 15, { duration: 0.8 });
    const m = markers[loc.id];
    if (m) {
      m.openPopup();
    }

    // Update destination bar
    if (destName) destName.textContent = loc.name;
    if (destDetails) destDetails.textContent = `${loc.distance} from 73 Curlew Dr · ${loc.desc}`;
    if (directionsBtn) {
      directionsBtn.href = `https://www.google.com/maps/dir/?api=1&origin=73+Curlew+Drive+North+York+ON&destination=${encodeURIComponent(loc.name + ' Toronto')}`;
      directionsBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
        <span>Route Directions</span>
      `;
    }
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');

      // Show/hide markers
      const group = [curlewMarker];
      nearbyLocations.forEach(loc => {
        const m = markers[loc.id];
        if (activeFilter === 'all' || loc.category === activeFilter) {
          if (!map.hasLayer(m)) map.addLayer(m);
          group.push(m);
        } else {
          if (map.hasLayer(m)) map.removeLayer(m);
        }
      });

      const featureGroup = L.featureGroup(group);
      map.fitBounds(featureGroup.getBounds().pad(0.15));

      renderSidebarCards();
    });
  });

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      map.flyTo(curlewCoords, 14, { duration: 0.8 });
      curlewMarker.openPopup();
      document.querySelectorAll('.map-location-card').forEach(c => c.classList.remove('active'));
      if (destName) destName.textContent = '73 Curlew Drive · Model Suites 62 & 63';
      if (destDetails) destDetails.textContent = 'Lawrence Hill Luxury Urban Towns · Starting Mid $500Ks';
      if (directionsBtn) {
        directionsBtn.href = 'https://www.google.com/maps/search/?api=1&query=73+Curlew+Drive+North+York+ON+M3A+2P8';
        directionsBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
          <span>Directions</span>
        `;
      }
    });
  }

  renderSidebarCards();
}


// --- High-Intent Buyer FAQ Accordion ---
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-target');
      const content = document.getElementById(targetId);
      if (content) {
        const isOpen = content.classList.contains('open');
        content.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen);
      }
    });
  });
}


// --- Tour Booking Navigation & Synchronized State ---
function initTourBookingInteractions() {
  const bookingCard = document.getElementById("book-tour");
  const suiteSelect = document.getElementById("suite-preference");

  function triggerTourBooking(preferredSuite) {
    if (!bookingCard) return;

    // 1. Sync suite preference dropdown
    if (suiteSelect && preferredSuite) {
      for (let i = 0; i < suiteSelect.options.length; i++) {
        if (suiteSelect.options[i].value.includes(preferredSuite) || preferredSuite.includes(suiteSelect.options[i].value)) {
          suiteSelect.selectedIndex = i;
          break;
        }
      }
    }

    // 2. Smoothly center booking card in viewport
    bookingCard.scrollIntoView({ behavior: "smooth", block: "center" });

    // 3. Trigger pulse highlight animation
    bookingCard.classList.remove("highlight-pulse");
    void bookingCard.offsetWidth; // force reflow
    bookingCard.classList.add("highlight-pulse");
    setTimeout(() => {
      bookingCard.classList.remove("highlight-pulse");
    }, 2800);

    // 4. Focus tour time select or first interactive input after smooth scroll
    const nameInput = document.getElementById("lead-fullname");
    if (nameInput) {
      setTimeout(() => nameInput.focus({ preventScroll: true }), 400);
    }
  }

  // Bind clicks on dedicated plan tour buttons (.plan-tour-btn)
  const planTourBtns = document.querySelectorAll(".plan-tour-btn");
  planTourBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const suite = btn.getAttribute("data-suite") || "2-Bed (781-853 SF)";
      triggerTourBooking(suite);
    });
  });

  // Bind clicks on any anchor pointing to #book-tour (Hero CTA, Mobile sticky CTA, nav CTA)
  const bookTourLinks = document.querySelectorAll('a[href="#book-tour"]');
  bookTourLinks.forEach(link => {
    if (!link.classList.contains("plan-tour-btn") && !link.classList.contains("open-pricesheet-btn")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        triggerTourBooking();
      });
    }
  });
}

// --- VIP Price Sheet & Floor Plan Dossier Modal Controller ---
function initPriceSheetModal() {
  const modal = document.getElementById("pricesheet-modal");
  const closeBtn = document.getElementById("ps-modal-close-btn");
  const form = document.getElementById("pricesheet-submit-form");
  const formView = document.getElementById("ps-form-view");
  const successView = document.getElementById("ps-success-view");
  const openBtns = document.querySelectorAll(".open-pricesheet-btn");

  if (!modal) return;

  function openModal(defaultSuite) {
    if (defaultSuite) {
      const suiteSelect = document.getElementById("ps-interest");
      if (suiteSelect) {
        for (let i = 0; i < suiteSelect.options.length; i++) {
          if (suiteSelect.options[i].value.includes(defaultSuite) || defaultSuite.includes(suiteSelect.options[i].value)) {
            suiteSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    const nameInput = document.getElementById("ps-name");
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 150);
    }
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  openBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const suite = btn.getAttribute("data-suite");
      openModal(suite);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Form Submission & Lead Persistence
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("ps-name").value.trim();
      const email = document.getElementById("ps-email").value.trim();
      const phone = document.getElementById("ps-phone").value.trim();
      const suiteInterest = document.getElementById("ps-interest").value;
      const submitBtn = document.getElementById("btn-submit-pricesheet");

      if (!name || !email || !phone) {
        alert("Please complete your name, email, and phone number to unlock the official price sheet.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>Verifying &amp; Unlocking...</span>";

      const payload = {
        fullName: name,
        email: email,
        phone: phone,
        suiteInterest: suiteInterest,
        requestIncentives: true,
        source: "VIP Price Sheet Download Modal",
        timestamp: new Date().toISOString()
      };

      try {
        await fetch(getApiUrl("/api/leads"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn("Network issue saving price sheet lead, proceeding to download:", err);
      }

      // Show success view
      if (formView && successView) {
        formView.style.display = "none";
        successView.style.display = "block";

        const desc = document.getElementById("ps-success-desc");
        if (desc) {
          desc.textContent = "Thank you, " + name + "! Your VIP access is registered. Your official October 2026 Developer Price List & Incentive Dossier is ready for instant download:";
        }

        // Auto trigger download
        setTimeout(() => {
          const directLink = document.getElementById("ps-direct-download-link");
          if (directLink) {
            const dl = document.createElement("a");
            dl.href = directLink.href;
            dl.download = "Lawrence-Hill-Price-List-Incentive.pdf";
            document.body.appendChild(dl);
            dl.click();
            document.body.removeChild(dl);
          }
        }, 600);
      }
    });
  }
}


// --- Private Pre-Construction & Investor Newsletter Controller ---
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("newsletter-name");
    const emailInput = document.getElementById("newsletter-email");
    const submitBtn = document.getElementById("btn-newsletter-submit");
    const successBox = document.getElementById("newsletter-success");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";

    if (!email || !email.includes("@")) {
      if (emailInput) emailInput.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Subscribing...";
    }

    const payload = {
      name: name || "Anonymous Investor",
      email: email,
      interests: ["Pre-Construction Allocations", "Real Estate Investing", "Toronto Builder Assignments"],
      source: "Lawrence Hill Landing Page Footer Newsletter",
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(getApiUrl("/api/newsletter"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Server responded with " + response.status);
      }
    } catch (err) {
      console.warn("Network issue saving newsletter subscriber, saving locally:", err);
      try {
        const stored = JSON.parse(localStorage.getItem("lh_subscribers") || "[]");
        stored.push(payload);
        localStorage.setItem("lh_subscribers", JSON.stringify(stored));
      } catch (localErr) {
        console.error("Local fallback error:", localErr);
      }
    }

    // Success UI
    const inputsRow = form.querySelector(".newsletter-inputs");
    const disclaimer = form.querySelector(".newsletter-disclaimer");
    if (inputsRow) inputsRow.style.display = "none";
    if (disclaimer) disclaimer.style.display = "none";
    if (successBox) {
      successBox.style.display = "flex";
    }
  });
}


// --- Open House Guest Sign-In Experience (Hard-Gated on ?openhouse=true) ---
function initOpenHouseSign() {
  const modal = document.getElementById("openhouse-modal");
  if (!modal) return;

  const form = document.getElementById("openhouse-submit-form");
  const exploreBtn = document.getElementById("oh-explore-landing-btn");
  const successCloseBtn = document.getElementById("oh-success-close-btn");

  function openOpenHouse() {
    modal.style.display = "flex";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeOpenHouse() {
    modal.style.display = "none";
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Opened from the Halloween pop-up: web visitors may close it (QR visitors stay gated)
  document.addEventListener("open-house:open", () => {
    modal.classList.add("promo");
    openOpenHouse();
    setTimeout(() => document.getElementById("oh-first-name")?.focus(), 150);
  });
  const dismissPromo = () => { closeOpenHouse(); modal.classList.remove("promo"); };
  document.getElementById("oh-dismiss-btn")?.addEventListener("click", dismissPromo);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("promo") && modal.classList.contains("active")) dismissPromo();
  });

  // Dismissal is ONLY allowed after registration on the success screen
  if (exploreBtn) exploreBtn.addEventListener("click", closeOpenHouse);
  if (successCloseBtn) successCloseBtn.addEventListener("click", closeOpenHouse);

  // Activate via URL parameter: ?openhouse=true, ?openhouse=1, or hash #open-house
  const searchParams = new URLSearchParams(window.location.search);
  const isOhParam = searchParams.get("openhouse") === "true" || searchParams.get("openhouse") === "1" || searchParams.has("openhouse");
  const isOhHash = window.location.hash === "#open-house" || window.location.hash === "#openhouse";

  if (isOhParam || isOhHash) {
    setTimeout(openOpenHouse, 120);
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const firstName = (document.getElementById("oh-first-name")?.value || "").trim();
      const lastName = (document.getElementById("oh-last-name")?.value || "").trim();
      const phone = (document.getElementById("oh-phone")?.value || "").trim();
      const email = (document.getElementById("oh-email")?.value || "").trim();
      const timeline = document.getElementById("oh-timeline")?.value || "Immediate (30–90 Days)";
      const budgetRange = document.getElementById("oh-budget-range")?.value || "$550,000 – $600,000";
      const realtorStatus = document.getElementById("oh-realtor-status")?.value || "No Realtor / Direct Buyer";
      const newsletterOptin = document.getElementById("oh-newsletter-optin");
      const subscribeNewsletter = newsletterOptin ? Boolean(newsletterOptin.checked) : false;

      if (!firstName || !lastName || !phone || !email) {
        if (!firstName) document.getElementById("oh-first-name")?.focus();
        else if (!lastName) document.getElementById("oh-last-name")?.focus();
        else if (!phone) document.getElementById("oh-phone")?.focus();
        else if (!email) document.getElementById("oh-email")?.focus();
        return;
      }

      const submitBtn = document.getElementById("btn-submit-openhouse");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Unlocking Access...";
      }

      const fullName = `${firstName} ${lastName}`.trim();
      const promoMode = modal.classList.contains("promo");
      const errBox = document.getElementById("oh-error");
      if (errBox) errBox.hidden = true;
      const payload = {
        firstName,
        lastName,
        fullName,
        email,
        phone,
        timeline,
        realtorStatus,
        budgetRange,
        suitePreference: "Model Suite 62",
        suiteInterest: `Open House Sign-In (${timeline} · ${budgetRange})`,
        subscribeNewsletter,
        isOpenHouse: true,
        source: promoMode ? "Halloween RSVP (Open House form)" : "Open House QR Check-In",
        timestamp: new Date().toISOString()
      };

      let raffle = null, duplicate = false, checkedIn = false;
      try {
        const response = await fetch(getApiUrl("/api/leads"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error("Server responded with " + response.status);
        }
        const data = await response.json().catch(() => ({}));
        raffle = data.raffle || null;
        duplicate = Boolean(data.duplicate);
        checkedIn = Boolean(data.checkedIn);
      } catch (err) {
        if (promoMode) { // never claim a registration we could not save
          if (errBox) { errBox.textContent = "We could not complete your registration. Please try again, or call Jeffrey Shew at 647-503-2768."; errBox.hidden = false; }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Complete Check-In & View Floor Plans"; }
          return;
        }
        console.warn("Network issue saving open house lead, storing locally:", err);
        try {
          const stored = JSON.parse(localStorage.getItem("lawrence_hill_leads") || "[]");
          stored.push(payload);
          localStorage.setItem("lawrence_hill_leads", JSON.stringify(stored));
        } catch (localErr) {
          console.error("Local storage fallback error:", localErr);
        }
      }

      // Raffle: remember this browser registered (no promo again) and show the result
      if (raffle || duplicate || checkedIn) {
        try { if (raffle || !hwRegistered()) localStorage.setItem(HW_STORE, JSON.stringify({ entryId: (raffle || {}).entryId, name: fullName, at: Date.now() })); } catch (e) {}
      }
      if (promoMode && (raffle || duplicate)) {
        dismissPromo(); // pre-registration is done: show the confirmation screen, not the on-site "access granted" view
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Complete Check-In & View Floor Plans"; }
        showHwConfirm({ name: fullName, email, entryId: (raffle || {}).entryId, emailing: (raffle || {}).emailing, duplicate });
        return;
      }
      const raffleBox = document.getElementById("oh-raffle-box");
      if (raffleBox && (raffle || duplicate || checkedIn)) {
        const id = (raffle || {}).entryId;
        raffleBox.textContent = duplicate
          ? "This email or phone is already registered for the Halloween raffle. Each person can register once."
          : (checkedIn ? "You are checked in for the Halloween raffle draw (a $100 gift card, first week of November). " : "You are entered in the Halloween raffle draw (a $100 gift card, first week of November). ")
            + (id ? "Registration number: " + id + "." : "") + (raffle && raffle.emailing ? " A confirmation is on its way to " + email + "." : "") + " Conditions apply.";
        raffleBox.style.display = "block";
      }

      // Switch to Success View
      const formView = document.getElementById("oh-form-view");
      const successView = document.getElementById("oh-success-view");
      if (formView) formView.style.display = "none";
      if (successView) {
        successView.style.display = "block";
        const desc = document.getElementById("oh-success-desc");
        if (desc) {
          const nlText = subscribeNewsletter ? "<br><span style='display:inline-block; margin-top:8px; font-size:0.8125rem; color:#575249; background:#f6f3ee; padding:6px 12px; border-radius:4px;'>You are also subscribed to Jeffrey Shew's Private Investor Briefing.</span>" : "";
          desc.innerHTML = `Welcome to Model Suite 62, <strong>${firstName} ${lastName}</strong>. Your check-in has been registered with broker Jeffrey Shew.${nlText}`;
        }
      }
    });
  }
}

// --- Halloween Open House pop-up: every visitor once per visit, until the event ends ---
function initHalloweenPopup() {
  const pop = document.getElementById("halloween-popup");
  if (!pop) return;
  const sp = new URLSearchParams(window.location.search);
  if (sp.has("openhouse") || window.location.hash === "#open-house" || window.location.hash === "#openhouse") return; // QR guests already see the check-in
  if (Date.now() >= Date.parse("2026-10-26T00:00:00-04:00")) return; // open house is over
  if (sp.has("register")) { // came from the jeffreyshew.com pop-up: straight to the closable check-in form
    try { sessionStorage.setItem("hwSeen", "1"); } catch (e) {}
    setTimeout(() => document.dispatchEvent(new CustomEvent("open-house:open")), 120);
    return;
  }
  try { if (sessionStorage.getItem("hwSeen")) return; } catch (e) {}
  if (hwRegistered()) return; // already registered here: no promo, no second entry

  const cta = document.getElementById("hw-register-btn");
  function close() {
    pop.hidden = true;
    document.body.style.overflow = "";
    try { sessionStorage.setItem("hwSeen", "1"); } catch (e) {}
  }
  pop.querySelectorAll("[data-hw-close]").forEach((el) => el.addEventListener("click", close));
  cta.addEventListener("click", () => {
    close();
    document.dispatchEvent(new CustomEvent("open-house:open")); // same check-in form the QR opens
  });
  pop.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    const f = [...pop.querySelectorAll("button")].filter((b) => b.offsetParent !== null);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Show once the collage photos are decoded (2.5s cap) so the card never flashes half-empty
  const photosReady = Promise.race([
    Promise.all([...pop.querySelectorAll(".hw-photo")].map((img) => img.decode().catch(() => {}))),
    new Promise((r) => setTimeout(r, 2500))
  ]);
  setTimeout(async () => {
    await photosReady;
    if (document.getElementById("openhouse-modal")?.classList.contains("active")) return;
    pop.hidden = false;
    document.body.style.overflow = "hidden";
    cta.focus();
  }, 1800);
}

// --- Halloween registration confirmation screen + "already registered in this browser" memory ---
const HW_STORE = "lhHwRegistration";
function hwRegistered() {
  try { return JSON.parse(localStorage.getItem(HW_STORE) || "null"); } catch (e) { return null; }
}
function showHwConfirm({ name, entryId, email, emailing, duplicate }) {
  const box = document.getElementById("hw-confirm");
  if (!box) return;
  const first = (name || "").trim().split(/\s+/)[0] || "";
  const known = entryId || (hwRegistered() || {}).entryId;
  document.getElementById("hwc-title").textContent = duplicate ? "You're already registered" : "You're registered";
  document.getElementById("hwc-lead").textContent = duplicate
    ? (first ? first + ", t" : "T") + "his email or phone is already registered for the Halloween Open House. Each person can register once."
    : "Thank you" + (first ? ", " + first : "") + ". See you at the Halloween Open House.";
  const entry = document.getElementById("hwc-entry");
  entry.textContent = known || "";
  document.getElementById("hwc-entry-row").hidden = !known;
  document.getElementById("hwc-mail").textContent = duplicate
    ? "Please check your inbox for your confirmation."
    : (emailing && email ? "A confirmation is on its way to " + email + "." : "Please keep your registration number.");
  const promo = document.getElementById("halloween-popup");
  if (promo) promo.hidden = true; // never stack the promo under the confirmation
  box.hidden = false;
  document.body.style.overflow = "hidden";
  const done = document.getElementById("hwc-done");
  const close = () => { box.hidden = true; document.body.style.overflow = ""; box.removeEventListener("keydown", onKey); };
  const onKey = (e) => { if (e.key === "Escape") close(); else if (e.key === "Tab") { e.preventDefault(); done.focus(); } };
  box.querySelectorAll("[data-hwc-close]").forEach((el) => el.addEventListener("click", close, { once: true }));
  box.addEventListener("keydown", onKey);
  done.focus();
}
