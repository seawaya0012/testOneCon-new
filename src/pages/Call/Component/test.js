/* eslint-disable no-unused-vars*/
import * as bodyPix from "@tensorflow-models/body-pix";

//#region Variables
let videoStream = null;
let selectedLibrary = "bodypix";
let selectedBackground = null;
let blurredEnabled = false;
let virtualBackgroundEnabled = false;
let libraryLoaded = false;

const source = document.getElementById("video-source");
const output = document.getElementById("video-output");

const canvasOutput = document.getElementById("canvas-output");
const ctx = canvasOutput.getContext("2d");

const resultStream = document.getElementById("video-stream");

const segmentationWidth = 480;
const segmentationHeight = 320;
const segmentationPixelCount = segmentationWidth * segmentationHeight;
const segmentationMask = new ImageData(segmentationWidth, segmentationHeight);
const segmentationMaskCanvas = document.createElement("canvas");
segmentationMaskCanvas.width = segmentationWidth;
segmentationMaskCanvas.height = segmentationHeight;
const segmentationMaskCtx = segmentationMaskCanvas.getContext("2d");

const librarySelect = document.getElementById("librarySelect");
const noBackgroundBtn = document.getElementById("noBackground");
const blurBackgroundBtn = document.getElementById("blurBackground");
const virutalBackgroundBtn = document.getElementById("virutalBackground");
const backgroundBlurRange = document.getElementById("backgroundBlur");
const blurAmountText = document.getElementById("blurAmount");
blurAmountText.innerText = backgroundBlurRange.value;

const edgeBlurRange = document.getElementById("edgeBlur");
const edgeBlurAmountText = document.getElementById("edgeBlurAmount");
edgeBlurAmountText.innerText = edgeBlurRange.value;

//#endregion

function startVideoStream() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      videoStream = stream;

      playVideo(source);
      playVideo(output);
    })
    .catch((err) => {
      alert(`Following error occured: ${err}`);
    });
}

function playVideo(video) {
  video.srcObject = videoStream;
  video.play();
}

//#region Bodypix
async function loadBodyPix() {
  try {
    const net = await bodyPix.load();
    output.hidden = true;
    canvasOutput.hidden = false;
    perform(net);
  } catch (err) {
    console.log(err);
  }
}

async function perform(net) {
  while (
    selectedLibrary === "bodypix" &&
    (blurredEnabled || virtualBackgroundEnabled)
  ) {
    segmentationMaskCtx.clearRect(
      0,
      0,
      canvasOutput.width,
      canvasOutput.height
    );
    segmentationMaskCtx.drawImage(
      source,
      0,
      0,
      canvasOutput.width,
      canvasOutput.height
    );

    const segmentation = await net.segmentPerson(segmentationMaskCanvas);
    for (let i = 0; i < segmentationPixelCount; i++) {
      // Sets only the alpha component of each pixel
      segmentationMask.data[i * 4 + 3] = segmentation.data[i] ? 255 : 0;
    }
    segmentationMaskCtx.putImageData(segmentationMask, 0, 0);

    runPostProcessing(
      source,
      segmentationMaskCanvas,
      backgroundBlurRange.value
    );
  }
}
//#endregion

function runPostProcessing(image, segmentation, blurAmount) {
  clearCanvas();

  ctx.globalCompositeOperation = "copy";
  ctx.filter = "none";

  if (blurredEnabled || virtualBackgroundEnabled) {
    ctx.filter = `blur(${edgeBlurRange.value}px)`;
    drawSegmentationMask(segmentation);
    ctx.globalCompositeOperation = "source-in";
    ctx.filter = "none";
  }

  ctx.drawImage(image, 0, 0, canvasOutput.width, canvasOutput.height);

  if (virtualBackgroundEnabled) {
    blurBackground(selectedBackground, 0);
  }

  if (blurredEnabled) {
    blurBackground(image, blurAmount);
  }

  ctx.restore();
}

function drawSegmentationMask(segmentation) {
  ctx.drawImage(segmentation, 0, 0, canvasOutput.width, canvasOutput.height);
}

function blurBackground(image, blurAmount) {
  ctx.globalCompositeOperation = "destination-over";
  ctx.filter = `blur(${blurAmount}px)`;
  ctx.drawImage(image, 0, 0, canvasOutput.width, canvasOutput.height);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
}

/* eslint-disable default-case */
function onLibraryLoad(library) {
  libraryLoaded = true;
  switch (library) {
    case "bodypix":
      loadBodyPix();
      setResultStream();
      break;
  }

  backgroundBlurRange.max = 20;
}

/* eslint-disable default-case */
async function onLibraryUnload(library) {
  clearCanvas();

  switch (library) {
    case "bodypix":
      output.hidden = false;
      canvasOutput.hidden = true;
      break;
  }

  libraryLoaded = false;
}

function setResultStream() {
  const stream = canvasOutput.captureStream();
  resultStream.srcObject = stream;
  resultStream.play();

  if (resultStream.hidden) {
    resultStream.hidden = false;
  }
}

noBackgroundBtn.addEventListener("click", (e) => {
  blurredEnabled = false;
  virtualBackgroundEnabled = false;
  backgroundBlurRange.disabled = true;
  edgeBlurRange.disabled = true;

  noBackgroundBtn.classList.add("selected");
  blurBackgroundBtn.classList.remove("selected");
  virutalBackgroundBtn.classList.remove("selected");

  onLibraryUnload(librarySelect.value);

  resultStream.hidden = true;
});

blurBackgroundBtn.addEventListener("click", (e) => {
  blurredEnabled = true;
  virtualBackgroundEnabled = false;
  backgroundBlurRange.disabled = false;
  edgeBlurRange.disabled = false;

  noBackgroundBtn.classList.remove("selected");
  blurBackgroundBtn.classList.add("selected");
  virutalBackgroundBtn.classList.remove("selected");

  if (!libraryLoaded) {
    onLibraryLoad(librarySelect.value);
  }
});

virutalBackgroundBtn.addEventListener("click", (e) => {
  blurredEnabled = false;
  virtualBackgroundEnabled = true;
  backgroundBlurRange.disabled = true;
  edgeBlurRange.disabled = false;

  noBackgroundBtn.classList.remove("selected");
  blurBackgroundBtn.classList.remove("selected");
  virutalBackgroundBtn.classList.add("selected");

  selectedBackground = e.target;

  if (!libraryLoaded) {
    onLibraryLoad(librarySelect.value);
  }
});

librarySelect.addEventListener("input", (e) => {
  if (selectedLibrary !== e.target.value) {
    onLibraryUnload(selectedLibrary);
  }

  selectedLibrary = e.target.value;

  if (!blurredEnabled && !virtualBackgroundEnabled) return;

  onLibraryLoad(e.target.value);
});

backgroundBlurRange.addEventListener("input", (e) => {
  blurAmountText.innerText = e.target.value;
});

edgeBlurRange.addEventListener("input", (e) => {
  edgeBlurAmountText.innerText = e.target.value;
});

startVideoStream();
