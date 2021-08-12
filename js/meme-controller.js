'use strict';

let gCanvas;
let gCtx;
let gCurrFont = 'Impact';
let gStartPos;
let gIsMoving = false;
let gIsMouseDown = false;


function onInit() {
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');
    resizeCanvas();
    // addListeners()
    addMouseListeners()
    addTouchListeners();
    renderGallery();
    renderCanvas();
    // onAddLine();
}

function resizeCanvas() {
    const elCanvContainer = document.querySelector('.canvas-container');
    gCanvas.width = 400;
    gCanvas.height = 400;
}

function renderGallery() {
    var images = getImagesToShow();
    console.log(images);
    var strHTMLs = '';
    images.map(img => {
        return strHTMLs += `<img class="gallery-img" src="${img.src}" onclick="onSelectImg(${img.id})"/>`
    })

    document.querySelector('.images-container').innerHTML = strHTMLs;
}


function renderCanvas() {
    const img = new Image();
    img.src = getImgSrc();
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        onAddLine();
    }
}

function onAddLine() {
    const lines = getLinesToShow();
    lines.forEach(line => {
        // const size = getTxtSize();
        var lineHeight = line.size * 1.286;
        var textWidth = gCtx.measureText(line.txt).width;
        gCtx.textAlign = 'left';
        gCtx.textBaseline = 'top';
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.fillStyle = `${line.color}`
        gCtx.strokeStyle = '#000';
        if (line.isStroke) {
            gCtx.lineWidth = 2;
            gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
        }
        gCtx.fillText(line.txt, line.pos.x, line.pos.y)
        if (line.isChosen) {
            gCtx.strokeStyle = 'black'
            gCtx.strokeRect(line.pos.x, line.pos.y - 5, textWidth, lineHeight);
        }
        // gCtx.fillText(line.txt, line.pos.x, line.pos.y)

    })

}

function onSetStroke() {
    setStroke();
    renderCanvas();
}

function onSetLineTxt(txt) {
    setLineTxt(txt);
    renderCanvas();
}

function onSelectImg(id) {
    setSelectImg(id);
    renderCanvas();
    document.querySelector('.gallery-container-main').classList.toggle('hidden');
    document.querySelector('.edit-container').classList.toggle('hidden');
}

function onIncreaseFontSize() {
    increaseFontSize();
    renderCanvas();
}

function onDecreaseFontSize() {
    decreaseFontSize();
    renderCanvas();
}

function onAddNewLine() {
    // if (!txt) return;
    var txt = document.querySelector('.txt-input').value = '';
    const color = document.querySelector('.color-input').value;
    addNewLine(txt, gCanvas.width, gCanvas.height, color);
    setChosen();
    renderCanvas();
}

function onChangeLine() {
    // var dimensions = getTxtDimensions();

    changeLine();
    setChosen();
    document.querySelector('.txt-input').value = getTxtToShow();
    renderCanvas();
}

function onSetFontColor(color) {
    setFontColor(color);
    renderCanvas();
}

function onDeleteLine() {
    console.log('hi')
    deleteLine();
    document.querySelector('.txt-input').value = getTxtToShow();
    setChosen();
    renderCanvas();
}

function onChangeFont(font) {
    changeFont(font);
    gCurrFont = font;
    renderCanvas();
}

function onDownloadMeme(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;

}



// function addListeners() {
//     addMouseListeners()
//     addTouchListeners()
//     window.addEventListener('resize', () => {
//         resizeCanvas()
//         renderCanvas()
//     })
// }

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMoveTouch)
    gCanvas.addEventListener('touchstart', onStartTouch)
    gCanvas.addEventListener('touchend', onEndTouch)
}

function onDown() {
    gIsMouseDown = true;
}

function onMove(ev) {
    var dimensions = getTxtDimensions();
    if (gIsMouseDown) {
        var x = ev.offsetX - (dimensions.x / 2);
        var y = ev.offsetY;
        moveTxt(x, y);
        renderCanvas()
    }
}

function onUp() {
    gIsMouseDown = false;
}

function onStartTouch(ev) {
    ev.preventDefault();
    gIsMouseDown = true;
}

function onMoveTouch(ev) {
    if (gIsMouseDown) {
        const { x, y, width, height } = ev.target.getBoundingClientRect();
        const offsetX = (ev.touches[0].clientX - x) / width * ev.target.offsetWidth;
        const offsetY = (ev.touches[0].clientY - y) / height * ev.target.offsetHeight;
        moveTxt(offsetX, offsetY);
        renderCanvas();
    }
}

function onEndTouch() {
    gIsMouseDown = false;
}