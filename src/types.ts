export interface TeacherProfile {
  nama: string;
  nip?: string;
  sekolah: string;
  jenjang: "SD" | "SMP" | "SMA" | "SMK";
}

export interface ModulAjarForm {
  mata_pelajaran: string;
  kelas: string;
  fase: string;
  topik_pembahasan: string;
  alokasi_waktu: string;
  catatan_tambahan?: string;
}

export interface BankSoalForm {
  mata_pelajaran: string;
  kelas: string;
  topik_materi: string;
  jumlah_soal: number;
  tipe_soal: "Pilihan Ganda" | "Esai";
  tingkat_kesulitan: "Campuran" | "Dominan HOTS" | "Dominan LOTS";
  catatan_tambahan?: string;
}

export interface PresetTemplate {
  title: string;
  description: string;
  type: "modul" | "soal";
  jenjang: "SD" | "SMP" | "SMA" | "SMK";
  data: any;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  // ==================== SD/MI ====================
  {
    title: "Modul: Fotosintesis IPAS Kelas 4 (Fase B)",
    description: "Modul tentang proses fotosintesis tumbuhan dan perannya bagi kelangsungan hidup di Bumi.",
    type: "modul",
    jenjang: "SD",
    data: {
      mata_pelajaran: "IPAS",
      kelas: "Kelas 4",
      fase: "Fase B",
      topik_pembahasan: "Proses Fotosintesis: Bagaimana Tumbuhan Menciptakan Energi?",
      alokasi_waktu: "2 JP (2 x 35 Menit)",
      catatan_tambahan: "Gunakan Model Pembelajaran Berbasis Masalah (PBL) berbasis lingkungan sekitar sekolah."
    }
  },
  {
    title: "Modul: Pecahan Senilai Matematika Kelas 5 (Fase C)",
    description: "Modul ajar interaktif pecahan senilai menggunakan alat peraga kertas lipat.",
    type: "modul",
    jenjang: "SD",
    data: {
      mata_pelajaran: "Matematika",
      kelas: "Kelas 5",
      fase: "Fase C",
      topik_pembahasan: "Konsep Pecahan Senilai dan Operasi Hitung Sederhana",
      alokasi_waktu: "2 JP (2 x 35 Menit)",
      catatan_tambahan: "Gunakan pendekatan pembelajaran terdiferensiasi (kinestetik menggunakan kertas warna-warni)."
    }
  },
  {
    title: "Soal: Harmoni Ekosistem IPAS Kelas 5 (Fase C)",
    description: "Soal evaluasi berpikir kritis tentang rantai makanan dan ketidakseimbangan ekosistem harian.",
    type: "soal",
    jenjang: "SD",
    data: {
      mata_pelajaran: "IPAS",
      kelas: "Kelas 5",
      topik_materi: "Harmoni dalam Ekosistem: Peran Produsen, Konsumen, dan Pengurai",
      jumlah_soal: 5,
      tipe_soal: "Pilihan Ganda",
      tingkat_kesulitan: "Campuran",
      catatan_tambahan: "Sajikan stimulus kontekstual tentang ledakan populasi belalang karena pemburu ular berkurang."
    }
  },
  {
    title: "Soal: Menulis Deskripsi Bahasa Indonesia Kelas 3 (Fase B)",
    description: "Soal esai deskriptif melatih keterampilan menyusun kalimat runtut berdasarkan stimulus gambar hewan.",
    type: "soal",
    jenjang: "SD",
    data: {
      mata_pelajaran: "Bahasa Indonesia",
      kelas: "Kelas 3",
      topik_materi: "Menulis Paragraf Deskriptif Berdasarkan Pengamatan Lingkungan",
      jumlah_soal: 3,
      tipe_soal: "Esai",
      tingkat_kesulitan: "Dominan LOTS",
      catatan_tambahan: "Berikan stimulus berupa ilustrasi kebun sekolah yang bersih dan asri."
    }
  },

