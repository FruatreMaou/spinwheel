# Deployment Eksternal — SpinWheel Mini

SpinWheel Mini adalah aplikasi frontend statis. Build produksi dibuat melalui `pnpm build`; berkas yang diunggah berada dalam direktori `dist/public`. Konfigurasi di repositori ini sudah menyediakan fallback SPA untuk semua rute, sehingga halaman tetap dimuat dengan benar ketika URL dibuka langsung.

| Platform | Konfigurasi yang digunakan | Build command | Publish directory |
|---|---|---|---|
| Vercel | `vercel.json` | `pnpm build` | `dist/public` |
| Netlify | `netlify.toml` | `pnpm build` | `dist/public` |

## Vercel

Hubungkan repositori GitHub proyek ke Vercel. Platform akan membaca `vercel.json` secara otomatis. Pastikan instalasi menggunakan Node.js 22 dan pnpm sesuai `package.json`, lalu jalankan deployment tanpa mengubah direktori output.

## Netlify

Hubungkan repositori GitHub proyek ke Netlify. Platform akan membaca `netlify.toml` secara otomatis, memakai Node.js 22, menjalankan `pnpm build`, dan memublikasikan isi `dist/public`.

## Catatan

Daftar pilihan pengguna disimpan melalui `localStorage` di browser. Karena itu, data tersebut tidak dikirim ke server dan tidak berpindah otomatis antarperangkat atau antarbrowser.
