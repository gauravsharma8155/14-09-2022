console.log("This is Console for index js");


let scrren1 = document.getElementById("screen1").addEventListener("click", () => {
    console.log(scrren1);

    let block1 = document.getElementById("block1");
    console.log(block1)
    let block2 = document.getElementById("block2");
    console.log(block2)
    let block3 = document.getElementById("block3");
    console.log(block3)


    if (block1.style.display = 'block') {
        block2.style.display = 'none';
        block3.style.display = 'none'
    }



})

let scrren2 = document.getElementById("screen2").addEventListener("click", () => {
    console.log(scrren1);

    let block1 = document.getElementById("block1");
    let block2 = document.getElementById("block2");
    let block3 = document.getElementById("block3");


    if (block2.style.display = 'block') {
        block1.style.display = 'none';
        block3.style.display = 'none'
    }

})

let scrren3 = document.getElementById("screen3").addEventListener("click", () => {
    console.log(scrren1);

    let block1 = document.getElementById("block1");
    let block2 = document.getElementById("block2");
    let block3 = document.getElementById("block3");


    if (block3.style.display = 'block') {
        block1.style.display = 'none';
        block2.style.display = 'none'
    }

})


let btn_record1 = document.getElementById("btn_record1").addEventListener("click", async () => {
    console.log("this is console for btn_record1");


    let stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true

    })

    let audio = await navigator.mediaDevices.getUserMedia({
        audio: true
    })

    



    const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
        ? "video/webm; codecs=vp9"
        : "video/webm"
    let mediaRecorder = new MediaRecorder(stream, {
        mimeType: mime
    })

  

    let chunks = []
    mediaRecorder.addEventListener('dataavailable', function (e) {
        chunks.push(e.data);
    })
    



    mediaRecorder.addEventListener('stop', function () {
        let blob = new Blob(chunks, {
            type: chunks[0].type
        })
        console.log(blob);
        let cross = document.getElementById("cross");

        cross.style.display = 'block'

        let data = document.getElementById("data");
        console.log(data);
        data.src = URL.createObjectURL(blob);
        data.style.display = 'block'

        let main = document.getElementById("main-container");
        console.log(main);
        main.style.display = 'none'


        console.log(cross)
        cross.addEventListener("click", () => {
            let main = document.getElementById("main-container");
            console.log(main); main.style.display = 'block'

            let data = document.getElementById("data");
            data.style.display = 'none'
            console.log(data);

            let download = document.getElementById('download');
            download.style.display = 'none';
        })

        let download = document.getElementById('download');
        download.style.display = 'block'
        download.href = URL.createObjectURL(blob);

        console.log(chunks)


        // cross.style.display = 'none'
    });

    mediaRecorder.start();


});




let btn_record2 = document.getElementById("btn_record2").addEventListener("click", async () => {

    const parts = [];

    navigator.mediaDevices.getUserMedia({ video: true, audio: true, echocancellation: true, noiseSuppression: true, sampleRate: 44100, echocancellation: true }).then(stream => {


        let main = document.getElementById("main-container");
        console.log(main);
        main.style.display = 'none';

        let data2 = document.getElementById("data2");
        data2.style.display = 'block'
        data2.srcObject = stream


        let download1 = document.getElementById("download1")
        download1.style.display = 'block'

    

        download1.addEventListener("click", () => {
            console.log("this is console", download1);

            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.start(1000);


            mediaRecorder.ondataavailable = function (e) {

                parts.push(e.data)
            }

        });



        let download2 = document.getElementById("download2");
        download2.style.display = 'block'

        let cross = document.getElementById("cross");
        console.log(cross)
        cross.style.display = 'block'


        download2.addEventListener("click", () => {

            mediaRecorder.stop();

            const blob = new Blob(parts, {

                type: "video/webm"
            })
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");

            document.body.appendChild(a);;

            a.style = "display: none";

            a.href = url;

            a.download = "test.webm";

            a.click();
        });
    });
});





let localCamStream,
  localScreenStream,
  localOverlayStream,
  rafId,
  cam,
  screen,
  mediaRecorder,
  audioContext,
  audioDestination;


let mediaWrapperDiv = document.getElementById("mediaWrapper");

let canvasElement = document.createElement("canvas");
let canvasCtx = canvasElement.getContext("2d");
let encoderOptions = {
  mimeType: "video/webm; codecs=vp9"
};
let recordedChunks = [];
let audioTracks = [];


const requestVideoFrame = function(callback) {
  return window.setTimeout(function() {
    callback(Date.now());
  }, 1000 / 60); // 60 fps - just like requestAnimationFrame
};

/**
 * Internal polyfill to simulate
 * window.cancelAnimationFrame
 */
const cancelVideoFrame = function(id) {
  clearTimeout(id);
};

async function startWebcamFn() {
  localCamStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: {
      deviceId: {
        exact: "communications"
      }
    }
  });
  if (localCamStream) {
    cam = await attachToDOM("justWebcam", localCamStream);
  }
}

