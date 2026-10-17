/**
 * BeaconMC Official Website Script
 * Clean Vanilla JavaScript - High Performance, Accessible & Multi-Page Compatible
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCopyActions();
  initFaqAccordion();
  initServerStatus();
  initStaffPage();
  initScrollReveal();
  initBeaconCursorAndClickEffects();
});

/* ==========================================================================
   1. Navbar & Mobile Menu (Multi-Page Navigation)
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('site-header');
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');

  // Glass background transition & height reduction on scroll
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Highlight active link based on current page URL as a progressive enhancement
  try {
    const rawPath = window.location.pathname.split('/').pop().toLowerCase().replace(/\.html$/, '');
    const currentBase = (!rawPath || rawPath === 'index' || rawPath === '.') ? 'index' : rawPath;

    desktopLinks.forEach(link => {
      const linkBase = (link.getAttribute('href') || '').split('/').pop().toLowerCase().replace(/\.html$/, '');
      if (linkBase === currentBase) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const linkBase = (link.getAttribute('href') || '').split('/').pop().toLowerCase().replace(/\.html$/, '');
      if (linkBase === currentBase) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  } catch {
    // If URL matching fails, HTML-defined active classes remain unchanged
  }

  if (!toggleBtn || !mobileNav) return;

  const openMobileMenu = () => {
    toggleBtn.setAttribute('aria-expanded', 'true');
    mobileNav.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    toggleBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('hidden', '');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close menu after clicking any navigation link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (toggleBtn.getAttribute('aria-expanded') === 'true') {
      if (!mobileNav.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
      toggleBtn.focus();
    }
  });

  // Reset menu if window is resized to desktop size
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
    }
  });
}

/* ==========================================================================
   2. Copy IP & Port Handlers (Inline Button Feedback)
   ========================================================================== */
function initCopyActions() {
  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback below
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  };

  const triggerButtonFeedback = (button, defaultLabel) => {
    if (!button) return;

    const labelSpan = button.querySelector('.btn-text, .copy-text');
    const icon = button.querySelector('svg');

    // Cache original label and icon structure once
    if (!button.dataset.originalLabel) {
      button.dataset.originalLabel = labelSpan ? labelSpan.textContent.trim() : defaultLabel;
    }
    if (icon && !button._originalSvg) {
      button._originalSvg = icon.innerHTML;
    }

    // Clear any pending timeout on rapid repeated clicks
    if (button._copiedTimer) {
      clearTimeout(button._copiedTimer);
    }

    // Set inline copied state
    if (labelSpan) {
      labelSpan.textContent = 'Copied ✓';
    } else {
      button.textContent = 'Copied ✓';
    }

    if (icon) {
      // Clean checkmark SVG
      icon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
    }

    button.classList.add('btn-copied');

    // Revert after 1.8 seconds
    button._copiedTimer = setTimeout(() => {
      if (labelSpan) {
        labelSpan.textContent = button.dataset.originalLabel || defaultLabel;
      } else {
        button.textContent = button.dataset.originalLabel || defaultLabel;
      }
      if (icon && button._originalSvg) {
        icon.innerHTML = button._originalSvg;
      }
      button.classList.remove('btn-copied');
      button._copiedTimer = null;
    }, 1800);
  };

  // 1. Hero Quick Copy Button
  const heroCopyBtn = document.getElementById('hero-copy-btn');
  if (heroCopyBtn) {
    heroCopyBtn.addEventListener('click', async () => {
      await copyToClipboard('play.BeaconMC.space');
      triggerButtonFeedback(heroCopyBtn, 'COPY IP');
    });
  }

  // 2. All "COPY IP" buttons (.copy-ip-btn)
  const copyIpButtons = document.querySelectorAll('.copy-ip-btn');
  copyIpButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy') || 'play.BeaconMC.space';
      await copyToClipboard(textToCopy);
      triggerButtonFeedback(btn, 'COPY IP');
    });
  });

  // 3. Bedrock "COPY PORT" button (#copy-port-btn)
  const copyPortBtn = document.getElementById('copy-port-btn');
  if (copyPortBtn) {
    copyPortBtn.addEventListener('click', async () => {
      const portVal = copyPortBtn.getAttribute('data-port') || '19132';
      await copyToClipboard(portVal);
      triggerButtonFeedback(copyPortBtn, 'COPY PORT');
    });
  }
}

