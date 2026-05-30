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
  data: any;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    title: "Modul: Fotosintesis IPA Kelas 4 (Fase B)",
    description: "Modul interaktif tentang proses fotosintesis tumbuhan dan perannya bagi kehidupan.",
    type: "modul",
    data: {
      mata_pelajaran: "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
      kelas: "Kelas 4",
      fase: "Fase B",
      topik_pembahasan: "Proses Fotosintesis: Bagaimana Tumbuhan Menghasilkan Makanan?",
      alokasi_waktu: "2 JP (2 x 35 Menit)",
      catatan_tambahan: "Gunakan model Problem Based Learning. Fokuskan pada eksperimen sederhana membuktikan tumbuhan butuh cahaya matahari."
    }
  },
  {
    title: "Modul: Aljabar Matematika SMP Kelas 7 (Fase D)",
    description: "Modul konstruktivis pengenalan variabel, konstanta, dan penyelesaian persamaan linier satu variabel.",
    type: "modul",
    data: {
      mata_pelajaran: "Matematika",
      kelas: "Kelas 7",
      fase: "Fase D",
      topik_pembahasan: "Konsep Dasar Aljabar dan Persamaan Linier Satu Variabel",
      alokasi_waktu: "3 JP (3 x 40 Menit)",
      catatan_tambahan: "Gunakan pendekatan visual (timbangan atau blok aljabar) agar konsep persamaan linier lebih konkret."
    }
  },
  {
    title: "Modul: Pancasila Pendidikan Pancasila SMA Kelas 10 (Fase E)",
    description: "Modul diskusi kritis implementasi nilai-nilai Pancasila dalam kehidupan era digital.",
    type: "modul",
    data: {
      mata_pelajaran: "Pendidikan Pancasila",
      kelas: "Kelas 10",
      fase: "Fase E",
      topik_pembahasan: "Penerapan Nilai-Nilai Pancasila dalam Kehidupan Sehari-hari dan Era Digital",
      alokasi_waktu: "2 JP (2 x 45 Menit)",
      catatan_tambahan: "Gunakan model diskusi kelompok terarah (FGD) menganalisis studi kasus hoaks di media sosial."
    }
  },
  {
    title: "Soal: Sistem Pencernaan HOTS SMP Kelas 8",
    description: "Bank soal IPA berorientasi HOTS dengan stimulus grafik kalori dan diagram enzim.",
    type: "soal",
    data: {
      mata_pelajaran: "Ilmu Pengetahuan Alam (IPA)",
      kelas: "Kelas 8",
      topik_materi: "Sistem Pencernaan Manusia: Organ, Enzim Pencernaan, dan Nutrisi Makanan",
      jumlah_soal: 5,
      tipe_soal: "Pilihan Ganda",
      tingkat_kesulitan: "Dominan HOTS",
      catatan_tambahan: "Sajikan stimulus berupa tabel informasi nilai gizi produk mie instan dan grafik aktivitas amilase pada berbagai tingkat pH."
    }
  },
  {
    title: "Soal: Persamaan Kuadrat Matematika SMA Kelas 11",
    description: "Soal campuran pilihan ganda dan esai tentang penerapan fungsi kuadrat di kehidupan nyata.",
    type: "soal",
    data: {
      mata_pelajaran: "Matematika",
      kelas: "Kelas 11",
      topik_materi: "Persamaan Kuadrat, Fungsi Kuadrat, dan Aplikasinya dalam Lintasan Fisika (Parabola)",
      jumlah_soal: 5,
      tipe_soal: "Pilihan Ganda",
      tingkat_kesulitan: "Campuran",
      catatan_tambahan: "Masukkan 2 soal tipe esai dengan stimulus lintasan bola basket yang membentuk parabola."
    }
  }
];