  // ==================== SMP/MTs ====================
  {
    title: "Modul: Struktur & Sel IPA Kelas 8 (Fase D)",
    description: "Modul berbasis inquiry terbimbing untuk mengeksplorasi perbedaan sel hewan dan tumbuhan.",
    type: "modul",
    jenjang: "SMP",
    data: {
      mata_pelajaran: "IPA",
      kelas: "Kelas 8",
      fase: "Fase D",
      topik_pembahasan: "Struktur Sel dan Spesialisasi Sel sebagai Unit Terkecil Kehidupan",
      alokasi_waktu: "3 JP (3 x 40 Menit)",
      catatan_tambahan: "Fokuskan pada praktikum virtual menggunakan simulator mikroskop sederhana."
    }
  },
  {
    title: "Modul: Nilai-Nilai Pancasila SMP Kelas 7 (Fase D)",
    description: "Modul diskusi kontekstual penerapan Pancasila dalam pergaulan remaja masa kini.",
    type: "modul",
    jenjang: "SMP",
    data: {
      mata_pelajaran: "Pendidikan Pancasila",
      kelas: "Kelas 7",
      fase: "Fase D",
      topik_pembahasan: "Penerapan Nilai-Nilai Pancasila dalam Kehidupan Sehari-hari dan Gotong Royong",
      alokasi_waktu: "2 JP (2 x 40 Menit)",
      catatan_tambahan: "Rancang aktivitas analisis video kasus toleransi beragama di masyarakat multikultural."
    }
  },
  {
    title: "Soal: Sistem Organ & Pencernaan IPA Kelas 8",
    description: "Soal HOTS dengan stimulus grafik nilai kalori instan dan uji kandungan bahan makanan.",
    type: "soal",
    jenjang: "SMP",
    data: {
      mata_pelajaran: "IPA",
      kelas: "Kelas 8",
      topik_materi: "Sistem Pencernaan Manusia: Kebutuhan Energi dan Kandungan Nutrisi",
      jumlah_soal: 5,
      tipe_soal: "Pilihan Ganda",
      tingkat_kesulitan: "Dominan HOTS",
      catatan_tambahan: "Berikan stimulus tabel uji biuret dan lugol pada makanan misterius."
    }
  },
  {
    title: "Soal: Persamaan Linear Matematika Kelas 7 (Fase D)",
    description: "Soal esai penalaran logis memecahkan masalah pembelian barang dalam aktivitas ekonomi.",
    type: "soal",
    jenjang: "SMP",
    data: {
      mata_pelajaran: "Matematika",
      kelas: "Kelas 7",
      topik_materi: "Persamaan Linear Satu Variabel (PLSV) dalam Kasus Belanja Pasar",
      jumlah_soal: 3,
      tipe_soal: "Esai",
      tingkat_kesulitan: "Campuran",
      catatan_tambahan: "Setiap soal esai wajib disertai rubrik penyelesaian langkah-langkah aljabar secara runtut."
    }
  },

  // ==================== SMA/MA ====================
  {
    title: "Modul: Kimia Hijau Kelas 10 (Fase E)",
    description: "Modul ajar tentang 12 prinsip Green Chemistry untuk melestarikan lingkungan.",
    type: "modul",
    jenjang: "SMA",
    data: {
      mata_pelajaran: "Kimia",
      kelas: "Kelas 10",
      fase: "Fase E",
      topik_pembahasan: "Prinsip Kimia Hijau dalam Mendukung Kelestarian Bumi",
      alokasi_waktu: "2 JP (2 x 45 Menit)",
      catatan_tambahan: "Gunakan model Project Based Learning (PjBL) membuat infografis produk plastik biodegradable."
    }
  },
  {
    title: "Modul: Keanekaragaman Hayati Kelas 10 (Fase E)",
    description: "Modul diferensiasi mengeksplorasi ancaman kepunahan fauna endemik Indonesia.",
    type: "modul",
    jenjang: "SMA",
    data: {
      mata_pelajaran: "Biologi",
      kelas: "Kelas 10",
      fase: "Fase E",
      topik_pembahasan: "Keanekaragaman Hayati Indonesia: Ancaman dan Pelestarian Flora/Fauna Endemik",
      alokasi_waktu: "2 JP (2 x 45 Menit)",
      catatan_tambahan: "Aspek diferensiasi produk: siswa bebas mengumpulkan tugas berupa mindmap, podcast, atau vlog."
    }
  },
  {
    title: "Soal: Transpor Membran Biologi Kelas 11 (Fase F)",
    description: "Soal HOTS berbasis stimulus eksperimen osmosis sel kentang pada larutan garam pekat.",
    type: "soal",
    jenjang: "SMA",
    data: {
      mata_pelajaran: "Biologi",
      kelas: "Kelas 11",
      topik_materi: "Transpor Membran Pasif (Difusi dan Osmosis)",
      jumlah_soal: 5,
      tipe_soal: "Pilihan Ganda",
      tingkat_kesulitan: "Dominan HOTS",
      catatan_tambahan: "Gunakan stimulus berupa grafik penurunan atau peningkatan massa kentang seiring waktu."
    }
  },
  {
    title: "Soal: Efek Rumah Kaca Fisika Kelas 10 (Fase E)",
    description: "Soal esai analitis dampak polusi gas CO2 dan mitigasi perubahan iklim.",
    type: "soal",
    jenjang: "SMA",
    data: {
      mata_pelajaran: "Fisika",
      kelas: "Kelas 10",
      topik_materi: "Efek Rumah Kaca, Pemanasan Global, dan Solusi Energi Terbarukan",
      jumlah_soal: 3,
      tipe_soal: "Esai",
      tingkat_kesulitan: "Campuran",
      catatan_tambahan: "Berikan stimulus berupa data emisi karbon dunia 5 tahun terakhir."
    }
  },

