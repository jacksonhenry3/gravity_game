// set up for audio playback
try {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	context = new AudioContext();
}
catch(e) {
	alert("Sorry, your browser doesn't support the magic of web audio \n try the latest firefox or chrome");
}

// Utility functions for playing notes

function midiToFreq(midi) {
	return 440 * Math.pow(2, (midi-69)/12)
}

function freqToMidi(freq) {
	return (Math.log(freq/440) / Math.LN2) * 12 + 69
}

// Sets up audio apparatus

var gainNode = context.createGain();
gainNode.gain.value = 0;
// create Oscillator node
var oscillator = context.createOscillator();

oscillator.type = 'square';
// oscillator.frequency.value = 300; // value in hertz
oscillator.start();
oscillator.connect(gainNode)


gainNode.connect(context.destination)
// gainNode.connect(rangeAnalyser1.input)
