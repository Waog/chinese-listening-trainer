import { audioTts } from './audio-tts.js';

describe('audioTts', () => {
  it('should work', () => {
    expect(audioTts()).toEqual('audio-tts');
  });
});
