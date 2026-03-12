'use client';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark text-white">
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" x="4" y="4" fill="white" opacity="0.3" />
              <rect width="8" height="8" x="28" y="28" fill="white" opacity="0.2" />
              <rect width="6" height="6" x="20" y="8" fill="white" opacity="0.15" />
              <rect width="4" height="4" x="8" y="24" fill="white" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 text-center sm:py-16">
        <p className="mb-2 text-sm font-medium tracking-widest uppercase opacity-80">
          April 20–24, 2026 &middot; Durham & Raleigh
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          RDSW Session Selector
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg opacity-90 sm:text-xl">
          Build your perfect Startup Week schedule. Pick your vibe, find your sessions, register in one click.
        </p>
      </div>
    </header>
  );
}
