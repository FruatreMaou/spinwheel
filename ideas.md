# Arah Desain — SpinWheel Mini

## Tiga pendekatan awal

### 1. Putaran Kertas Pesta
**Very Brief Intro:** Antarmuka terasa seperti permainan meja pada pesta kecil: hangat, riang, dan sedikit taktil. Kertas, pita, serta warna tinta menjadi pusat pengalaman.

**Probability:** 0.07

### 2. Studio Siaran Langsung
**Very Brief Intro:** Roda tampil seperti alat penentuan pemenang di studio acara televisi mini. Kontras tegas dan gerak yang terukur membuat hasil terasa dramatis.

**Probability:** 0.04

### 3. Kios Keberuntungan
**Very Brief Intro:** Sebuah kios undian retro-modern yang memadukan kertas nota, cap tinta, dan permainan warna koral. Interaksi sederhana terasa seperti menarik kupon nyata.

**Probability:** 0.09

---

## Pendekatan terpilih: Kios Keberuntungan

### Design Movement
Mengambil inspirasi dari **editorial retro-modern** dan grafis kios permainan era pertengahan abad ke-20, dengan bentuk potongan kertas yang segar dan tata letak asimetris.

### Core Principles
1. Keberuntungan harus terasa nyata melalui tekstur, tanda cetak, dan unsur analog.
2. Roda adalah pusat panggung; semua elemen lain bertugas membangun antisipasi tanpa menyaingi roda.
3. Kontrol harus ringkas, terbaca, dan memberikan respons fisik ketika dipakai.
4. Kejutan kecil hadir melalui warna, gerak, dan bahasa mikro, bukan dekorasi berlebihan.

### Color Philosophy
Latar krem hangat memberi rasa seperti kertas poster, sementara **koral tomat** menjadi warna milik merek dan penanda aksi. Biru tinta dan hijau lumut membangun kontras yang tenang; kuning mentega dipakai sebagai kilasan keberuntungan. Kombinasi ini sengaja menghindari nuansa digital dingin agar aplikasi terasa seperti objek permainan yang dapat disentuh.

### Layout Paradigm
Halaman memakai komposisi **panggung dan loket**: roda mendominasi sisi kiri sebagai panggung permainan, sedangkan sisi kanan berfungsi seperti meja loket untuk mengatur kupon pilihan. Pada layar kecil, loket turun secara berurutan di bawah panggung tanpa mengorbankan ukuran roda.

### Signature Elements
1. Stiker label berbentuk kapsul dengan tepi putus-putus seperti nota undian.
2. Titik-titik radial di sekitar roda sebagai kilau keberuntungan.
3. Cap hasil bergaya tinta pada kartu pemenang.

### Interaction Philosophy
Setiap tindakan memberi umpan balik yang jelas: tombol memampat ketika ditekan, item daftar merespons saat disentuh, dan putaran roda mengutamakan ketegangan yang singkat. Pengguna dapat langsung mencoba tanpa perlu panduan panjang.

### Animation
Putaran memakai gerak melambat yang kuat selama sekitar 4,8 detik untuk membangun antisipasi. Panel dan kartu masuk dengan translasi kecil serta opacity pada pemuatan awal. Semua gerak non-esensial dimatikan untuk pengguna yang memilih reduced motion; tombol memakai transisi 160 ms dan efek scale 0,97 saat aktif.

### Typography System
**DM Serif Display** dipakai untuk judul dan hasil pemenang agar terasa editorial serta ekspresif. **DM Sans** dipakai untuk antarmuka, instruksi, dan daftar agar padat namun ramah. Judul memakai ukuran besar dan leading rapat; label menggunakan huruf kapital kecil dengan letter-spacing lebar.

### Brand Essence
**SpinWheel adalah loket keputusan kecil untuk siapa pun yang ingin mengubah pilihan biasa menjadi momen seru.** Kepribadian: riang, taktil, spontan.

### Brand Voice
Nada bahasa singkat, mengundang, dan sedikit jenaka; CTA memakai kata kerja aktif tanpa janji berlebihan.

Contoh: “Masukkan pilihanmu, lalu biarkan roda berisik.”

Contoh: “Sekali putar. Tidak ada debat lanjutan.”

### Wordmark & Logo
Wordmark memakai “SPIN” yang padat dan “WHEEL” dengan gaya serif miring, didampingi mark lingkaran koral bergigi dengan lubang biru tinta di tengah—seperti roda kecil sekaligus cap undian. Mark dipakai tanpa teks sebagai favicon dan identitas di header.

### Signature Brand Color
**Koral Tomat — #F04B36**. Warna ini selalu menandai dorongan aksi, hasil, dan identitas utama.

## Style Decisions

- Roda dalam keadaan kosong tetap menampilkan sektor cetak samar, titik radial, dan lingkaran bertanda agar panggung permainan terasa hidup sebelum pilihan dimasukkan.
- Kartu hasil selalu diperlakukan sebagai nota undian dengan dasar kertas hangat, garis putus-putus, serta cap tinta transparan; bukan panel digital datar.
- Confetti difokuskan sebagai orbit keberuntungan di sekitar roda dan pointer agar dekorasi mendukung aksi putaran, bukan menjadi wallpaper halaman.
