export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-white mt-16 pb-20 sm:pb-8">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <p className="text-sm text-muted">
          Built for{' '}
          <a
            href="https://www.raleighdurhamstartupweek.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Raleigh-Durham Startup Week 2026
          </a>
        </p>
        <p className="mt-1 text-xs text-muted/60">
          Session data from{' '}
          <a
            href="https://luma.com/raleighdurhamstartupweek"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Luma
          </a>
          {' · '}Auto-updates hourly
        </p>
      </div>
    </footer>
  );
}
