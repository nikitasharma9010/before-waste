import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { readStoryProgress, writeStoryProgress, STORY_PROGRESS_KEY } from '../utils/storyProgress';
beforeEach(()=>sessionStorage.clear());
afterEach(()=>vi.restoreAllMocks());
it('validates saved story positions before resuming',()=>{
  for (const value of ['bad json',JSON.stringify({id:'unknown',stage:0}),JSON.stringify({id:'tshirt',stage:5}),JSON.stringify({id:'tshirt',stage:-1})]) {
    sessionStorage.setItem(STORY_PROGRESS_KEY,value);
    expect(readStoryProgress()).toEqual({id:'tshirt',stage:0});
  }
  writeStoryProgress('food',4); expect(readStoryProgress()).toEqual({id:'food',stage:4});
});
it('continues to work when tab storage is blocked',()=>{
  vi.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new Error('blocked');});
  vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked');});
  expect(readStoryProgress()).toEqual({id:'tshirt',stage:0});
  expect(()=>writeStoryProgress('food',3)).not.toThrow();
});
