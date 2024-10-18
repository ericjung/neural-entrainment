/**
 * Play an isochronic tone at 40 Hz for stimulation. 40 Hz is 12.5 msecs on, then 12.5 of silence, repeated indefinitely.
 * Elapsed time is displayed every 30 seconds.
 * 
 * node isochronic-tone.js <frequency in Hz> <duration in minutes>
 * 
 * example execution:
 * node isochronic-tone.js    (200 Hz for Infinity)
 * node isochronic-tone.js 400 20    (400 Hz for 20 minutes)
 */

const Speaker = require('speaker');

const sampleRate = 44100;
const channels = 1;       // Mono audio
const bitDepth = 16;      // 16-bit audio
const duration = 0.0125;  // 12.5 milliseconds

// Get frequency from command-line argument or default to 200 Hz
const frequency = parseFloat(process.argv[2]) || 200;

// Get duration (in minutes) from command-line argument or default to Infinity (no stop)
const durationMinutes = parseFloat(process.argv[3]) || Infinity;

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

// Write to the speaker continuously. Speaker can be closed at any time so check it's state first.
let isPlaying = true;
function playLoop() {
    if (!isPlaying) {
        return;
    }
    if (!speaker.closed) {
        speaker.write(toneBuffer, () => {
            // After tone, write silence
            if (!speaker.closed) {
                speaker.write(silenceBuffer, playLoop); // Play silence, then repeat
            }
        });
    }
}

// Display elapsed time every _interval_ seconds so we know how long we've been listening and how much remains
const interval = 30000;
let elapsedSeconds = 0;
const timerId = setInterval(() => {
    elapsedSeconds += interval / 1000;
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = Math.floor(elapsedSeconds % 60);
    const remainingSeconds = (durationMinutes * 60) - elapsedSeconds;
    const remainingMinutes = Math.floor(remainingSeconds / 60);
    const remainingSecondsInMinute = Math.floor(remainingSeconds % 60);

    console.log(`Elapsed time: ${minutes} minute(s) and ${seconds} second(s) | Remaining time: ${remainingMinutes} minute(s) and ${remainingSecondsInMinute} second(s) | Total duration: ${durationMinutes} minute(s)`);
}, interval);

// Optionally stop playback after x minutes
if (durationMinutes !== Infinity) {
    setTimeout(() => {
        stopPlayback();
    }, durationMinutes * 60 * 1000);
}

function stopPlayback() {
    console.log(`Stopping playback after ${durationMinutes} minute(s).`);
    isPlaying = false;
    clearInterval(timerId);
    speaker.end();
}

playLoop(); // start!
