/**
 * Audio Processor - handles AudioWorklet and audio capture
 */

export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: AudioWorkletNode | null = null;
  private stream: MediaStream | null = null;
  private onFrameCallback: ((audioData: Float32Array) => void) | null = null;

  async initialize(): Promise<void> {
    try {
      // Get microphone permission
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      // Create audio context
      this.audioContext = new AudioContext({
        sampleRate: 16000,
        latencyHint: 'interactive'
      });

      // Create source node
      this.source = this.audioContext.createMediaStreamSource(this.stream);

      // Load and register worklet
      await this.audioContext.audioWorklet.addModule('/silli-meter/audio-worklet-processor.js');

      // Create processor node
      this.processor = new AudioWorkletNode(this.audioContext, 'audio-processor', {
        numberOfInputs: 1,
        numberOfOutputs: 1, // Changed from 0 to 1
        processorOptions: {
          frameSize: 1024
        }
      });

      // Handle messages from worklet
      this.processor.port.onmessage = (event) => {
        if (event.data.type === 'frame' && this.onFrameCallback) {
          this.onFrameCallback(event.data.audioData);
        }
      };

      // Connect nodes
      this.source.connect(this.processor);
      // Don't connect to destination to avoid feedback
      // this.processor.connect(this.audioContext.destination);

    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  start(callback: (audioData: Float32Array) => void): void {
    this.onFrameCallback = callback;
    
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  stop(): void {
    this.onFrameCallback = null;
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
} 