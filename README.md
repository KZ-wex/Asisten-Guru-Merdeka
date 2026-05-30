# 🎓 GuruAsisten.ai — Intelligent Co-Pilot for Indonesian Educators

[![Hackathon Project](https://img.shields.io/badge/Hackathon-Project-blueviolet)]()
[![Google Tech Integration](https://img.shields.io/badge/Google%20Tech-30%25-blue)](https://ai.google.dev/)
[![SDG Target](https://img.shields.io/badge/SDG%204-Quality%20Education-green)]()

> **Empowering Educators, Personalizing Learning Path.**
> Sebuah ekosistem AI Co-pilot berbasis Google Gemini API & Firebase yang dirancang khusus untuk mengatasi *burnout* administratif guru dan mempercepat pemerataan kualitas pendidikan di Indonesia demi mendukung **SDG 4: Quality Education**.

---

## 📌 Latar Belakang & Masalah Nyata (30% Impact & Relevance)

Dunia pendidikan di Indonesia saat ini masih menghadapi tiga tantangan besar yang saling berkesinambungan:
1. **Admin Burnout:** Guru menghabiskan terlalu banyak waktu (bisa lebih dari 4 jam seminggu) hanya untuk membuat modul ajar, Alur Tujuan Pembelajaran (ATP), dan bank soal secara manual, dibandingkan fokus mengajar atau memberikan perhatian personal ke siswa.
2. **Kesenjangan Kontekstual:** Akses materi belajar yang ada saat ini terlalu kaku dan sulit dipahami oleh siswa di daerah tertentu karena kurangnya pendekatan lokal atau analogi yang relevan.
3. **Kurangnya Personalisasi:** Minimnya alat bantu belajar interaktif yang mampu menyesuaikan diri dengan kecepatan dan gaya belajar unik setiap siswa (*one-size-fits-all*).

---

## 🚀 Solusi & Fitur Utama (20% Innovation & Creativity)

GuruAsisten.ai hadir dengan sistem **Dual-Dashboard** (Sisi Guru & Sisi Siswa) yang mengintegrasikan tiga pilar fitur inovatif:

* **🤖 AI Kurikulum Merdeka Generator (Solusi Masalah #1):** Memotong waktu pembuatan dokumen administrasi guru dari berjam-jam menjadi hitungan detik. Mengonstruksi Modul Ajar, RPP, LKPD, hingga Bank Soal (LOTS/HOTS) secara otomatis dan terstruktur sesuai standar Kemendikbudristek.
* **📍 PahamLokal Engine (Solusi Masalah #2):** Menggunakan kekuatan LLM untuk melokalisasi materi pelajaran yang rumit menjadi analogi budaya, geografis, atau bahasa daerah setempat agar siswa di berbagai pelosok Indonesia lebih mudah paham.
* **🎮 SobatBelajar Companion (Solusi Masalah #3):** Tutor interaktif berbasis AI untuk siswa dengan pendekatan *gamification* dan *Socratic dialogue* yang menyesuaikan materi secara *hyper-personalized* berdasarkan profil belajar anak.

---

## 🛠️ Google Tech Stack & Arsitektur (30% Google Tech Integration)

Proyek ini dibangun menggunakan ekosistem teknologi mutakhir dari Google untuk memastikan performa yang cepat, aman, dan mudah diskalakan:

| Teknologi | Peran dalam Sistem |
| :--- | :--- |
| **Google Gemini API (`gemini-1.5-flash`)** | Otak utama untuk *content generation*, analisis teks dokumen materi, dan *multimodal processing*. |
| **Flutter** | *Framework frontend* untuk membangun aplikasi *cross-platform* (Web & Mobile) yang ringan dan inklusif untuk perangkat berspesifikasi rendah. |
| **Cloud Firestore (Firebase)** | Database NoSQL *real-time* untuk sinkronisasi data modul, bank soal, dan portfolio siswa secara *offline-first*. |
| **Firebase Authentication** | Sistem autentikasi yang aman dan instan menggunakan Google Sign-In bagi para guru. |
| **Project IDX** | Cloud-native IDE dari Google yang digunakan tim untuk kolaborasi *coding* dan prototyping cepat selama hackathon. |

---

## 💻 Potongan Kode Kunci (Core Implementation)

Berikut adalah implementasi integrasi **Google AI Dart SDK** pada aplikasi kami untuk memanggil `gemini-1.5-flash` dengan konfigurasi *Structured Output (JSON)* untuk menghasilkan Modul Ajar:

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
