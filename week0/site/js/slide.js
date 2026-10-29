/* Navigasi slide: tombol, papan ketik, geser jari, dan alamat #nomor. Tanpa pustaka luar. */
(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var sebelumnya = document.getElementById('sebelumnya');
  var berikutnya = document.getElementById('berikutnya');
  var status = document.getElementById('status');
  var indeks = 0;

  function dariHash() {
    var n = parseInt(window.location.hash.replace('#', ''), 10);
    if (isNaN(n) || n < 1 || n > slides.length) { return 0; }
    return n - 1;
  }

  function tampil(i, perbaruiHash) {
    indeks = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, k) { s.hidden = (k !== indeks); });
    status.textContent = (indeks + 1) + ' / ' + slides.length;
    sebelumnya.disabled = (indeks === 0);
    berikutnya.disabled = (indeks === slides.length - 1);
    if (perbaruiHash) {
      history.replaceState(null, '', '#' + (indeks + 1));
    }
    document.title = 'Slide ' + (indeks + 1) + ' dari ' + slides.length + ' | Kickoff Track AI, ML, dan Optimasi';
  }

  sebelumnya.addEventListener('click', function () { tampil(indeks - 1, true); });
  berikutnya.addEventListener('click', function () { tampil(indeks + 1, true); });

  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) { return; }
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'A' && e.key === 'Enter') { return; }
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ':
        if (tag === 'BUTTON' && e.key === ' ') { return; }
        e.preventDefault(); tampil(indeks + 1, true); break;
      case 'ArrowLeft': case 'PageUp':
        e.preventDefault(); tampil(indeks - 1, true); break;
      case 'Home': e.preventDefault(); tampil(0, true); break;
      case 'End': e.preventDefault(); tampil(slides.length - 1, true); break;
    }
  });

  var awalX = null;
  document.addEventListener('touchstart', function (e) { awalX = e.changedTouches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (awalX === null) { return; }
    var selisih = e.changedTouches[0].clientX - awalX;
    awalX = null;
    if (Math.abs(selisih) < 60) { return; }
    tampil(indeks + (selisih < 0 ? 1 : -1), true);
  }, { passive: true });

  window.addEventListener('hashchange', function () { tampil(dariHash(), false); });

  tampil(dariHash(), false);
})();
