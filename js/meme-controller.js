'use strict';

var gCanvas;
var gCtx;
var gCurrFont = 'Impact';
var gStartPos;
var gIsMoving = false;


function onInit() {
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');
    resizeCanvas();
    // addListeners()
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
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.fillStyle = `${line.color}`
        gCtx.strokeStyle = '#000';
        if (line.isStroke) {
            gCtx.lineWidth = 2;
            gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
        }

        gCtx.fillText(line.txt, line.pos.x, line.pos.y)
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
    var txt = document.querySelector('.txt-input').value = '';
    const color = document.querySelector('.color-input').value;
    addNewLine(txt, gCanvas.width, gCanvas.height, color);
    renderCanvas();
}

function onChangeLine() {
    changeLine();
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

// function addMouseListeners() {
//     gCanvas.addEventListener('mousemove', onMove)
//     gCanvas.addEventListener('mousedown', onDown)
//     gCanvas.addEventListener('mouseup', onUp)
// }

// function addTouchListeners() {
//     gCanvas.addEventListener('touchmove', onMove)
//     gCanvas.addEventListener('touchstart', onDown)
//     gCanvas.addEventListener('touchend', onUp)
// }

// function onDown(ev) {
//     const pos = getEvPos(ev)
//     if (!isCircleClicked(pos)) return
//     setCircleDrag(true)
//     gStartPos = pos
//     document.body.style.cursor = 'grabbing'

// }

// function onMove(ev) {
//     const circle = getCircle();
//     if (circle.isDrag) {
//         const pos = getEvPos(ev)
//         const dx = pos.x - gStartPos.x
//         const dy = pos.y - gStartPos.y
//         moveCircle(dx, dy)
//         gStartPos = pos
//         renderCanvas()
//     }
// }

// function onUp() {
//     setCircleDrag(false)
//     document.body.style.cursor = 'grab'
// }



// function getEvPos(ev) {
//     var pos = {
//         x: ev.offsetX,
//         y: ev.offsetY
//     }
//     if (gTouchEvs.includes(ev.type)) {
//         ev.preventDefault()
//         ev = ev.changedTouches[0]
//         pos = {
//             x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
//             y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
//         }
//     }
//     return pos
// }