/* ============================================================
   BinaryShield — Web VAPT Checklist
   Script: script.js
   ============================================================ */

// ── DONE TOGGLE BUTTONS ─────────────────────────────────────
// Inject a toggle button into every vuln-header and restore state
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.vuln-header').forEach(header => {
    const card = header.closest('.vuln-card');
    const id = card ? card.id : null;

    // Create the toggle button
    const btn = document.createElement('button');
    btn.className = 'toggle-done';
    btn.title = 'Mark as tested';
    btn.innerHTML = '✓';

    // Restore saved state
    if (id && localStorage.getItem('done_' + id) === '1') {
      btn.classList.add('done');
      card.classList.add('done-card');
    }

    // Toggle on click (stop propagation so card doesn't collapse)
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isDone = btn.classList.toggle('done');
      if (card) card.classList.toggle('done-card', isDone);
      if (id) localStorage.setItem('done_' + id, isDone ? '1' : '0');
    });

    // Insert before the chevron
    const chevron = header.querySelector('.chevron');
    if (chevron) {
      header.insertBefore(btn, chevron);
    } else {
      header.appendChild(btn);
    }
  });
});

// Toggle individual card open/closed
function toggleCard(header) {
  const body = header.nextElementSibling;
  const chevron = header.querySelector('.chevron');
  if (body.classList.contains('collapsed')) {
    body.classList.remove('collapsed');
    header.classList.remove('collapsed-header');
  } else {
    body.classList.add('collapsed');
    header.classList.add('collapsed-header');
  }
}

// Expand all cards
function expandAll() {
  document.querySelectorAll('.vuln-body').forEach(b => b.classList.remove('collapsed'));
  document.querySelectorAll('.vuln-header').forEach(h => h.classList.remove('collapsed-header'));
}

// Collapse all cards
function collapseAll() {
  document.querySelectorAll('.vuln-body').forEach(b => b.classList.add('collapsed'));
  document.querySelectorAll('.vuln-header').forEach(h => h.classList.add('collapsed-header'));
}

// Live search across vulnerability cards
function searchVulns(query) {
  const q = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.vuln-card');
  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = (!q || text.includes(q)) ? '' : 'none';
  });
  // Dim non-matching nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.opacity = (!q || text.includes(q)) ? '1' : '0.3';
  });
}

// Scroll-to-top button visibility
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scroll-top');
  btn.classList.toggle('show', window.scrollY > 300);
});

// Active nav item highlighting on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-20% 0px -60% 0px' });

document.querySelectorAll('.vuln-card[id]').forEach(card => observer.observe(card));
