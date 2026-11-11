/* =====================================================================
   mobile.js – menu hamburger + thanh đặt phòng cố định cho điện thoại
   Nạp cuối <body> bằng:  <script src="mobile.js" defer></script>
   Tự đọc link từ header hiện có (không cần sửa HTML từng trang).
   Chỉ hoạt động khi màn hình ≤1024px (phần còn lại do mobile.css quyết định).
   ===================================================================== */
(function () {
  'use strict';
  if (window.__mbInit) return;
  window.__mbInit = true;

  var header = document.querySelector('.hd, header.header, #header');
  if (!header) return;

  var CJK = /[\u4e00-\u9fff]/;
  var isZh = CJK.test((header.textContent || '').replace(/Tiếng Việt\/\s*中文|越南语\/中文/g, ''));

  var T = isZh
    ? { menu: '菜单', close: '关闭菜单', book: '立即预订', from: '参考价格', lang: '越南语 / 中文' }
    : { menu: 'Mở menu', close: 'Đóng menu', book: 'Đặt phòng ngay', from: 'Giá từ', lang: 'Tiếng Việt / 中文' };

  /* ---------- Thu thập link từ header hiện có ---------- */
  function urlFromOnclick(el) {
    var s = (el && el.getAttribute && el.getAttribute('onclick')) || '';
    var m = s.match(/['"]([^'"]+\.html[^'"]*)['"]/);
    return m ? m[1] : '';
  }
  function hrefOf(el) {
    if (!el) return '';
    var a = el.tagName === 'A' ? el : (el.querySelector('a[href]') || el.closest('a[href]'));
    if (a) return a.getAttribute('href');
    return urlFromOnclick(el) || urlFromOnclick(el.querySelector('[onclick]'));
  }

  var navLinks = [].slice.call(header.querySelectorAll('nav a[href]')).map(function (a) {
    return {
      href: a.getAttribute('href'),
      text: a.textContent.replace(/\s+/g, ' ').trim(),
      current: a.classList.contains('on') || a.getAttribute('aria-current') === 'page'
    };
  });

  var langHref = '';
  [].slice.call(header.querySelectorAll('a, button, div')).some(function (el) {
    if (/中文/.test(el.textContent) && el.children.length < 3) {
      var h = hrefOf(el);
      if (h && h !== '#') { langHref = h; return true; }
    }
    return false;
  });

  var ctaHref = '';
  var ctaEl = header.querySelector('a.cta') ||
    [].slice.call(header.querySelectorAll('button, a')).filter(function (el) {
      return /dat_phong|预订|订房/.test((el.getAttribute('href') || '') + (el.getAttribute('onclick') || '') +
        ((el.querySelector('[onclick]') || {}).getAttribute ? el.querySelector('[onclick]').getAttribute('onclick') : ''));
    })[0];
  ctaHref = hrefOf(ctaEl);
  if (!ctaHref) {
    var side = document.querySelector('.side .btn[href]');
    if (side) ctaHref = side.getAttribute('href');
  }

  /* ---------- Nút hamburger ---------- */
  var burger = document.createElement('button');
  burger.type = 'button';
  burger.className = 'mb-burger';
  burger.setAttribute('aria-label', T.menu);
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'mb-drawer');
  burger.innerHTML = '<span></span>';

  var host = header.querySelector('.act') || header.querySelector('.hd-r') || header.querySelector('.header__right') || header;
  host.appendChild(burger);

  /* ---------- Ngăn kéo menu ---------- */
  var drawer = document.createElement('div');
  drawer.className = 'mb-drawer';
  drawer.id = 'mb-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', T.menu);

  var links = document.createElement('nav');
  links.className = 'mb-links';
  navLinks.forEach(function (l) {
    var a = document.createElement('a');
    a.href = l.href;
    a.textContent = l.text;
    if (l.current) a.setAttribute('aria-current', 'page');
    links.appendChild(a);
  });
  drawer.appendChild(links);

  var actions = document.createElement('div');
  actions.className = 'mb-actions';
  if (ctaHref) {
    var book = document.createElement('a');
    book.className = 'mb-book';
    book.href = ctaHref;
    book.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg><span></span>';
    book.querySelector('span').textContent = T.book;
    actions.appendChild(book);
  }
  if (langHref) {
    var lang = document.createElement('a');
    lang.className = 'mb-lang';
    lang.href = langHref;
    lang.textContent = T.lang;
    actions.appendChild(lang);
  }
  drawer.appendChild(actions);
  document.body.appendChild(drawer);

  function setOpen(open) {
    document.documentElement.classList.toggle('mb-open', open);
    document.body.classList.toggle('mb-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? T.close : T.menu);
    if (open) { var first = drawer.querySelector('a'); first && first.focus({ preventScroll: true }); }
  }
  burger.addEventListener('click', function () { setOpen(!document.body.classList.contains('mb-open')); });
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('mb-open')) { setOpen(false); burger.focus(); }
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', function (e) { if (e.matches) setOpen(false); });

  /* ---------- Thanh đặt phòng cố định ở đáy ---------- */
  var priceB = document.querySelector('.side .price b');
  var onRoomPage = !!priceB;
  var onRoomsList = !!document.querySelector('.faq');   // trang Hạng phòng
  if ((onRoomPage || onRoomsList) && ctaHref) {
    var bar = document.createElement('div');
    bar.className = 'mb-bar';
    var left = document.createElement('div');
    left.className = 'mb-price';
    if (onRoomPage) {
      var small = document.createElement('small');
      small.textContent = T.from;
      var b = document.createElement('b');
      b.textContent = priceB.textContent.trim();
      left.appendChild(small); left.appendChild(b);
    } else {
      var t = document.createElement('b');
      t.textContent = isZh ? '想入住下龙湾？' : 'Sẵn sàng nghỉ dưỡng?';
      left.appendChild(t);
    }
    var go = document.createElement('a');
    go.className = 'mb-go';
    go.href = ctaHref;
    go.textContent = T.book;
    bar.appendChild(left); bar.appendChild(go);
    document.body.appendChild(bar);
    document.body.classList.add('has-mb-bar');

    /* Ẩn thanh khi cuộn tới chân trang hoặc khu "Đặt phòng" cuối trang */
    var hideTargets = [document.querySelector('.site-footer'), document.querySelector('.end')].filter(Boolean);
    if ('IntersectionObserver' in window && hideTargets.length) {
      var visible = new Set();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? visible.add(en.target) : visible.delete(en.target); });
        bar.classList.toggle('is-hidden', visible.size > 0);
      }, { threshold: 0.15 });
      hideTargets.forEach(function (el) { io.observe(el); });
    }
  }
})();
