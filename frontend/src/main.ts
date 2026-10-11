// ==================================================
// CUBELY INTRO
// ==================================================

const cubelyIntro =
  document.getElementById(
    "cubelyIntro"
  ) as HTMLDivElement | null;

const page =
  document.getElementById(
    "page"
  ) as HTMLDivElement | null;


// Prevent scrolling while intro is running
document.body.classList.add(
  "intro-active"
);


// ==================================================
// CUBELY INTRO ANIMATION
// ==================================================
//
// 0s    -> 3D cube appears
// 0.65s -> CUBELY logo appears
// 4s    -> intro fades out
// 4.5s  -> solver page appears
//
// ==================================================

setTimeout(() => {

  if (cubelyIntro) {

    cubelyIntro.classList.add(
      "hide"
    );

  }


  // Wait for intro fade-out
  setTimeout(() => {

    if (page) {

      page.classList.add(
        "visible"
      );

    }

    document.body.classList.remove(
      "intro-active"
    );

  }, 500);

}, 4000);


// ============================================================
// TYPES
// ============================================================

type CubeColor =
  | "WHITE"
  | "YELLOW"
  | "RED"
  | "ORANGE"
  | "BLUE"
  | "GREEN";


type FaceName =
  | "U"
  | "R"
  | "F"
  | "D"
  | "L"
  | "B";


type CubeFaces = Record<
  FaceName,
  CubeColor[]
>;


interface SolveResponse {

  cube_string: string;

  solution: string;

  moves: string[];

  move_count: number;

}


// ============================================================
// DOM ELEMENTS
// ============================================================

const video =
  document.getElementById(
    "camera"
  ) as HTMLVideoElement | null;


const overlay =
  document.getElementById(
    "overlay"
  ) as HTMLCanvasElement | null;


const startCameraButton =
  document.getElementById(
    "start-camera"
  ) as HTMLButtonElement | null;


const scanFaceButton =
  document.getElementById(
    "scan-face"
  ) as HTMLButtonElement | null;


const resetButton =
  document.getElementById(
    "reset"
  ) as HTMLButtonElement | null;


const solveButton =
  document.getElementById(
    "solve-button"
  ) as HTMLButtonElement | null;


const currentFaceElement =
  document.getElementById(
    "current-face"
  ) as HTMLElement | null;


const instructionElement =
  document.getElementById(
    "instruction"
  ) as HTMLElement | null;


const statusElement =
  document.getElementById(
    "status"
  ) as HTMLElement | null;


const solutionSection =
  document.getElementById(
    "solution-section"
  ) as HTMLElement | null;


const solutionElement =
  document.getElementById(
    "solution"
  ) as HTMLElement | null;


const moveCountElement =
  document.getElementById(
    "move-count"
  ) as HTMLElement | null;


// ============================================================
// CANVAS
// ============================================================

const canvas =
  document.createElement(
    "canvas"
  );


const context =
  canvas.getContext(
    "2d"
  );


// ============================================================
// CAMERA
// ============================================================

let cameraStream:
  MediaStream | null = null;


// ============================================================
// FACE SCANNING
// ============================================================

// We deliberately scan in this order.
//
// U = White
// R = Red
// F = Green
// D = Yellow
// L = Orange
// B = Blue
//
// This is the standard colour scheme used
// by this project.

const scanOrder: FaceName[] = [

  "U",

  "R",

  "F",

  "D",

  "L",

  "B"

];


let currentFaceIndex = 0;


// ============================================================
// CUBE STATE
// ============================================================

const cubeFaces:
  Partial<CubeFaces> = {};


// ============================================================
// COLOUR DEFINITIONS
// ============================================================

interface RGB {

  r: number;

  g: number;

  b: number;

}


const referenceColors:
  Record<CubeColor, RGB> = {

  WHITE: {

    r: 245,

    g: 245,

    b: 245

  },


  YELLOW: {

    r: 230,

    g: 210,

    b: 20

  },


  RED: {

    r: 210,

    g: 40,

    b: 40

  },


  ORANGE: {

    r: 235,

    g: 120,

    b: 25

  },


  BLUE: {

    r: 40,

    g: 80,

    b: 210

  },


  GREEN: {

    r: 40,

    g: 170,

    b: 80

  }

};


// ============================================================
// INITIALISE
// ============================================================

