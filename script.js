const canvas = document.getElementById("draw-area");
const context = canvas.getContext("2d");
const clearButton = document.getElementById("clear");
const depthInput = document.getElementById("depth");
const widthValue = document.getElementById("width-value");
const heightValue = document.getElementById("height-value");
const areaValue = document.getElementById("area-value");
const volumeValue = document.getElementById("volume-value");
const hint = document.getElementById("hint");

let isDrawing = false;
let startPoint = { x: 0, y: 0 };
let currentRect = null;

const drawRect = (rect) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(47, 91, 249, 0.15)";
  context.strokeStyle = "#2f5bf9";
  context.lineWidth = 2;
  context.setLineDash([8, 6]);

  if (!rect) {
    return;
  }

  context.fillRect(rect.x, rect.y, rect.width, rect.height);
  context.strokeRect(rect.x, rect.y, rect.width, rect.height);
};

const updateStats = () => {
  const depth = Math.max(0, Number(depthInput.value) || 0);

  if (!currentRect) {
    widthValue.textContent = "0 cm";
    heightValue.textContent = "0 cm";
    areaValue.textContent = "0 cm²";
    volumeValue.textContent = "0 cm³";
    return;
  }

  const width = Math.abs(currentRect.width);
  const height = Math.abs(currentRect.height);
  const area = width * height;
  const volume = area * depth;

  widthValue.textContent = `${width.toFixed(1)} cm`;
  heightValue.textContent = `${height.toFixed(1)} cm`;
  areaValue.textContent = `${area.toFixed(1)} cm²`;
  volumeValue.textContent = `${volume.toFixed(1)} cm³`;
};

const handlePointerDown = (event) => {
  const rect = canvas.getBoundingClientRect();
  startPoint = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  isDrawing = true;
  hint.textContent = "Suelta para terminar el rectángulo.";
};

const handlePointerMove = (event) => {
  if (!isDrawing) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const currentPoint = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };

  currentRect = {
    x: Math.min(startPoint.x, currentPoint.x),
    y: Math.min(startPoint.y, currentPoint.y),
    width: Math.abs(currentPoint.x - startPoint.x),
    height: Math.abs(currentPoint.y - startPoint.y),
  };

  drawRect(currentRect);
  updateStats();
};

const handlePointerUp = () => {
  if (!isDrawing) {
    return;
  }
  isDrawing = false;
  hint.textContent = "Rectángulo listo. Puedes ajustar la profundidad.";
  updateStats();
};

const clearCanvas = () => {
  currentRect = null;
  drawRect(null);
  updateStats();
  hint.textContent = "Haz clic y arrastra para dibujar.";
};

canvas.addEventListener("pointerdown", handlePointerDown);
canvas.addEventListener("pointermove", handlePointerMove);
canvas.addEventListener("pointerup", handlePointerUp);
canvas.addEventListener("pointerleave", handlePointerUp);
clearButton.addEventListener("click", clearCanvas);
depthInput.addEventListener("input", updateStats);

updateStats();
