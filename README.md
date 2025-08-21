# neural-entrainment

2025-08-21: do not use this repo. it is still in tests. it currently outputs slightly more than 40Hz.

A collection of [neural brainwave entrainment](https://en.wikipedia.org/wiki/Brainwave_entrainment) code. I'll be adding to this more over time. After [installing node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs), clone this directory locally then:


## isochronic tone: output to speaker

Play an isochronic tone at 40 Hz for stimulation for `x` minutes. 40 Hz is 12.5 msecs of audible playback, then 12.5 of silence, repeated indefinitely. Elapsed time and remaining time is displayed every 30 seconds.

```
npm install
node isochronic-tone.js <frequency> <durationMinutes>
```

`frequency`: optional, specifies the tone frequency. 200 Hz is the default. 400 Hz also seems to sound good; of course, this is subjective. Play with different values for one that you like.

`durationMinutes`:  optional, specifies the duration in minutes after which play stops. Default is infinity.

### Example Execution

```
node isochronic-tone.js 200 2
Elapsed time: 0 minute(s) and 30 second(s) | Remaining time: 1 minute(s) and 30 second(s) | Total duration: 2 minute(s)
Elapsed time: 1 minute(s) and 0 second(s) | Remaining time: 1 minute(s) and 0 second(s) | Total duration: 2 minute(s)
Elapsed time: 1 minute(s) and 30 second(s) | Remaining time: 0 minute(s) and 30 second(s) | Total duration: 2 minute(s)
Stopping playback after 2 minute(s).
```

Note: 2 minutes doesn't do anything for me. Try 20 minutes!

## isochronic tone: output written to file

Write to a file an isochronic tone at 40 Hz for stimulation. 40 Hz is 12.5 msecs of audible playback, then 12.5 of silence, repeated indefinitely.

```
npm install
node isochronic-tone-write-to-file.js <frequency in Hz> <duration in minutes> <filename>
```

`frequency`: optional, specifies the tone frequency. 200 Hz is the default. 400 Hz also seems to sound good; of course, this is subjective. Play with different values for one that you like.

`durationMinutes`:  optional, specifies the duration in minutes for the recording. Default is 20.

`filename`: optional, specifies the filename to be created with an optional directory prefix. Default is `output.wav` in the current directory

### Example Execution
```
node isochronic-tone-write-to-file.js    (200 Hz for 20 minutes written to ./output.wav)
node isochronic-tone.js 400 30 /tmp/sardines.wav    (400 Hz for 30 minutes written to /tmp/sardines.wav)
```
