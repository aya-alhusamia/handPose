import { useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam';
import { drawHand } from './utilities';
//Style 
import './App.css';


function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const runHandpose = async () => {
    const net = await handpose.load()
    console.log('Handpose model loaded');
    // Loop and detect hands
    setInterval(() => {
      detect(net)
    }, 100)
  }

  const detect = async (net) => {
    // Chech data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4) {
      // Get video properties
      const video = webcamRef.current.video // get a video from webcamra
      const videoWidth = webcamRef.current.video.videoWidth // grabbing the width of our video from our webcam
      const videoHeight = webcamRef.current.video.videoHeight // grabbing the hieght of our video from our webcam 

      // Set video height and width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // Set canvas height and width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      // Make Detections
      const hand = await net.estimateHands(video)
      console.log(hand);
      // Draw mash
      const ctx = canvasRef.current.getContext('2d')
      drawHand(hand, ctx)
    }

  }

  runHandpose()
  return (
    <div className="App">
      <header className='App-header'>
        <Webcam className='webcam' ref={webcamRef} />
        <canvas className='canvas' ref={canvasRef} />
      </header>
    </div>
  );
}

export default App;
