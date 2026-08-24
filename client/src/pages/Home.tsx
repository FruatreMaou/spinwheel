/**
 * Kios Keberuntungan: roda adalah pusat panggung; detail bergaya nota undian
 * dengan koral tomat, biru tinta, kertas krem, dan tipografi editorial.
 */
import { Button } from "@/components/ui/button";
import { Check, ClipboardPaste, FileUp, Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { FormEvent, type ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

const COLORS = ["#F04B36", "#1E4668", "#E8B843", "#5F8668", "#EA8A6D", "#577691", "#C96E85", "#97A56C"];
const MAX_OPTIONS = 50;
const STORAGE_KEY = "spinwheel-v2-user-options";

const ASSETS = {
  logo: "/manus-storage/spinwheel-logo_3dfdb099.png",
  confetti: "/manus-storage/spinwheel-confetti_ab55187f.png",
  stamp: "/manus-storage/spinwheel-stamp-winner_7d11795a.png",
  tickets: "/manus-storage/spinwheel-ticket-strip_354222d9.png",
};

function normalized(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}

function extractEntries(raw: string) {
  const seen = new Set<string>();
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[\-•*]\s*/, ""))
    .filter((line) => {
      const key = line.toLocaleLowerCase();
      if (!line || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function extractCsvEntries(raw: string) {
  const values: string[] = [];
  let currentValue = "";
  let insideQuote = false;

  for (let index = 0; index < raw.length; index += 1) {
    const character = raw[index];
    const nextCharacter = raw[index + 1];

    if (character === '"') {
      if (insideQuote && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (!insideQuote && (character === "," || character === ";" || character === "\n" || character === "\r")) {
      values.push(currentValue);
      currentValue = "";
    } else {
      currentValue += character;
    }
  }
  values.push(currentValue);

  return extractEntries(values.join("\n"));
}

export default function Home() {
  const [options, setOptions] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.slice(0, MAX_OPTIONS) : [];
    } catch {
      return [];
    }
  });
  const [draft, setDraft] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<{ name: string; ticketNumber: number } | null>(null);
  const [importMessage, setImportMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    return () => {
      if (resultTimer.current) clearTimeout(resultTimer.current);
    };
  }, []);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const size = Math.max(Math.floor(rect.width), 280);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * pixelRatio;
    canvas.height = size * pixelRatio;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, size, size);
    const center = size / 2;
    const radius = center - 14;

    if (options.length < 2) {
      context.beginPath();
      context.arc(center, center, radius + 7, 0, Math.PI * 2);
      context.fillStyle = "#16354f";
      context.fill();
      context.beginPath();
      context.arc(center, center, radius, 0, Math.PI * 2);
      context.fillStyle = "#F2E4C6";
      context.fill();
      context.setLineDash([7, 7]);
      context.lineWidth = 3;
      context.strokeStyle = "#16354f";
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = "#16354f";
      context.font = `700 ${Math.max(18, Math.min(28, size / 17))}px "DM Serif Display", serif`;
      context.textAlign = "center";
      context.fillText("Siapkan roda", center, center - 10);
      context.font = `700 ${Math.max(11, Math.min(15, size / 31))}px "DM Sans", sans-serif`;
      context.fillStyle = "#F04B36";
      context.fillText("Tambahkan minimal 2 pilihan", center, center + 22);
      return;
    }

    const segment = (Math.PI * 2) / options.length;
    context.beginPath();
    context.arc(center, center, radius + 7, 0, Math.PI * 2);
    context.fillStyle = "#16354f";
    context.fill();

    options.forEach((option, index) => {
      const start = -Math.PI / 2 + index * segment;
      const end = start + segment;
      const mid = start + segment / 2;
      context.beginPath();
      context.moveTo(center, center);
      context.arc(center, center, radius, start, end);
      context.closePath();
      context.fillStyle = COLORS[index % COLORS.length];
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = "#FFF9ED";
      context.stroke();

      if (options.length <= 16) {
        context.save();
        context.translate(center + Math.cos(mid) * radius * 0.6, center + Math.sin(mid) * radius * 0.6);
        context.rotate(mid + Math.PI / 2);
        context.fillStyle = index % COLORS.length === 2 ? "#16354f" : "#FFF9ED";
        context.font = `700 ${Math.max(11, Math.min(16, size / 27))}px "DM Sans", sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        const shortText = option.length > 16 ? `${option.slice(0, 15)}…` : option;
        context.fillText(shortText, 0, 0, radius * 0.5);
        context.restore();
      }
    });

    context.beginPath();
    context.arc(center, center, Math.max(26, size * 0.075), 0, Math.PI * 2);
    context.fillStyle = "#FFF9ED";
    context.fill();
    context.lineWidth = 7;
    context.strokeStyle = "#16354f";
    context.stroke();
    context.beginPath();
    context.arc(center, center, Math.max(7, size * 0.02), 0, Math.PI * 2);
    context.fillStyle = "#F04B36";
    context.fill();
  }, [options]);

  useEffect(() => {
    drawWheel();
    const redraw = () => drawWheel();
    window.addEventListener("resize", redraw);
    return () => window.removeEventListener("resize", redraw);
  }, [drawWheel]);

  const parsedDraft = extractEntries(draft);
  const existingOptions = new Set(options.map((option) => option.toLocaleLowerCase()));
  const newEntries = parsedDraft.filter((entry) => !existingOptions.has(entry.toLocaleLowerCase()));
  const canAddCount = Math.min(newEntries.length, MAX_OPTIONS - options.length);

  function addOptions(event: FormEvent) {
    event.preventDefault();
    if (!canAddCount || isSpinning) return;
    setOptions((current) => [...current, ...newEntries.slice(0, MAX_OPTIONS - current.length)]);
    setDraft("");
    setWinner(null);
  }

  function addImportedEntries(entries: string[], fileName: string) {
    const currentEntries = new Set(options.map((option) => option.toLocaleLowerCase()));
    const newItems = entries.filter((entry) => !currentEntries.has(entry.toLocaleLowerCase()));
    const acceptedItems = newItems.slice(0, MAX_OPTIONS - options.length);

    if (!acceptedItems.length) {
      setImportMessage(options.length >= MAX_OPTIONS ? "Roda sudah mencapai batas 50 pilihan." : "Tidak ada pilihan baru di dalam berkas.");
      return;
    }

    setOptions((current) => [...current, ...acceptedItems]);
    setWinner(null);
    setImportMessage(`${acceptedItems.length} pilihan dari ${fileName} berhasil dimasukkan.`);
  }

  function handleFileImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || isSpinning) return;

    const extension = file.name.split(".").pop()?.toLocaleLowerCase();
    if (extension !== "txt" && extension !== "csv") {
      setImportMessage("Pilih berkas dengan format .txt atau .csv.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setImportMessage("Ukuran berkas terlalu besar. Pilih berkas maksimal 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      const entries = extension === "csv" ? extractCsvEntries(content) : extractEntries(content);
      addImportedEntries(entries, file.name);
    };
    reader.onerror = () => setImportMessage("Berkas tidak dapat dibaca. Coba pilih berkas lain.");
    reader.readAsText(file);
  }

  function removeOption(index: number) {
    if (isSpinning) return;
    setOptions((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setWinner(null);
  }

  function clearOptions() {
    if (isSpinning) return;
    setOptions([]);
    setWinner(null);
    setRotation(0);
    setImportMessage("");
  }

  function spinWheel() {
    if (isSpinning || options.length < 2) return;
    const winnerIndex = Math.floor(Math.random() * options.length);
    const slice = 360 / options.length;
    const destination = normalized(360 - (winnerIndex + 0.5) * slice);
    const current = normalized(rotation);
    const delta = normalized(destination - current);
    const nextRotation = rotation + 5 * 360 + delta;

    setWinner(null);
    setIsSpinning(true);
    setRotation(nextRotation);
    resultTimer.current = setTimeout(() => {
      setWinner({ name: options[winnerIndex], ticketNumber: winnerIndex + 1 });
      setIsSpinning(false);
    }, 4850);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF9ED] text-[#16354F]">
      <img className="pointer-events-none absolute -right-20 top-8 z-0 hidden w-[45rem] max-w-none opacity-70 lg:block" src={ASSETS.confetti} alt="" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-10 pt-5 sm:px-8 lg:px-12 lg:pb-12">
        <header className="flex items-center justify-between border-b-2 border-dashed border-[#16354F]/25 pb-5">
          <a href="#spin" className="group flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F04B36]">
            <img src={ASSETS.logo} alt="" className="h-11 w-11 transition-transform duration-200 group-hover:rotate-12" />
            <span className="leading-none">
              <span className="block font-serif text-2xl font-bold tracking-tight">Spin<span className="italic text-[#F04B36]">Wheel</span></span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-[#16354F]/65">Loket keputusan</span>
            </span>
          </a>
          <div className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#16354F]/60 sm:flex">
            <Sparkles className="h-4 w-4 text-[#F04B36]" />
            Pilihan jadi seru
          </div>
        </header>

        <section id="spin" className="grid items-start gap-8 pt-8 lg:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.84fr)] lg:gap-12">
          <div className="min-w-0">
            <div className="relative isolate min-h-[225px] overflow-hidden rounded-[2rem] border-[3px] border-[#16354F] bg-[#F6E8C5] px-6 pb-24 pt-7 shadow-[7px_7px_0_#16354F] sm:px-9 sm:pt-9">
              <div className="absolute inset-0 -z-10 bg-[url('/manus-storage/spinwheel-hero-poster_e0952194.jpg')] bg-cover bg-center opacity-95" aria-hidden="true" />
              <div className="absolute inset-0 -z-10 bg-[#FFF9ED]/20" aria-hidden="true" />
              <p className="mb-3 inline-flex rounded-full border-2 border-[#16354F] bg-[#FFF9ED] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em]">Keputusan kecil, drama besar</p>
              <h1 className="max-w-md font-serif text-4xl font-bold leading-[0.9] tracking-[-0.045em] sm:text-5xl">Biarkan roda yang <span className="text-[#F04B36] italic">menentukan.</span></h1>
              <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-[#16354F]/80">Masukkan pilihanmu sendiri, tekan putar, lalu terima kartu hasilnya.</p>
            </div>

            <div className="relative -mt-20 px-3 sm:-mt-24 sm:px-10">
              <div className="relative mx-auto aspect-square w-full max-w-[560px]">
                <div className="wheel-aura absolute inset-[3%] rounded-full bg-[#E8B843]/50 blur-2xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -top-2 left-1/2 z-30 -translate-x-1/2 drop-shadow-[0_4px_0_#16354F]" aria-hidden="true">
                  <div className="h-0 w-0 border-x-[25px] border-x-transparent border-t-[47px] border-t-[#F04B36] sm:border-x-[30px] sm:border-t-[54px]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-[#16354F] p-[10px] shadow-[10px_12px_0_rgba(22,53,79,0.22)] sm:p-[13px]">
                  <div className="h-full w-full overflow-hidden rounded-full bg-[#FFF9ED]">
                    <canvas ref={canvasRef} aria-label="Roda pilihan" role="img" className="h-full w-full will-change-transform" style={{ transform: `rotate(${rotation}deg)`, transition: isSpinning ? "transform 4.8s cubic-bezier(0.1, 0.75, 0.16, 1)" : "none" }} />
                  </div>
                </div>
                <span className="absolute left-[5%] top-[20%] h-3 w-3 rounded-full bg-[#E8B843] shadow-[0_0_0_4px_#FFF9ED]" aria-hidden="true" />
                <span className="absolute bottom-[15%] right-[4%] h-4 w-4 rounded-full bg-[#5F8668] shadow-[0_0_0_4px_#FFF9ED]" aria-hidden="true" />
              </div>

              <div className="mx-auto mt-5 max-w-[400px]">
                <Button onClick={spinWheel} disabled={isSpinning || options.length < 2} className="h-14 w-full rounded-2xl border-2 border-[#16354F] bg-[#F04B36] text-base font-extrabold uppercase tracking-[0.13em] text-white shadow-[5px_5px_0_#16354F] transition-transform duration-150 hover:bg-[#dc402d] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0_#16354F] disabled:cursor-not-allowed disabled:opacity-60">
                  {isSpinning ? "Roda lagi memilih…" : "Putar sekarang"}
                </Button>
                <p className="mt-3 text-center text-xs font-semibold text-[#16354F]/60">{options.length} pilihan di dalam roda · maksimal {MAX_OPTIONS}</p>
              </div>
            </div>
          </div>

          <aside className="relative mt-4 lg:mt-0">
            <div className="relative overflow-hidden rounded-[2rem] border-[3px] border-[#16354F] bg-white px-5 pb-6 pt-5 shadow-[8px_8px_0_#16354F] sm:px-7 sm:pb-7 sm:pt-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#F04B36]">Meja loket</p>
                  <h2 className="mt-1 font-serif text-3xl font-bold tracking-[-0.03em]">Masukkan pilihan</h2>
                  <p className="mt-1 text-xs font-bold text-[#16354F]/55">{options.length} / {MAX_OPTIONS} kupon terisi</p>
                </div>
                <button onClick={clearOptions} disabled={isSpinning || !options.length} type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-[#16354F]/50 text-[#16354F] transition-colors hover:border-[#F04B36] hover:bg-[#FFF3E9] hover:text-[#F04B36] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#F04B36] disabled:opacity-40" aria-label="Kosongkan semua pilihan" title="Kosongkan semua pilihan">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={addOptions}>
                <label className="sr-only" htmlFor="new-option">Daftar pilihan baru</label>
                <textarea id="new-option" value={draft} onChange={(event) => setDraft(event.target.value)} disabled={isSpinning || options.length >= MAX_OPTIONS} placeholder={"Tulis atau tempel daftar di sini.\nSatu baris = satu pilihan."} className="min-h-[106px] w-full resize-y rounded-xl border-2 border-[#16354F]/25 bg-[#FFF9ED] px-4 py-3 text-sm font-semibold leading-relaxed placeholder:text-[#16354F]/42 focus:border-[#F04B36] focus:outline-none disabled:opacity-60" />
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="flex min-w-0 items-center gap-1.5 text-[11px] font-bold leading-snug text-[#16354F]/60"><ClipboardPaste className="h-4 w-4 shrink-0 text-[#F04B36]" /> Satu baris akan dideteksi sebagai satu pilihan.</p>
                  <Button type="submit" disabled={isSpinning || !canAddCount || options.length >= MAX_OPTIONS} className="h-10 shrink-0 rounded-xl border-2 border-[#16354F] bg-[#E8B843] px-3 text-xs font-extrabold uppercase tracking-[0.07em] text-[#16354F] shadow-[3px_3px_0_#16354F] hover:bg-[#dca72f] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#16354F]">
                    <Plus className="h-4 w-4" /> Masukkan{canAddCount ? ` ${canAddCount}` : ""}
                  </Button>
                </div>
                {draft.trim() && !canAddCount ? <p className="mt-2 text-[11px] font-bold text-[#F04B36]">Tidak ada pilihan baru yang bisa dimasukkan.</p> : null}
              </form>

              <div className="mt-4 rounded-xl border-2 border-dashed border-[#16354F]/20 bg-[#FFFDF8] p-3">
                <input ref={fileInputRef} type="file" accept=".txt,.csv,text/plain,text/csv" onChange={handleFileImport} className="sr-only" aria-label="Impor pilihan dari berkas" />
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#16354F]">Punya daftar panjang?</p>
                    <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-[#16354F]/60">Impor .txt per baris atau .csv dari setiap sel.</p>
                  </div>
                  <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isSpinning || options.length >= MAX_OPTIONS} className="h-10 shrink-0 rounded-xl border-2 border-[#16354F] bg-white px-3 text-xs font-extrabold uppercase tracking-[0.06em] text-[#16354F] shadow-[3px_3px_0_#16354F] hover:bg-[#FFF3E9] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#16354F]">
                    <FileUp className="h-4 w-4" /> Impor file
                  </Button>
                </div>
                {importMessage ? <p aria-live="polite" className="mt-2 border-t border-dashed border-[#16354F]/20 pt-2 text-[11px] font-bold leading-snug text-[#F04B36]">{importMessage}</p> : null}
              </div>

              <div className="mt-5 max-h-[286px] space-y-2 overflow-y-auto pr-1">
                {options.length ? options.map((option, index) => (
                  <div key={`${option}-${index}`} className="group flex items-center gap-3 rounded-xl border-2 border-dashed border-[#16354F]/20 bg-[#FFFDF8] px-3 py-2.5 transition-colors hover:border-[#16354F]/45">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[#16354F] text-[11px] font-extrabold text-[#16354F]" style={{ backgroundColor: COLORS[index % COLORS.length] }}>{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-bold">{option}</span>
                    <button type="button" onClick={() => removeOption(index)} disabled={isSpinning} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#16354F]/45 transition-colors hover:bg-[#FDE5DD] hover:text-[#F04B36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F04B36] disabled:cursor-not-allowed disabled:opacity-25" aria-label={`Hapus ${option}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                )) : (
                  <div className="rounded-xl border-2 border-dashed border-[#16354F]/20 bg-[#FFFDF8] px-4 py-5 text-center">
                    <p className="font-serif text-lg font-bold">Belum ada kupon</p>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-[#16354F]/60">Tulis pilihanmu sendiri atau tempel banyak baris sekaligus di atas.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t-2 border-dashed border-[#16354F]/20 pt-5">
                {winner ? (
                  <div className="relative isolate overflow-hidden rounded-2xl border-2 border-[#16354F] bg-[#FFF3E9] p-5">
                    <img src={ASSETS.stamp} alt="" aria-hidden="true" className="pointer-events-none absolute -right-7 -top-5 -z-10 w-44 rotate-[-10deg] opacity-15" />
                    <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F04B36]"><Check className="h-4 w-4 rounded-full bg-[#F04B36] p-[2px] text-white" /> Kartu yang didapat</p>
                    <p className="mt-2 font-serif text-3xl font-bold leading-none tracking-[-0.035em]">{winner.name}</p>
                    <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-[#16354F]/20 pt-3 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#16354F]/60"><span>Kartu #{String(winner.ticketNumber).padStart(2, "0")}</span><span>Hasil resmi roda</span></div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#16354F] px-5 py-4 text-[#FFF9ED]">
                    <p className="font-serif text-xl font-bold">Kartu hasil menunggu</p>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-[#FFF9ED]/70">Tambahkan setidaknya dua pilihan, lalu putar roda untuk mendapatkan kartu.</p>
                  </div>
                )}
              </div>
            </div>
            <img src={ASSETS.tickets} alt="" aria-hidden="true" className="pointer-events-none mx-auto -mt-2 hidden w-72 rotate-[-2deg] sm:block" />
          </aside>
        </section>

        <footer className="mt-7 flex flex-col gap-2 border-t-2 border-dashed border-[#16354F]/20 pt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#16354F]/55 sm:mt-10 sm:flex-row sm:items-center sm:justify-between"><span>Satu putaran, satu keputusan</span><span>Pilihanmu tersimpan di perangkat ini</span></footer>
      </div>
    </main>
  );
}
