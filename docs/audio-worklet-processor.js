/**
 * AudioWorkletProcessor - processes audio frames in real-time
 */

class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.frameSize = options.processorOptions?.frameSize || 1024;
    this.buffer = new Float32Array(this.frameSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    const inputChannel = input[0];
    
    // Fill buffer
    for (let i = 0; i < inputChannel.length; i++) {
      this.buffer[this.bufferIndex] = inputChannel[i];
      this.bufferIndex++;
      
      // When buffer is full, send frame
      if (this.bufferIndex >= this.frameSize) {
        // Send frame to main thread
        this.port.postMessage({
          type: 'frame',
          audioData: new Float32Array(this.buffer)
        });
        
        // Reset buffer
        this.bufferIndex = 0;
      }
    }
    
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor); 