let toggleBtn = document.querySelector(".toggle-cont");
let toolCont = document.querySelector(".tools-cont");
let pencilCont = document.querySelector(".pencil-cont");
let eraserCont = document.querySelector(".eraser-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let stickyCont = document.querySelector(".sticky-cont");
let donwloadBtn = document.querySelector(".download-cont");
let uploadBtn = document.querySelector(".upload-cont");
let toggleFlag = false;
let pencilToggle = false;
let eraserToggle = false;

toggleBtn.addEventListener("click", function (e) {
  toggleFlag = !toggleFlag;
  if (toggleFlag) {
    toolCont.style.display = "flex";
  } else {
    toolCont.style.display = "none";
  }
});

pencilCont.addEventListener("click", function (e) {
  if (eraserToggle) {
    eraserCont.click();
  }
  pencilToggle = !pencilToggle;
  if (pencilToggle) {
    pencilToolCont.style.display = "block";
  } else {
    pencilToolCont.style.display = "none";
  }
});

eraserCont.addEventListener("click", function (e) {
  if (pencilToggle) {
    pencilCont.click();
  }
  eraserToggle = !eraserToggle;
  if (eraserToggle) {
    eraserToolCont.style.display = "block";
  } else {
    eraserToolCont.style.display = "none";
  }
});

stickyCont.addEventListener("click", function (e) {
  let div = document.createElement("div");
  div.setAttribute("class", "sticky-note");
  div.innerHTML = `<div class="action-cont">
    <div class="minimize"></div>
    <div class="close"></div>
  </div>
 <div class="note-cont"><textarea spellcheck="false"></textarea></div>`;
  sticky(div);
});

function sticky(div) {
  document.body.appendChild(div);
  div.onmousedown = function (event) {
    dragAndDrop(div, event);
  };

  div.ondragstart = function () {
    return false;
  };
  let minimize = div.querySelector(".minimize");
  let close = div.querySelector(".close");
  action(div, minimize, close);
}

function action(elem, minimize, close) {
  minimize.addEventListener("click", function (e) {
    let noteArea = elem.querySelector(".note-cont");
    if (getComputedStyle(noteArea).getPropertyValue("display") === "block") {
      noteArea.style.display = "none";
    } else {
      noteArea.style.display = "block";
    }
  });
  close.addEventListener("click", function (e) {
    elem.remove();
  });
}

function dragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener("mousemove", onMouseMove);

  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}

donwloadBtn.addEventListener("click", function (e) {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "canvas.jpg";
  a.click();
});

uploadBtn.addEventListener("click", function (e) {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();
  input.onchange = function (e) {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let div = document.createElement("div");
    div.setAttribute("class", "sticky-note");
    div.innerHTML = `<div class="action-cont">
    <div class="minimize"></div>
    <div class="close"></div>
  </div>
 <div class="note-cont"><img src=${url} class="upload-img"/></img></div>`;
    sticky(div);
  };
});
