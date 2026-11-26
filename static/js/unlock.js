// =============================================================
//  unlock.js —— 随笔页（backroom）密码解锁
//
//  随笔列表和正文在构建时用 PBKDF2 + AES-GCM 加密成 backroom/content.json，
//  这里在浏览器端解密，一次性注入整页。
//  工具在 tools.html，是公开的普通页面，不走加密。
//  密码只存在于输入的那一下和这页的内存里，不写进仓库、不写进本地存储。
//
//  说明：这层加密能挡住随意翻看和搜索引擎，但挡不住一个拿到密文后
//  专门离线爆破的 attacker —— 所以请用足够长的密码（见 README）。
// =============================================================

(function () {
  'use strict';

  const gate = document.getElementById('backroom-gate');
  const content = document.getElementById('backroom-content');
  const input = document.getElementById('backroom-pass');
  if (!gate || !content || !input) return; // 不是随笔页就什么都不做

  function b64ToBuf(b64) {
    const bin = atob(b64);
    const u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u;
  }

  async function decrypt(rec, password) {
    const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: b64ToBuf(rec.salt), iterations: 200000, hash: 'SHA-256' },
      km,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBuf(rec.iv) }, key, b64ToBuf(rec.ct));
    return new TextDecoder().decode(pt);
  }

  // ---- 列表 ↔ 单篇，用 hash 记录当前位置 ----
  function initEssay() {
    const postIndex = document.getElementById('post-index');
    const postView = document.getElementById('post-view');
    const sections = content.querySelectorAll('section.notes');

    function setSections(hidden) {
      for (let i = 0; i < sections.length; i++) sections[i].hidden = hidden;
    }

    function showLists() {
      setSections(false);
      if (postIndex) postIndex.hidden = false;
      if (postView) postView.hidden = true;
    }

    function openPost(slug) {
      if (!postView) return false;
      let hit = null;
      postView.querySelectorAll('article.post').forEach(function (a) {
        const on = a.getAttribute('data-slug') === slug;
        a.hidden = !on;
        if (on) hit = a;
      });
      if (!hit) return false;
      setSections(true);
      postView.hidden = false;
      window.scrollTo(0, 0);
      return true;
    }

    document.addEventListener('click', function (e) {
      const target = e.target;

      const link = target.closest('a[data-post]');
      if (link) {
        e.preventDefault();
        const slug = link.getAttribute('data-post');
        if (openPost(slug)) history.replaceState(null, '', '#post-' + slug);
        return;
      }

      if (target.closest('a[data-back]')) {
        e.preventDefault();
        showLists();
        history.replaceState(null, '', location.pathname + location.search);
      }
    });

    function fromHash() {
      const m = location.hash.match(/^#post-(.+)$/);
      if (m && openPost(decodeURIComponent(m[1]))) return;
      showLists();
    }

    window.addEventListener('hashchange', fromHash);
    if (location.hash) fromHash();
  }

  async function unlock() {
    const pw = input.value;
    if (!pw) return;
    try {
      const res = await fetch('backroom/content.json', { cache: 'no-store' });
      const rec = await res.json();
      if (rec.status === 'unavailable') return; // 没带密码构建，没有可解的内容
      const html = await decrypt(rec, pw);
      gate.style.display = 'none';
      content.innerHTML = html;
      content.hidden = false;
      initEssay();
    } catch (e) {
      // 密码不对：清空输入并抖一下，不显示任何文字提示
      input.value = '';
      input.classList.remove('shake');
      void input.offsetWidth; // 强制重排，让动画能重复触发
      input.classList.add('shake');
    }
  }

  // 表单提交：桌面按 Enter、手机点按钮或键盘的“前往”都走这里
  gate.addEventListener('submit', function (e) {
    e.preventDefault();
    unlock();
  });
})();
