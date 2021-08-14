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
    addMouseListeners()
    addTouchListeners();
    renderGallery();
    renderCanvas();

}

function resizeCanvas() {
    const elCanvContainer = document.querySelector('.canvas-container');
    gCanvas.width = 400;
    gCanvas.height = 400;
}

function renderGallery() {
    var images = getImagesToShow();
    var strHTMLs = `<label for="upload-img"><div  class="upload gallery-img">Upload your own photo</div></label><input onchange="onImgInput(event)" id="upload-img" class="upload-img" type="file">`;
    images.map(img => {
        return strHTMLs += `<img class="gallery-img" src="${img.src}" onclick="onSelectImg(${img.id})"/>`
    })

    document.querySelector('.images-container').innerHTML = strHTMLs;
}


function renderCanvas() {
    const img = new Image();
    img.src = getImgSrc();
    img.onload = () => {
        // fitImageOn(img)
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
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'top';
        if (line.isChosen) {
            gCtx.strokeStyle = 'black'
            gCtx.strokeRect(line.pos.x - (textWidth / 2), line.pos.y - 5, textWidth, lineHeight);
        }
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.fillStyle = `${line.color}`
        gCtx.strokeStyle = '#000';
        if (line.isStroke) {
            gCtx.lineWidth = 2;
            gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
        }
        gCtx.fillText(line.txt, line.pos.x, line.pos.y)
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

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader()

    reader.onload = function (event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])


}

function renderImg(img) {
    img.src.replace('image/png', 'image/jpeg')
    var imagesLength = getImagesLength();
    createImg(img.src, imagesLength + 1);
    setSelectImg(imagesLength + 1);
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

function onDown(ev) {
    gIsMouseDown = true;
}

function onMove(ev) {
    var dimensions = getTxtDimensions();
    if (gIsMouseDown) {
        var x = ev.offsetX;
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

function onSelectLine(ev) {
    return gCtx.isPointInStroke(ev.offsetX, ev.offsetY)
}

function onSaveMeme() {
    var lines = getLinesToShow();
    lines.forEach(line => {
        line.isChosen = false;
    });
    renderCanvas();
    setTimeout(() => {
        const meme = gCanvas.toDataURL().replace('image/png', 'image/jpeg');
        addToStorage(meme);
    }, 100)

    document.querySelector('.modal-container').style.display = 'block';
    document.body.classList.toggle('modal-open');

    setTimeout(() => {
        document.querySelector('.modal-container').style.display = 'none';
        document.body.classList.toggle('modal-open');
    }, 1000)

}

function onRenderSavedMemes(isDeleted) {
    if (!isDeleted) onToggleMenu();
    var memes = getSavedMemesToShow();
    var strHTMLs = '';
    memes.map(meme => {
        return strHTMLs += `<div class="saved-meme-container"><img class="gallery-img" src="${meme.meme}"/><i onclick="onDeleteSavedMeme('${meme.id}')" class="delete-icon fas fa-times"></i></div>`
    })
    document.querySelector('.images-container').innerHTML = strHTMLs;
    if (!document.querySelector('.edit-container').classList.contains('hidden')) {
        document.querySelector('.edit-container').classList.toggle('hidden');
        document.querySelector('.gallery-container-main').classList.toggle('hidden');
    }

}

function onDeleteSavedMeme(imgIdx) {
    console.log('id', imgIdx)
    deleteSavedMeme(imgIdx);
    onRenderSavedMemes(true);
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open');
}

function onToggleModal() {
    document.body.classList.toggle('modal-open');
    document.querySelector('.about-modal-container').style.display = 'none';
}

function onFilterMemes(elItem) {
    var elWord = elItem.innerText;
    var filteredImgs = filterMemes(elWord);
    var strHTMLs = `<label for="upload-img"><div  class="upload gallery-img">Upload your own photo</div></label><input onchange="onImgInput(event)" id="upload-img" class="upload-img" type="file">`;
    filteredImgs.map(img => {
        return strHTMLs += `<img class="gallery-img" src="${img.src}" onclick="onSelectImg(${img.id})"/>`
    })

    document.querySelector('.images-container').innerHTML = strHTMLs;
}

function onFilterMemesInput(word) {
    console.log(word);
    var filteredImgs = filterMemes(word)
    var strHTMLs = '';
    filteredImgs.map(img => {
        return strHTMLs += `<img class="gallery-img" src="${img.src}" onclick="onSelectImg(${img.id})"/>`
    })
    document.querySelector('.images-container').innerHTML = strHTMLs;
}

function onToggleAbout(isMobile) {
    if (isMobile) onToggleMenu();
    document.querySelector('.about-modal-container').style.display = 'block';
    document.body.classList.toggle('modal-open');
}