import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';
import { useEffect, useState } from 'react'
import "./index.css"


// model just you real need  
const modelPath = './need-model';

const minScore = 0.2; // minimum score
const maxResults = 5; // maximum number of results to return
let optionsSSDMobileNet;

function App() {

  useEffect(() => {
    main()
  }, [])


  const main = async () => {
    // default is webgl backend
    await faceapi.tf.setBackend('webgl');
    await faceapi.tf.ready();

    // tfjs optimizations
    if (faceapi.tf?.env().flagRegistry.CANVAS2D_WILL_READ_FREQUENTLY) faceapi.tf.env().set('CANVAS2D_WILL_READ_FREQUENTLY', true);
    if (faceapi.tf?.env().flagRegistry.WEBGL_EXP_CONV) faceapi.tf.env().set('WEBGL_EXP_CONV', true);
    if (faceapi.tf?.env().flagRegistry.WEBGL_EXP_CONV) faceapi.tf.env().set('WEBGL_EXP_CONV', true);


    await setupFaceAPI();
    await setupCamera();
  }

  const setupFaceAPI = async () => {
    await faceapi.nets.ssdMobilenetv1.load(modelPath);
    // await faceapi.nets.ageGenderNet.load(modelPath);
    // await faceapi.nets.faceLandmark68Net.load(modelPath);
    // await faceapi.nets.faceRecognitionNet.load(modelPath);
    // await faceapi.nets.faceExpressionNet.load(modelPath);

    optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence: minScore, maxResults });
  }

  // just initialize everything and call main function
  const setupCamera = async () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    if (!video || !canvas) return null;

    // log('Setting up camera');
    // setup webcam. note that navigator.mediaDevices requires that page is accessed via https
    if (!navigator.mediaDevices) {
      // log('Camera Error: access not supported');
      return null;
    }
    let stream;
    const constraints = { audio: false, video: { facingMode: 'user', resizeMode: 'crop-and-scale' } };
    if (window.innerWidth > window.innerHeight) constraints.video.width = { ideal: window.innerWidth };
    else constraints.video.height = { ideal: window.innerHeight };
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      // if (err.name === 'PermissionDeniedError' || err.name === 'NotAllowedError') { }
      // //  log(`Camera Error: camera permission denied: ${err.message || err}`);
      // if (err.name === 'SourceUnavailableError') { }
      //  log(`Camera Error: camera not available: ${err.message || err}`);
      return null;
    }
    if (stream) {
      video.srcObject = stream;
    } else {
      // log('Camera Error: stream empty');
      return null;
    }
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    if (settings.deviceId) delete settings.deviceId;
    if (settings.groupId) delete settings.groupId;
    if (settings.aspectRatio) settings.aspectRatio = Math.trunc(100 * settings.aspectRatio) / 100;
    canvas.addEventListener('click', () => {
      if (video && video.readyState >= 2) {
        if (video.paused) {
          video.play();
          detectVideo(video, canvas);
        } else {
          video.pause();
        }
      }
      // log(`Camera state: ${video.paused ? 'paused' : 'playing'}`);
    });
    return new Promise((resolve) => {
      video.onloadeddata = async () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.play();
        detectVideo(video, canvas);
        resolve(true);
      };
    });
  }

  async function detectVideo(video, canvas) {
    if (!video || video.paused) return false;
    const t0 = performance.now();
    faceapi
      .detectAllFaces(video, optionsSSDMobileNet)
      // .withFaceLandmarks() // 人脸关键点
      // .withFaceExpressions() 情感表达
      // .withFaceDescriptors() // 描述
      // .withAgeAndGender()  年龄和性别
      .then((result) => {
        console.log("result", result)
        const fps = 1000 / (performance.now() - t0);
        drawFaces(canvas, result, fps.toLocaleString());
        requestAnimationFrame(() => detectVideo(video, canvas));
        return true;
      })
      .catch((err) => {
        // log(`Detect Error: ${str(err)}`);
        console.error(err);
        return false;
      });
    return false;
  }

  // helper function to draw detected faces
  function drawFaces(canvas, data, fps) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw title
    ctx.font = 'small-caps 20px "Segoe UI"';
    ctx.fillStyle = 'white';
    ctx.fillText(`FPS: ${fps}`, 10, 25);
    for (const person of data) {
      // draw box around each face
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'deepskyblue';
      ctx.fillStyle = 'deepskyblue';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.rect(person.box.x, person.box.y, person.box.width, person.box.height);
      ctx.stroke();
      ctx.globalAlpha = 1;
      // draw text labels
      // const expression = Object.entries(person.expressions).sort((a, b) => b[1] - a[1]);
      ctx.fillStyle = 'black';
      // if (person.gender) {
      //   ctx.fillText(`gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`, person.detection.box.x, person.detection.box.y - 59);
      // }
      // ctx.fillText(`expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`, person.detection.box.x, person.detection.box.y - 41);
      // ctx.fillText(`age: ${Math.round(person.age)} years`, person.detection.box.x, person.detection.box.y - 23);
      // ctx.fillText(`roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`, person.detection.box.x, person.detection.box.y - 5);
      ctx.fillStyle = 'lightblue';
      // ctx.fillText(`gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`, person.detection.box.x, person.detection.box.y - 60);
      // ctx.fillText(`expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`, person.detection.box.x, person.detection.box.y - 42);
      // ctx.fillText(`age: ${Math.round(person.age)} years`, person.detection.box.x, person.detection.box.y - 24);
      // ctx.fillText(`roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`, person.detection.box.x, person.detection.box.y - 6);
      // draw face points for each face
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = 'lightblue';
      // const pointSize = 2;
      // for (let i = 0;i < person.landmarks.positions.length;i++) {
      //   ctx.beginPath();
      //   ctx.arc(person.landmarks.positions[i].x, person.landmarks.positions[i].y, pointSize, 0, 2 * Math.PI);
      //   ctx.fill();
      // }
    }
  }




  return <div>
    <video id="video" playsInline className="video"></video>
    <canvas id="canvas" className="canvas"></canvas>
    {/* <div id="log" style="overflow-y: scroll; height: 16.5rem"></div> */}
  </div>
}

export default App