function initialise(): void {

  if (!video) {

    console.error(
      "Camera video element not found."
    );

    return;

  }


  if (!overlay) {

    console.error(
      "Overlay canvas not found."
    );

    return;

  }


  if (!startCameraButton) {

    console.error(
      "Start camera button not found."
    );

    return;

  }


  if (!scanFaceButton) {

    console.error(
      "Scan face button not found."
    );

    return;

  }


  updateFaceUI();


  startCameraButton.addEventListener(
    "click",
    startCamera
  );


  scanFaceButton.addEventListener(
    "click",
    scanCurrentFace
  );


  resetButton?.addEventListener(
    "click",
    resetApplication
  );


  solveButton?.addEventListener(
    "click",
    solveCube
  );


  window.addEventListener(
    "resize",
    resizeCanvas
  );

}


// ============================================================
// START CAMERA
// ============================================================

async function startCamera(): Promise<void> {

  if (
    !video ||
    !startCameraButton ||
    !scanFaceButton
  ) {

    return;

  }


  try {

    updateStatus(
      "Requesting camera permission..."
    );


    cameraStream =
      await navigator.mediaDevices.getUserMedia({

        video: {

          facingMode: "environment",

          width: {

            ideal: 1280

          },

          height: {

            ideal: 720

          }

        },

        audio: false

      });


    video.srcObject =
      cameraStream;


    await video.play();


    resizeCanvas();


    startCameraButton.disabled =
      true;


    scanFaceButton.disabled =
      false;


    updateStatus(
      "Camera ready. Place the requested face inside the square."
    );


  } catch (error) {

    console.error(error);


    updateStatus(
      "Unable to access the camera. Check browser permissions."
    );

  }

}


// ============================================================
// RESIZE CANVAS
// ============================================================

function resizeCanvas(): void {

  if (
    !video ||
    !overlay
  ) {

    return;

  }


  const width =
    video.videoWidth ||
    video.clientWidth;


  const height =
    video.videoHeight ||
    video.clientHeight;


  if (
    width <= 0 ||
    height <= 0
  ) {

    return;

  }


  overlay.width =
    width;


  overlay.height =
    height;


  drawOverlay();

}


// ============================================================
// DRAW OVERLAY
// ============================================================

function drawOverlay(): void {

  if (
    !video ||
    !overlay
  ) {

    return;

  }


  const ctx =
    overlay.getContext(
      "2d"
    );


  if (!ctx) {

    return;

  }


  ctx.clearRect(
    0,
    0,
    overlay.width,
    overlay.height
  );


  const size =
    Math.min(
      overlay.width,
      overlay.height
    ) * 0.48;


  const x =
    (overlay.width - size) / 2;


  const y =
    (overlay.height - size) / 2;


  ctx.strokeStyle =
    "rgba(255,255,255,0.9)";


  ctx.lineWidth = 3;


  ctx.strokeRect(
    x,
    y,
    size,
    size
  );


  const cellSize =
    size / 3;


  ctx.lineWidth = 1;


  ctx.strokeStyle =
    "rgba(255,255,255,0.55)";


  for (
    let i = 1;
    i < 3;
    i++
  ) {

    ctx.beginPath();


    ctx.moveTo(
      x + cellSize * i,
      y
    );


    ctx.lineTo(
      x + cellSize * i,
      y + size
    );


    ctx.stroke();


    ctx.beginPath();


    ctx.moveTo(
      x,
      y + cellSize * i
    );


    ctx.lineTo(
      x + size,
      y + cellSize * i
    );


    ctx.stroke();

  }

}


// ============================================================
// SCAN CURRENT FACE
// ============================================================

function scanCurrentFace(): void {

  if (
    !video ||
    !canvas ||
    !context
  ) {

    return;

  }


  if (
    video.readyState < 2
  ) {

    updateStatus(
      "Camera is not ready yet."
    );

    return;

  }


  const colours =
    detectFaceColours();


  if (
    colours.length !== 9
  ) {

    updateStatus(
      "Could not detect all 9 stickers."
    );

    return;

  }


  const face =
    scanOrder[
    currentFaceIndex
    ];


  cubeFaces[face] =
    colours;


  renderMiniFace(
    face,
    colours
  );


  currentFaceIndex++;


  if (
    currentFaceIndex >=
    scanOrder.length
  ) {

    currentFaceIndex =
      scanOrder.length - 1;


    updateFaceUI();


    if (scanFaceButton) {

      scanFaceButton.disabled =
        true;

    }


    if (solveButton) {

      solveButton.disabled =
        !allFacesScanned();

    }


    updateStatus(
      "All six faces scanned. Check the colours, then solve."
    );


    return;

  }


  updateFaceUI();


  updateStatus(
    `${face} face scanned successfully.`
  );

}


