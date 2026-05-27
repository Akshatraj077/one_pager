/* ============================================================
   OPTIGEARS — main.js
   Vanilla JS: Navbar, Hero Slider, Carousels, Counter,
   Scroll Reveal, Language Switcher, EmailJS Form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. NAVBAR — Scroll shadow + hamburger + mobile submenus
  // ============================================================
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Mobile submenus
  document.querySelectorAll('.mobile-has-sub').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      if (sub && sub.classList.contains('mobile-submenu')) {
        sub.classList.toggle('open');
      }
    });
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Active nav link tracking
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current || 
          (current === 'home' && link.getAttribute('href') === '#home')) {
        link.classList.add('active');
      }
    });
  });

  // ============================================================
  // 2. HERO SLIDER — Opacity fade, auto-advance, pause on hover
  // ============================================================
  const heroSlides = document.querySelectorAll('.hero__slide');
  const heroSlideName = document.getElementById('hero-slide-name');
  const heroPrev = document.getElementById('hero-prev');
  const heroNext = document.getElementById('hero-next');
  const slideNames = [
    'Screw Conveyor Gearbox',
    'Taper Lock Pulley',
    'Inline Helical GearBox',
    'Round Shaft (OT Series)',
    'Shaft Mounted Speed Reducer'
  ];

  let heroIndex = 0;
  let heroTimer = null;
  let heroPaused = false;

  function showHeroSlide(index) {
    heroSlides.forEach(s => s.classList.remove('active'));
    heroSlides[index].classList.add('active');
    if (heroSlideName) heroSlideName.textContent = slideNames[index];
  }

  function nextHeroSlide() {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(heroIndex);
  }

  function prevHeroSlide() {
    heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
    showHeroSlide(heroIndex);
  }

  function startHeroTimer() {
    heroTimer = setInterval(() => {
      if (!heroPaused) nextHeroSlide();
    }, 4000);
  }

  if (heroNext) heroNext.addEventListener('click', () => { nextHeroSlide(); resetHeroTimer(); });
  if (heroPrev) heroPrev.addEventListener('click', () => { prevHeroSlide(); resetHeroTimer(); });

  function resetHeroTimer() {
    clearInterval(heroTimer);
    startHeroTimer();
  }

  // Pause on hover
  const sliderCard = document.querySelector('.hero__slider-card');
  if (sliderCard) {
    sliderCard.addEventListener('mouseenter', () => { heroPaused = true; });
    sliderCard.addEventListener('mouseleave', () => { heroPaused = false; });
  }

  startHeroTimer();

  // ============================================================
  // 3. CAROUSELS — Products & Gallery
  // ============================================================
  function initCarousel(trackId, navId) {
    const track = document.getElementById(trackId);
    const nav = document.getElementById(navId);
    if (!track || !nav) return;

    const cards = track.children;
    let offset = 0;
    const gap = 24;

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w <= 480) return 1;
      if (w <= 768) return 2;
      if (w <= 1024) return 3;
      return 4;
    }

    function updatePosition() {
      const wrapperW = track.parentElement.getBoundingClientRect().width;
      const visible = getVisibleCount();
      const cardW = (wrapperW - (gap * (visible - 1))) / visible;
      
      Array.from(cards).forEach(c => {
         c.style.minWidth = `${cardW}px`;
         c.style.maxWidth = `${cardW}px`;
      });

      track.style.transform = `translateX(-${offset * (cardW + gap)}px)`;
    }

    function maxOffset() {
      const visible = getVisibleCount();
      return Math.max(0, cards.length - visible);
    }

    nav.querySelectorAll('.carousel-nav__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.getAttribute('data-dir');
        if (dir === 'next' && offset < maxOffset()) {
          offset++;
        } else if (dir === 'prev' && offset > 0) {
          offset--;
        }
        updatePosition();
      });
    });

    // Initialize layout
    updatePosition();

    // Reset on resize
    window.addEventListener('resize', () => {
      offset = Math.min(offset, maxOffset());
      updatePosition();
    });
  }

  initCarousel('products-track', 'products-nav');
  initCarousel('gallery-track', 'gallery-nav');

  // ============================================================
  // 4. COUNTER ANIMATION — IntersectionObserver + RAF
  // ============================================================
  const counters = document.querySelectorAll('.stats-bar__number');
  let counterDone = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);

      if (target >= 10000) {
        el.textContent = value.toLocaleString() + '+';
      } else if (target >= 100) {
        el.textContent = value.toLocaleString() + '+';
      } else {
        el.textContent = value + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterDone) {
        counterDone = true;
        counters.forEach(c => animateCounter(c));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) statsObserver.observe(statsSection);

  // ============================================================
  // 5. SCROLL REVEAL — IntersectionObserver
  // ============================================================
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ============================================================
  // 6. LANGUAGE SWITCHER
  // ============================================================
  const langSwitcher = document.getElementById('lang-switcher');
  const langOptions = document.querySelectorAll('.navbar__lang-option');
  const langNameEl = document.querySelector('.lang-name');

  // Toggle dropdown
  if (langSwitcher) {
    const langBtn = langSwitcher.querySelector('.navbar__lang-btn');
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langSwitcher.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      langSwitcher.classList.remove('open');
    });
  }

  // Translations
  const translations = {
    en: {
      top_cert: 'Certificate No. 3050231221746Q',
      top_call: 'Call +919868157136',
      top_contact: 'Contact Us',
      nav_home: 'HOME',
      nav_about: 'ABOUT US',
      nav_product: 'OUR PRODUCT',
      nav_catalog: 'OUR CATALOGUE',
      nav_gallery: 'GALLERY',
      hero_label: 'Precision Industrial',
      hero_heading_1: 'Gear & Power',
      hero_heading_2: 'Transmission',
      hero_heading_3: 'Solution',
      hero_sub: 'Trusted Manufacturer Of Gearboxes, Taper Lock Pulleys And Conveyor Gear Systems For Heavy Industry.',
      btn_quote: 'GET INSTANT QUOTE',
      btn_read_more: 'READ MORE',
      stat_exp: 'YEARS OF EXPERIENCE',
      stat_units: 'UNITS DELIVERED',
      stat_customers: 'HAPPY CUSTOMER',
      intro_text: '<strong>JRB Engineering Works</strong> has modern machines, a dedicated tool room, and an in-house R&D team. Every product undergoes strict quality checks before dispatch to ensure top performance.',
      new_prod_title: 'New Products',
      new_prod_sub: 'Explore our latest additions to the gear transmission lineup — precision-engineered for heavy-duty industrial performance and long-term operational reliability.',
      about_quality_title: 'Quality',
      about_quality_text: 'We place a high value on quality and go above and beyond to meet the established product requirements.',
      about_title: 'About Us',
      about_text: 'JRB ENGINEERING WORKS Is Equipped With Latest Machines With A Separate Tool Room Arrangement. We Have Our Own R&D Department Under The Supervision Of Well Qualified And Technically Sound Engineers. We Keep On Developing New Products For Our Customers. Before Dispatch Quality Control Department Screens Every Piece To Ensure Best Performance.',
      about_chk_1: 'ISO Certified',
      about_chk_2: 'Custom Engineering',
      about_chk_3: 'Pan India Supply',
      mission_title: 'Our Mission',
      mission_text: 'Our goal is to maintain quality control and innovative production that enables us to raise client satisfaction levels.',
      vision_title: 'Our Vission',
      vision_text: 'We are aware that replacement costs for products go beyond their initial price. It involves lost manpower and downtime.',
      trusted_title: 'Trusted by Leading Industrial Companies',
      contact_title: 'Connect With Us For Inquiries!',
      form_name: 'Name',
      form_phone: 'Phone',
      form_email: 'Email',
      form_address: 'Address',
      form_message: 'Message',
      form_btn: 'REQUEST PRICE QUOTE',
      gallery_title: 'Our Gallery',
      reach_title: 'Reach Us',
      reach_visit: 'VISIT OUR OFFICE',
      reach_address: 'C-30/10, Mayapuri Industrial Area, Phase-II, NewDelhi-110064, Delhi',
      reach_talk: "LET'S TALK",
      reach_email_title: 'E-MAIL US',
      iso_cta_title: 'Looking For Industrial Gear Solutions?',
      iso_chk_1: 'Custom Gearbox Manufacturing',
      iso_chk_2: 'Heavy Duty Industrial Components',
      iso_chk_3: 'Fast Quotation Support',
      footer_topline: 'Get More Detail For Product.',
      footer_contact_heading: 'Contact Us',
      footer_address_label: 'Address',
      footer_address: 'C-3/10, Mayapuri Industrial Area, Phase-II, New Delhi - 110064, India',
      footer_tel_label: 'Telephone No.',
      footer_mobile_label: 'Mobile No.',
      footer_email_label: 'E-Mail',
      footer_quicklink_heading: 'Quick Link',
      footer_product_heading: 'Our Product',
      prod_taper_lock: 'Taper Lock Pulley',
      prod_inline_helical: 'Inline Helical GearBox',
      prod_v_belt: 'Transmission V-Belt',
      prod_parallel: 'Parallel Shaft Gearbox',
      prod_screw_conveyor: 'Screw Conveyor Gearbox',
      prod_speed_reducer: 'Shaft Mounted Speed Reducer',
      prod_round_shaft: 'Round Shaft (OT Series)',
      prod_ground_gear: 'Ground Gear & Shaft',
      prod_industrial: 'Industrial Gearbox'
    },
    es: {
      top_cert: 'Certificado N.º 3050231221746Q',
      top_call: 'Llamar +919868157136',
      top_contact: 'Contáctenos',
      nav_home: 'INICIO',
      nav_about: 'SOBRE NOSOTROS',
      nav_product: 'NUESTROS PRODUCTOS',
      nav_catalog: 'NUESTRO CATÁLOGO',
      nav_gallery: 'GALERÍA',
      hero_label: 'Industrial de Precisión',
      hero_heading_1: 'Engranajes y',
      hero_heading_2: 'Transmisión',
      hero_heading_3: 'de Potencia',
      hero_sub: 'Fabricante confiable de cajas de engranajes, poleas de bloqueo cónico y sistemas de engranajes transportadores para la industria pesada.',
      btn_quote: 'OBTENER COTIZACIÓN',
      btn_read_more: 'LEER MÁS',
      stat_exp: 'AÑOS DE EXPERIENCIA',
      stat_units: 'UNIDADES ENTREGADAS',
      stat_customers: 'CLIENTES SATISFECHOS',
      intro_text: '<strong>JRB Engineering Works</strong> cuenta con maquinaria moderna, un taller dedicado y un equipo de I+D interno. Cada producto pasa controles de calidad estrictos antes del envío.',
      new_prod_title: 'Nuevos Productos',
      new_prod_sub: 'Explore nuestras últimas incorporaciones a la línea de transmisión de engranajes, diseñadas para rendimiento industrial pesado y fiabilidad operativa a largo plazo.',
      about_quality_title: 'Calidad',
      about_quality_text: 'Valoramos mucho la calidad y vamos más allá para cumplir con los requisitos establecidos.',
      about_title: 'Sobre Nosotros',
      about_text: 'JRB ENGINEERING WORKS está equipado con las últimas máquinas con un taller separado. Tenemos nuestro propio departamento de I+D bajo la supervisión de ingenieros calificados.',
      about_chk_1: 'Certificación ISO',
      about_chk_2: 'Ingeniería Personalizada',
      about_chk_3: 'Suministro en toda la India',
      mission_title: 'Nuestra Misión',
      mission_text: 'Nuestro objetivo es mantener el control de calidad y la producción innovadora que nos permita elevar los niveles de satisfacción del cliente.',
      vision_title: 'Nuestra Visión',
      vision_text: 'Somos conscientes de que los costos de reemplazo de productos van más allá de su precio inicial. Implica mano de obra perdida y tiempo de inactividad.',
      trusted_title: 'Confianza de Empresas Industriales Líderes',
      contact_title: '¡Conéctese Con Nosotros Para Consultas!',
      form_name: 'Nombre',
      form_phone: 'Teléfono',
      form_email: 'Correo',
      form_address: 'Dirección',
      form_message: 'Mensaje',
      form_btn: 'SOLICITAR COTIZACIÓN',
      gallery_title: 'Nuestra Galería',
      reach_title: 'Contáctenos',
      reach_visit: 'VISITE NUESTRA OFICINA',
      reach_address: 'C-30/10, Área Industrial Mayapuri, Fase-II, Nueva Delhi-110064, Delhi',
      reach_talk: 'HABLEMOS',
      reach_email_title: 'ESCRÍBANOS',
      iso_cta_title: '¿Busca Soluciones de Engranajes Industriales?',
      iso_chk_1: 'Fabricación de Cajas Personalizadas',
      iso_chk_2: 'Componentes Industriales Pesados',
      iso_chk_3: 'Soporte de Cotización Rápida',
      footer_topline: 'Obtenga Más Detalles del Producto.',
      footer_contact_heading: 'Contáctenos',
      footer_address_label: 'Dirección',
      footer_address: 'C-3/10, Área Industrial Mayapuri, Fase-II, Nueva Delhi - 110064, India',
      footer_tel_label: 'Teléfono',
      footer_mobile_label: 'Móvil',
      footer_email_label: 'Correo',
      footer_quicklink_heading: 'Enlaces Rápidos',
      footer_product_heading: 'Nuestros Productos',
      prod_taper_lock: 'Polea de Bloqueo Cónico',
      prod_inline_helical: 'Caja Helicoidal en Línea',
      prod_v_belt: 'Correa V de Transmisión',
      prod_parallel: 'Caja de Eje Paralelo',
      prod_screw_conveyor: 'Caja de Transportador de Tornillo',
      prod_speed_reducer: 'Reductor de Velocidad de Eje',
      prod_round_shaft: 'Eje Redondo (Serie OT)',
      prod_ground_gear: 'Engranaje Rectificado y Eje',
      prod_industrial: 'Caja de Engranajes Industrial'
    },
    fr: {
      top_cert: 'Certificat N° 3050231221746Q',
      top_call: 'Appeler +919868157136',
      top_contact: 'Contactez-nous',
      nav_home: 'ACCUEIL',
      nav_about: 'À PROPOS',
      nav_product: 'NOS PRODUITS',
      nav_catalog: 'NOTRE CATALOGUE',
      nav_gallery: 'GALERIE',
      hero_label: 'Industriel de Précision',
      hero_heading_1: 'Engrenages et',
      hero_heading_2: 'Transmission',
      hero_heading_3: 'de Puissance',
      hero_sub: 'Fabricant de confiance de réducteurs, poulies à moyeu amovible et systèmes de convoyage pour l\'industrie lourde.',
      btn_quote: 'DEMANDER UN DEVIS',
      btn_read_more: 'EN SAVOIR PLUS',
      stat_exp: 'ANNÉES D\'EXPÉRIENCE',
      stat_units: 'UNITÉS LIVRÉES',
      stat_customers: 'CLIENTS SATISFAITS',
      intro_text: '<strong>JRB Engineering Works</strong> dispose de machines modernes, d\'un atelier d\'outillage dédié et d\'une équipe R&D interne.',
      new_prod_title: 'Nouveaux Produits',
      new_prod_sub: 'Découvrez nos derniers ajouts à la gamme de transmission — conçus pour des performances industrielles lourdes et une fiabilité à long terme.',
      about_quality_title: 'Qualité',
      about_quality_text: 'Nous accordons une grande valeur à la qualité et allons au-delà pour répondre aux exigences établies.',
      about_title: 'À Propos',
      about_text: 'JRB ENGINEERING WORKS est équipé des dernières machines avec un atelier d\'outillage séparé et un département R&D propre.',
      about_chk_1: 'Certifié ISO',
      about_chk_2: 'Ingénierie Personnalisée',
      about_chk_3: 'Livraison Pan-Inde',
      mission_title: 'Notre Mission',
      mission_text: 'Maintenir le contrôle qualité et la production innovante pour augmenter la satisfaction client.',
      vision_title: 'Notre Vision',
      vision_text: 'Nous savons que les coûts de remplacement dépassent le prix initial. Cela implique une perte de main-d\'œuvre et des temps d\'arrêt.',
      trusted_title: 'La Confiance des Leaders Industriels',
      contact_title: 'Contactez-nous Pour Vos Demandes!',
      form_name: 'Nom', form_phone: 'Téléphone', form_email: 'E-mail', form_address: 'Adresse', form_message: 'Message',
      form_btn: 'DEMANDER UN DEVIS',
      gallery_title: 'Notre Galerie',
      reach_title: 'Nous Joindre',
      reach_visit: 'VISITEZ NOTRE BUREAU',
      reach_address: 'C-30/10, Zone Industrielle Mayapuri, Phase-II, New Delhi-110064',
      reach_talk: 'PARLONS',
      reach_email_title: 'ÉCRIVEZ-NOUS',
      iso_cta_title: 'Vous Cherchez des Solutions d\'Engrenages?',
      iso_chk_1: 'Fabrication de Réducteurs Sur Mesure',
      iso_chk_2: 'Composants Industriels Lourds',
      iso_chk_3: 'Support Devis Rapide',
      footer_topline: 'Plus de Détails sur nos Produits.',
      footer_contact_heading: 'Contactez-nous',
      footer_address_label: 'Adresse',
      footer_address: 'C-3/10, Zone Industrielle Mayapuri, Phase-II, New Delhi - 110064, Inde',
      footer_tel_label: 'Téléphone', footer_mobile_label: 'Mobile', footer_email_label: 'E-Mail',
      footer_quicklink_heading: 'Liens Rapides',
      footer_product_heading: 'Nos Produits',
      prod_taper_lock: 'Poulie à Moyeu Amovible', prod_inline_helical: 'Réducteur Hélicoïdal', prod_v_belt: 'Courroie de Transmission',
      prod_parallel: 'Réducteur à Arbre Parallèle', prod_screw_conveyor: 'Réducteur de Convoyeur', prod_speed_reducer: 'Réducteur de Vitesse',
      prod_round_shaft: 'Arbre Rond (Série OT)', prod_ground_gear: 'Engrenage Rectifié', prod_industrial: 'Réducteur Industriel'
    },
    de: {
      top_cert: 'Zertifikat Nr. 3050231221746Q',
      top_call: 'Anrufen +919868157136',
      top_contact: 'Kontakt',
      nav_home: 'STARTSEITE',
      nav_about: 'ÜBER UNS',
      nav_product: 'UNSERE PRODUKTE',
      nav_catalog: 'UNSER KATALOG',
      nav_gallery: 'GALERIE',
      hero_label: 'Präzisionsindustrie',
      hero_heading_1: 'Getriebe &',
      hero_heading_2: 'Kraft-',
      hero_heading_3: 'übertragung',
      hero_sub: 'Vertrauenswürdiger Hersteller von Getrieben, Spannbuchsen-Riemenscheiben und Förderschneckengetrieben für die Schwerindustrie.',
      btn_quote: 'ANGEBOT ANFORDERN',
      btn_read_more: 'MEHR ERFAHREN',
      stat_exp: 'JAHRE ERFAHRUNG', stat_units: 'EINHEITEN GELIEFERT', stat_customers: 'ZUFRIEDENE KUNDEN',
      intro_text: '<strong>JRB Engineering Works</strong> verfügt über moderne Maschinen, einen eigenen Werkzeugraum und ein internes F&E-Team.',
      new_prod_title: 'Neue Produkte',
      new_prod_sub: 'Entdecken Sie unsere neuesten Getriebe — entwickelt für schwere industrielle Leistung und langfristige Zuverlässigkeit.',
      about_quality_title: 'Qualität',
      about_quality_text: 'Wir legen großen Wert auf Qualität und gehen über die etablierten Anforderungen hinaus.',
      about_title: 'Über Uns',
      about_text: 'JRB ENGINEERING WORKS ist mit den neuesten Maschinen ausgestattet, mit separatem Werkzeugraum und eigener F&E-Abteilung.',
      about_chk_1: 'ISO-zertifiziert', about_chk_2: 'Kundenspezifische Technik', about_chk_3: 'Lieferung in ganz Indien',
      mission_title: 'Unsere Mission', mission_text: 'Qualitätskontrolle und innovative Produktion zur Steigerung der Kundenzufriedenheit.',
      vision_title: 'Unsere Vision', vision_text: 'Ersatzkosten gehen über den Anfangspreis hinaus. Sie beinhalten verlorene Arbeitskraft und Ausfallzeiten.',
      trusted_title: 'Vertrauen führender Industrieunternehmen',
      contact_title: 'Kontaktieren Sie Uns!',
      form_name: 'Name', form_phone: 'Telefon', form_email: 'E-Mail', form_address: 'Adresse', form_message: 'Nachricht',
      form_btn: 'ANGEBOT ANFORDERN',
      gallery_title: 'Unsere Galerie',
      reach_title: 'Erreichen Sie Uns',
      reach_visit: 'BESUCHEN SIE UNS', reach_address: 'C-30/10, Mayapuri Industriegebiet, Phase-II, Neu-Delhi-110064',
      reach_talk: 'SPRECHEN WIR', reach_email_title: 'SCHREIBEN SIE UNS',
      iso_cta_title: 'Suchen Sie Industrielle Getriebe?',
      iso_chk_1: 'Maßgeschneiderte Getriebe', iso_chk_2: 'Schwere Industriekomponenten', iso_chk_3: 'Schnelle Angebotsunterstützung',
      footer_topline: 'Mehr Details zu Produkten.',
      footer_contact_heading: 'Kontakt', footer_address_label: 'Adresse',
      footer_address: 'C-3/10, Mayapuri Industriegebiet, Phase-II, Neu-Delhi - 110064, Indien',
      footer_tel_label: 'Telefon', footer_mobile_label: 'Mobil', footer_email_label: 'E-Mail',
      footer_quicklink_heading: 'Schnelllinks', footer_product_heading: 'Unsere Produkte',
      prod_taper_lock: 'Spannbuchsen-Riemenscheibe', prod_inline_helical: 'Inline-Schräggetriebe', prod_v_belt: 'Keilriemen',
      prod_parallel: 'Parallelwellengetriebe', prod_screw_conveyor: 'Förderschneckengetriebe', prod_speed_reducer: 'Wellenmontierter Untersetzungsgetriebe',
      prod_round_shaft: 'Rundwelle (OT-Serie)', prod_ground_gear: 'Geschliffenes Zahnrad', prod_industrial: 'Industriegetriebe'
    },
    hi: {
      top_cert: 'प्रमाणपत्र संख्या 3050231221746Q',
      top_call: 'कॉल करें +919868157136',
      top_contact: 'संपर्क करें',
      nav_home: 'होम',
      nav_about: 'हमारे बारे में',
      nav_product: 'हमारे उत्पाद',
      nav_catalog: 'हमारी सूची',
      nav_gallery: 'गैलरी',
      hero_label: 'प्रिसिजन इंडस्ट्रियल',
      hero_heading_1: 'गियर और पावर',
      hero_heading_2: 'ट्रांसमिशन',
      hero_heading_3: 'समाधान',
      hero_sub: 'भारी उद्योग के लिए गियरबॉक्स, टेपर लॉक पुली और कन्वेयर गियर सिस्टम के विश्वसनीय निर्माता।',
      btn_quote: 'तुरंत कोटेशन प्राप्त करें',
      btn_read_more: 'और पढ़ें',
      stat_exp: 'वर्षों का अनुभव', stat_units: 'यूनिट वितरित', stat_customers: 'खुश ग्राहक',
      intro_text: '<strong>JRB Engineering Works</strong> के पास आधुनिक मशीनें, एक समर्पित टूल रूम और इन-हाउस R&D टीम है।',
      new_prod_title: 'नए उत्पाद',
      new_prod_sub: 'गियर ट्रांसमिशन लाइनअप में हमारे नवीनतम उत्पादों का अन्वेषण करें।',
      about_quality_title: 'गुणवत्ता',
      about_quality_text: 'हम गुणवत्ता को बहुत महत्व देते हैं और स्थापित आवश्यकताओं को पूरा करने से परे जाते हैं।',
      about_title: 'हमारे बारे में',
      about_text: 'JRB ENGINEERING WORKS नवीनतम मशीनों से सुसज्जित है जिसमें अलग टूल रूम और R&D विभाग है।',
      about_chk_1: 'ISO प्रमाणित', about_chk_2: 'कस्टम इंजीनियरिंग', about_chk_3: 'पूरे भारत में आपूर्ति',
      mission_title: 'हमारा मिशन', mission_text: 'गुणवत्ता नियंत्रण और नवीन उत्पादन बनाए रखना जो ग्राहक संतुष्टि बढ़ाए।',
      vision_title: 'हमारा विजन', vision_text: 'हम जानते हैं कि उत्पादों की प्रतिस्थापन लागत उनकी प्रारंभिक कीमत से परे जाती है।',
      trusted_title: 'अग्रणी औद्योगिक कंपनियों द्वारा विश्वसनीय',
      contact_title: 'पूछताछ के लिए हमसे जुड़ें!',
      form_name: 'नाम', form_phone: 'फ़ोन', form_email: 'ईमेल', form_address: 'पता', form_message: 'संदेश',
      form_btn: 'मूल्य कोटेशन का अनुरोध करें',
      gallery_title: 'हमारी गैलरी',
      reach_title: 'हम तक पहुंचें',
      reach_visit: 'हमारे कार्यालय में आएं',
      reach_address: 'C-30/10, मायापुरी औद्योगिक क्षेत्र, फेज-II, नई दिल्ली-110064',
      reach_talk: 'बात करें', reach_email_title: 'ई-मेल करें',
      iso_cta_title: 'औद्योगिक गियर समाधान खोज रहे हैं?',
      iso_chk_1: 'कस्टम गियरबॉक्स निर्माण', iso_chk_2: 'भारी औद्योगिक घटक', iso_chk_3: 'त्वरित कोटेशन सहायता',
      footer_topline: 'उत्पाद के लिए अधिक विवरण प्राप्त करें।',
      footer_contact_heading: 'संपर्क करें', footer_address_label: 'पता',
      footer_address: 'C-3/10, मायापुरी औद्योगिक क्षेत्र, फेज-II, नई दिल्ली - 110064, भारत',
      footer_tel_label: 'टेलीफोन', footer_mobile_label: 'मोबाइल', footer_email_label: 'ई-मेल',
      footer_quicklink_heading: 'त्वरित लिंक', footer_product_heading: 'हमारे उत्पाद',
      prod_taper_lock: 'टेपर लॉक पुली', prod_inline_helical: 'इनलाइन हेलिकल गियरबॉक्स', prod_v_belt: 'ट्रांसमिशन वी-बेल्ट',
      prod_parallel: 'पैरेलल शाफ्ट गियरबॉक्स', prod_screw_conveyor: 'स्क्रू कन्वेयर गियरबॉक्स', prod_speed_reducer: 'शाफ्ट माउंटेड स्पीड रिड्यूसर',
      prod_round_shaft: 'राउंड शाफ्ट (OT सीरीज)', prod_ground_gear: 'ग्राउंड गियर और शाफ्ट', prod_industrial: 'इंडस्ट्रियल गियरबॉक्स'
    },
    ar: {
      top_cert: 'شهادة رقم 3050231221746Q',
      top_call: 'اتصل +919868157136',
      top_contact: 'اتصل بنا',
      nav_home: 'الرئيسية',
      nav_about: 'من نحن',
      nav_product: 'منتجاتنا',
      nav_catalog: 'الكتالوج',
      nav_gallery: 'المعرض',
      hero_label: 'صناعية دقيقة',
      hero_heading_1: 'التروس والطاقة',
      hero_heading_2: 'نقل',
      hero_heading_3: 'الحلول',
      hero_sub: 'مصنع موثوق لعلب التروس وبكرات القفل المخروطي وأنظمة تروس الناقل للصناعة الثقيلة.',
      btn_quote: 'احصل على عرض سعر',
      btn_read_more: 'اقرأ المزيد',
      stat_exp: 'سنوات الخبرة', stat_units: 'وحدات مسلمة', stat_customers: 'عميل سعيد',
      intro_text: '<strong>JRB Engineering Works</strong> لديها آلات حديثة وغرفة أدوات مخصصة وفريق بحث وتطوير داخلي.',
      new_prod_title: 'منتجات جديدة',
      new_prod_sub: 'استكشف أحدث إضافاتنا إلى مجموعة نقل التروس.',
      about_quality_title: 'الجودة',
      about_quality_text: 'نحن نقدر الجودة بشكل كبير ونتجاوز المتطلبات المحددة.',
      about_title: 'من نحن',
      about_text: 'JRB ENGINEERING WORKS مجهزة بأحدث الآلات مع غرفة أدوات منفصلة وقسم بحث وتطوير خاص.',
      about_chk_1: 'حاصل على شهادة ISO', about_chk_2: 'هندسة مخصصة', about_chk_3: 'توريد لكل الهند',
      mission_title: 'مهمتنا', mission_text: 'هدفنا هو الحفاظ على مراقبة الجودة والإنتاج المبتكر لرفع مستويات رضا العملاء.',
      vision_title: 'رؤيتنا', vision_text: 'ندرك أن تكاليف استبدال المنتجات تتجاوز سعرها الأولي.',
      trusted_title: 'موثوق من قبل الشركات الصناعية الرائدة',
      contact_title: 'تواصل معنا للاستفسارات!',
      form_name: 'الاسم', form_phone: 'الهاتف', form_email: 'البريد', form_address: 'العنوان', form_message: 'الرسالة',
      form_btn: 'طلب عرض سعر',
      gallery_title: 'معرضنا',
      reach_title: 'تواصل معنا',
      reach_visit: 'زوروا مكتبنا',
      reach_address: 'C-30/10, منطقة مايابوري الصناعية, المرحلة الثانية, نيودلهي-110064',
      reach_talk: 'لنتحدث', reach_email_title: 'راسلنا',
      iso_cta_title: 'تبحث عن حلول تروس صناعية؟',
      iso_chk_1: 'تصنيع علب تروس مخصصة', iso_chk_2: 'مكونات صناعية ثقيلة', iso_chk_3: 'دعم عروض أسعار سريع',
      footer_topline: 'احصل على مزيد من التفاصيل للمنتج.',
      footer_contact_heading: 'اتصل بنا', footer_address_label: 'العنوان',
      footer_address: 'C-3/10, منطقة مايابوري الصناعية, المرحلة الثانية, نيودلهي - 110064, الهند',
      footer_tel_label: 'هاتف', footer_mobile_label: 'جوال', footer_email_label: 'بريد إلكتروني',
      footer_quicklink_heading: 'روابط سريعة', footer_product_heading: 'منتجاتنا',
      prod_taper_lock: 'بكرة قفل مخروطي', prod_inline_helical: 'علبة تروس حلزونية', prod_v_belt: 'سير نقل',
      prod_parallel: 'علبة تروس محور متوازي', prod_screw_conveyor: 'علبة تروس ناقل لولبي', prod_speed_reducer: 'مخفض سرعة',
      prod_round_shaft: 'محور دائري (سلسلة OT)', prod_ground_gear: 'ترس مصقول ومحور', prod_industrial: 'علبة تروس صناعية'
    },
    zh: {
      top_cert: '证书编号 3050231221746Q',
      top_call: '拨打 +919868157136',
      top_contact: '联系我们',
      nav_home: '首页',
      nav_about: '关于我们',
      nav_product: '我们的产品',
      nav_catalog: '产品目录',
      nav_gallery: '画廊',
      hero_label: '精密工业',
      hero_heading_1: '齿轮与动力',
      hero_heading_2: '传动',
      hero_heading_3: '解决方案',
      hero_sub: '重工业齿轮箱、锥套皮带轮和输送齿轮系统的值得信赖的制造商。',
      btn_quote: '获取即时报价',
      btn_read_more: '阅读更多',
      stat_exp: '年经验', stat_units: '交付单位', stat_customers: '满意客户',
      intro_text: '<strong>JRB Engineering Works</strong> 拥有现代化机器、专用工具室和内部研发团队。',
      new_prod_title: '新产品',
      new_prod_sub: '探索我们齿轮传动系列的最新产品——为重型工业性能和长期可靠性精密设计。',
      about_quality_title: '质量',
      about_quality_text: '我们非常重视质量，并超越既定的产品要求。',
      about_title: '关于我们',
      about_text: 'JRB ENGINEERING WORKS 配备了最新的机器，拥有独立的工具室和研发部门。',
      about_chk_1: 'ISO认证', about_chk_2: '定制工程', about_chk_3: '全印度供应',
      mission_title: '我们的使命', mission_text: '我们的目标是保持质量控制和创新生产，以提高客户满意度。',
      vision_title: '我们的愿景', vision_text: '我们知道产品更换成本超出了初始价格。它涉及人力损失和停机时间。',
      trusted_title: '领先工业公司的信任',
      contact_title: '联系我们获取咨询！',
      form_name: '姓名', form_phone: '电话', form_email: '邮箱', form_address: '地址', form_message: '消息',
      form_btn: '请求报价',
      gallery_title: '我们的画廊',
      reach_title: '联系我们',
      reach_visit: '访问我们的办公室',
      reach_address: 'C-30/10, Mayapuri工业区, 二期, 新德里-110064',
      reach_talk: '让我们聊聊', reach_email_title: '给我们发邮件',
      iso_cta_title: '寻找工业齿轮解决方案？',
      iso_chk_1: '定制齿轮箱制造', iso_chk_2: '重型工业组件', iso_chk_3: '快速报价支持',
      footer_topline: '获取更多产品详情。',
      footer_contact_heading: '联系我们', footer_address_label: '地址',
      footer_address: 'C-3/10, Mayapuri工业区, 二期, 新德里 - 110064, 印度',
      footer_tel_label: '电话', footer_mobile_label: '手机', footer_email_label: '邮件',
      footer_quicklink_heading: '快速链接', footer_product_heading: '我们的产品',
      prod_taper_lock: '锥套皮带轮', prod_inline_helical: '直列螺旋齿轮箱', prod_v_belt: '传动V带',
      prod_parallel: '平行轴齿轮箱', prod_screw_conveyor: '螺旋输送齿轮箱', prod_speed_reducer: '轴装减速器',
      prod_round_shaft: '圆轴 (OT系列)', prod_ground_gear: '磨削齿轮和轴', prod_industrial: '工业齿轮箱'
    }
  };

  const langNames = {
    en: 'English', es: 'Español', fr: 'Français',
    de: 'Deutsch', hi: 'हिन्दी', ar: 'العربية', zh: '中文'
  };

  function setLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        if (key === 'intro_text') {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // RTL for Arabic
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }

    // Update lang name display
    if (langNameEl) langNameEl.textContent = langNames[lang] || lang;

    // Update active state
    langOptions.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });

    sessionStorage.setItem('lang', lang);
  }

  // Language option clicks
  langOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.getAttribute('data-lang');
      setLanguage(lang);
      if (langSwitcher) langSwitcher.classList.remove('open');
    });
  });

  // Restore saved language
  const savedLang = sessionStorage.getItem('lang') || 'en';
  if (savedLang !== 'en') setLanguage(savedLang);

  // ============================================================
  // 7. EMAILJS FORM HANDLING
  // ============================================================
  // Step 1: Go to https://emailjs.com and create a free account
  // Step 2: Create a service (Gmail, Outlook, etc.) → copy Service ID
  // Step 3: Create an email template → copy Template ID
  // Step 4: Go to Account → copy your Public Key
  // Step 5: Replace the three placeholders below:
  // ============================================================
  emailjs.init('YOUR_PUBLIC_KEY'); // REPLACE: your EmailJS public key

  function validateForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('.contact-form__input');
    let valid = true;

    inputs.forEach(input => {
      input.classList.remove('error');
      const errorMsg = input.nextElementSibling;
      if (errorMsg) errorMsg.style.display = 'none';

      if (!input.value.trim()) {
        input.classList.add('error');
        if (errorMsg) errorMsg.style.display = 'block';
        valid = false;
      }

      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          input.classList.add('error');
          if (errorMsg) errorMsg.style.display = 'block';
          valid = false;
        }
      }
    });

    return valid;
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateForm()) return;

      emailjs.sendForm(
        'YOUR_SERVICE_ID',   // REPLACE: your EmailJS service ID
        'YOUR_TEMPLATE_ID',  // REPLACE: your EmailJS template ID
        this
      ).then(() => {
        document.getElementById('form-success').style.display = 'block';
        document.getElementById('form-error').style.display = 'none';
        this.reset();
      }).catch(() => {
        document.getElementById('form-error').style.display = 'block';
        document.getElementById('form-success').style.display = 'none';
      });
    });
  }

  // ============================================================
  // 8. SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight + 24;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

});
