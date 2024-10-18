# neural-entrainment

A collection of neural brainwave entrainment code. I'll be adding to this more over time.

After installing node, clone this directory locally then:


## isochronic-tone.js

Play an isochronic tone at 40 Hz for stimulation. 40 Hz is 12.5 msecs on, then 12.5 of silence, repeated indefinitely. Elapsed time is displayed every 30 seconds.

```
npm install
node isochronic-tone.js <frequency>

<frequency> is an optional command-line argument specifying the tone frequency. 200 Hz is the default if not specified. 400 Hz also seems to sound good; of course, this is subjective. Play with different values for one that you like.
