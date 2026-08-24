/**
 * Kios Keberuntungan: roda adalah pusat panggung; detail bergaya nota undian
 * dengan koral tomat, biru tinta, kertas krem, dan tipografi editorial.
 */
import { Button } from "@/components/ui/button";
import { Check, Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

const COLORS = ["#F04B36", "#1E4668", "#E8B843", "#5F8668", "#EA8A6D", "#577691", "#C96E85", "#97A56C"];
const DEFAULT_OPTIONS = ["Nasi goreng", "Sate ayam", "Kwetiau", "Salad buah", "Seblak", "Bubur ayam"];
const STORAGE_KEY = "spinwheel-mini-options";

const ASSETS = {
  logo: "/manus-storage/spinwheel-logo_3dfdb099.png",
  confetti: "/manus-storage/spinwheel-confetti_ab55187f.png",
  stamp: "/manus-storage/spinwheel-stamp-winner_7d11795a.png",
  tickets: "/manus-storage/spinwheel-ticket-strip_354222d9.png",
};

function normalized(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}

export default function Home() {
  const [options, setOptions] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_OPTIONS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length >= 2 ? parsed : DEFAULT_OPTIONS;
    } catch {
      return DEFAULT_OPTIONS;
    }
  });
  const [draft, setDraft] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    if (!canvas || options.length < 2) return;
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

      context.save();
      context.translate(center + Math.cos(mid) * radius * 0.6, center + Math.sin(mid) * radius * 0.6);
      context.rotate(mid + Math.PI / 2);
      context.fillStyle = index % COLORS.length === 2 ? "#16354f" : "#FFF9ED";
      context.font = `700 ${Math.max(11, Math.min(16, size / 27))}px DM Sans, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      const shortText = option.length > 16 ? `${option.slice(0, 15)}…` : option;
      context.fillText(shortText, 0, 0, radius * 0.5);
      context.restore();
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

  function addOption(event: FormEvent) {
    event.preventDefault();
    const value = draft.trim();
    if (!value || options.length >= 12 || options.some((option) => option.toLowerCase() === value.toLowerCase())) return;
    setOptions((current) => [...current, value]);
    setDraft("");
    setWinner(null);
  }

  function removeOption(index: number) {
    if (options.length <= 2 || isSpinning) return;
    setOptions((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setWinner(null);
  }

  function resetOptions() {
    if (isSpinning) return;
    setOptions(DEFAULT_OPTIONS);
    setWinner(null);
    setRotation(0);
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
      setWinner(options[winnerIndex]);
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
              <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-[#16354F]/80">Masukkan pilihan, tekan putar, lalu terima hasilnya. Tanpa rapat. Tanpa debat.</p>
            </div>

            <div className="relative -mt-20 px-3 sm:-mt-24 sm:px-10">
              <div className="relative mx-auto aspect-square w-full max-w-[560px]">
                <div className="wheel-aura absolute inset-[3%] rounded-full bg-[#E8B843]/50 blur-2xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -top-2 left-1/2 z-30 -translate-x-1/2 drop-shadow-[0_4px_0_#16354F]" aria-hidden="true">
                  <div className="h-0 w-0 border-x-[25px] border-x-transparent border-t-[47px] border-t-[#F04B36] sm:border-x-[30px] sm:border-t-[54px]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-[#16354F] p-[10px] shadow-[10px_12px_0_rgba(22,53,79,0.22)] sm:p-[13px]">
                  <div className="h-full w-full overflow-hidden rounded-full bg-[#FFF9ED]">
                    <canvas
                      ref={canvasRef}
                      aria-label="Roda pilihan"
                      role="img"
                      className="h-full w-full will-change-transform"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning ? "transform 4.8s cubic-bezier(0.1, 0.75, 0.16, 1)" : "none",
                      }}
                    />
                  </div>
                </div>
                <span className="absolute left-[5%] top-[20%] h-3 w-3 rounded-full bg-[#E8B843] shadow-[0_0_0_4px_#FFF9ED]" aria-hidden="true" />
                <span className="absolute bottom-[15%] right-[4%] h-4 w-4 rounded-full bg-[#5F8668] shadow-[0_0_0_4px_#FFF9ED]" aria-hidden="true" />
              </div>

              <div className="mx-auto mt-5 max-w-[400px]">
                <Button onClick={spinWheel} disabled={isSpinning || options.length < 2} className="h-14 w-full rounded-2xl border-2 border-[#16354F] bg-[#F04B36] text-base font-extrabold uppercase tracking-[0.13em] text-white shadow-[5px_5px_0_#16354F] transition-transform duration-150 hover:bg-[#dc402d] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0_#16354F] disabled:cursor-not-allowed disabled:opacity-60">
                  {isSpinning ? "Roda lagi memilih…" : "Putar sekarang"}
                </Button>
                <p className="mt-3 text-center text-xs font-semibold text-[#16354F]/60">{options.length} pilihan di dalam roda · maksimal 12</p>
              </div>
            </div>
          </div>

          <aside className="relative mt-4 lg:mt-0">
            <div className="relative overflow-hidden rounded-[2rem] border-[3px] border-[#16354F] bg-white px-5 pb-6 pt-5 shadow-[8px_8px_0_#16354F] sm:px-7 sm:pb-7 sm:pt-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#F04B36]">Meja loket</p>
                  <h2 className="mt-1 font-serif text-3xl font-bold tracking-[-0.03em]">Masukkan kupon</h2>
                </div>
                <button onClick={resetOptions} disabled={isSpinning} type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-[#16354F]/50 text-[#16354F] transition-colors hover:border-[#F04B36] hover:bg-[#FFF3E9] hover:text-[#F04B36] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#F04B36] disabled:opacity-40" aria-label="Kembalikan pilihan awal" title="Kembalikan pilihan awal">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={addOption} className="flex gap-2">
                <label className="sr-only" htmlFor="new-option">Pilihan baru</label>
                <input
                  id="new-option"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={isSpinning || options.length >= 12}
                  maxLength={28}
                  placeholder="Contoh: martabak manis"
                  className="h-12 min-w-0 flex-1 rounded-xl border-2 border-[#16354F]/25 bg-[#FFF9ED] px-4 text-sm font-semibold placeholder:text-[#16354F]/42 focus:border-[#F04B36] focus:outline-none disabled:opacity-60"
                />
                <Button type="submit" disabled={isSpinning || !draft.trim() || options.length >= 12} className="h-12 shrink-0 rounded-xl border-2 border-[#16354F] bg-[#E8B843] px-4 text-[#16354F] shadow-[3px_3px_0_#16354F] hover:bg-[#dca72f] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#16354F]">
                  <Plus className="h-5 w-5" /><span className="sr-only">Tambah</span>
                </Button>
              </form>

              <div className="mt-5 max-h-[286px] space-y-2 overflow-y-auto pr-1">
                {options.map((option, index) => (
                  <div key={`${option}-${index}`} className="group flex items-center gap-3 rounded-xl border-2 border-dashed border-[#16354F]/20 bg-[#FFFDF8] px-3 py-2.5 transition-colors hover:border-[#16354F]/45">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[#16354F] text-[11px] font-extrabold text-[#16354F]" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-bold">{option}</span>
                    <button type="button" onClick={() => removeOption(index)} disabled={isSpinning || options.length <= 2} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#16354F]/45 transition-colors hover:bg-[#FDE5DD] hover:text-[#F04B36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F04B36] disabled:cursor-not-allowed disabled:opacity-25" aria-label={`Hapus ${option}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t-2 border-dashed border-[#16354F]/20 pt-5">
                {winner ? (
                  <div className="relative isolate overflow-hidden rounded-2xl border-2 border-[#16354F] bg-[#FFF3E9] p-5">
                    <img src={ASSETS.stamp} alt="" aria-hidden="true" className="pointer-events-none absolute -right-7 -top-5 -z-10 w-44 rotate-[-10deg] opacity-15" />
                    <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F04B36]"><Check className="h-4 w-4 rounded-full bg-[#F04B36] p-[2px] text-white" /> Hasil roda</p>
                    <p className="mt-2 font-serif text-3xl font-bold leading-none tracking-[-0.035em]">{winner}</p>
                    <p className="mt-3 text-xs font-semibold text-[#16354F]/65">Keputusan resmi dari roda. Tidak menerima banding.</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#16354F] px-5 py-4 text-[#FFF9ED]">
                    <p className="font-serif text-xl font-bold">Siap diundi?</p>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-[#FFF9ED]/70">Hasil pilihan akan muncul di sini setelah roda berhenti.</p>
                  </div>
                )}
              </div>
            </div>
            <img src={ASSETS.tickets} alt="" aria-hidden="true" className="pointer-events-none mx-auto -mt-2 hidden w-72 rotate-[-2deg] sm:block" />
          </aside>
        </section>

        <footer className="mt-7 flex flex-col gap-2 border-t-2 border-dashed border-[#16354F]/20 pt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#16354F]/55 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <span>Satu putaran, satu keputusan</span>
          <span>Pilihanmu tersimpan di perangkat ini</span>
        </footer>
      </div>
    </main>
  );
}