// ============================================================
// DETECT 9 COLOURS
// ============================================================

function detectFaceColours(): CubeColor[] {

  if (
    !video ||
    !canvas ||
    !context
  ) {

    return [];

  }


  const videoWidth =
    video.videoWidth;


  const videoHeight =
    video.videoHeight;


  if (
    videoWidth <= 0 ||
    videoHeight <= 0
  ) {

    return [];

  }


  canvas.width =
    videoWidth;


  canvas.height =
    videoHeight;


  context.drawImage(
    video,
    0,
    0,
    videoWidth,
    videoHeight
  );


  // Same square used by the
  // visual grid.

  const size =
    Math.min(
      videoWidth,
      videoHeight
    ) * 0.48;


  const startX =
    (videoWidth - size) / 2;


  const startY =
    (videoHeight - size) / 2;


  const cellSize =
    size / 3;


  const colours:
    CubeColor[] = [];


  for (
    let row = 0;
    row < 3;
    row++
  ) {

    for (
      let col = 0;
      col < 3;
      col++
    ) {

      const sampleX =
        Math.round(
          startX +
          col * cellSize +
          cellSize / 2
        );


      const sampleY =
        Math.round(
          startY +
          row * cellSize +
          cellSize / 2
        );


      const rgb =
        getAverageRGB(
          context,
          sampleX,
          sampleY,
          12
        );


      const colour =
        classifyColour(
          rgb
        );


      colours.push(
        colour
      );

    }

  }


  return colours;

}


// ============================================================
// AVERAGE RGB
// ============================================================

function getAverageRGB(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
): RGB {

  const imageData =
    ctx.getImageData(
      centerX - radius,
      centerY - radius,
      radius * 2,
      radius * 2
    );


  let totalR = 0;

  let totalG = 0;

  let totalB = 0;

  let count = 0;


  for (
    let i = 0;
    i < imageData.data.length;
    i += 4
  ) {

    totalR +=
      imageData.data[i];


    totalG +=
      imageData.data[i + 1];


    totalB +=
      imageData.data[i + 2];


    count++;

  }


  return {

    r:
      Math.round(
        totalR / count
      ),

    g:
      Math.round(
        totalG / count
      ),

    b:
      Math.round(
        totalB / count
      )

  };

}


// ============================================================
// COLOUR CLASSIFICATION
// ============================================================

function classifyColour(
  rgb: RGB
): CubeColor {

  let bestColour:
    CubeColor = "WHITE";


  let bestDistance =
    Number.POSITIVE_INFINITY;


  for (
    const colour of Object.keys(
      referenceColors
    ) as CubeColor[]
  ) {

    const reference =
      referenceColors[
      colour
      ];


    const distance =
      Math.sqrt(

        Math.pow(
          rgb.r - reference.r,
          2
        ) +

        Math.pow(
          rgb.g - reference.g,
          2
        ) +

        Math.pow(
          rgb.b - reference.b,
          2
        )

      );


    if (
      distance <
      bestDistance
    ) {

      bestDistance =
        distance;


      bestColour =
        colour;

    }

  }


  return bestColour;

}


// ============================================================
// MINI FACE
// ============================================================

function renderMiniFace(
  face: FaceName,
  colours: CubeColor[]
): void {

  const element =
    document.getElementById(
      `face-${face}`
    );


  if (!element) {

    return;

  }


  element.innerHTML =
    "";


  for (
    const colour of colours
  ) {

    const sticker =
      document.createElement(
        "div"
      );


    sticker.className =
      "mini-sticker";


    sticker.style.background =
      cssColour(
        colour
      );


    element.appendChild(
      sticker
    );

  }

}


// ============================================================
// CSS COLOURS
// ============================================================

function cssColour(
  colour: CubeColor
): string {

  switch (colour) {

    case "WHITE":

      return "#ffffff";


    case "YELLOW":

      return "#ffd900";


    case "RED":

      return "#e53935";


    case "ORANGE":

      return "#ff8c00";


    case "BLUE":

      return "#1976d2";


    case "GREEN":

      return "#26a641";


    default:

      return "#888888";

  }

}


