import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { CopyTextButton } from '../components/CopyTextButton';
let host:HTMLDivElement; let root:Root;
beforeEach(()=>{ Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true}); host=document.createElement('div'); document.body.append(host); root=createRoot(host); });
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.unstubAllGlobals();});
async function render(text='Complete answer\n\nResources: https://example.org') {await act(async()=>root.render(<CopyTextButton text={text} />));}
async function click() {await act(async()=>host.querySelector('button')!.click());}
it('copies the exact current text and reports success beside the button',async()=>{
  const write=vi.fn().mockResolvedValue(undefined);vi.stubGlobal('navigator',{clipboard:{writeText:write}});
  await render(); await click(); expect(write).toHaveBeenCalledWith('Complete answer\n\nResources: https://example.org');
  expect(host.querySelector('button')?.textContent).toBe('Copied'); expect(host.querySelector('[role="status"]')?.textContent).toContain('Copied to clipboard');
  await render('Updated answer'); expect(host.querySelector('button')?.textContent).toBe('Copy answer'); await click(); expect(write).toHaveBeenLastCalledWith('Updated answer');
});
it.each([false,true])('provides selectable exact text when clipboard is missing or denied: %s',async denied=>{
  vi.stubGlobal('navigator',denied ? {clipboard:{writeText:vi.fn().mockRejectedValue(new Error('denied'))}} : {});
  await render(); await click(); const field=host.querySelector('textarea')!;
  expect(field.readOnly).toBe(true);expect(field.value).toContain('https://example.org');expect(document.activeElement).toBe(field);
  expect(field.selectionStart).toBe(0); expect(field.selectionEnd).toBe(field.value.length);
  expect(host.querySelector('[role="status"]')?.textContent).toContain('unavailable');expect(host.querySelector('button')?.textContent).not.toBe('Copied');
});
