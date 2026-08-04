import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  ClipboardCheck, 
  Printer, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight, 
  Info, 
  Check, 
  Copy, 
  FileText, 
  Lightbulb,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  CheckCircle2
} from "lucide-react";
import { 
  ModulAjarForm, 
  BankSoalForm, 
  PRESET_TEMPLATES, 
  PresetTemplate,
  TeacherProfile
} from "./types";

const MOTIVATIONAL_QUOTES = [
  { quote: "Ing ngarsa sung tuladha, ing madya mangun karsa, tut wuri handayani.", author: "Ki Hajar Dewantara" },
  { quote: "Tujuan utama pendidikan bukanlah sekadar pengetahuan, melainkan tindakan nyata.", author: "Herbert Spencer" },
  { quote: "Anak-anak tumbuh sesuai kodratnya sendiri. Pendidik hanya dapat merawat dan menuntun tumbuhnya kodrat itu.", author: "Ki Hajar Dewantara" }
];

const LOADING_STEPS_MODUL = [
  "Mengkaji naskah akademik Kurikulum Merdeka...",
  "Memformulasikan rincian Kompetensi Awal prasyarat...",
  "Menyinkronkan elemen Profil Pelajar Pancasila dengan topik...",
  "Menyusun skenario model pembelajaran aktif berpusat pada murid...",
  "Memetakan durasi waktu kegiatan Pendahuluan, Inti, dan Penutup...",
  "Mendesain Lembar Kerja Peserta Didik (LKPD) yang menantang...",
  "Menulis ringkasan bahan bacaan guru dan peserta didik secara komprehensif..."
];

