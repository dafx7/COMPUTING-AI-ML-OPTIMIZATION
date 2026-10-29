/* Evolusi Gambar: hill climbing (1+1) pada 40 segitiga transparan.
   Satu "evaluasi" = menggambar ulang kandidat dan menghitung galat terhadap target.
   Tanpa pustaka luar dan tanpa penyimpanan data. */
(function () {
  'use strict';

  var W = 64, H = 64;
  var JUMLAH = 40;            // jumlah segitiga
  var BATAS_EVALUASI = 30000; // anggaran
  var KECEPATAN = { pelan: 4, sedang: 40, cepat: 400 };

  var elTarget = document.getElementById('kanvas-target');
  var elTerbaik = document.getElementById('kanvas-terbaik');
  var elKurva = document.getElementById('kanvas-kurva');
  var tombolMain = document.getElementById('tombol-main');
  var tombolUlang = document.getElementById('tombol-ulang');
  var pilihKecepatan = document.getElementById('kecepatan');
  var sIter = document.getElementById('s-iter');
  var sTerima = document.getElementById('s-terima');
  var sGalat = document.getElementById('s-galat');
  var sBaik = document.getElementById('s-baik');
  var sSeed = document.getElementById('s-seed');
  var umum = document.getElementById('umum');

  var ctxTarget = elTarget.getContext('2d');
  var ctxTerbaik = elTerbaik.getContext('2d');
  var ctxKurva = elKurva.getContext('2d');
  var kerja = document.createElement('canvas');
  kerja.width = W; kerja.height = H;
  var kctx = kerja.getContext('2d', { willReadFrequently: true });

  var dataTarget;
  var genom, rnd, seed, iter, diterima, galat0, galatSkrg, riwayat, jalan, selesai, berubah;

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normal() { // Box-Muller
    var u = 1 - rnd(), v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function klem(x, a, b) { return x < a ? a : (x > b ? b : x); }

  function gambarTarget(ctx) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0A2540');
    g.addColorStop(0.65, '#2d5a8a');
    g.addColorStop(1, '#8fb0d0');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#F7B125';
    ctx.beginPath(); ctx.arc(44, 24, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#12363f';
    ctx.beginPath(); ctx.moveTo(0, 64); ctx.lineTo(0, 46); ctx.lineTo(20, 35); ctx.lineTo(42, 53); ctx.lineTo(64, 41); ctx.lineTo(64, 64); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#061a2c';
    ctx.beginPath(); ctx.moveTo(0, 64); ctx.lineTo(0, 56); ctx.lineTo(26, 48); ctx.lineTo(64, 58); ctx.lineTo(64, 64); ctx.closePath(); ctx.fill();
  }

  function perbaruiWarna(s) {
    s.warna = 'rgba(' + Math.round(s.r) + ',' + Math.round(s.g) + ',' + Math.round(s.b) + ',' + s.a.toFixed(3) + ')';
  }

  function segitigaAcak() {
    var cx = rnd(), cy = rnd();
    var s = { x: [0, 0, 0], y: [0, 0, 0], r: rnd() * 255, g: rnd() * 255, b: rnd() * 255, a: 0.2 + rnd() * 0.3 };
    for (var k = 0; k < 3; k++) {
      s.x[k] = klem(cx + (rnd() - 0.5) * 0.4, 0, 1);
      s.y[k] = klem(cy + (rnd() - 0.5) * 0.4, 0, 1);
    }
    perbaruiWarna(s);
    return s;
  }

  function render(ctx) {
    ctx.fillStyle = '#777777';
    ctx.fillRect(0, 0, W, H);
    for (var i = 0; i < genom.length; i++) {
      var s = genom[i];
      ctx.fillStyle = s.warna;
      ctx.beginPath();
      ctx.moveTo(s.x[0] * W, s.y[0] * H);
      ctx.lineTo(s.x[1] * W, s.y[1] * H);
      ctx.lineTo(s.x[2] * W, s.y[2] * H);
      ctx.closePath();
      ctx.fill();
    }
  }

  function galat() {
    var d = kctx.getImageData(0, 0, W, H).data;
    var t = dataTarget, jumlah = 0;
    for (var i = 0; i < d.length; i += 4) {
      var dr = d[i] - t[i], dg = d[i + 1] - t[i + 1], db = d[i + 2] - t[i + 2];
      jumlah += dr * dr + dg * dg + db * db;
    }
    return Math.sqrt(jumlah / (W * H * 3));
  }

  // Ubah satu hal pada satu segitiga. Mengembalikan fungsi pembatal.
  function mutasi() {
    var idx = Math.floor(rnd() * genom.length);
    var s = genom[idx];
    var salinan = { x: s.x.slice(), y: s.y.slice(), r: s.r, g: s.g, b: s.b, a: s.a, warna: s.warna };
    var skala = [0.2, 0.08, 0.02][Math.floor(rnd() * 3)];
    var jenis = rnd();
    var urutanLama = null;

    if (jenis < 0.40) {                       // geser satu titik sudut
      var k = Math.floor(rnd() * 3);
      s.x[k] = klem(s.x[k] + normal() * skala, 0, 1);
      s.y[k] = klem(s.y[k] + normal() * skala, 0, 1);
    } else if (jenis < 0.65) {                // ubah satu kanal warna
      var c = ['r', 'g', 'b'][Math.floor(rnd() * 3)];
      s[c] = klem(s[c] + normal() * skala * 255, 0, 255);
      perbaruiWarna(s);
    } else if (jenis < 0.80) {                // ubah transparansi
      s.a = klem(s.a + normal() * skala, 0.05, 0.9);
      perbaruiWarna(s);
    } else if (jenis < 0.90) {                // geser seluruh segitiga
      var dx = normal() * skala, dy = normal() * skala;
      for (var m = 0; m < 3; m++) { s.x[m] = klem(s.x[m] + dx, 0, 1); s.y[m] = klem(s.y[m] + dy, 0, 1); }
    } else {                                  // pindahkan urutan gambar
      urutanLama = { dari: idx, ke: Math.floor(rnd() * genom.length) };
      genom.splice(urutanLama.dari, 1);
      genom.splice(urutanLama.ke, 0, s);
    }

    return function batal() {
      if (urutanLama) {
        genom.splice(urutanLama.ke, 1);
        genom.splice(urutanLama.dari, 0, s);
      } else {
        s.x = salinan.x; s.y = salinan.y; s.r = salinan.r; s.g = salinan.g; s.b = salinan.b; s.a = salinan.a; s.warna = salinan.warna;
      }
    };
  }

  function langkah() {
    var batal = mutasi();
    render(kctx);
    var g = galat();
    iter++;
    if (g <= galatSkrg) {
      galatSkrg = g; diterima++; berubah = true;
    } else {
      batal();
    }
    if (iter % 25 === 0) { riwayat.push([iter, galatSkrg]); }
  }

  function format(n) { return n.toLocaleString('id-ID'); }

  function gambarKurva() {
    var w = elKurva.width, h = elKurva.height;
    var kiri = 8, kanan = w - 12, atas = 10, bawah = h - 14;
    ctxKurva.clearRect(0, 0, w, h);
    ctxKurva.fillStyle = '#ffffff';
    ctxKurva.fillRect(0, 0, w, h);
    ctxKurva.strokeStyle = '#C5D0DE';
    ctxKurva.lineWidth = 1;
    ctxKurva.beginPath();
    ctxKurva.moveTo(kiri, atas); ctxKurva.lineTo(kiri, bawah); ctxKurva.lineTo(kanan, bawah);
    ctxKurva.stroke();
    var maxX = Math.max(BATAS_EVALUASI * 0.1, iter);
    var maxY = galat0 * 1.05;
    function px(i) { return kiri + (i / maxX) * (kanan - kiri); }
    function py(g) { return bawah - (g / maxY) * (bawah - atas); }
    ctxKurva.strokeStyle = '#0A2540';
    ctxKurva.lineWidth = 2.5;
    ctxKurva.beginPath();
    for (var i = 0; i < riwayat.length; i++) {
      var p = riwayat[i];
      if (i === 0) { ctxKurva.moveTo(px(p[0]), py(p[1])); } else { ctxKurva.lineTo(px(p[0]), py(p[1])); }
    }
    ctxKurva.lineTo(px(iter), py(galatSkrg));
    ctxKurva.stroke();
    ctxKurva.fillStyle = '#F7B125';
    ctxKurva.strokeStyle = '#0A2540';
    ctxKurva.lineWidth = 2;
    ctxKurva.beginPath(); ctxKurva.arc(px(iter), py(galatSkrg), 5, 0, Math.PI * 2); ctxKurva.fill(); ctxKurva.stroke();
  }

  function tampilkan() {
    if (berubah) { render(ctxTerbaik); berubah = false; }
    sIter.textContent = format(iter);
    sTerima.textContent = format(diterima);
    sGalat.textContent = galatSkrg.toFixed(1).replace('.', ',');
    sBaik.textContent = Math.round((1 - galatSkrg / galat0) * 100) + '%';
    gambarKurva();
  }

  function laporkan(pesan) {
    umum.textContent = pesan + ' Evaluasi ' + format(iter) + '. Galat ' + galatSkrg.toFixed(1).replace('.', ',') +
      '. Perbaikan ' + Math.round((1 - galatSkrg / galat0) * 100) + ' persen dari awal.';
  }

  function bingkai() {
    if (!jalan) { return; }
    var maks = KECEPATAN[pilihKecepatan.value] || KECEPATAN.sedang;
    var t0 = performance.now(), n = 0;
    while (n < maks && iter < BATAS_EVALUASI && performance.now() - t0 < 12) { langkah(); n++; }
    tampilkan();
    if (iter >= BATAS_EVALUASI) {
      jalan = false; selesai = true;
      tombolMain.textContent = 'Selesai';
      tombolMain.disabled = true;
      laporkan('Anggaran habis.');
      return;
    }
    window.requestAnimationFrame(bingkai);
  }

  function ulang() {
    jalan = false; selesai = false;
    seed = Math.floor(Math.random() * 90000) + 10000;
    rnd = mulberry32(seed);
    genom = [];
    for (var i = 0; i < JUMLAH; i++) { genom.push(segitigaAcak()); }
    render(kctx);
    galat0 = galat();
    galatSkrg = galat0;
    iter = 0; diterima = 0; riwayat = [[0, galat0]]; berubah = true;
    sSeed.textContent = String(seed);
    tombolMain.textContent = 'Mulai';
    tombolMain.disabled = false;
    umum.textContent = '';
    tampilkan();
  }

  tombolMain.addEventListener('click', function () {
    if (selesai) { return; }
    if (jalan) {
      jalan = false;
      tombolMain.textContent = 'Lanjut';
      laporkan('Dijeda.');
    } else {
      jalan = true;
      tombolMain.textContent = 'Jeda';
      window.requestAnimationFrame(bingkai);
    }
  });
  tombolUlang.addEventListener('click', ulang);

  gambarTarget(ctxTarget);
  dataTarget = ctxTarget.getImageData(0, 0, W, H).data;
  ulang();
})();
