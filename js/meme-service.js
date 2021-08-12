'use strict';
const KEY = 'memesDB'

var gImages = [
    { id: 1, src: 'images/1.jpg', keywords: ['All', 'Funny', 'Men'] },
    { id: 2, src: 'images/2.jpg', keywords: ['All', 'Animal'] },
    { id: 3, src: 'images/3.jpg', keywords: ['All', 'Animal'] },
    { id: 4, src: 'images/4.jpg', keywords: ['All', 'Animal'] },
    { id: 5, src: 'images/5.jpg', keywords: ['All', 'Funny'] },
    { id: 6, src: 'images/6.jpg', keywords: ['All', 'Men', 'Smile'] },
    { id: 7, src: 'images/7.jpg', keywords: ['All', 'Funny', 'Smile'] },
    { id: 8, src: 'images/8.jpg', keywords: ['All', 'Men', 'Smile'] },
    { id: 9, src: 'images/9.jpg', keywords: ['All', 'Funny', 'Comic'] },
    { id: 10, src: 'images/10.jpg', keywords: ['All', 'Men', 'Funny', 'Smile'] },
    { id: 11, src: 'images/11.jpg', keywords: ['All', 'Men', 'Funny'] },
    { id: 12, src: 'images/12.jpg', keywords: ['All', 'Men'] },
    { id: 13, src: 'images/13.jpg', keywords: ['All', 'Men', 'Smile'] },
    { id: 14, src: 'images/14.jpg', keywords: ['All', 'Men'] },
    { id: 15, src: 'images/15.jpg', keywords: ['All', 'Men', 'Smile'] },
    { id: 16, src: 'images/16.jpg', keywords: ['All', 'Men', 'Funny'] },
    { id: 17, src: 'images/17.jpg', keywords: ['All', 'Men'] },
    { id: 18, src: 'images/18.jpg', keywords: ['All', 'Comic'] }
];

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: '',
            size: 40,
            align: 'center',
            color: 'black',
            isStroke: true,
            pos: { x: 200, y: 20 },
            isChosen: true,
        },
    ],
}

var gSavedMemes = [];
loadSavedMemes()
function addNewLine(txt, w, h, color) {
    var linesCount = gMeme.lines.length;
    if (linesCount === 1) {
        var posX = 200;
        var posY = h - 55;

    } else if (linesCount >= 2) {
        var posY = 200;
    }

    var newLine = {
        txt,
        size: 40,
        align: 'center',
        color: 'black',
        isStroke: true,
        pos: { x: 200, y: posY },
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = linesCount;
}


function getImagesToShow() {
    return gImages;
}
function getLinesToShow() {
    return gMeme.lines;
}

function getimgIdxById() {
    return gImages.findIndex(img =>
        img.id === gMeme.selectedImgId
    )
}

function getImgSrc() {
    const idx = getimgIdxById();
    return gImages[idx].src;
}

function getTxtToShow() {
    return gMeme.lines[gMeme.selectedLineIdx].txt;
}

function getTxtSize() {
    return gMeme.lines[gMeme.selectedLineIdx].size;
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function setSelectImg(id) {
    gMeme.selectedImgId = id;
}


function changeLine() {
    if (gMeme.lines.length === 0) return
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
        gMeme.selectedLineIdx = 0;
        return;
    }
    gMeme.selectedLineIdx++;
}
function increaseFontSize() {
    gMeme.lines[gMeme.selectedLineIdx].size++;
}

function decreaseFontSize() {
    gMeme.lines[gMeme.selectedLineIdx].size--;
}

function setFontColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function deleteLine() {
    if (gMeme.selectedLineIdx > 0) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        gMeme.selectedLineIdx--;
    } else if (gMeme.selectedLineIdx === 0) {
        gMeme.selectedLineIdx = 0;
        gMeme.lines[0].txt = '';
    } else {
        return;
    }
}

function getTextWidth() {
    return gCtx.measureText(gMeme.lines[selectedLineIdx].txt).width;
}

function getTextHeight() {
    return gMeme.lines[gMeme.selectedLineIdx].txt * 1.5;
}

function setStroke() {
    (gMeme.lines[gMeme.selectedLineIdx].isStroke) ? gMeme.lines[gMeme.selectedLineIdx].isStroke = false : gMeme.lines[gMeme.selectedLineIdx].isStroke = true;

}

function changeFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function getTxtDimensions() {
    var txt = gMeme.lines[gMeme.selectedLineIdx].txt;
    var lineHeight = txt * 1.286;
    var textWidth = gCtx.measureText(txt).width;
    return { x: textWidth, y: lineHeight }
}

function setChosen() {
    gMeme.lines.forEach(line => {
        line.isChosen = false;
    })
    gMeme.lines[gMeme.selectedLineIdx].isChosen = true;
}

function moveTxt(x, y) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x = x;
    gMeme.lines[gMeme.selectedLineIdx].pos.y = y;
}

function loadSavedMemes() {
    const memes = loadFromStorage(KEY);
    if (memes) {
        memes.forEach(meme => {
            gSavedMemes.push(meme);
        })
    }
    _saveToStorage();
}

function getSavedMemesToShow() {
    return gSavedMemes;
}


function addToStorage(meme) {
    const id = makeId();
    const memeObj = { id, meme };
    gSavedMemes.push(memeObj)
    _saveToStorage()
}

function filterMemes(word) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
    if (word !== 'All' && word !== 'all' && word !== 'Men' && word !== 'men' && word !== 'Funny' && word !== 'funny' && word !== 'Animal' && word !== 'animal' && word !== 'Smile' && word !== 'smile' && word !== 'Comic' && word !== 'comic') {
        word = 'All'
    }

    var filteredMemes = [];
    gImages.forEach(img => {
        if (img.keywords.includes(word)) {
            filteredMemes.push(img);
        }
    })
    return filteredMemes;
}


function _saveToStorage() {
    saveToStorage(KEY, gSavedMemes);
}