/* ==========================================================================
   3. FAQ Accordion (Smooth & Accessible)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current item
      if (isExpanded) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

/* ==========================================================================
   4. Live Minecraft Server Status Monitor
   - Checks play.BeaconMC.space
   - Online / Offline / Status Unavailable (Clearly distinguished)
   - Real-time player counts, never fake
   - Refreshes approximately every 45 seconds
   - Safe error handling (No console errors)
   ========================================================================== */
function initServerStatus() {
  const SERVER_HOST = 'play.BeaconMC.space';
  const FALLBACK_VERSION = '1.21.11';
  const REFRESH_INTERVAL_MS = 45000;

  // DOM Elements - Hero
  const heroDot = document.getElementById('hero-status-dot');
  const heroText = document.getElementById('hero-status-text');
  const heroPlayersVal = document.getElementById('hero-players-val');

  // DOM Elements - Status Section
  const mainBadge = document.getElementById('main-status-badge');
  const mainDot = document.getElementById('main-status-dot');
  const mainText = document.getElementById('main-status-text');
  const metricOnline = document.getElementById('metric-players-online');
  const metricMax = document.getElementById('metric-players-max');
  const metricPlayerBar = document.getElementById('metric-player-bar');
  const metricVersion = document.getElementById('metric-detected-version');

  // If no status elements exist on this page, exit gracefully
  if (!heroDot && !mainBadge) return;

  const updateUIOnline = (onlinePlayers, maxPlayers, version) => {
    // Hero Status
    if (heroDot) heroDot.className = 'status-pulse-dot online';
    if (heroText) heroText.textContent = 'ONLINE';
    if (heroPlayersVal) heroPlayersVal.textContent = `${onlinePlayers} / ${maxPlayers}`;

    // Dashboard Status
    if (mainBadge) mainBadge.className = 'server-status-badge online';
    if (mainDot) mainDot.className = 'status-pulse-dot online';
    if (mainText) mainText.textContent = 'ONLINE';
    if (metricOnline) metricOnline.textContent = String(onlinePlayers);
    if (metricMax) metricMax.textContent = `/ ${maxPlayers} max`;
    if (metricPlayerBar && maxPlayers > 0) {
      const percentage = Math.min(100, Math.round((onlinePlayers / maxPlayers) * 100));
      metricPlayerBar.style.width = `${percentage}%`;
    }
    if (metricVersion) metricVersion.textContent = version || FALLBACK_VERSION;
  };

  const updateUIOffline = (maxPlayers, version) => {
    // Hero Status
    if (heroDot) heroDot.className = 'status-pulse-dot offline';
    if (heroText) heroText.textContent = 'OFFLINE';
    if (heroPlayersVal) heroPlayersVal.textContent = `0 / ${maxPlayers || 50}`;

    // Dashboard Status
    if (mainBadge) mainBadge.className = 'server-status-badge offline';
    if (mainDot) mainDot.className = 'status-pulse-dot offline';
    if (mainText) mainText.textContent = 'OFFLINE';
    if (metricOnline) metricOnline.textContent = '0';
    if (metricMax) metricMax.textContent = `/ ${maxPlayers || 50} max`;
    if (metricPlayerBar) metricPlayerBar.style.width = '0%';
    if (metricVersion) metricVersion.textContent = version || FALLBACK_VERSION;
  };

  const updateUIUnavailable = () => {
    // Hero Status
    if (heroDot) heroDot.className = 'status-pulse-dot unavailable';
    if (heroText) heroText.textContent = 'STATUS UNAVAILABLE';
    if (heroPlayersVal) heroPlayersVal.textContent = '-- / --';

    // Dashboard Status
    if (mainBadge) mainBadge.className = 'server-status-badge unavailable';
    if (mainDot) mainDot.className = 'status-pulse-dot unavailable';
    if (mainText) mainText.textContent = 'STATUS UNAVAILABLE';
    if (metricOnline) metricOnline.textContent = '--';
    if (metricMax) metricMax.textContent = '/ -- max';
    if (metricPlayerBar) metricPlayerBar.style.width = '0%';
    if (metricVersion) metricVersion.textContent = FALLBACK_VERSION;
  };

  const updateUIChecking = () => {
    if (heroText && (!heroText.textContent || heroText.textContent === '--')) heroText.textContent = 'CHECKING STATUS...';
    if (mainText && (!mainText.textContent || mainText.textContent === '--')) mainText.textContent = 'CHECKING STATUS...';
  };

  const fetchStatus = async () => {
    updateUIChecking();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`https://api.mcsrvstat.us/3/${SERVER_HOST}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        updateUIUnavailable();
        return;
      }

      const data = await response.json();

      if (data && typeof data.online === 'boolean') {
        const maxCount = (data.players && typeof data.players.max === 'number') ? data.players.max : 50;
        const versionString = data.version || FALLBACK_VERSION;

        if (data.online) {
          const onlineCount = (data.players && typeof data.players.online === 'number') ? data.players.online : 0;
          updateUIOnline(onlineCount, maxCount, versionString);
        } else {
          // Explicitly reported offline by API
          updateUIOffline(maxCount, versionString);
        }
      } else {
        updateUIUnavailable();
      }
    } catch {
      // Safe catch for timeout, network error, or CORS
      updateUIUnavailable();
    }
  };

  // Initial fetch and scheduled refresh every 45s
  fetchStatus();
  setInterval(fetchStatus, REFRESH_INTERVAL_MS);
}

/* ==========================================================================
   5. Viewport Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const revealInView = () => {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || 800;
    revealElements.forEach(el => {
      if (el.classList.contains('is-revealed')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowHeight + 60 && rect.bottom >= -60) {
        el.classList.add('is-revealed');
      }
    });
  };

  // Immediate reveal for elements already in viewport
  revealInView();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    revealElements.forEach(el => {
      if (!el.classList.contains('is-revealed')) {
        observer.observe(el);
      }
    });
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Safety fallback: ensure elements are revealed even if observer is delayed
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }, 1000);
}

/* ==========================================================================
   6. Dynamic Staff Showcase Generator & Observer
   - Automatically reads staffMembers array
   - Displays all official roles: Owner, Founder, Co-Owner, Co-Founder, Admin, Mod, Staff, Builder, Helper
   - Displays: Role, Minecraft IGN, Discord ID, Avatar
   - NEVER displays Discord Name
   - Hides empty fields cleanly (no undefined, null, or blank labels)
   - Preserves alternating desktop layout and mobile layout
   - Preserves scroll reveal animations and glassmorphism styling
   ========================================================================== */
const defaultStaffMembers = [
    {
        role: "Owner",
        minecraftIGN: "BeaconX7",
        discordID: "beaconx7",
        avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554024043433164850/avatar-3d-bust.png?ex=6ad3c4ec&is=6ad2736c&hm=c57ebf119f39e591bbb0f1250bfa599f7ceb6958b6e67b035321e0ff446d0cdc&"
    },
    {
        role: "Founder",
        minecraftIGN: "AshuX7",
        discordID: "ashugautam0849",
        avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554025193637154856/avatar-3d-bust_1.png?ex=6ad3c5fe&is=6ad2747e&hm=a65572d1354876c71b4d35957ba0f96d9b702db9d49688f7f4272dba63a1c4e1&"
    },
    {
        role: "Co-Owner",
        minecraftIGN: "EnvyQueen",
        discordID: "pro_mahiru",
        avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554480144029188226/avatar-3d-bust_7.png?ex=6ad37373&is=6ad221f3&hm=f5c0c62cbe1310eef39606592193a28bbf63a1ab632f2d9678a71a27d69863f3&"
    },
    {
        role: "Co-Founder",
        minecraftIGN: "Echo_X1",
        discordID: "echo_x1__58783",
        avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554031930314457148/avatar-3d-bust_3.png?ex=6ad3cc44&is=6ad27ac4&hm=8db9b34c106886d75274f75ebaf7192f2d6b83de252263a873880ff4f0010da2&"
    },
    {
        role: "Admin",
        minecraftIGN: "AuraManav",
        discordID: "manavsoni980",
        avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554482060184256552/avatar-3d-bust_8.png?ex=6ad3753c&is=6ad223bc&hm=2040753265b1e034f413062bb6dd2167eb6e036724376fd0c5867999346880e9&"
    },
    {
        role: "Mod",
        minecraftIGN: "RoronoaZORO_18",
        discordID: "togxsaber",
        avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554026146981617694/avatar-3d-bust_2.png?ex=6ad3c6e1&is=6ad27561&hm=c1ae29aaa1796e758f6588097cf6ef90304ade0df25d810e707a571b3d99ad99&"
    },
    {
        role: "Staff",
        minecraftIGN: "_ishaaaaaaa",
        discordID: "its_ishaa0979",
        avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554037951418343424/avatar-3d-bust_4.png?ex=6ad3d1e0&is=6ad28060&hm=bd16ba47766b5e60669dbbbeffb2168fb6bc6136a54a040a36280f866902fbc3&"
    },
    {
        role: "Builder",
        minecraftIGN: "Kunal_V",
        discordID: "kunal03790",
        avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554479378430173234/avatar-3d-bust_5.png?ex=6ad372bc&is=6ad2213c&hm=de50c1f87c6cd365219838af56dfebd3d2d0d62eb08b3a2be1048c58038ac7cb&"
    },
    {
        role: "Helper",
        minecraftIGN: "Diya156",
        discordID: "Unavailable",
        avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1560797381124161617/avatar-3d-bust.png?ex=6ad40555&is=6ad2b3d5&hm=b52459fe44cc615a6df3b51850634b18e61ca2f2380dab44ba0cd12987728eb0&"
    }
];

function getActiveStaffList() {
  if (typeof window !== 'undefined' && window.staffMembers && Array.isArray(window.staffMembers)) {
    return window.staffMembers;
  }
  if (typeof staffMembers !== 'undefined' && Array.isArray(staffMembers)) {
    return staffMembers;
  }
  return defaultStaffMembers;
}

function buildStaffCards(targetContainer, members) {
  if (!targetContainer || !Array.isArray(members)) return;

  targetContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();

  members.forEach((member, index) => {
    if (!member || typeof member !== 'object') return;

    const role = (member.role != null) ? String(member.role).trim() : '';
    const ign = (member.minecraftIGN != null) ? String(member.minecraftIGN).trim() : '';
    const discordID = (member.discordID != null) ? String(member.discordID).trim() : '';
    const rawAvatar = (member.avatar != null) ? String(member.avatar).trim() : '';
    const avatar = rawAvatar || 'assets/BeaconMC.png';

    // If completely empty object, skip cleanly
    if (!role && !ign && !discordID && !rawAvatar) return;

    const isEven = index % 2 === 0;
    const layoutClass = isEven ? 'staff-card--info-left' : 'staff-card--avatar-left';
    const delayClass = 'reveal-delay-' + ((index % 6) + 1);
    const roleSlug = role ? role.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

    const article = document.createElement('article');
    article.className = `staff-card ${layoutClass} glass-panel reveal-on-scroll ${delayClass}`;

    // Content Side
    const contentDiv = document.createElement('div');
    contentDiv.className = 'staff-card__content';

    // 1. Role Badge (Prominent at top)
    if (role) {
      const roleBadge = document.createElement('span');
      roleBadge.className = `staff-role staff-role--${roleSlug}`;
      roleBadge.textContent = role.toUpperCase();
      contentDiv.appendChild(roleBadge);
    }

    // 2. Minecraft IGN (Main large title)
    if (ign) {
      const ignTitle = document.createElement('h2');
      ignTitle.className = 'staff-minecraft-ign font-mono';
      ignTitle.textContent = ign;
      contentDiv.appendChild(ignTitle);
    }

    // 3. Discord ID (Smaller secondary text; cleanly hidden if empty/unavailable; NEVER shows Discord Name or Not Found)
    const isDiscordAvailable = discordID && 
      !['unavailable', 'not found', 'none', 'n/a', 'hidden', ''].includes(discordID.toLowerCase().trim());
    if (isDiscordAvailable) {
      const discordMeta = document.createElement('div');
      discordMeta.className = 'staff-discord-meta';

      const discordSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      discordSvg.setAttribute('class', 'icon-discord-mini');
      discordSvg.setAttribute('viewBox', '0 0 24 24');
      discordSvg.setAttribute('width', '16');
      discordSvg.setAttribute('height', '16');
      discordSvg.setAttribute('fill', 'currentColor');
      discordSvg.setAttribute('aria-hidden', 'true');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z');
      discordSvg.appendChild(path);
      discordMeta.appendChild(discordSvg);

      const discordLabel = document.createElement('span');
      discordLabel.className = 'staff-discord-label';
      discordLabel.textContent = 'Discord:';
      discordMeta.appendChild(discordLabel);

      const discordVal = document.createElement('span');
      discordVal.className = 'staff-discord-val';
      discordVal.textContent = discordID;
      discordMeta.appendChild(discordVal);

      contentDiv.appendChild(discordMeta);
    }

    article.appendChild(contentDiv);

    // 4. Large Avatar with Role Ring (Uses clean default placeholder if avatar is empty)
    const avatarSide = document.createElement('div');
    avatarSide.className = 'staff-card__avatar-side';

    const avatarRing = document.createElement('div');
    avatarRing.className = `staff-avatar-ring ${roleSlug ? 'staff-avatar-ring--' + roleSlug : ''}`;

    const avatarImg = document.createElement('img');
    avatarImg.src = avatar;
    avatarImg.alt = (ign ? ign + ' Avatar' : (role ? role + ' Staff Avatar' : 'BeaconMC Staff'));
    avatarImg.className = 'staff-avatar-img';
    avatarImg.width = 180;
    avatarImg.height = 180;
    avatarImg.loading = 'lazy';
    avatarImg.onerror = function() {
      this.onerror = null;
      this.src = 'assets/BeaconMC.png';
    };

    avatarRing.appendChild(avatarImg);
    avatarSide.appendChild(avatarRing);
    article.appendChild(avatarSide);

    fragment.appendChild(article);
  });

  targetContainer.appendChild(fragment);

  // If scroll observer exists, re-bind to the freshly created cards
  if (typeof initScrollReveal === 'function') {
    initScrollReveal();
  }
}

function initStaffPage() {
  const container = document.getElementById('staff-showcase-container') || document.querySelector('.staff-showcase-container');
  if (!container) return;

  const members = getActiveStaffList();
  buildStaffCards(container, members);
}

// Expose on window for programmatic updates without circular recursion
if (typeof window !== 'undefined') {
  window.buildStaffCards = buildStaffCards;
  window.renderStaffCards = (customMembers) => {
    const container = document.getElementById('staff-showcase-container') || document.querySelector('.staff-showcase-container');
    if (container) {
      buildStaffCards(container, customMembers || getActiveStaffList());
    }
  };
  window.initStaffPage = initStaffPage;
}/* ==========================================================================
   7. BeaconMC Minecraft Beacon Cursor Trail & Click Animations
   - Smooth cyan/blue glowing trail following the cursor with connected ribbon
   - Tiny Minecraft-style pixel particles (square blocks) & diamond sparkles
   - Natural shrinking and fading of particles as cursor moves
   - Beacon click animation: small cyan energy pulse, expanding circular rings,
     burst of blue/cyan pixel particles and rotating diamond sparkles (400-650ms)
   - Extra emphasis on interactive buttons and links
   - High DPI (devicePixelRatio) sharp rendering
   - Automatic requestAnimationFrame pause when idle (0% CPU when stationary)
   - Respects prefers-reduced-motion and disables on touch-only devices
   - Normal mouse pointer remains completely visible and unaffected
   ========================================================================== */
function initBeaconCursorAndClickEffects() {
  if (window._beaconFxInitialized) return;
  window._beaconFxInitialized = true;

  // Setup fixed full-screen canvas
  let canvas = document.getElementById('beacon-fx-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'beacon-fx-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const target = document.body || document.documentElement;
    if (target) {
      target.appendChild(canvas);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        (document.body || document.documentElement).appendChild(canvas);
      });
    }
  }

  // Force explicit CSS styling on canvas
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999999';
  canvas.style.display = 'block';

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // DPR Sharpness handling
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let cssWidth = window.innerWidth;
  let cssHeight = window.innerHeight;

  const resizeCanvas = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssWidth = window.innerWidth;
    cssHeight = window.innerHeight;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Effect State
  const particles = [];
  const rings = [];
  const pulses = [];
  const trailPoints = [];
  let mouse = { x: -100, y: -100, lastX: -100, lastY: -100 };
  let isMoving = false;
  let moveStopTimer = null;
  let animFrameId = null;
  let lastClickTime = 0;

  // BeaconMC Palette
  const BEACON_COLORS = [
    '#00eefa', // Diamond Cyan
    '#0072fe', // Beacon Electric Blue
    '#38e9f8', // Sky Diamond
    '#60a5fa', // Azure Blue
    '#ffffff'  // Pure White Beacon Beam
  ];

  function randomBeaconColor() {
    return BEACON_COLORS[Math.floor(Math.random() * BEACON_COLORS.length)];
  }

  // Draw crisp Minecraft-style square pixel particle
  function drawPixel(ctx, x, y, size, color, alpha) {
    if (alpha <= 0.01 || size <= 0.1) return;
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    const half = size / 2;
    ctx.fillRect(Math.round(x - half), Math.round(y - half), Math.max(1, Math.round(size)), Math.max(1, Math.round(size)));
    ctx.restore();
  }

  // Draw 4-pointed diamond sparkle (Minecraft beacon crystal)
  function drawDiamond(ctx, x, y, size, rotation, color, alpha) {
    if (alpha <= 0.01 || size <= 0.1) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.45, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.45, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw expanding pulse ring
  function drawRing(ctx, ring) {
    if (ring.alpha <= 0.01) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, Math.max(0.1, ring.radius), 0, Math.PI * 2);
    ctx.strokeStyle = ring.color;
    ctx.globalAlpha = Math.max(0, Math.min(1, ring.alpha));
    ctx.lineWidth = ring.lineWidth;
    ctx.shadowColor = ring.color;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();
  }

  // Draw beacon energy core pulse
  function drawPulse(ctx, pulse) {
    if (pulse.alpha <= 0.01) return;
    ctx.save();
    const grad = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, Math.max(1, pulse.radius));
    grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, pulse.alpha)})`);
    grad.addColorStop(0.4, `rgba(0, 238, 250, ${Math.min(1, pulse.alpha * 0.95)})`);
    grad.addColorStop(1, 'rgba(0, 114, 254, 0)');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#00eefa';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, Math.max(1, pulse.radius), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Draw smooth glowing trail ribbon behind cursor
  function drawTrailRibbon(ctx, now) {
    const len = trailPoints.length;
    if (len < 2) return;

    for (let i = 1; i < len; i++) {
      const p1 = trailPoints[i - 1];
      const p2 = trailPoints[i];
      const ageRatio = (now - p2.time) / 320; // 320ms visible trail
      if (ageRatio >= 1) continue;

      const alpha = (1 - ageRatio);
      const width = (1 - ageRatio) * 4.2 + 0.8;

      // Outer glowing aura
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = '#00eefa';
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.65));
      ctx.lineWidth = width + 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#00eefa';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // Inner bright diamond core
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = (i > len - 4) ? '#ffffff' : '#38e9f8';
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.95));
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#0072fe';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.restore();
    }

    // Glowing tip at cursor position
    if (isMoving && len > 0) {
      const head = trailPoints[len - 1];
      ctx.save();
      ctx.beginPath();
      ctx.arc(head.x, head.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.9;
      ctx.shadowColor = '#00eefa';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  }

  // Spawn trail particle (Minecraft pixel block or diamond sparkle)
  function spawnTrailParticle(x, y, dx, dy) {
    const isDiamond = Math.random() < 0.28;
    const size = isDiamond ? (Math.random() * 3.5 + 3.5) : (Math.random() * 3.0 + 2.5);
    const maxLife = isDiamond ? (Math.random() * 18 + 22) : (Math.random() * 16 + 18);
    const angle = Math.random() * Math.PI * 2;
    const driftSpeed = Math.random() * 0.8 + 0.3;

    particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: Math.cos(angle) * driftSpeed - dx * 0.05,
      vy: Math.sin(angle) * driftSpeed - dy * 0.05 - 0.3, // Beacon upward drift
      size: size,
      initialSize: size,
      color: randomBeaconColor(),
      life: maxLife,
      maxLife: maxLife,
      isDiamond: isDiamond,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      friction: 0.95
    });

    if (particles.length > 140) {
      particles.shift();
    }
  }

  // Spawn beacon click burst (pulse flash + expanding rings + burst of pixels and diamond sparkles)
  function spawnClickBurst(x, y, isImportant) {
    const count = isImportant ? 16 : 14;
    const maxRingRadius = isImportant ? 46 : 40;

    // 1. Beacon core energy pulse
    pulses.push({
      x: x,
      y: y,
      radius: 3,
      maxRadius: isImportant ? 18 : 14,
      alpha: 1.0,
      fadeRate: 0.065,
      growRate: 1.2
    });

    // 2. Primary cyan expanding ring
    rings.push({
      x: x,
      y: y,
      radius: 4,
      maxRadius: maxRingRadius,
      alpha: 1.0,
      fadeRate: isImportant ? 0.026 : 0.030,
      growRate: 1.4,
      lineWidth: 2.2,
      color: '#00eefa'
    });

    // 3. Secondary deep blue echo ring
    rings.push({
      x: x,
      y: y,
      radius: 2,
      maxRadius: Math.round(maxRingRadius * 0.75),
      alpha: 0.75,
      fadeRate: 0.034,
      growRate: 1.05,
      lineWidth: 1.6,
      color: '#0072fe'
    });

    // 4. Burst particles
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 2.8 + 1.4;
      const isDiamond = (i === 0 || i === 1 || i === 2);
      const size = isDiamond ? (Math.random() * 2.5 + 4.5) : (Math.random() * 1.8 + 3.0);
      const maxLife = Math.random() * 10 + 30; // ~500ms

      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.35,
        size: size,
        initialSize: size,
        color: randomBeaconColor(),
        life: maxLife,
        maxLife: maxLife,
        isDiamond: isDiamond,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.18,
        friction: 0.94,
        gravity: 0.045
      });
    }

    startAnimationLoop();
  }

  // Animation frame loop
  function render(timestamp) {
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const now = (typeof timestamp === 'number' && timestamp > 0) ? timestamp : performance.now();
    let hasActiveElements = false;

    // 1. Render and prune trail ribbon points
    while (trailPoints.length > 0 && (now - trailPoints[0].time) > 320) {
      trailPoints.shift();
    }
    if (trailPoints.length > 0) {
      drawTrailRibbon(ctx, now);
      hasActiveElements = true;
    }

    // 2. Render and update core energy pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.radius += p.growRate;
      p.alpha -= p.fadeRate;
      if (p.alpha <= 0 || p.radius >= p.maxRadius) {
        pulses.splice(i, 1);
      } else {
        drawPulse(ctx, p);
        hasActiveElements = true;
      }
    }

    // 3. Render and update expanding rings
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.radius += r.growRate;
      r.alpha -= r.fadeRate;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        rings.splice(i, 1);
      } else {
        drawRing(ctx, r);
        hasActiveElements = true;
      }
    }

    // 4. Render and update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life--;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      if (p.friction) {
        p.vx *= p.friction;
        p.vy *= p.friction;
      }
      if (p.gravity) {
        p.vy += p.gravity;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed || 0;

      const progress = p.life / p.maxLife;
      const currentSize = p.initialSize * (0.3 + 0.7 * progress);
      const alpha = Math.min(1, progress * 1.35);

      if (p.isDiamond) {
        drawDiamond(ctx, p.x, p.y, currentSize, p.rotation, p.color, alpha);
      } else {
        drawPixel(ctx, p.x, p.y, currentSize, p.color, alpha);
      }

      hasActiveElements = true;
    }

    if (hasActiveElements || isMoving) {
      animFrameId = (window.requestAnimationFrame || requestAnimationFrame)(render);
    } else {
      animFrameId = null;
      ctx.clearRect(0, 0, cssWidth, cssHeight);
    }
  }

  function startAnimationLoop() {
    if (!animFrameId) {
      animFrameId = (window.requestAnimationFrame || requestAnimationFrame)(render);
    }
  }

  // Track mouse movement
  const handlePointerMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    if (typeof x !== 'number' || typeof y !== 'number') return;
    const now = performance.now();

    const dx = mouse.lastX !== -100 ? (x - mouse.lastX) : 0;
    const dy = mouse.lastY !== -100 ? (y - mouse.lastY) : 0;
    const dist = Math.hypot(dx, dy);

    mouse.x = x;
    mouse.y = y;

    isMoving = true;
    clearTimeout(moveStopTimer);
    moveStopTimer = setTimeout(() => {
      isMoving = false;
    }, 120);

    // Append to glowing ribbon trail
    trailPoints.push({ x: x, y: y, time: now });
    if (trailPoints.length > 30) {
      trailPoints.shift();
    }

    // Spawn trail particles
    if (dist > 1) {
      const step = 8;
      const steps = Math.min(5, Math.max(1, Math.floor(dist / step)));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const interpX = mouse.lastX !== -100 ? (mouse.lastX + dx * t) : x;
        const interpY = mouse.lastY !== -100 ? (mouse.lastY + dy * t) : y;
        spawnTrailParticle(interpX, interpY, dx, dy);
      }
    }

    mouse.lastX = x;
    mouse.lastY = y;

    startAnimationLoop();
  };

  // Attach movement listeners with capture & passive
  window.addEventListener('pointermove', handlePointerMove, { passive: true, capture: true });
  window.addEventListener('mousemove', handlePointerMove, { passive: true, capture: true });

  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && !e.toElement) {
      mouse.lastX = -100;
      mouse.lastY = -100;
      isMoving = false;
    }
  }, { passive: true });

  const checkIsImportantTarget = (target) => {
    if (!target || typeof target.closest !== 'function') return false;
    return !!target.closest(
      'a, button, input[type="button"], input[type="submit"], .btn, .nav-link, ' +
      '.copy-ip-btn, .faq-trigger, .rank-card, .staff-card, .status-indicator, ' +
      '.copy-box, [role="button"]'
    );
  };

  const handlePointerTrigger = (e) => {
    if (typeof e.button === 'number' && e.button !== 0) return;

    const now = performance.now();
    if (now - lastClickTime < 40) return;
    lastClickTime = now;

    const isImportant = checkIsImportantTarget(e.target);
    spawnClickBurst(e.clientX, e.clientY, isImportant);
  };

  window.addEventListener('pointerdown', handlePointerTrigger, { capture: true, passive: true });
  window.addEventListener('mousedown', handlePointerTrigger, { capture: true, passive: true });
  window.addEventListener('click', handlePointerTrigger, { capture: true, passive: true });
}

// Auto-run if script loaded after DOMContentLoaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initBeaconCursorAndClickEffects();
}