// ============================================================
// UPDATE FACE UI
// ============================================================

function updateFaceUI(): void {

  const face =
    scanOrder[
    currentFaceIndex
    ];


  if (currentFaceElement) {

    currentFaceElement.textContent =
      face;

  }


  if (!instructionElement) {

    return;

  }


  const names:
    Record<
      FaceName,
      string
    > = {

    U:
      "UP / WHITE",

    R:
      "RIGHT / RED",

    F:
      "FRONT / GREEN",

    D:
      "DOWN / YELLOW",

    L:
      "LEFT / ORANGE",

    B:
      "BACK / BLUE"

  };


  instructionElement.textContent =
    `Hold the ${names[face]} face inside the square.`;

}


// ============================================================
// CHECK ALL FACES
// ============================================================

function allFacesScanned(): boolean {

  return scanOrder.every(
    face =>

      Array.isArray(
        cubeFaces[face]
      ) &&

      cubeFaces[face]!.length === 9
  );

}


// ============================================================
// SOLVE
// ============================================================

async function solveCube(): Promise<void> {

  if (
    !allFacesScanned()
  ) {

    updateStatus(
      "Please scan all six faces first."
    );

    return;

  }


  if (!solveButton) {

    return;

  }


  solveButton.disabled =
    true;


  updateStatus(
    "Sending cube to solver..."
  );


  try {

    const response =
      await fetch(
        "http://127.0.0.1:8000/solve",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              faces:
                cubeFaces

            })

        }
      );


    const data =
      await response.json();


    if (
      !response.ok
    ) {

      throw new Error(

        data.detail ||

        "The server rejected the cube."

      );

    }


    const result =
      data as SolveResponse;


    displaySolution(
      result
    );


    updateStatus(
      "Cube solved successfully."
    );


  } catch (
  error
  ) {

    console.error(
      error
    );


    const message =
      error instanceof Error

        ? error.message

        : "Unknown error";


    updateStatus(
      `Solver error: ${message}`
    );


  } finally {

    solveButton.disabled =
      false;

  }

}


// ============================================================
// DISPLAY SOLUTION
// ============================================================

function displaySolution(
  result: SolveResponse
): void {

  if (
    !solutionSection ||
    !solutionElement ||
    !moveCountElement
  ) {

    return;

  }


  solutionSection.classList.remove(
    "hidden"
  );


  solutionElement.innerHTML =
    "";


  if (
    result.moves.length === 0
  ) {

    solutionElement.textContent =
      "The cube is already solved.";

  } else {

    for (
      const move of result.moves
    ) {

      const element =
        document.createElement(
          "span"
        );


      element.className =
        "move";


      element.textContent =
        move;


      solutionElement.appendChild(
        element
      );

    }

  }


  moveCountElement.textContent =
    `${result.move_count} move${result.move_count === 1
      ? ""
      : "s"
    }`;

}


// ============================================================
// RESET
// ============================================================

function resetApplication(): void {

  currentFaceIndex =
    0;


  for (
    const face of scanOrder
  ) {

    delete cubeFaces[
      face
    ];


    const element =
      document.getElementById(
        `face-${face}`
      );


    if (element) {

      element.innerHTML =
        "";

    }

  }


  if (solveButton) {

    solveButton.disabled =
      true;

  }


  if (scanFaceButton) {

    scanFaceButton.disabled =
      cameraStream === null;

  }


  solutionSection?.classList.add(
    "hidden"
  );


  if (solutionElement) {

    solutionElement.innerHTML =
      "";

  }


  if (moveCountElement) {

    moveCountElement.textContent =
      "";

  }


  updateFaceUI();


  updateStatus(

    cameraStream

      ? "Ready to scan again."

      : "Start the camera to begin."

  );

}


// ============================================================
// STATUS
// ============================================================

function updateStatus(
  message: string
): void {

  if (statusElement) {

    statusElement.textContent =
      message;

  }

}


// ============================================================
// CLEANUP CAMERA
// ============================================================

window.addEventListener(
  "beforeunload",
  () => {

    cameraStream
      ?.getTracks()
      .forEach(
        track =>
          track.stop()
      );

  }
);


// ============================================================
// START
// ============================================================

initialise();