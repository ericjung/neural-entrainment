/**
 * Play an isochronic tone at 40 Hz for stimulation
 * 
 * Example execution:
 * 
 * node isochronic-tone.js 400
 * or to default to 200 Hz:
 * node node isochronic-tone.js
 */

const Speaker = require('speaker');

const sampleRate = 44100;
const channels = 1;       // Mono audio
const bitDepth = 16;      // 16-bit audio
const duration = 0.0125;  // 12.5 milliseconds

// Get frequency from command-line argument or default to 200 Hz
const frequency = parseFloat(process.argv[2]) || 200;

// Number of samples for 12.5 ms
const numSamples = Math.floor(sampleRate * duration);

// Create a Speaker instance to play raw PCM data
const speaker = new Speaker({
    channels: channels,
    bitDepth: bitDepth,
    sampleRate: sampleRate
});

// Generate a sine wave at _frequency_ Hz for 12.5 ms
function generateTone() {
    const buffer = Buffer.alloc(numSamples * 2); // 16-bit samples (2 bytes per sample)

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        // Generate the sine wave sample
        const amplitude = Math.sin(2 * Math.PI * frequency * t);
        // Convert to 16-bit integer (-32767 to 32767)
        const sample = Math.floor(amplitude * 32767);
        buffer.writeInt16LE(sample, i * 2);
    }

    return buffer;
}

// Generate silence for 12.5 ms (16-bit samples of zero)
function generateSilence() {
    return Buffer.alloc(numSamples * 2); // Silence is zeros in the buffer
}

// Create the buffers once and only once. We could hit buffer underflows
// if we generate them repeatedly in the play loop.
const toneBuffer = generateTone(), silenceBuffer = generateSilence();

// Write to the speaker continuously
function playLoop() {
    // Tone
    speaker.write(toneBuffer, () => {
        // After tone, write silence
        speaker.write(silenceBuffer, playLoop); // Play silence, then repeat
    });
}

playLoop();

// Display elapsed time every minute so we know how long we've been listening
let elapsedSeconds = 0;

setInterval(() => {
    elapsedSeconds += 30;
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    console.log(`Elapsed time: ${minutes} minute(s) and ${seconds} second(s)`);
}, 30000);
