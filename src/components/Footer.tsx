/**
 * Image footer — the deep-space astronaut render is the final element
 * of the site. Nothing renders after it.
 */
export default function Footer() {
  return (
    <footer className="relative w-full bg-black leading-none">
      <img
        src="/images/footer-space.png"
        alt="Astronaut in ATHER EVA suit floating above Earth with the Moon in the distance"
        className="block w-full h-auto min-h-[320px] object-cover object-center"
      />
      {/* Subtle brand line over the bottom of the image */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-between gap-2 px-6 md:px-12 py-4 bg-gradient-to-t from-black/70 to-transparent">
        <span className="text-white font-semibold tracking-[0.25em] text-xs uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
          ATHER
        </span>
        <span className="text-[9px] font-mono tracking-widest text-zinc-300 uppercase text-center">
          © 2026 ATHER SYSTEM ARCHITECTURE • ORBITAL GRADE
        </span>
      </div>
    </footer>
  );
}
