import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TestMic = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser doesn’t support speech recognition.</p>;
  }

  return (
    <div>
      <h2>Mic: {listening ? '🎤 Listening' : '🛑 Stopped'}</h2>
      <button onClick={() => SpeechRecognition.startListening({ continuous: true })}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default TestMic;
