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
    gCanvas.width = 400;
    gCanvas.height = 400;
}

function renderGallery() {
    const images = getImagesToShow();
    let strHTMLs = `<label for="upload-img"><div  class="upload gallery-img">Upload your own photo</div></label><input onchange="onImgInput(event)" id="upload-img" class="upload-img" type="file">`;
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
        const lineHeight = line.size * 1.2;
        var textWidth = gCtx.measureText(line.txt).width;
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'top';
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.fillStyle = `${line.color}`
        gCtx.strokeStyle = '#000';
        if (line.isStroke) {
            gCtx.lineWidth = 2;
            gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
        }
        if (line.isChosen) {
            gCtx.strokeStyle = 'black'
            gCtx.strokeRect(line.pos.x - (textWidth / 2), line.pos.y - 5, textWidth, lineHeight);
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
    const reader = new FileReader()

    reader.onload = function (event) {
        const img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])


}

function renderImg(img) {
    img.src.replace('image/png', 'image/jpeg')
    const imagesLength = getImagesLength();
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
    const txt = document.querySelector('.txt-input').value = '';
    const color = document.querySelector('.color-input').value;
    addNewLine(txt, gCanvas.width, gCanvas.height, color);
    setChosen();
    renderCanvas();
}

function onChangeLine() {
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
    let memes = getLinesToShow();
    document.querySelector('.txt-input').value = '';
    memes.forEach(line => {
        line.isChosen = false;
    })
    const idx = isLineChosen(ev.offsetX, ev.offsetY);
    if (idx !== -1) {
        setMemeIdx(idx);
        document.querySelector('.txt-input').value = getTxtToShow();
    }
    renderCanvas();
}

function onMove(ev) {
    const dimensions = getTxtDimensions();
    if (gIsMouseDown) {
        var x = ev.offsetX;
        var y = ev.offsetY - (dimensions.y / 2);
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
    const memes = getLinesToShow();
    memes.forEach(line => {
        line.isChosen = false;
    })
    const { x, y, width, height } = ev.target.getBoundingClientRect();
    const offsetX = (ev.touches[0].clientX - x) / width * ev.target.offsetWidth;
    const offsetY = (ev.touches[0].clientY - y) / height * (ev.target.offsetHeight + 70);

    const idx = isLineChosen(offsetX, offsetY);
    if (idx !== -1) {
        setMemeIdx(idx);
    }
    renderCanvas();
}

function onMoveTouch(ev) {
    if (gIsMouseDown) {
        const { x, y, width, height } = ev.target.getBoundingClientRect();
        const offsetX = (ev.touches[0].clientX - x) / width * ev.target.offsetWidth;
        const offsetY = (ev.touches[0].clientY - y) / height * (ev.target.offsetHeight + 70);
        moveTxt(offsetX, offsetY);
        renderCanvas();
    }
}

function onEndTouch() {
    gIsMouseDown = false;
}


function onSaveMeme() {
    const lines = getLinesToShow();
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
    const memes = getSavedMemesToShow();
    let strHTMLs = '';

    memes.map(meme => {
        return strHTMLs += `
        <div class="saved-meme-container"><img class="gallery-img" src="${meme.meme}"/>
        <a onclick="onDownloadSavedMeme(this, '${meme.meme}')"  href="" download="myPhoto"><i class="download-icon fas fa-download"></i></a>
        <i onclick="onDeleteSavedMeme('${meme.id}')" class="delete-icon fas fa-times"></i></div>`
    })
    document.querySelector('.images-container').innerHTML = strHTMLs;
    if (!document.querySelector('.edit-container').classList.contains('hidden')) {
        document.querySelector('.edit-container').classList.toggle('hidden');
        document.querySelector('.gallery-container-main').classList.toggle('hidden');
    }

}

function onDeleteSavedMeme(imgIdx) {
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
    const elWord = elItem.innerText;
    const filteredImgs = filterMemes(elWord);
    let strHTMLs = `<label for="upload-img"><div  class="upload gallery-img">Upload your own photo</div></label><input onchange="onImgInput(event)" id="upload-img" class="upload-img" type="file">`;
    filteredImgs.map(img => {
        return strHTMLs += `<img class="gallery-img" src="${img.src}" onclick="onSelectImg(${img.id})"/>`
    })

    document.querySelector('.images-container').innerHTML = strHTMLs;
}

function onFilterMemesInput(word) {
    const filteredImgs = filterMemes(word)
    let strHTMLs = '';
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

function onAlignText(pos) {

    if (pos === 'left') {
        setAlignPos(100)
    } else if (pos === 'right') {
        setAlignPos(300)
    } else if (pos === 'center') {
        setAlignPos(200)
    }
    renderCanvas();
}

function onDownloadSavedMeme(elLink, memeImg) {
    const data = memeImg;
    console.log(memeImg);
    elLink.href = data;
}