/**
 * Write an isochronic tone at 40 Hz for stimulation. 40 Hz is 12.5 msecs on, then 12.5 of silence, repeated indefinitely.
 * 
 * node isochronic-tone-write-to-file.js <frequency in Hz> <duration in minutes> <filename>
 * 
 * All arguments are optional. Defaults are:
 * 
 * frequency: 200 Hz
 * duration in minutes: 20
 * filename: out.wav in the current directory
 * 
 * example execution:
 * node isochronic-tone-write-to-file.js    (200 Hz for 20 minutes written to ./out.wav)
 * node isochronic-tone.js 400 5 /tmp/output.wav    (400 Hz for 5 minutes written to /tmp/output.wav)
 */

const fs = require('fs');
const toneGenerator = require('tonegenerator');
const waveHeader = require('waveheader');

const sampleRate = 44100;

function generateAlernatingToneThenSilenceBuffer(toneFrequency, durationInMinutes) {
    const toneDuration = 0.0125, silenceDuration = 0.0125; // 12.5 milliseconds each
    const durationInSeconds = durationInMinutes * 60;
    const totalSamples = Math.floor(sampleRate * durationInSeconds);
    const buffer = Buffer.alloc(totalSamples * 2); // 16-bit audio (2 bytes per sample)
    const samplesPerTone = Math.floor(sampleRate * toneDuration);
    const samplesPerSilence = Math.floor(sampleRate * silenceDuration);
    let offset = 0;

    while (offset < totalSamples) {
        const toneData = toneGenerator({
            freq: toneFrequency,
            lengthInSecs: toneDuration,
            volume: 15, // Volume level (0-100)
            rate: sampleRate,
            shape: 'sine',
            Int16Array: false
        });

        Buffer.from(toneData).copy(buffer, offset * 2); // Copy tone to buffer
        offset += samplesPerTone;

        const silenceBuffer = Buffer.alloc(samplesPerSilence * 2);
        silenceBuffer.copy(buffer, offset * 2); // Copy silence to buffer
        offset += samplesPerSilence;
    }
    return buffer;
}
function createWavFile(frequency, durationInMinutes, filename) {
    const toneBuffer = generateAlernatingToneThenSilenceBuffer(frequency, durationInMinutes);

    // Create a WAV header
    const wavHeaderInfo = {
        numChannels: 1, // mono
        sampleRate: sampleRate,
        byteRate: sampleRate * 2, // 16 bits = 2 bytes
        bitsPerSample: 16,
        dataLength: toneBuffer.length,
    };
    const wavHeaderBuffer = waveHeader(wavHeaderInfo);
    const wavFile = Buffer.concat([wavHeaderBuffer, toneBuffer]);
    fs.writeFileSync(filename, wavFile);
    console.log('WAV file created: ' + filename);
}

// Get frequency from command-line argument or default to 200 Hz
const frequency = parseFloat(process.argv[2]) || 200;

// Get duration (in minutes) from command-line argument or default to 20 minutes
const durationMinutes = parseFloat(process.argv[3]) || 20;
if (isNaN(durationMinutes) || durationMinutes <= 0) {
    console.error('Invalid duration. Please provide a positive number in minutes.');
    process.exit(1);
}

createWavFile(frequency, durationMinutes, process.argv[4] || 'output.wav');
