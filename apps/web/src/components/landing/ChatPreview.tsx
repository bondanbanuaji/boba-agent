import { CHAT_PREVIEW_MESSAGES } from '@/lib/landing-data';
import { clsx } from 'clsx';

export function ChatPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="section-label mb-4">Preview</h2>
          <p className="font-chat mb-6 text-3xl font-bold text-[var(--text-primary)]">
            Lebih natural, kayak ngobrol sama asisten beneran.
          </p>
          <p className="text-lg text-[var(--text-muted)]">
            BobaAgent paham bahasa gaul, konteks pekerjaan, dan terintegrasi langsung dengan alat kerja kamu.
          </p>
        </div>
        
        <div className="rounded-2xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-col gap-4">
            {CHAT_PREVIEW_MESSAGES.map((msg, i) => (
              <div
                key={i}
                className={clsx(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === 'user'
                    ? "self-end bg-[var(--user-bubble)] text-[var(--user-text)]"
                    : "self-start bg-[var(--sidebar)] text-[var(--text-primary)]"
                )}
              >
                <p className="font-chat">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