async function startScreenShareFn() {
  localScreenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  });
  if (localScreenStream) {
    screen = await attachToDOM("justScreenShare", localScreenStream);
  }
}

async function stopAllStreamsFn() {
  [
    ...(localCamStream ? localCamStream.getTracks() : []),
    ...(localScreenStream ? localScreenStream.getTracks() : []),
    ...(localOverlayStream ? localOverlayStream.getTracks() : [])
  ].map((track) => track.stop());
  localCamStream = null;
  localScreenStream = null;
  localOverlayStream = null;
  cancelVideoFrame(rafId);
  mediaWrapperDiv.innerHTML = "";
  document.getElementById("recordingState").innerHTML = "";
}

async function makeComposite() {
  if (cam && screen) {
    canvasCtx.save();
    canvasElement.setAttribute("width", `${screen.videoWidth}px`);
    canvasElement.setAttribute("height", `${screen.videoHeight}px`);
    canvasCtx.clearRect(0, 0, screen.videoWidth, screen.videoHeight);
    canvasCtx.drawImage(screen, 0, 0, screen.videoWidth, screen.videoHeight);
    canvasCtx.drawImage(
      cam,
      0,
      Math.floor(screen.videoHeight - screen.videoHeight / 4),
      Math.floor(screen.videoWidth / 4),
      Math.floor(screen.videoHeight / 4)
    ); // this is just a rough calculation to offset the webcam stream to bottom left
    let imageData = canvasCtx.getImageData(
      0,
      0,
      screen.videoWidth,
      screen.videoHeight
    ); // this makes it work
    canvasCtx.putImageData(imageData, 0, 0); // properly on safari/webkit browsers too
    canvasCtx.restore();
    rafId = requestVideoFrame(makeComposite);
  }
}

async function mergeStreamsFn() {
  document.getElementById("mutingStreams").style.display = "block";
  await makeComposite();
  audioContext = new AudioContext();
  audioDestination = audioContext.createMediaStreamDestination();
  let fullVideoStream = canvasElement.captureStream();
  let existingAudioStreams = [
    ...(localCamStream ? localCamStream.getAudioTracks() : []),
    ...(localScreenStream ? localScreenStream.getAudioTracks() : [])
  ];
  audioTracks.push(
    audioContext.createMediaStreamSource(
      new MediaStream([existingAudioStreams[0]])
    )
  );
  if (existingAudioStreams.length > 1) {
    audioTracks.push(
      audioContext.createMediaStreamSource(
        new MediaStream([existingAudioStreams[1]])
      )
    );
  }
  audioTracks.map((track) => track.connect(audioDestination));
  console.log(audioDestination.stream);
  localOverlayStream = new MediaStream([...fullVideoStream.getVideoTracks()]);
  let fullOverlayStream = new MediaStream([
    ...fullVideoStream.getVideoTracks(),
    ...audioDestination.stream.getTracks()
  ]);
  console.log(localOverlayStream, existingAudioStreams);
  if (localOverlayStream) {
    overlay = await attachToDOM("pipOverlayStream", localOverlayStream);
    mediaRecorder = new MediaRecorder(fullOverlayStream, encoderOptions);
    mediaRecorder.ondataavailable = handleDataAvailable;
    overlay.volume = 0;
    cam.volume = 0;
    screen.volume = 0;
    cam.style.display = "none";
    // localCamStream.getAudioTracks().map(track => { track.enabled = false });
    screen.style.display = "none";
    // localScreenStream.getAudioTracks().map(track => { track.enabled = false });
  }
}

async function startRecordingFn() {
  mediaRecorder.start();
  console.log(mediaRecorder.state);
  console.log("recorder started");
  document.getElementById("pipOverlayStream").style.border = "10px solid red";
  document.getElementById(
    "recordingState"
  ).innerHTML = `${mediaRecorder.state}...`;
}

async function attachToDOM(id, stream) {
  let videoElem = document.createElement("video");
  videoElem.id = id;
  videoElem.width = 640;
  videoElem.height = 360;
  videoElem.autoplay = true;
  videoElem.setAttribute("playsinline", true);
  videoElem.srcObject = new MediaStream(stream.getTracks());
  mediaWrapperDiv.appendChild(videoElem);
  return videoElem;
}

function handleDataAvailable(event) {
  console.log("data-available");
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    console.log(recordedChunks);
    download();
  } else {}
}

function download() {
  var blob = new Blob(recordedChunks, {
    type: "video/webm"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "result.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}



webcam = () => {
  startWebcamFn();
  startScreenShareFn();
  // startRecordingFn();


}

let btn = document.getElementById("btn");
btn.addEventListener("click", webcam);

webcam2 = () => {
  mergeStreamsFn();
}

webcam3 = () => {
  download();
}
let btn2 = document.getElementById("btn2").addEventListener("click", webcam2);
let btn3 = document.getElementById("btn3").addEventListener("click", webcam3);
  











