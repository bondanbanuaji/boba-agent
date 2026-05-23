# 🚀 Panduan Setup BOBA-AGENT (Versi Gampang)

Halo! Mau cobain jalanin **BOBA-AGENT** di komputermu sendiri? Tenang, panduan ini dibikin khusus buat kamu yang pengen setup dengan cepat dan gampang, tanpa pusing mikirin istilah teknis yang ribet.

Kita akan bagi prosesnya jadi beberapa langkah gampang. Yuk, mulai!

---

## 🛠️ 1. Persiapan Awal (Yang Wajib Ada di Laptopmu)

Sebelum mulai, ibarat mau masak, kita butuh alat-alatnya dulu. Pastikan kamu udah punya 3 aplikasi ini:

1. **Node.js** (Minimal versi 22) - Ini mesin utama buat jalanin aplikasinya.
   👉 [Download Node.js di sini](https://nodejs.org/)
2. **Git** - Buat ngambil kode aplikasinya dari internet.
   👉 [Download Git di sini](https://git-scm.com/)
3. **PostgreSQL** (Minimal versi 15) - Ini tempat nyimpen data (database) kayak history chat kamu.
   👉 [Download PostgreSQL di sini](https://www.postgresql.org/download/)

*Cara cek kalau udah ke-install:* Buka terminal/Command Prompt (CMD), lalu ketik `node -v` dan `git --version`. Kalau keluar angkanya, berarti udah aman!

---

## 📥 2. Ambil Kodenya (Download)

Sekarang kita ambil kode BOBA-AGENT-nya. Buka terminal/CMD, lalu ketik:

```bash
git clone https://github.com/username/boba-agent.git
cd boba-agent
```
*(Catatan: Ganti `username` dengan link repo aslinya ya)*

---

## 📦 3. Install Bahan-bahannya (Dependencies)

Kodenya udah ada, sekarang kita perlu download "bumbu-bumbunya" (library tambahan). Tenang, kamu cuma perlu ketik satu perintah ini di folder `boba-agent`:

```bash
npm install
```

Tunggu sebentar sampai proses loadingnya selesai (biasanya beberapa menit).

---

## 🔑 4. Bikin "Kunci Rahasia" (File .env)

Aplikasi butuh tahu password database-mu dan API key (kunci rahasia) buat nyambung ke AI. Kita udah siapin contohnya, kamu tinggal *copy-paste* aja!

**Untuk Backend (API):**
1. Masuk ke folder `apps/api`.
2. Copy file `.env.example` dan ubah namanya jadi `.env`.
3. Buka file `.env` pakai Notepad atau VS Code.
4. Ganti bagian `DATABASE_URL` dengan password PostgreSQL-mu. Contoh:
   `DATABASE_URL=postgresql://postgres:password_kamu_disini@localhost:5432/boba_agent`
5. Kalau kamu punya API Key dari OpenAI / Gemini, masukin juga di situ. Kalau nggak, pakai default bawaan `9Router` buat lokal.

**Untuk Frontend (Web):**
1. Masuk ke folder `apps/web`.
2. Copy file `.env.example` dan ubah namanya jadi `.env`.
3. Biarin aja isinya (udah disetting otomatis ke `http://localhost:3001`).

---

## 🗄️ 5. Bikin Ruang Penyimpanan (Database)

Kita perlu bikinin "ruangan" kosong di PostgreSQL buat nyimpen data aplikasinya.

1. Buka aplikasi **pgAdmin** atau terminal psql bawaan PostgreSQL.
2. Bikin database baru, kasih nama: `boba_agent`.
3. Kalau udah, buka terminal di folder `apps/api` dan ketik:
   ```bash
   npx drizzle-kit push
   ```
   *Perintah ini ibarat nyuruh asisten buat ngerapiin struktur tabel di dalam ruangan database yang baru kita bikin.*

---

## 🏃‍♂️ 6. Gass! Nyalakan Aplikasinya

Sekarang semuanya udah siap! Balik ke folder paling depan (root) `boba-agent`, lalu ketik "mantra" ini:

```bash
npm run dev
```

Kalau udah jalan, kamu bisa buka aplikasinya di browser kesayanganmu:
- 🌐 **Tampilan Web (Frontend):** Buka `http://localhost:4321`
- ⚙️ **Mesin Belakang (API):** Berjalan di `http://localhost:3001`

---

## 💡 Troubleshooting (Kalau Ada Masalah)

**Q: Pas ketik `npm install` kok error merah-merah?**
A: Pastikan versi Node.js kamu udah versi 22 ke atas. Cek lagi pakai `node -v`.

**Q: Webnya blank atau muter-muter aja pas dibuka?**
A: Pastikan file `.env` di `apps/web` dan `apps/api` udah dibuat dengan benar dan backend-nya (API) nggak mati.

**Q: Database error / connection refused?**
A: Cek lagi password di `DATABASE_URL` di file `.env` API-mu, pastikan PostgreSQL udah jalan di komputermu, dan database `boba_agent` beneran udah dibuat.

---

> 🎉 **Selesai! Gampang kan? Selamat menikmati BOBA-AGENT milikmu sendiri!**