  // ==================== SMK ====================
  {
    title: "Modul: Pemrograman Web Kelas 10 (Kejuruan SMK)",
    description: "Modul praktek laboratorium merancang struktur halaman web dinamis dengan HTML5 dan CSS3.",
    type: "modul",
    jenjang: "SMK",
    data: {
      mata_pelajaran: "Informatika",
      kelas: "Kelas 10",
      fase: "Fase E",
      topik_pembahasan: "Pengenalan Tag Dasar HTML5, CSS Fleksibel, dan Responsive Web Design",
      alokasi_waktu: "4 JP (4 x 45 Menit)",
      catatan_tambahan: "Pendekatan Praktik Industri langsung. Pendidik menyajikan studi kasus landing page e-commerce lokal."
    }
  },
  {
    title: "Modul: Kreatif dan Kewirausahaan Kelas 11 (SMK)",
    description: "Modul interaktif merancang model bisnis inovatif (Business Model Canvas) untuk produk kreatif.",
    type: "modul",
    jenjang: "SMK",
    data: {
      mata_pelajaran: "Produk Kreatif & Kewirausahaan",
      kelas: "Kelas 11",
      fase: "Fase F",
      topik_pembahasan: "Penyusunan Lean Canvas dan Analisis Kelayakan Usaha Kreatif",
      alokasi_waktu: "4 JP (4 x 45 Menit)",
      catatan_tambahan: "Tunjang keterampilan vokasi dengan brainstorming kelompok merancang MVP (Minimum Viable Product)."
    }
  },
  {
    title: "Soal: Peluang Usaha & SWOT Kewirausahaan Kelas 11",
    description: "Soal evaluasi HOTS mengenai analisis kekuatan, kelemahan, peluang, dan ancaman produk kejuruan.",
    type: "soal",
    jenjang: "SMK",
    data: {
      mata_pelajaran: "Produk Kreatif & Kewirausahaan",
      kelas: "Kelas 11",
      topik_materi: "Analisis Peluang Usaha Kreatif Menggunakan Pendekatan SWOT",
      jumlah_soal: 5,
      tipe_soal: "Pilihan Ganda",
      tingkat_kesulitan: "Dominan HOTS",
      catatan_tambahan: "Sajikan stimulus berupa profil kedai kopi lokal yang menghadapi persaingan dengan gerai waralaba modern."
    }
  },
  {
    title: "Soal: Diagnosis EFI Kejuruan Otomotif Kelas 12",
    description: "Soal esai analitis memecahkan masalah kegagalan kelistrikan pada injeksi bahan bakar elektronik.",
    type: "soal",
    jenjang: "SMK",
    data: {
      mata_pelajaran: "Kejuruan Otomotif",
      kelas: "Kelas 12",
      topik_materi: "Mendiagnosis Kerusakan (Troubleshooting) Sistem Electronic Fuel Injection (EFI)",
      jumlah_soal: 3,
      tipe_soal: "Esai",
      tingkat_kesulitan: "Campuran",
      catatan_tambahan: "Wajib sertakan langkah diagnosis skematis aman (K3) industri bengkel resmi."
    }
  }
];
