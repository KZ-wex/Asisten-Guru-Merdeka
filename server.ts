import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK safely (lazy-loaded or checked gracefully)
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY belum dikonfigurasi di Pengaturan > Secrets.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 1. Endpoint untuk membuat Modul Ajar (Kurikulum Merdeka)
app.post("/api/generate-modul", async (req, res) => {
  try {
    const { mata_pelajaran, kelas, fase, topik_pembahasan, alokasi_waktu, catatan_tambahan } = req.body;

    if (!mata_pelajaran || !kelas || !fase || !topik_pembahasan || !alokasi_waktu) {
      return res.status(400).json({ error: "Mohon isi semua field wajib untuk membuat Modul Ajar." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Anda adalah seorang Pakar Kurikulum Merdeka dan Konsultan Pedagogi Senior di Kemendikbudristek Indonesia. Tugas Anda adalah membantu guru menyusun Modul Ajar yang komprehensif, kreatif, dan siap pakai dalam hitungan detik. Anda harus selalu mematuhi struktur resmi Kurikulum Merdeka.
Guru di Indonesia mengalami kelelahan administratif. Modul Ajar yang Anda buat harus praktis, berpusat pada murid (student-centered), dan memiliki instruksi yang sangat jelas agar guru bisa langsung mempraktikkannya di kelas.

Hasilkan Modul Ajar dengan struktur persis seperti di bawah ini menggunakan Markdown yang rapi:

### A. INFORMASI UMUM
1. **Identitas Modul:** (Mata Pelajaran, Kelas, Fase, Topik, Alokasi Waktu)
2. **Kompetensi Awal:** (Kemampuan/pengetahuan prasyarat yang harus dimiliki siswa sebelum mempelajari materi ini secara realistis)
3. **Profil Pelajar Pancasila:** (Pilih 2-3 elemen yang paling relevan dengan topik ini, jelaskan detail penerapannya/kegiatannya di dalam kelas dengan konkret)
4. **Sarana & Prasarana:** (Berikan 2 opsi yang detail: Opsi untuk sekolah dengan fasilitas digital lengkap DAN opsi alternatif kreatif untuk sekolah dengan fasilitas minim/keterbatasan alat)

### B. KOMPONEN INTI
1. **Tujuan Pembelajaran (TP):** (Gunakan kata kerja operasional yang dapat diamati dan diukur berdasarkan taksonomi Bloom hasil revisi)
2. **Pemahaman Bermakna:** (Manfaat konseptual nyata materi ini dalam kehidupan sehari-hari siswa)
3. **Pertanyaan Pemantik:** (Berikan minimal 3 Pertanyaan diskusi pemantik kritis yang memicu rasa ingin tahu siswa di awal kelas)
4. **Kegiatan Pembelajaran:**
   - *Model Pembelajaran yang Digunakan:* (Tentukan satu model pembelajaran yang aktif seperti Problem Based Learning (PBL), Project Based Learning (PjBL), Discovery/Inquiry Learning, atau cooperative learning yang cocok dengan topik)
   - *Pendahuluan (10-15% Waktu):* (Sebutkan durasi dalam menit. Langkah konkret apersepsi, kuis menyenangkan, memberikan motivasi kontekstual, dan penyampaian tujuan pembelajaran)
   - *Kegiatan Inti (70-80% Waktu):* (Sebutkan durasi dalam menit. Cantumkan langkah-langkah praktis langkah demi langkah (Sintaks) berdasarkan model pembelajaran yang dipilih secara aktif, interaktif, kolaboratif, dan menyenangkan)
   - *Penutup (10-15% Waktu):* (Sebutkan durasi dalam menit. Aktivitas refleksi terstruktur untuk siswa & guru, pengambilan kesimpulan bersama, serta tindak lanjut)

### C. LAMPIRAN
1. **Lembar Kerja Peserta Didik (LKPD):** (Buat 1 tugas kelompok atau individu yang interaktif, menantang, kontekstual, dan memiliki instruksi pengerjaan yang lengkap dan jelas)
2. **Bahan Bacaan Guru & Peserta Didik:** (Ringkasan materi esensial singkat 2-3 paragraf bergaya bahasa edukatif, jelas, dan mudah dipahami sebagai panduan cepat)`;

    const promptMessage = `Buatlah Modul Ajar lengkap berdasar variabel berikut:
Mata Pelajaran: ${mata_pelajaran}
Kelas: ${kelas}
Fase: ${fase}
Topik Pembahasan: ${topik_pembahasan}
Alokasi Waktu: ${alokasi_waktu}
${catatan_tambahan ? `Fokus atau Catatan Tambahan dari Guru: ${catatan_tambahan}` : ""}

Pastikan Modul Ajar dibuat sangat praktis, inspiratif, inovatif, dan ramah guru tanpa mengurangi kelengkapan isinya sesuai instruksi sistem. Gunakan bahasa Indonesia yang baik, benar, ramah, dan memotivasi.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error generating Modul Ajar:", error);
    res.status(500).json({ error: error.message || "Gagal menghasilkan Modul Ajar karena terjadi kesalahan." });
  }
});

// 2. Endpoint untuk membuat Bank Soal Evaluasi
app.post("/api/generate-soal", async (req, res) => {
  try {
    const { mata_pelajaran, kelas, topik_materi, jumlah_soal, tipe_soal, tingkat_kesulitan, catatan_tambahan } = req.body;

    if (!mata_pelajaran || !kelas || !topik_materi || !jumlah_soal || !tipe_soal || !tingkat_kesulitan) {
      return res.status(400).json({ error: "Mohon isi semua field wajib untuk membuat Bank Soal." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Anda adalah Spesialis Evaluasi Pembelajaran dan Pembuat Soal Ujian Nasional terkemuka di Indonesia. Tugas Anda adalah membuat bank soal yang valid, adil, bermutu, dan berkualitas tinggi berdasarkan materi atau topik yang diberikan oleh guru.
Bila tipe soal adalah "Pilihan Ganda", selalu berikan opsi A, B, C, D, E.
Bila tipe soal adalah "Esai", buatlah soal esai uraian terstruktur dengan kunci jawaban yang jelas dan indikator penilaian yang konkret.

Sangat penting khususnya untuk Soal HOTS (Higher Order Thinking Skills): Berikan stimulus kontekstual yang kaya berupa cerita pendek, studi kasus nyata, tabel data, grafik ilmiah, kutipan berita, atau diagram terlebih dahulu sebelum pertanyaan diajukan. Siswa harus menganalisis stimulus tersebut untuk menjawab, bukan sekadar menghafal.

Patuhi format hasil di bawah ini dengan Markdown yang rapi:

---
### DAFTAR SOAL
[Tuliskan stimulus jika ada, kemudian pertanyaan. Jika pilihan ganda, sediakan opsi A, B, C, D, E dengan rapi]

---
### KUNCI JAWABAN & RUBRIK PENILAIAN
1. **Soal 1:** Kunci Jawaban: [Jawaban Benar]
   - **Pembahasan/Rubrik:** (Jelaskan secara ilmiah mengapa jawaban tersebut benar dan mengapa opsi lainnya salah, agar guru bisa menggunakannya untuk analisis remedial, pengayaan, atau evaluasi diagnostik).
2. **Soal 2:** ... dan seterusnya [sesuai jumlah soal yang diminta]`;

    const promptMessage = `Buatlah Bank Soal berdasarkan kriteria berikut:
Mata Pelajaran: ${mata_pelajaran}
Kelas: ${kelas}
Topik Materi: ${topik_materi}
Jumlah Soal: ${jumlah_soal}
Tipe Soal: ${tipe_soal}
Tingkat Kesulitan: ${tingkat_kesulitan}
${catatan_tambahan ? `Instruksi tambahan dari guru: ${catatan_tambahan}` : ""}

Pastikan semua soal sesuai untuk tingkat kelas dan topik materi yang ditentukan. Hasilkan output secara penuh sesuai petunjuk model.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error generating Bank Soal:", error);
    res.status(500).json({ error: error.message || "Gagal menghasilkan Bank Soal karena terjadi kesalahan." });
  }
});

// Setup Vite middleware or Static files based on environment
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Asisten Guru Merdeka aktif di port ${PORT}`);
  });
}

setupApp().catch((err) => {
  console.error("Gagal memulai server:", err);
});