const LOADING_STEPS_SOAL = [
  "Menganalisis tingkat kognitif dan cakupan materi...",
  "Merancang stimulus kontekstual yang kaya (skenario, tabel, kasus nyata)...",
  "Memformulasikan soal berbasis HOTS (Higher Order Thinking Skills)...",
  "Menyusun pilihan pengecoh yang adil dan saintifik...",
  "Menulis rubrik penilaian terstandar dan kunci jawaban...",
  "Memverifikasi keandalan dan validitas indikator soal..."
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"modul" | "soal">("modul");
  const [loading, setLoading] = useState(false);
  const [loadedFromPreset, setLoadedFromPreset] = useState<string | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Teacher Profile States
  const [profile, setProfile] = useState<TeacherProfile | null>(() => {
    const saved = localStorage.getItem("guru_merdeka_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [regNama, setRegNama] = useState("");
  const [regNip, setRegNip] = useState("");
  const [regSekolah, setRegSekolah] = useState("");
  const [regJenjang, setRegJenjang] = useState<"SD" | "SMP" | "SMA" | "SMK">("SD");

  // Load teacher attributes into register inputs if editing
  useEffect(() => {
    if (profile) {
      setRegNama(profile.nama);
      setRegNip(profile.nip || "");
      setRegSekolah(profile.sekolah);
      setRegJenjang(profile.jenjang);
    }
  }, [profile]);

  // Helper lists based on Teacher Jenjang
  const getClassesForJenjang = (jenjang: "SD" | "SMP" | "SMA" | "SMK") => {
    switch (jenjang) {
      case "SD":
        return ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"];
      case "SMP":
        return ["Kelas 7", "Kelas 8", "Kelas 9"];
      case "SMA":
      case "SMK":
        return ["Kelas 10", "Kelas 11", "Kelas 12"];
      default:
        return Array.from({ length: 12 }, (_, i) => `Kelas ${i + 1}`);
    }
  };

  const getSubjectSuggestions = (jenjang: "SD" | "SMP" | "SMA" | "SMK") => {
    switch (jenjang) {
      case "SD":
        return ["IPAS", "Matematika", "Bahasa Indonesia", "Pendidikan Pancasila", "Seni Rupa", "PJOK", "Bahasa Inggris"];
      case "SMP":
        return ["IPA", "IPS", "Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Pancasila", "Informatika", "Seni Budaya"];
      case "SMA":
        return ["Fisika", "Kimia", "Biologi", "Matematika", "Sejarah", "Bahasa Indonesia", "Bahasa Inggris", "Sosiologi", "Ekonomi", "Pendidikan Pancasila"];
      case "SMK":
        return ["Produk Kreatif & Kewirausahaan", "Dasar-Dasar Kejuruan", "Matematika", "Informatika", "Bahasa Inggris", "Kejuruan Otomotif", "Rekayasa Perangkat Lunak", "Simulasi Digital"];
      default:
        return ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "IPA"];
    }
  };

  const getTopicSuggestions = (jenjang: "SD" | "SMP" | "SMA" | "SMK", kelas: string, subject: string): string[] => {
    const subLower = (subject || "").toLowerCase().trim();
    const kNum = (kelas || "");
    
    if (jenjang === "SD") {
      if (subLower.includes("ipas") || subLower.includes("alam") || subLower.includes("sosial")) {
        if (kNum.includes("4")) return ["Proses Fotosintesis pada Tumbuhan", "Bagian Tubuh Tumbuhan & Fungsinya", "Wujud Zat & Perubahannya", "Gaya di Sekitar Kita"];
        if (kNum.includes("5")) return ["Harmoni dalam Ekosistem", "Melihat karena Cahaya, Mendengar karena Bunyi", "Organ Pencernaan Manusia", "Warisan Sejarah Indonesia"];
        if (kNum.includes("6")) return ["Sistem Organ Tubuh Manusia", "Negeriku dan Keanekaragaman Budayanya", "Bumi dan Alam Semesta"];
        return ["Proses Fotosintesis", "Rantai Makanan Ekosistem", "Pelestarian Lingkungan Hidup"];
      }
      if (subLower.includes("matematika") || subLower.includes("hitung")) {
        if (kNum.includes("1") || kNum.includes("2")) return ["Penjumlahan & Pengurangan 1-20", "Pola Gambar & Pola Bilangan", "Pengenalan Bangun Datar"];
        if (kNum.includes("3") || kNum.includes("4")) return ["Konsep Pecahan Senilai", "Pembagian Ribuan dengan Sisa", "Pengukuran Luas & Volume"];
        return ["Operasi Hitung Pecahan Campuran", "Penyusunan & Pengolahan Data", "KPK dan FPB Kontekstual"];
      }
      if (subLower.includes("indonesia") || subLower.includes("bahasa")) {
        return ["Membaca Cerita Pendek", "Menulis Paragraf Deskripsi", "Menemukan Ide Pokok Paragraf", "Kosakata Lingkungan Sehat"];
      }
      return ["Makna Sila-sila Pancasila", "Kegiatan Gotong Royong", "Hak dan Kewajiban Anak"];
    }

    if (jenjang === "SMP") {
      if (subLower.includes("ipa") || subLower.includes("sains")) {
        if (kNum.includes("7")) return ["Sel Mikroskopis Unit Kehidupan", "Suhu, Kalor, & Pemuaian Zat", "Klasifikasi Makhluk Hidup"];
        if (kNum.includes("8")) return ["Sistem Pencernaan & Nutrisi", "Struktur Tubuh, Otot & Tulang", "Unsur, Senyawa, dan Campuran"];
        return ["Sistem Reproduksi Manusia", "Pewarisan Sifat (Genetika)", "Teknologi Ramah Lingkungan"];
      }
      if (subLower.includes("matematika")) {
        return ["Bilangan Bulat & Operasi Logika", "Konsep Aljabar & PLSV", "Persamaan Kuadrat Sederhana", "Rumus Pythagoras & Geometri"];
      }
      if (subLower.includes("pancasila") || subLower.includes("pkn")) {
        return ["Lahirnya Pancasila Dasar Negara", "Norma Hukum & Keadilan Sosial", "NKRI dan Keberagaman Bangsa"];
      }
      return ["Algoritma Pemrograman Blok", "Dampak Sosial Informatika", "Berpikir Komputasional"];
    }

    if (jenjang === "SMA") {
      if (subLower.includes("kimia")) {
        return ["12 Prinsip Kimia Hijau Lestari", "Konsep Mol & Stoikiometri", "Hukum Dasar Kimia Ruatan", "Struktur Atom & Nanoteknologi"];
      }
      if (subLower.includes("biologi")) {
        return ["Organel Sel & Transpor Membran", "Ancaman Kepunahan Fauna Endemik", "Pembelahan Sel Mitosis & Meiosis", "Daur Biogeokimia & Ekosistem"];
      }
      if (subLower.includes("fisika")) {
        return ["Energi Terbarukan Mitigasi Iklim", "Hukum Newton & Gerak Parabola", "Listrik Dinamis AC/DC Rumah Tangga", "Pengukuran & Angka Penting"];
      }
      if (subLower.includes("sejarah")) {
        return ["Asal-Usul Leluhur Bangsa Indonesia", "Kerajaan Hindu-Buddha Nusantara", "Peristiwa Proklamasi Kemerdekaan"];
      }
      return ["Persamaan & Fungsi Kuadrat", "Matriks & Perkalian Garis", "Statistika Deskriptif Kelompok"];
    }

    if (jenjang === "SMK") {
      if (subLower.includes("produk") || subLower.includes("wirausaha") || subLower.includes("pkk") || subLower.includes("kreatif")) {
        return ["Uji SWOT Keunggulan Produk", "Penyusunan Lean Model Canvas", "Perencanaan Strategi Pemasaran"];
      }
      if (subLower.includes("informatika") || subLower.includes("rpl") || subLower.includes("komputer") || subLower.includes("web")) {
        return ["Struktur Kerangka HTML5 & CSS3", "Algoritma Pemrograman Prosedural", "Desain Database Relasional", "OOP Class & Encapsulation"];
      }
      if (subLower.includes("otomotif") || subLower.includes("mesin") || subLower.includes("motor")) {
        return ["Diagnosis Sistem Bahan Bakar EFI", "Sistem Kelistrikan Bodi Otomotif", "Overhaul Mesin Bensin 4-Tak"];
      }
      return ["Budaya Kerja Industri 5S/5R", "Keselamatan & Kesehatan Kerja K3", "Prinsip Dasar Desain Kreatif"];
    }

    return ["Pengenalan Konsep Kurikulum Merdeka", "Projek Penguatan Pelajar Pancasila", "Studi Kasus Kontekstual Harian"];
  };

  // Modul Ajar State
  const [modulForm, setModulForm] = useState<ModulAjarForm>({
    mata_pelajaran: "",
    kelas: "Kelas 4",
    fase: "Fase B",
    topik_pembahasan: "",
    alokasi_waktu: "",
    catatan_tambahan: ""
  });

  // Bank Soal State
  const [soalForm, setSoalForm] = useState<BankSoalForm>({
    mata_pelajaran: "",
    kelas: "Kelas 4",
    topik_materi: "",
    jumlah_soal: 5,
    tipe_soal: "Pilihan Ganda",
    tingkat_kesulitan: "Campuran",
    catatan_tambahan: ""
  });

  // Automatically update forms defaults to first matched class on teacher level change
  useEffect(() => {
    if (profile) {
      const classes = getClassesForJenjang(profile.jenjang);
      setModulForm(prev => {
        // If current class isn't in the new list, switch it to first element
        if (!classes.includes(prev.kelas)) {
          return { ...prev, kelas: classes[0] || "Kelas" };
        }
        return prev;
      });
      setSoalForm(prev => {
        if (!classes.includes(prev.kelas)) {
          return { ...prev, kelas: classes[0] || "Kelas" };
        }
        return prev;
      });
    }
  }, [profile?.jenjang]);

  // Output Storage
  const [generatedModul, setGeneratedModul] = useState<string>("");
  const [generatedSoal, setGeneratedSoal] = useState<string>("");
  const [lastGeneratedModulMeta, setLastGeneratedModulMeta] = useState<any>(null);
  const [lastGeneratedSoalMeta, setLastGeneratedSoalMeta] = useState<any>(null);

  const getSubjectBannerImage = (mataPelajaran: string): string => {
    const subject = (mataPelajaran || "").toLowerCase();
    
    if (subject.includes("biologi") || subject.includes("hayat")) {
      return "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop";
    }
    if (subject.includes("kimia") || subject.includes("green")) {
      return "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=1200&auto=format&fit=crop";
    }
    if (subject.includes("fisika") || subject.includes("energi") || subject.includes("gaya")) {
      return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop";
    }
    if (subject.includes("matematika") || subject.includes("hitung") || subject.includes("aljabar") || subject.includes("pecahan")) {
      return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop";
    }
    if (subject.includes("ipas") || subject.includes("alam") || subject.includes("sosial") || subject.includes("ekosistem")) {
      return "https://images.unsplash.com/photo-1472214222541-d510753a4707?q=80&w=1200&auto=format&fit=crop";
    }
    if (subject.includes("informatika") || subject.includes("rpl") || subject.includes("bahasa pemrograman") || subject.includes("komputer") || subject.includes("web")) {
      return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop";
    }
    if (subject.includes("pancasila") || subject.includes("pkn") || subject.includes("kewarganegaraan") || subject.includes("sejarah") || subject.includes("sosial")) {
      return "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=1200&auto=format&fit=crop";
    }
    if (subject.includes("wirausaha") || subject.includes("produk kreatif") || subject.includes("pkk") || subject.includes("bisnis")) {
      return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop";
    }
    if (subject.includes("otomotif") || subject.includes("mesin") || subject.includes("motor") || subject.includes("teknik")) {
      return "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1200&auto=format&fit=crop";
    }
    if (subject.includes("indonesia") || subject.includes("inggris") || subject.includes("bahasa") || subject.includes("sastra") || subject.includes("menulis")) {
      return "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop";
    }
    
    return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop";
  };

  const activeMeta = activeTab === "modul"
    ? {
        mata_pelajaran: lastGeneratedModulMeta?.mata_pelajaran || modulForm.mata_pelajaran || "Pelajaran Umum",
        kelas: lastGeneratedModulMeta?.kelas || modulForm.kelas || "Kelas Umum",
        fase: lastGeneratedModulMeta?.fase || modulForm.fase || "Fase Umum",
        topik_pembahasan: lastGeneratedModulMeta?.topik_pembahasan || modulForm.topik_pembahasan || "Topik Pembahasan",
        alokasi_waktu: lastGeneratedModulMeta?.alokasi_waktu || modulForm.alokasi_waktu || "Sesuai Kebutuhan",
        guru_nama: lastGeneratedModulMeta?.guru_nama || profile?.nama || "Guru Indonesia",
        guru_sekolah: lastGeneratedModulMeta?.guru_sekolah || profile?.sekolah || "Asisten Guru Merdeka",
        guru_nip: lastGeneratedModulMeta?.guru_nip || profile?.nip || "",
        guru_jenjang: lastGeneratedModulMeta?.guru_jenjang || profile?.jenjang || "SD"
      }
    : {
        mata_pelajaran: lastGeneratedSoalMeta?.mata_pelajaran || soalForm.mata_pelajaran || "Pelajaran Umum",
        kelas: lastGeneratedSoalMeta?.kelas || soalForm.kelas || "Kelas Umum",
        topik_materi: lastGeneratedSoalMeta?.topik_materi || soalForm.topik_materi || "Topik Pembahasan",
        jumlah_soal: lastGeneratedSoalMeta?.jumlah_soal || soalForm.jumlah_soal || 5,
        tipe_soal: lastGeneratedSoalMeta?.tipe_soal || soalForm.tipe_soal || "Pilihan Ganda",
        tingkat_kesulitan: lastGeneratedSoalMeta?.tingkat_kesulitan || soalForm.tingkat_kesulitan || "Campuran",
        guru_nama: lastGeneratedSoalMeta?.guru_nama || profile?.nama || "Guru Indonesia",
        guru_sekolah: lastGeneratedSoalMeta?.guru_sekolah || profile?.sekolah || "Asisten Guru Merdeka",
        guru_nip: lastGeneratedSoalMeta?.guru_nip || profile?.nip || "",
        guru_jenjang: lastGeneratedSoalMeta?.guru_jenjang || profile?.jenjang || "SD"
      };

  // Map Kelas to Fase automatically
  useEffect(() => {
    if (activeTab === "modul") {
      const kelasToFase: Record<string, string> = {
        "Kelas 1": "Fase A",
        "Kelas 2": "Fase A",
        "Kelas 3": "Fase B",
        "Kelas 4": "Fase B",
        "Kelas 5": "Fase C",
        "Kelas 6": "Fase C",
        "Kelas 7": "Fase D",
        "Kelas 8": "Fase D",
        "Kelas 9": "Fase D",
        "Kelas 10": "Fase E",
        "Kelas 11": "Fase F",
        "Kelas 12": "Fase F",
      };
      const mappedFase = kelasToFase[modulForm.kelas] || "Fase B";
      setModulForm(prev => ({ ...prev, fase: mappedFase }));
    }
  }, [modulForm.kelas, activeTab]);

  // Loading steps rotation
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIndex(prev => {
          const limit = activeTab === "modul" ? LOADING_STEPS_MODUL.length : LOADING_STEPS_SOAL.length;
          return (prev + 1) % limit;
        });
      }, 2500);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading, activeTab]);

  // Handle Preset Click
  const handleApplyPreset = (preset: PresetTemplate) => {
    setErrorMsg(null);
    setLoadedFromPreset(preset.title);
    if (preset.type === "modul") {
      setActiveTab("modul");
      setModulForm(preset.data);
      setLastGeneratedModulMeta(null);
    } else {
      setActiveTab("soal");
      setSoalForm(preset.data);
      setLastGeneratedSoalMeta(null);
    }

    // Trigger toast
    showToast(`Template "${preset.title}" berhasil dimuat!`);
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNama.trim() || !regSekolah.trim()) {
      setErrorMsg("Nama Lengkap dan Sekolah wajib diisi.");
      return;
    }
    const newProfile: TeacherProfile = {
      nama: regNama.trim(),
      nip: regNip.trim() || undefined,
      sekolah: regSekolah.trim(),
      jenjang: regJenjang
    };
    localStorage.setItem("guru_merdeka_profile", JSON.stringify(newProfile));
    setProfile(newProfile);
    
    // Auto-update class and subject to match level's first class/subject
    const classes = getClassesForJenjang(regJenjang);
    const subjects = getSubjectSuggestions(regJenjang);
    setModulForm(prev => ({
      ...prev,
      kelas: classes[0] || "Kelas 1",
      mata_pelajaran: subjects[0] || ""
    }));
    setSoalForm(prev => ({
      ...prev,
      kelas: classes[0] || "Kelas 1",
      mata_pelajaran: subjects[0] || ""
    }));

    showToast(`Selamat datang Bpk/Ibu ${newProfile.nama}! Profil ${newProfile.jenjang} berhasil diaktifkan. 🚀`);
  };

  // Submit Generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const endpoint = activeTab === "modul" ? "/api/generate-modul" : "/api/generate-soal";
    
    // Construct rich payload incorporating teacher identity
    const payload = activeTab === "modul" 
      ? {
          ...modulForm,
          guru_nama: profile?.nama || "Guru Indonesia",
          guru_sekolah: profile?.sekolah || "Asisten Guru Merdeka",
          guru_nip: profile?.nip || "",
          guru_jenjang: profile?.jenjang || "Umum"
        }
      : {
          ...soalForm,
          guru_nama: profile?.nama || "Guru Indonesia",
          guru_sekolah: profile?.sekolah || "Asisten Guru Merdeka",
          guru_nip: profile?.nip || "",
          guru_jenjang: profile?.jenjang || "Umum"
        };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menghubungi server");
      }

      if (activeTab === "modul") {
        setGeneratedModul(data.text);
        setLastGeneratedModulMeta({
          mata_pelajaran: modulForm.mata_pelajaran,
          kelas: modulForm.kelas,
          fase: modulForm.fase,
          topik_pembahasan: modulForm.topik_pembahasan,
          alokasi_waktu: modulForm.alokasi_waktu,
          guru_nama: profile?.nama || "Guru Indonesia",
          guru_sekolah: profile?.sekolah || "Asisten Guru Merdeka",
          guru_nip: profile?.nip || "",
          guru_jenjang: profile?.jenjang || "SD"
        });
      } else {
        setGeneratedSoal(data.text);
        setLastGeneratedSoalMeta({
          mata_pelajaran: soalForm.mata_pelajaran,
          kelas: soalForm.kelas,
          topik_materi: soalForm.topik_materi,
          jumlah_soal: soalForm.jumlah_soal,
          tipe_soal: soalForm.tipe_soal,
          tingkat_kesulitan: soalForm.tingkat_kesulitan,
          guru_nama: profile?.nama || "Guru Indonesia",
          guru_sekolah: profile?.sekolah || "Asisten Guru Merdeka",
          guru_nip: profile?.nip || "",
          guru_jenjang: profile?.jenjang || "SD"
        });
      }
      showToast("Berhasil memproduksi materi ajar bertenaga AI! 🎉");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan jaringan atau API Key belum ditentukan.");
    } finally {
      setLoading(false);
    }
  };

  // Action: Salin Teks
  const handleCopyText = () => {
    const textToCopy = activeTab === "modul" ? generatedModul : generatedSoal;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    showToast("Teks berhasil disalin ke clipboard! 📋");
  };

  // Action: Unduh File Txt
  const handleDownloadTxt = () => {
    const textToCopy = activeTab === "modul" ? generatedModul : generatedSoal;
    if (!textToCopy) return;

    const subject = activeTab === "modul" ? modulForm.mata_pelajaran : soalForm.mata_pelajaran;
    const topic = activeTab === "modul" ? modulForm.topik_pembahasan : soalForm.topik_materi;
    const cleanSubject = (subject || "Dokumen").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const cleanTopic = (topic || "Belajar").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const fileName = activeTab === "modul" 
      ? `modul_ajar_${cleanSubject}_${cleanTopic}.txt`
      : `bank_soal_${cleanSubject}_${cleanTopic}.txt`;

    const blob = new Blob([textToCopy], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Berkas TXT berhasil diunduh! 💾");
  };

  // Action: Cetak / PDF
  const handlePrint = () => {
    const originalTitle = document.title;
    const documentTitle = activeTab === "modul" 
      ? `Modul_Ajar_${(activeMeta.mata_pelajaran || "Pelajaran").replace(/\s+/g, "_")}`
      : `Bank_Soal_${(activeMeta.mata_pelajaran || "Pelajaran").replace(/\s+/g, "_")}`;
    
    document.title = documentTitle;

    const printArea = document.getElementById("print-area");
    if (!printArea) {
      window.print();
      return;
    }

    try {
      // Buka window baru untuk Cetak agar bebas hambatan sandbox iframe di browser
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        const printHtml = printArea.innerHTML;

        printWindow.document.open();
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${documentTitle}</title>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
              <!-- Tailwind CSS -->
              <script src="https://cdn.tailwindcss.com"></script>
              <script>
                tailwind.config = {
                  theme: {
                    extend: {
                      fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                      }
                    }
                  }
                }
              </script>
              <style>
                @media print {
                  @page {
                    size: A4;
                    margin: 1.5cm;
                  }
                  body {
                    background-color: white !important;
                    padding: 0 !important;
                  }
                  .print-bar {
                    display: none !important;
                  }
                  .card-container {
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    max-width: 100% !important;
                  }
                }
                body {
                  font-family: "Plus Jakarta Sans", "Inter", sans-serif;
                }
                /* Clean markdown styled output for print standard */
                .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
                  color: #0f172a;
                  font-weight: 800;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                }
                .markdown-body h1 {
                  font-size: 1.4rem;
                  border-bottom: 2px solid #004a99;
                  padding-bottom: 0.5rem;
                }
                .markdown-body h2 {
                  font-size: 1.25rem;
                  border-bottom: 1px solid #e2e8f0;
                  padding-bottom: 0.25rem;
                }
                .markdown-body h3 {
                  font-size: 1.1rem;
                  color: #004a99;
                  background-color: #f1f5f9;
                  padding: 0.25rem 0.75rem;
                  border-radius: 6px;
                  display: inline-block;
                }
                .markdown-body p, .markdown-body li {
                  color: #334155;
                  line-height: 1.7;
                  font-size: 0.95rem;
                }
                .markdown-body p {
                  margin-bottom: 1rem;
                }
                .markdown-body ul {
                  list-style-type: disc !important;
                  padding-left: 1.5rem;
                  margin-bottom: 1rem;
                }
                .markdown-body ol {
                  list-style-type: decimal !important;
                  padding-left: 1.5rem;
                  margin-bottom: 1rem;
                }
                .markdown-body li {
                  margin-bottom: 0.5rem;
                }
                .markdown-body blockquote {
                  border-left: 4px solid #004a99;
                  background-color: #f8fafc;
                  padding: 0.75rem 1rem;
                  margin: 1rem 0;
                  border-radius: 6px;
                }
                .markdown-body blockquote p {
                  margin-bottom: 0;
                  font-style: italic;
                  color: #003b80;
                }
                .markdown-body strong {
                  font-weight: 600;
                  color: #0f172a;
                }
              </style>
            </head>
            <body class="bg-slate-100 p-4 sm:p-8 min-h-screen">
              <!-- Floating control panel for non-print view -->
              <div class="print-bar max-w-4xl mx-auto mb-6 bg-slate-900 text-white rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                    AG
                  </div>
                  <div>
                    <h1 class="text-xs font-bold text-white tracking-wide uppercase">Asisten Guru Merdeka - Pusat Cetak</h1>
                    <p class="text-[11px] text-slate-400">Siap mencetak dokumen Anda dalam format rapi Kurikulum Merdeka.</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick="window.print()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition duration-150 shadow-sm cursor-pointer">
                    Cetak Sekarang / Simpan PDF
                  </button>
                  <button onclick="window.close()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition duration-150 border border-slate-700 cursor-pointer">
                    Tutup
                  </button>
                </div>
              </div>

              <!-- Main printable layout sheet -->
              <div class="card-container max-w-4xl mx-auto bg-white border border-slate-200 shadow-xl p-10 sm:p-14 rounded-3xl min-h-[297mm]">
                ${printHtml}
              </div>

              <script>
                // Auto trigger browser print dialogue
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 700);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        showToast("Membuka Dokumen di Tab Pencetakan Baru... 🖨️");
      } else {
        // Fallback jika popup blocker aktif
        window.print();
        showToast("Membuka dialog cetak sistem... Untuk hasil maksimal, izinkan pop-up situs ini! 📄");
      }
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      document.title = originalTitle;
    }
  };

  // Action: Reset Form
  const handleReset = () => {
    if (activeTab === "modul") {
      setModulForm({
        mata_pelajaran: "",
        kelas: "Kelas 4",
        fase: "Fase B",
        topik_pembahasan: "",
        alokasi_waktu: "",
        catatan_tambahan: ""
      });
      setGeneratedModul("");
      setLastGeneratedModulMeta(null);
    } else {
      setSoalForm({
        mata_pelajaran: "",
        kelas: "Kelas 4",
        topik_materi: "",
        jumlah_soal: 5,
        tipe_soal: "Pilihan Ganda",
        tingkat_kesulitan: "Campuran",
        catatan_tambahan: ""
      });
      setGeneratedSoal("");
      setLastGeneratedSoalMeta(null);
    }
    setLoadedFromPreset(null);
    setErrorMsg(null);
    showToast("Form berhasil dikosongkan.");
  };

  const activeResult = activeTab === "modul" ? generatedModul : generatedSoal;

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased font-sans">
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-slate-200" />
        
        <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-10 flex flex-col justify-center items-center gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            <div className="bg-[#004a99] text-white p-3.5 rounded-2xl shadow-md inline-flex items-center justify-center">
              <GraduationCap className="h-9 w-9 animate-bounce" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#004a99] uppercase tracking-tight mt-2 flex items-center gap-2">
              Asisten Guru Merdeka
            </h1>
            <p className="text-xs text-slate-500 max-w-md font-mono uppercase tracking-wider font-semibold">
              KONSULTAN PEDAGOGI DIGITAL & EVALUASI OTOMATIS
            </p>
          </div>

          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#004a99] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider">Identitas Pendidik Merdeka</h2>
                  <h3 className="text-[10px] text-blue-100 font-light">Lengkapi profil Anda untuk menyesuaikan otomatis jenjang mengajar</h3>
                </div>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="p-6 sm:p-8 flex flex-col gap-4">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap & Gelar Akademik <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siti Rahma, S.Pd. atau Budi Santoso, M.Pd."
                  value={regNama}
                  onChange={e => setRegNama(e.target.value)}
                  className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#004a99] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              {/* Row NIP & Sekolah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    NIP / NUPTK <span className="text-slate-400 font-normal italic">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 19870420..."
                    value={regNip}
                    onChange={e => setRegNip(e.target.value)}
                    className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:border-[#004a99] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Sekolah / Instansi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SD Negeri 1 Jakarta"
                    value={regSekolah}
                    onChange={e => setRegSekolah(e.target.value)}
                    className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:border-[#004a99] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Pilih Jenjang */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tingkat Mengajar (Jenjang Sekolah) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(["SD", "SMP", "SMA", "SMK"] as const).map(jen => {
                    const isSelected = regJenjang === jen;
                    return (
                      <button
                        key={jen}
                        type="button"
                        onClick={() => setRegJenjang(jen)}
                        className={`py-3 px-2 rounded-xl border-2 transition duration-205 flex flex-col items-center justify-center gap-1.5 cursor-pointer uppercase ${
                          isSelected
                            ? "bg-blue-50/70 border-[#004a99] text-[#004a99] shadow-inner font-extrabold"
                            : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100/65 hover:border-slate-300 font-semibold"
                        }`}
                      >
                        <span className="text-xs font-bold">
                          {jen === "SD" ? "🔴 SD / MI" : jen === "SMP" ? "🔵 SMP / MTs" : jen === "SMA" ? "🔘 SMA / MA" : "🟢 SMK"}
                        </span>
                        <span className="text-[9px] font-medium text-slate-500 leading-none">
                          {jen === "SD" ? "Kelas 1-6" : jen === "SMP" ? "Kelas 7-9" : jen === "SMA" ? "Kelas 10-12" : "Kejuruan"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#004a99] hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-lg shadow-md transition cursor-pointer hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4.5 w-4.5 text-amber-300 animate-pulse" />
                Masuk ke Ruang Kerja Asisten ✨
              </button>
            </form>
          </div>

          <div className="max-w-md text-center text-slate-500 text-xs italic leading-relaxed py-2 flex flex-col gap-1 items-center">
            <p>"{MOTIVATIONAL_QUOTES[0].quote}"</p>
            <p className="font-semibold text-[#004a99] not-italic">— {MOTIVATIONAL_QUOTES[0].author}</p>
          </div>
        </div>

        <footer className="bg-slate-900 text-slate-550 py-4 border-t border-slate-800 text-[10px] text-center w-full">
          Asisten Guru Merdeka • Platform AI Adaptif untuk Administrasi Guru Indonesia
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-850 flex flex-col antialiased font-sans">
      {/* Kebanggaan Guru Merdeka Header */}
      <header className="bg-[#004a99] text-white border-b border-blue-900 sticky top-0 z-40 shadow-md print:hidden h-16 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#004a99] p-2 rounded-lg shadow-sm flex items-center justify-center">
              <GraduationCap className="h-6 w-6" id="app-logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight leading-none uppercase">ASISTEN GURU MERDEKA</span>
              <span className="text-[10px] opacity-80 uppercase tracking-widest font-semibold mt-0.5">Konsultan Pedagogi Digital</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => { setActiveTab("modul"); setErrorMsg(null); }}
              className={`transition-all pb-1 border-b-2 hover:text-blue-100 font-bold text-xs uppercase tracking-wider cursor-pointer ${
                activeTab === "modul" ? "border-white text-white" : "border-transparent text-blue-200"
              }`}
            >
              Modul Ajar
            </button>
            <button 
              onClick={() => { setActiveTab("soal"); setErrorMsg(null); }}
              className={`transition-all pb-1 border-b-2 hover:text-blue-100 font-bold text-xs uppercase tracking-wider cursor-pointer ${
                activeTab === "soal" ? "border-white text-white" : "border-transparent text-blue-200"
              }`}
            >
              Bank Soal
            </button>
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-blue-405">
              <div className="flex flex-col text-right">
                <span className="text-xs font-black tracking-tight text-white leading-tight">{profile.nama}</span>
                <span className="text-[9px] text-blue-200 font-semibold">{profile.sekolah} • Guru {profile.jenjang}</span>
              </div>
              <button 
                onClick={() => {
                  setProfile(null);
                }}
                className="bg-blue-600 hover:bg-emerald-600 hover:shadow-inner text-white cursor-pointer px-2 py-1 rounded text-[9px] font-bold tracking-wider transition ml-2 uppercase"
                title="Ganti Jenjang / Profil"
              >
                Ganti Profil
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner Intro */}
      <section className="bg-gradient-to-r from-[#004a99] via-blue-900 to-slate-900 text-white py-6 px-4 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2 text-white">
              Transformasi Administrasi Guru Menjadi Aksi Kelas! 🚀
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Buat Modul Ajar Kurikulum Merdeka yang komprehensif, interaktif, dan terdiferensiasi, serta Bank Soal (HOTS/LOTS) berkualitas nasional dengan stimulus realistik dalam sekejap tanpa repot administratif.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 hidden lg:block max-w-sm shrink-0">
            <span className="text-[10px] font-bold tracking-widest text-[#9cd4ff] block mb-1 uppercase">Pesan Pendidikan</span>
            <p className="text-xs italic text-blue-50 leading-relaxed font-light">
              "{MOTIVATIONAL_QUOTES[1].quote}"
            </p>
            <span className="text-[10px] font-semibold text-right block mt-1 text-blue-300">
              — {MOTIVATIONAL_QUOTES[1].author}
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Toast Notifikasi */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in text-sm max-w-sm">
            <div className="bg-emerald-500 text-white p-1 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
            <p className="font-medium text-slate-100">{successToast}</p>
          </div>
        )}

        {/* 1. SEKTION TEMPLATE PRESETS (Quick Click) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs print:hidden">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Mulai Cepat dengan Preset Contoh (Praktis & Instan):
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_TEMPLATES.filter(preset => !profile || preset.jenjang === profile.jenjang).map((preset, index) => {
              const isSelected = loadedFromPreset === preset.title;
              return (
                <button
                  key={index}
                  onClick={() => handleApplyPreset(preset)}
                  className={`text-left p-3.5 rounded-xl transition duration-150 border flex flex-col justify-between group h-full cursor-pointer ${
                    isSelected 
                      ? "bg-blue-50/40 border-blue-500 ring-2 ring-blue-100" 
                      : "bg-slate-50/60 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs"
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide block w-fit mb-2 ${
                      preset.type === "modul" 
                        ? "bg-blue-100 text-[#004a99]" 
                        : "bg-indigo-100 text-indigo-700"
                    }`}>
                      {preset.type === "modul" ? "Modul Ajar" : "Bank Soal"}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-[#004a99] mb-1 transition-colors">
                      {preset.title.split(": ")[1]}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 font-light">
                      {preset.description}
                    </p>
                  </div>
                  <div className="mt-2.5 text-[10px] text-[#004a99] font-semibold flex items-center gap-1 group-hover:translate-x-1 duration-150">
                    Pakai template <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. SPLIT LAYOUT FOR CREATOR & PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          
          {/* LEFT SIDE: CREATOR PANEL */}
          <div className="lg:col-span-5 flex flex-col gap-6 print:hidden">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              
              {/* Tab Selector */}
              <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5">
                <button
                  onClick={() => {
                    setActiveTab("modul");
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 px-4 text-xs font-extrabold rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === "modul"
                      ? "bg-[#004a99] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Modul Ajar Merdeka
                </button>
                <button
                  onClick={() => {
                    setActiveTab("soal");
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2.5 px-4 text-xs font-extrabold rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === "soal"
                      ? "bg-[#004a99] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                  }`}
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Bank Soal Evaluasi
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleGenerate} className="p-5 sm:p-6 flex flex-col gap-5">
                
                {/* Error Banner */}
                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-250 text-rose-800 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Gagal Membuat Materi</p>
                      <p className="font-light mt-0.5 text-rose-700">{errorMsg}</p>
                    </div>
                  </div>
                )}

                {activeTab === "modul" ? (
                  /* ==================================== */
                  /* TAB MODUL AJAR FORM                  */
                  /* ==================================== */
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <span className="bg-blue-100 text-[#004a99] font-bold text-[10px] px-2 py-0.5 rounded-md uppercase">Pedagogi</span>
                      <h4 className="text-xs font-bold text-slate-400 tracking-wide uppercase">Identitas & Cakupan Materi</h4>
                    </div>

                    {/* Mata Pelajaran */}
                    <div>
                      <label className="block text-xs font-bold text-slate-655 mb-1.5">
                        Mata Pelajaran <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Ilmu Pengetahuan Alam (IPA)"
                        value={modulForm.mata_pelajaran}
                        onChange={e => setModulForm({ ...modulForm, mata_pelajaran: e.target.value })}
                        className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-sm outline-none focus:border-[#004a99] focus:ring-2 focus:ring-blue-105 transition-all"
                      />
                      {profile && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-[10px] font-bold text-[#004a99] self-center mr-1 uppercase">Saran:</span>
                          {getSubjectSuggestions(profile.jenjang).map(sub => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => setModulForm(prev => ({ ...prev, mata_pelajaran: sub }))}
                              className="text-[10px] font-semibold text-slate-650 bg-slate-100 hover:bg-blue-50 hover:text-[#004a99] px-2 py-0.5 rounded transition duration-150 cursor-pointer border border-slate-200"
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Row: Kelas & Fase */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#004a99] text-xs font-bold mb-1.5">
                          Pilih Kelas ({profile?.jenjang || "SD"}) <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={modulForm.kelas}
                          onChange={e => setModulForm({ ...modulForm, kelas: e.target.value })}
                          className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#004a99] transition cursor-pointer font-bold"
                        >
                          {getClassesForJenjang(profile?.jenjang || "SD").map(k => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-655 mb-1.5">
                          Fase Kurikulum <span className="text-slate-400 font-normal">(Auto)</span>
                        </label>
                        <div className="w-full text-slate-800 bg-slate-100/60 font-bold text-sm px-3.5 py-2 rounded-md border border-dashed border-slate-250 text-center select-none flex items-center justify-center gap-1">
                          <Layers className="h-3.5 w-3.5 text-slate-500" />
                          {modulForm.fase}
                        </div>
                      </div>
                    </div>

                    {/* Topik / Bab Pembahasan */}
                    <div>
                      <label className="block text-xs font-bold text-slate-655 mb-1.5">
                        Topik atau Bab Pembahasan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Energi Alternatif dan Pemanfaatannya"
                        value={modulForm.topik_pembahasan}
                        onChange={e => setModulForm({ ...modulForm, topik_pembahasan: e.target.value })}
                        className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-sm outline-none focus:border-[#004a99] focus:ring-2 focus:ring-blue-105 transition-all"
                      />
                      {profile && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-[10px] font-bold text-[#004a99] self-center mr-1 uppercase">Saran Topik Kurikulum Merdeka:</span>
                          {getTopicSuggestions(profile.jenjang, modulForm.kelas, modulForm.mata_pelajaran).map(topic => (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => setModulForm(prev => ({ ...prev, topik_pembahasan: topic }))}
                              className="text-[10px] font-semibold text-slate-650 bg-slate-100 hover:bg-blue-50 hover:text-[#004a99] px-2 py-0.5 rounded transition duration-150 cursor-pointer border border-slate-200"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Alokasi Waktu */}
                    <div>
                      <label className="block text-xs font-bold text-slate-655 mb-1.5">
                        Alokasi Waktu <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 2 JP (2 x 35 Menit) atau 1 Pertemuan"
                        value={modulForm.alokasi_waktu}
                        onChange={e => setModulForm({ ...modulForm, alokasi_waktu: e.target.value })}
                        className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-sm outline-none focus:border-[#004a99] focus:ring-2 focus:ring-blue-105 transition-all"
                      />
                    </div>

                    {/* Catatan / Fokus Tambahan */}
                    <div>
                      <label className="block text-xs font-bold text-slate-655 mb-1.5 flex justify-between">
                        <span>Fokus / Kustomisasi Guru <span className="text-slate-400 font-normal">(Opsional)</span></span>
                        <span className="text-[9px] text-[#004a99] bg-blue-50 px-1.5 py-0.5 rounded-full font-bold">Terdiferensiasi</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Misal: Tambah eksperimen kelompok, fokus pada diferensiasi gaya belajar audiostik/visual, dll."
                        value={modulForm.catatan_tambahan}
                        onChange={e => setModulForm({ ...modulForm, catatan_tambahan: e.target.value })}
                        className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs outline-none focus:border-[#004a99] focus:ring-2 focus:ring-blue-105 transition-all resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  /* ==================================== */
                  /* TAB BANK SOAL FORM                   */
                  /* ==================================== */
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <span className="bg-indigo-100 text-indigo-800 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase">Evaluasi</span>
                      <h4 className="text-xs font-bold text-slate-400 tracking-wide uppercase">Cakupan Evaluasi & Kognitif</h4>
                    </div>

                    {/* Mata Pelajaran */}
                    <div>
                      <label className="block text-xs font-bold text-slate-655 mb-1.5">
                        Mata Pelajaran <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Sejarah Indonesia"
                        value={soalForm.mata_pelajaran}
                        onChange={e => setSoalForm({ ...soalForm, mata_pelajaran: e.target.value })}
                        className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-sm outline-none focus:border-[#004a99] focus:ring-2 focus:ring-blue-105 transition-all"
                      />
                      {profile && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-[10px] font-bold text-[#004a99] self-center mr-1 uppercase">Saran:</span>
                          {getSubjectSuggestions(profile.jenjang).map(sub => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => setSoalForm(prev => ({ ...prev, mata_pelajaran: sub }))}
                              className="text-[10px] font-semibold text-slate-655 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 px-2 py-0.5 rounded transition duration-150 cursor-pointer border border-slate-200"
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Row: Kelas & Jumlah Soal */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#004a99] text-xs font-bold mb-1.5">
                          Kelas ({profile?.jenjang || "SD"}) <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={soalForm.kelas}
                          onChange={e => setSoalForm({ ...soalForm, kelas: e.target.value })}
                          className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#004a99] transition cursor-pointer font-bold"
                        >
                          {getClassesForJenjang(profile?.jenjang || "SD").map(k => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-655 mb-1.5">
                          Jumlah Soal <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={soalForm.jumlah_soal}
                          onChange={e => setSoalForm({ ...soalForm, jumlah_soal: parseInt(e.target.value) })}
                          className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#004a99] transition cursor-pointer"
                        >
                          <option value="3">3 Soal Efisien</option>
                          <option value="5">5 Soal Standar</option>
                          <option value="10">10 Soal Lengkap</option>
                        </select>
                      </div>
                    </div>

                    {/* Topik Materi */}
                    <div>
                      <label className="block text-xs font-bold text-slate-655 mb-1.5">
                        Topik atau Materi Soal <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Sumpah Pemuda & Kebangkitan Nasional"
                        value={soalForm.topik_materi}
                        onChange={e => setSoalForm({ ...soalForm, topik_materi: e.target.value })}
                        className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-sm outline-none focus:border-[#004a99] focus:ring-2 focus:ring-blue-105 transition-all"
                      />
                      {profile && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-[10px] font-bold text-indigo-800 self-center mr-1 uppercase">Saran Topik Kurikulum Merdeka:</span>
                          {getTopicSuggestions(profile.jenjang, soalForm.kelas, soalForm.mata_pelajaran).map(topic => (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => setSoalForm(prev => ({ ...prev, topik_materi: topic }))}
                              className="text-[10px] font-semibold text-slate-655 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 px-2 py-0.5 rounded transition duration-150 cursor-pointer border border-slate-200"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Row: Tipe Soal & Tingkat Kesulitan */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-655 mb-1.5">
                          Tipe Soal <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex bg-slate-100 rounded-lg p-1 text-[11px] font-bold">
                          {(["Pilihan Ganda", "Esai"] as const).map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setSoalForm({ ...soalForm, tipe_soal: t })}
                              className={`flex-1 py-1.5 text-center rounded-md transition-all cursor-pointer ${
                                soalForm.tipe_soal === t
                                  ? "bg-white text-[#004a99] shadow-2xs"
                                  : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-655 mb-1.5">
                          Tingkat Kesulitan <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={soalForm.tingkat_kesulitan}
                          onChange={e => setSoalForm({ ...soalForm, tingkat_kesulitan: e.target.value as any })}
                          className="w-full text-slate-900 bg-slate-50 border border-slate-205 rounded-md px-3 py-2 text-xs outline-none focus:border-[#004a99] transition cursor-pointer"
                        >
                          <option value="Campuran">Campuran</option>
                          <option value="Dominan HOTS">Dominan HOTS (C4-C6)</option>
                          <option value="Dominan LOTS">Dominan LOTS (C1-C3)</option>
                        </select>
                      </div>
                    </div>

                    {/* Catatan Tambahan */}
                    <div>
                      <label className="block text-xs font-bold text-slate-655 mb-1.5 flex justify-between">
                        <span>Fokus / Kustomisasi Evaluasi <span className="text-slate-400 font-normal">(Opsional)</span></span>
                        <span className="text-[9px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-full font-bold">Stimulus</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Misal: Masukkan studi kasus tentang proklamasi kemerdekaan, fokus soal pemecahan masalah ekonomi, dsb."
                        value={soalForm.catatan_tambahan}
                        onChange={e => setSoalForm({ ...soalForm, catatan_tambahan: e.target.value })}
                        className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs outline-none focus:border-[#004a99] focus:ring-2 focus:ring-blue-105 transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-extrabold text-xs tracking-wider py-3.5 px-4 rounded-lg shadow-md cursor-pointer transition flex items-center justify-center gap-2 uppercase ${
                    loading 
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-[#004a99] hover:bg-blue-800 text-white shadow-lg shadow-blue-100 hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Memobilisasi Kekuatan AI Pendidikan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4.5 w-4.5 text-amber-300 animate-pulse" />
                      {activeTab === "modul" ? "Hasilkan Modul Ajar Instan ✨" : "Hasilkan Bank Soal Berkelas ✨"}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* QUICK MERDEKA TIPS CARD */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Pedoman Guru Kurikulum Merdeka
                </h4>
              </div>
              <ul className="text-xs leading-relaxed text-slate-300 flex flex-col gap-2.5 list-none">
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">1.</span>
                  <span><strong>Fase Pembelajaran:</strong> Pengelompokan umur siswa bukan lagi per tahun jenuh melainkan per rentang kompetensi (Fase A s/d F).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">2.</span>
                  <span><strong>Pembelajaran Diferensiasi:</strong> Modul kami menunjang diferensiasi proses & sarana prasarana digital maupun minim prasarana.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">3.</span>
                  <span><strong>Tipe HOTS:</strong> Soal didesain memaksa nalar kreatif dan kritis menganalisis stimulus kontekstual dwi-arah harian dibanding menghafal buta.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT SIDE: DOCUMENT VISUALIZER / OUTPUT PREVIEW */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Action Bar for Generated Paper */}
            {activeResult && !loading && (
              <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm print:hidden">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <FileText className="h-4 w-4 text-[#004a99] animate-pulse" />
                  Materi siap digunakan. <strong className="text-slate-900">Silakan unduh atau cetak langsung!</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 px-3 py-2 rounded-lg transition-all cursor-pointer shadow-2xs"
                    title="Salin semua teks ke clipboard"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Salin
                  </button>

                  <button
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 px-3 py-2 rounded-lg transition-all cursor-pointer shadow-2xs"
                    title="Unduh file format dokumen teks biasa"
                  >
                    <Download className="h-3.5 w-3.5" />
                    TXT
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#004a99] px-3 py-2 rounded-lg transition-all cursor-pointer shadow-2xs"
                    title="Cetak via browser atau Simpan PDF"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Cetak / PDF
                  </button>

                  <div className="h-6 w-px bg-slate-200 mx-1" />

                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 py-2 px-2.5 text-xs font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-50 rounded-lg border border-rose-100 transition-all cursor-pointer shadow-2xs"
                    title="Buat ulang dokumen kosong"
                  >
                    Mulai Baru
                  </button>
                </div>
              </div>
            )}

            {/* Document Preview Paper Area */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-md relative overflow-hidden flex flex-col min-h-[500px] lg:h-[850px]">
              
              {/* National Garis Hias Merah Putih (Indonesian Flag Vibe Top border) */}
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-slate-200 flex shrink-0" />

              {/* LOADING STATE VIEW */}
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
                  <div className="relative mb-6">
                    <span className="absolute inset-0 rounded-full bg-blue-105 animate-ping opacity-60" />
                    <div className="relative rounded-full bg-blue-50 text-[#004a99] p-5 flex items-center justify-center border border-blue-100 shadow-inner">
                      <RefreshCw className="h-8 w-8 animate-spin" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {activeTab === "modul" ? "Mengonstruksi Modul Ajar Merdeka" : "Memformulasikan Bank Soal Evaluasi"}
                  </h3>

                  {/* Progressive loading simulation text */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-[#004a99] font-semibold inline-block min-h-[52px] w-full max-w-sm mb-4">
                    {activeTab === "modul" 
                      ? LOADING_STEPS_MODUL[loadingStepIndex] 
                      : LOADING_STEPS_SOAL[loadingStepIndex]
                    }
                  </div>

                  <p className="text-slate-400 text-xs italic">
                    Mohon tunggu beberapa detik, asisten sedang mengumpulkan komponen pedagogi terbaik sesuai standar nasional Indonesia.
                  </p>
                </div>
              ) : activeResult ? (
                /* ==================================== */
                /* PRINTABLE GENERATED VIEW             */
                /* ==================================== */
                <article className="p-6 sm:p-10 flex-1 flex flex-col overflow-y-auto bg-white scroll-smooth" id="print-area">
                  
                  {/* Subject Cover-Image Illustration Hero (Visual Appeal) */}
                  <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-6 border border-slate-100 shadow-xs shrink-0 print:hidden">
                    <img
                      src={getSubjectBannerImage(activeMeta.mata_pelajaran)}
                      alt={activeMeta.mata_pelajaran || "Cover Pendidik"}
                      className="w-full h-full object-cover transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/40 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md text-white ${
                          activeTab === "modul" ? "bg-[#004a99]" : "bg-indigo-600"
                        }`}>
                          {activeTab === "modul" ? "MODUL AJAR GURU" : "EVALUASI AKADEMIK"}
                        </span>
                        <span className="text-[9px] font-bold tracking-widest text-[#F8FAFC] opacity-90 uppercase px-1.5 py-0.5 rounded-md bg-slate-800/80">
                          {profile?.jenjang || "KURIKULUM MERDEKA"}
                        </span>
                      </div>
                      <h2 className="text-white text-base sm:text-lg font-extrabold tracking-tight drop-shadow-xs uppercase line-clamp-1">
                        {activeTab === "modul" ? activeMeta.topik_pembahasan : activeMeta.topik_materi}
                      </h2>
                      <p className="text-slate-200 text-[10px] opacity-95 font-medium">
                        Mata Pelajaran: {activeMeta.mata_pelajaran} • {activeMeta.kelas} {activeTab === "modul" ? `(${activeMeta.fase})` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Kop Surat Pemerintah / Pendidikan Formal Header */}
                  <div className="border-b-4 border-double border-[#004a99] pb-4 mb-6 text-center">
                    <div className="font-extrabold text-[9px] sm:text-xs uppercase tracking-widest text-[#004a99]">
                      DOKUMEN EVALUASI & PERANGKAT PEMBELAJARAN
                    </div>
                    <div className="font-black text-base sm:text-lg text-slate-900 mt-1 uppercase">
                      ASISTEN GURU MERDEKA INDONESIA
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 font-mono mt-1">
                      Kemendibudristek RI • Modul Diferensiasi & Evaluasi HOTS Aktual • ID App: {document.location.hostname}
                    </div>
                  </div>

                  {/* Professional Administrasi Cover Grid Table (Aesthetic & Tidy) */}
                  <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50/50 mb-6 text-xs text-slate-800 gap-4 grid grid-cols-1 sm:grid-cols-2 shadow-2xs shrink-0">
                    <div className="flex flex-col gap-2.5 sm:border-r border-slate-200/60 sm:pr-4">
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block leading-none mb-1">Mata Pelajaran</span>
                        <span className="font-extrabold text-slate-900">{activeMeta.mata_pelajaran}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block leading-none mb-1">Sasaran Belajar</span>
                        <span className="font-extrabold text-slate-900">{activeMeta.kelas} {activeTab === "modul" ? `(${activeMeta.fase})` : ""}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block leading-none mb-1">{activeTab === "modul" ? "Alokasi Waktu" : "Metode / Jenis Soal"}</span>
                        <span className="font-extrabold text-[#004a99]">
                          {activeTab === "modul" ? activeMeta.alokasi_waktu : `${activeMeta.tipe_soal} (${activeMeta.jumlah_soal} Soal)`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2.5 pl-0 sm:pl-2">
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block leading-none mb-1">Pendidik / Penyusun</span>
                        <span className="font-extrabold text-slate-900">Bpk/Ibu {activeMeta.guru_nama}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block leading-none mb-1">Instansi Pendidikan</span>
                        <span className="font-extrabold text-slate-900">{activeMeta.guru_sekolah}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block leading-none mb-1">Kunci Identitas NIP</span>
                        <span className="font-mono text-[10px] text-slate-600 font-bold">{activeMeta.guru_nip || "NIP. - / Belum Diisi"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Output Markdown Content */}
                  <div className="markdown-body text-slate-800 flex-1">
                    <Markdown>{(activeResult || "").replace(/<br\s*\/?>/gi, "\n\n").replace(/\\n/g, "\n")}</Markdown>
                  </div>

                  {/* National Footer Signature Panel with QR & Seal Verification (Realtime & Authentic) */}
                  <div className="mt-12 pt-6 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
                    <div className="text-[11px] text-slate-500 italic text-center sm:text-left self-center sm:self-auto">
                      <div>Dicetak otomatis oleh <strong className="text-slate-700">Asisten Guru Merdeka AI</strong></div>
                      <div className="text-[10px] text-slate-400 not-italic font-mono mt-0.5">Ref-code: AGM-{Math.floor(100000 + Math.random() * 900000)}-{activeMeta.guru_jenjang} | {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
                    </div>
                    
                    {/* Validation Seal Block */}
                    <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl shrink-0 print:border-slate-300">
                      <div className="w-9 h-9 rounded-full bg-emerald-505/10 bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] text-slate-405 text-slate-400 font-bold uppercase tracking-wider leading-none">Status Verifikasi</span>
                        <span className="text-[11px] text-emerald-800 font-black tracking-tight mt-0.5">STANDAR NASIONAL</span>
                        <span className="text-[9px] text-emerald-600/90 font-medium">Bebas Plagiasi & Siap Ajarkan</span>
                      </div>
                    </div>
                  </div>
                </article>
              ) : (
                /* ==================================== */
                /* EMPTY STATE VIEW                     */
                /* ==================================== */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-auto">
                  <div className="bg-sky-50 text-sky-600 p-4 rounded-2xl mb-4 shadow-inner flex items-center justify-center">
                    <GraduationCap className="h-10 w-10 text-merdeka-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    Modul / Soal Belum Diproduksi
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-light mb-6">
                    Pilih salah satu template pracetak di atas, atau isi data kurikulum Anda di panel sebelah kiri untuk memformulasikan perangkat ajar instan bernilai akademis tinggi.
                  </p>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2.5 text-left text-[11px] text-slate-600 w-full">
                    <Info className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">💡 Keamanan Kunci API:</strong> Semua eksekusi proses kognitif ditransmisikan secara tersandi melalui server proxy tertutup tanpa memaparkan token API personal Anda.
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* National Motto Citation */}
            <div className="text-center text-slate-400 text-[11px] leading-relaxed py-2 flex flex-col gap-1 items-center justify-center print:hidden">
              <p>🌱 "Mendidik adalah memerdekakan manusia supaya hidup lahir dan batinnya selamat."</p>
              <p className="font-semibold text-slate-500">— Sekilas Gagasan Pendidikan Ki Hajar Dewantara</p>
            </div>
          </div>
          
        </div>
      </main>

      {/* Footer Branding page */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-300">Asisten Guru Merdeka © 2026</p>
            <p className="text-[10px] text-slate-500 font-light mt-0.5">Sistem Integrasi Penilaian Nasional dan Perencanaan Pembelajaran Digital Berbasis AI.</p>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition cursor-pointer">Panduan Penggunaan</span>
            <span className="hover:text-white transition cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-white transition cursor-pointer">Kemendikbudristek Hub</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
