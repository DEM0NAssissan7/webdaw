/* Audio Engine */

const audioContext = new AudioContext();
const output = audioContext.destination;


// get the audio element
const audioElement = document.querySelector("audio");

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);
track.crossOrigin = "anonymous";

const gainNode = audioContext.createGain();
gainNode.gain.value = 1;
// track.connect(gainNode).connect(audioContext.destination);

const pannerOptions = { pan: 0 };
const panner = new StereoPannerNode(audioContext, pannerOptions);
track.connect(gainNode).connect(panner).connect(output);

function get_output_latency() {
    return audioContext.outputLatency; // Useful for accurate recording with bluetooth devices
}
function get_base_latency() {
    return audioContext.baseLatency; // Useful for measuring system performance
}

function play_file(file) {
    if (!file) {
        console.error("No file provided for playback.");
        return;
    }

    // Read the file as an ArrayBuffer for decoding
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const arrayBuffer = e.target.result;
            
            // Decode the audio data
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);


            // Create a new audio source and connect it to the context
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);

            // Play the audio
            source.start();

            console.log(`Playing: ${file.name}`);
        } catch (err) {
            console.error("Error decoding or playing audio:", err);
        }
    };

    reader.onerror = () => {
        console.error("Error reading the file:", reader.error);
    };

    // Read the file
    reader.readAsArrayBuffer(file);
}

// Function to handle imported files
function handle_import(files) {
    if (files.length === 0) {
        console.warn("No files selected.");
        return;
    }

    console.log("Imported files:", files);

    // Optionally, you can choose what to do with all files. Here, we play the first one.
    play_file(files[0]);
}

// Function to prompt the user to import files
function prompt_import() {
    // Create a file input element dynamically
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ".wav, .mp3, .aiff, .ogg, .flac, .m4a, .opus, .aac"; // Allowed file types
    input.multiple = true; // Allow multiple file selection

    // Set up the onchange event to handle file selection
    input.onchange = e => {
        handle_import(e.target.files); // Pass the selected files to the handler
    };

    // Trigger the file picker dialog
    input.click();
}



let playing = false;
function pause_play() {
    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    if (!playing) {
        audioElement.play();
        playing = true;
    }
    else {
        audioElement.pause();
        playing = false;
    }
}

function panic() {
    audioContext.suspend();
}