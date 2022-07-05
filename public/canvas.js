let canvas = document.querySelector("canvas");
let pencilRange = document.querySelector(".range-cont > .range");
let undoBtn = document.querySelector(".undo-cont");
let redoBtn = document.querySelector(".redo-cont");
let eraserRange = document.querySelector(".eraser-tool-cont > .range");
let colorArr = document.querySelectorAll(".color-cont > div");
let pencilWidth = 3;
let eraserWidth = 10;
let pencil = false;
let eraser = false;
let tool = canvas.getContext("2d");
let undoRedoTracker = [];
let tracker;
let clr = "black";
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

tool.fillStyle = "white";
tool.fillRect(0, 0, canvas.width, canvas.height);

undoBtn.addEventListener("click", function (e) {
  if (tracker !== undefined && tracker > 0) tracker--;
  let obj = {
    trackValue: tracker,
    undoRedoTracker,
  };
  socket.emit("undoRedo-action",obj);
});

redoBtn.addEventListener("click", function (e) {
  if (tracker !== undefined && tracker < undoRedoTracker.length - 1) tracker++;
  let obj = {
    trackValue: tracker,
    undoRedoTracker,
  };
  socket.emit("undoRedo-action",obj);
});

function undoRedoCanvas(trackObj) {
  let url = trackObj.undoRedoTracker[trackObj.trackValue];
  let img = new Image(); // new image reference element
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

colorArr.forEach((color) => {
  color.addEventListener("click", function (e) {
    clr = color.classList[0];
    console.log(clr);
  });
});

pencilRange.addEventListener("change", function (e) {
  pencilWidth = pencilRange.value;
});

eraserRange.addEventListener("change", function (e) {
  eraserWidth = eraserRange.value;
});

canvas.addEventListener("mousedown", function (e) {
  if (!pencilToggle && !eraserToggle) return;
  if (pencilToggle) pencil = true;
  else eraser = true;
  let obj = {
    x: e.clientX,
    y: e.clientY,
  };
  socket.emit("beginPath",obj);
});

canvas.addEventListener("mousemove", function (e) {
  if (!pencil && !eraser) return;
  let obj = {
    x: e.clientX,
    y: e.clientY,
    color: eraserToggle ? "white" : clr,
    lineWidth: eraserToggle ? eraserWidth : pencilWidth,
  };
  socket.emit("drawPath", obj);
});

canvas.addEventListener("mouseup", function (e) {
  pencil = false;
  eraser = false;
  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  tracker = undoRedoTracker.length - 1;
});

function beginPath(obj) {
  tool.beginPath();
  tool.moveTo(obj.x, obj.y);
}

function drawPath(obj) {
  tool.strokeStyle = obj.color;
  tool.lineWidth = obj.lineWidth;
  tool.lineTo(obj.x, obj.y);
  tool.stroke();
}

socket.on("beginPath",function(data){
  beginPath(data);
})

socket.on("drawPath",function(data){
  drawPath(data);
});

socket.on("undoRedo-action",function(obj){
  undoRedoCanvas(obj);
});
