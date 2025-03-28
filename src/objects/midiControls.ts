export let midi: MIDIAccess; // global MIDIAccess object
function onMIDISuccess(midiAccess: MIDIAccess) {
  console.log("MIDI ready!");
  midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
  listInputsAndOutputs(midi);
}

function onMIDIFailure(msg: string) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

export async function getMidiAccess() {
  return navigator.requestMIDIAccess();
}

function listInputsAndOutputs(midiAccess: MIDIAccess) {
  for (const entry of midiAccess.inputs) {
    const input = entry[1];
    console.log(
      `Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`
    );
  }

  for (const entry of midiAccess.outputs) {
    const output = entry[1];
    console.log(
      `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`
    );
  }
}

getMidiAccess().then(onMIDISuccess, onMIDIFailure);

export function registerMidiEvent(fun: (e: MIDIMessageEvent) => void) {
  console.log("Registered MIDI event");
  midi.inputs.forEach((input) => {
    input.onmidimessage = fun;
  });
}
