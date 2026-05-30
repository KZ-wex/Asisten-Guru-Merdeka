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
  HelpCircle
} from "lucide-react";
import { 
  ModulAjarForm, 
  BankSoalForm, 
  PRESET_TEMPLATES, 
  PresetTemplate 
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

  // Output Storage
  const [generatedModul, setGeneratedModul] = useState<string>("");
  const [generatedSoal, setGeneratedSoal] = useState<string>("");

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
    } else {
      setActiveTab("soal");
      setSoalForm(preset.data);
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

  // Submit Generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const endpoint = activeTab === "modul" ? "/api/generate-modul" : "/api/generate-soal";
    const payload = activeTab === "modul" ? modulForm : soalForm;

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
      } else {
        setGeneratedSoal(data.text);
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
    const isInsideIframe = window.self !== window.top;

    if (!isInsideIframe) {
      // Di luar iframe: langsung panggil window.print() bawaan yang sudah dioptimalkan oleh CSS @media print
      window.print();
      showToast("Membuka dialog cetak sistem... 📄");
      return;
    }

    // Di dalam iframe: gunakan teknik cetak tersemat dengan duplikasi styles
    const printArea = document.getElementById("print-area");
    if (!printArea) {
      window.print();
      return;
    }

    try {
      // Hapus sisa iframe cetak lama jika ada
      const oldFrame = document.getElementById("temp-print-frame");
      if (oldFrame) {
        oldFrame.remove();
      }

      // Buat iframe sementara
      const iframe = document.createElement("iframe");
      iframe.id = "temp-print-frame";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "none";
      iframe.style.zIndex = "-1";
      
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        throw new Error("Cannot access iframe document");
      }

      const printHtml = printArea.innerHTML;

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cetak Perangkat Pembelajaran - Asisten Guru Merdeka</title>
            <style>
              body {
                background-color: white !important;
                color: black !important;
                padding: 1.5cm !important;
                margin: 0 !important;
              }
            </style>
          </head>
          <body class="bg-white text-slate-900">
            <div id="print-root">
              ${printHtml}
            </div>
          </body>
        </html>
      `);

      // Duplikasi seluruh stylesheet pendukung dari dokumen induk ke dalam iframe
      const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
      parentStyles.forEach(style => {
        try {
          doc.head.appendChild(style.cloneNode(true));
        } catch (e) {
          console.warn("Could not copy stylesheet node to iframe:", e);
        }
      });

      doc.close();

      showToast("💡 Mempersiapkan lembar cetak... Rekomendasi: Klik 'Buka di Tab Baru' di kanan atas!");

      // Tunggu hingga rendering selesai
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (printErr) {
          console.error("Iframe print triggered exception:", printErr);
          window.print();
        }
      }, 500);

    } catch (err) {
      console.error("Local printing iframe failed, calling window.print fallback:", err);
      window.print();
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
    }
    setLoadedFromPreset(null);
    setErrorMsg(null);
    showToast("Form berhasil dikosongkan.");
  };

  const activeResult = activeTab === "modul" ? generatedModul : generatedSoal;

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
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-blue-400">
              <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center font-bold text-[11px]">G</div>
              <span className="text-xs font-semibold">Guru Indonesia</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PRESET_TEMPLATES.map((preset, index) => {
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
                      <label className="block text-xs font-bold text-slate-650 mb-1.5">
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
                    </div>

                    {/* Row: Kelas & Fase */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-655 mb-1.5">
                          Pilih Kelas <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={modulForm.kelas}
                          onChange={e => setModulForm({ ...modulForm, kelas: e.target.value })}
                          className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#004a99] transition cursor-pointer"
                        >
                          {Array.from({ length: 12 }, (_, i) => `Kelas ${i + 1}`).map(k => (
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
                    </div>

                    {/* Row: Kelas & Jumlah Soal */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-655 mb-1.5">
                          Kelas <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={soalForm.kelas}
                          onChange={e => setSoalForm({ ...soalForm, kelas: e.target.value })}
                          className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#004a99] transition cursor-pointer"
                        >
                          {Array.from({ length: 12 }, (_, i) => `Kelas ${i + 1}`).map(k => (
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
            <div className="bg-white border border-slate-200 rounded-3xl shadow-md relative overflow-hidden flex flex-col min-h-[500px]">
              
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
                <article className="p-8 sm:p-10 flex-1 flex flex-col overflow-auto bg-white" id="print-area">
                  
                  {/* Kop Surat Pemerintah / Pendidikan Formal Header */}
                  <div className="border-b-4 border-double border-[#004a99] pb-4 mb-6 text-center">
                    <div className="font-extrabold text-xs uppercase tracking-widest text-[#004a99]">
                      DOKUMEN EVALUASI & PERANGKAT PEMBELAJARAN
                    </div>
                    <div className="font-black text-lg sm:text-lg text-slate-900 mt-1 uppercase">
                      ASISTEN GURU MERDEKA INDONESIA
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      Kemendibudristek RI • Modul Diferensiasi & Evaluasi HOTS Aktual • ID App: {document.location.hostname}
                    </div>
                  </div>

                  {/* Output Markdown Content */}
                  <div className="markdown-body text-slate-800">
                    <Markdown>{activeResult}</Markdown>
                  </div>

                  {/* National Footer Signature Panel for Print validation */}
                  <div className="mt-12 pt-6 border-t border-dashed border-slate-200 flex justify-between text-[11px] text-slate-445 italic">
                    <div>
                      Dicetak otomatis oleh {document.location.host || "Asisten Guru Merdeka"}
                    </div>
                    <div>
                      Disetujui untuk Kegiatan Pembelajaran Aktif
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
