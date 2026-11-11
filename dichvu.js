/* Services – 4 thẻ cuộn chồng (nằm dưới hero)
   Nếu có lỗi, trang tự quay về dạng 4 thẻ xếp dọc (không bị trắng) và báo lỗi trong Console (F12). */
(() => {
  const root = document.getElementById('svc');
  if (!root) { console.error('[svc] Không tìm thấy #svc trong home.html'); return; }
  const cards = [...root.querySelectorAll('.svc-card')];
  const N = cards.length;
  if (!N) { console.error('[svc] Không có thẻ .svc-card nào trong #svc'); return; }

  let vh = innerHeight, top0 = 0, current = 0, target = 0, raf = null;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ease  = x => 1 - Math.pow(1 - x, 1.6);

  const measure = () => {
    vh = innerHeight;
    root.style.height = (N * vh) + 'px';           // mỗi thẻ = 1 màn hình cuộn
    top0 = root.getBoundingClientRect().top + scrollY;
  };

  const render = t => {
    cards.forEach((card, i) => {
      const enter = i === 0 ? 1 : clamp(t - (i - 1), 0, 1);   // đang trượt lên
      const leave = clamp(t - i, 0, 1);                        // bị thẻ sau che
      const y = (1 - ease(enter)) * (vh * 0.87 + 40);
      card.style.transform = `translate3d(0,${y}px,0) scale(${1 - 0.05 * leave})`;
      card.style.opacity = leave >= 1 ? 0 : 1 - leave * 0.92;
      card.style.filter = leave > 0.001 ? `blur(${(leave * 7).toFixed(2)}px)` : 'none';
      card.style.zIndex = i + 1;
      card.style.pointerEvents = enter >= 1 && leave < 0.5 ? 'auto' : 'none';
      card.style.visibility = enter <= 0 || leave >= 1 ? 'hidden' : 'visible';
    });
  };

  const loop = () => {
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0005) current = target;
    render(current);
    raf = current !== target ? requestAnimationFrame(loop) : null;
  };

  const onScroll = () => {
    target = clamp((scrollY - top0) / vh, 0, N - 1);
    if (!raf) raf = requestAnimationFrame(loop);
  };

  // tạo 4 nút Y cho từng thẻ (thiếu <nav class="svc-dots"> thì bỏ qua, không làm hỏng hiệu ứng)
  const buildDots = () => cards.forEach((card, ci) => {
    const nav = card.querySelector('.svc-dots');
    if (!nav || nav.children.length) return;
    for (let i = 0; i < N; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.innerHTML = '<svg viewBox="0 0 24 24"><use href="#svc-y"/></svg>';
      if (i === ci) b.classList.add('on');
      b.addEventListener('click', () => scrollTo({ top: top0 + i * vh, behavior: 'smooth' }));
      nav.appendChild(b);
    }
  });

  const fallback = err => {                         // lỗi -> trả về dạng xếp dọc, thẻ vẫn hiện
    console.error('[svc] Hiệu ứng thẻ đè bị lỗi, chuyển sang dạng xếp dọc:', err);
    root.classList.remove('is-live');
    root.style.height = '';
    cards.forEach(c => c.removeAttribute('style'));
  };

  try {
    root.classList.add('is-live');
    try { buildDots(); } catch (e) { console.warn('[svc] Không tạo được nút Y:', e); }
    measure();
    target = current = clamp((scrollY - top0) / vh, 0, N - 1);
    render(current);
    onScroll();

    addEventListener('scroll', () => { try { onScroll(); } catch (e) { fallback(e); } }, { passive: true });
    addEventListener('resize', () => { try { measure(); onScroll(); } catch (e) { fallback(e); } });
    addEventListener('load',   () => { try { measure(); onScroll(); } catch (e) { fallback(e); } });
  } catch (e) {
    fallback(e);
  }
})();
