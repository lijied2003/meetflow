(() => {
  document.querySelectorAll("[data-product-link]").forEach(link => {
    link.href = PRODUCT_URL;
  });
  const nav = document.getElementById('site-nav');
  const menu = document.querySelector('.menu-toggle');
  const mobile = window.matchMedia('(max-width: 700px)');
  const menuIcon = menu.querySelector('use');
  const menuText = menu.querySelector('span');
  document.documentElement.classList.add('enhanced');
  menu.hidden = false;

  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(mobile.matches && open));
    nav.hidden = mobile.matches && !open;
    menuIcon.setAttribute('href', open ? '#i-close' : '#i-menu');
    menuText.textContent = open ? '关闭' : '菜单';
  }

  setMenu(false);
  mobile.addEventListener('change', () => {
    const focusInNav = nav.contains(document.activeElement);
    setMenu(false);
    if (mobile.matches && focusInNav) menu.focus();
  });
  menu.addEventListener('click', () => setMenu(nav.hidden));
  nav.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || !mobile.matches) return;
    setMenu(false);
    const destination = document.getElementById(link.hash.slice(1));
    if (destination) {
      destination.tabIndex = -1;
      destination.focus({ preventScroll: true });
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobile.matches && !nav.hidden) {
      setMenu(false);
      menu.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (mobile.matches && !nav.hidden && !nav.contains(event.target) && !menu.contains(event.target)) setMenu(false);
  });

  const tablist = document.querySelector('.gallery-tabs');
  const tabs = [...tablist.querySelectorAll('button')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', () => selectTab(index));
  });

  function selectTab(index, moveFocus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (moveFocus) tabs[index].focus();
  }

  selectTab(0);
  tablist.hidden = false;
  tablist.addEventListener('keydown', (event) => {
    const index = tabs.indexOf(event.target);
    if (index < 0) return;
    let next;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % tabs.length; break;
      case 'ArrowLeft': next = (index + tabs.length - 1) % tabs.length; break;
      case 'Home': next = 0; break;
      case 'End': next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectTab(next, true);
  });

  const dialog = document.getElementById('screenshot-viewer');
  const dialogTitle = dialog.querySelector('h2');
  const imageScroll = dialog.querySelector('.viewer-image');
  const dialogImage = imageScroll.querySelector('img');
  let opener;
  if (typeof dialog.showModal === 'function') {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('.zoom-trigger');
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      dialogTitle.textContent = link.dataset.title;
      dialogImage.alt = link.querySelector('img')?.alt || link.closest('figure')?.querySelector('img')?.alt || link.dataset.title;
      dialogImage.src = link.href;
      dialog.showModal();
      imageScroll.scrollTo(0, 0);
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      opener?.focus({ preventScroll: true });
    });
  }

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, { threshold: .1 });
    document.querySelectorAll('.reveal').forEach((item) => reveal.observe(item));
  }

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) => document.getElementById(link.hash.slice(1)));
  let scheduled = false;
  function syncNavigation() {
    const guide = Math.min(260, window.innerHeight * .35);
    let active = -1;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= guide) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  function scheduleNavigation() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(syncNavigation);
  }
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation, { passive: true });
  syncNavigation();
})();
