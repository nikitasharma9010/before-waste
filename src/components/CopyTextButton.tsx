import { useEffect, useRef, useState } from 'react';

export function CopyTextButton({ text, label = 'Copy answer' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'copying' | 'copied' | 'manual'>('idle');
  const field = useRef<HTMLTextAreaElement>(null);
  const version = useRef(0);
  useEffect(() => { version.current++; setState('idle'); }, [text]);
  useEffect(() => { if (state === 'manual') { field.current?.focus(); field.current?.select(); } }, [state]);
  async function copy() {
    const attempt = version.current;
    setState('copying');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Unavailable');
      await navigator.clipboard.writeText(text);
      if (version.current === attempt) setState('copied');
    } catch { if (version.current === attempt) setState('manual'); }
  }
  return <div className="min-w-0">
    <button type="button" disabled={!text.trim() || state === 'copying'} onClick={() => void copy()} className="min-h-[44px] rounded-xl border border-forest/40 px-4 py-3 font-semibold text-forest hover:bg-sage disabled:opacity-60">{state === 'copied' ? 'Copied' : state === 'copying' ? 'Copying…' : label}</button>
    <p role="status" aria-live="polite" className="mt-1 text-sm">{state === 'copied' ? 'Copied to clipboard.' : state === 'manual' ? 'Automatic copying is unavailable. The text below is selected; use your device’s Copy command.' : ''}</p>
    {state === 'manual' && <label className="mt-2 block text-sm font-semibold">Text to copy<textarea ref={field} readOnly rows={5} value={text} className="mt-2 block w-full min-w-0 rounded-xl border border-ink/25 bg-paper p-3 text-base font-normal" onFocus={event => event.target.select()} /></label>}
  </div>;
}
