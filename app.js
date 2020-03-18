
const topSide = '❔'
let gameEmojis
let totalMoves 
let currentCardIndex
let completedCards
let winCount
let bestScore = 0
// KEY_LOCK used to limit access to only 2 cards at a time
let KEY_LOCK = false
const startGame = () => {
    let emojiCol = ["😀","🙈","🙊","🐶","🐺","🦊",
                "🦝","🐱","🦁","🐴","🐮","🐷",
                "🐭","🐔","🐟","🦞","🌞","❤️",
                "⭐","🌜","🌛","🤑","😇","🥵",
                "🤠","👿","☠️","🤡","🤖","🍉",
                "🍇","🍆","🌶️","🥦","🍄","🍔"]
    gameEmojis = []
    totalMoves = 0
    winCount = 0
    currentCardIndex = -1
    completedCards = {}
    KEY_LOCK = false
    if(localStorage.bestScore != 'undefined') {
        bestScore = localStorage.bestScore
        document.querySelector('#best-score span').innerText = bestScore
    }
    document.querySelector('#your-score span').textContent = 0
    // clear playing board
    const grid = document.querySelector('.grid')
    while(grid.firstChild) {
        grid.removeChild(grid.lastChild)
    }    
    // add cards to playing board
    for(let i = 0; i < 36; i++) {
        addCardToGame(i)
    }
    let tempEmojis = []
    // select 18 emojis from list of emojis
    for(let i = 0; i < 18; i++) {
        let t = Math.floor(Math.random() * emojiCol.length)
        tempEmojis.push(emojiCol[i])
        emojiCol.splice(t, 1)
    }
    let temp = {}, tempIndex = 0, last = 0
    // randomly pick from list of 18 emojis and insert each twice in shuffled locations
    for(let i = 0; i < 36; i++) {
        tempIndex = Math.floor(Math.random() * tempEmojis.length)
        while(Math.abs(tempIndex - last) < 2 && tempEmojis.length > 4){
            tempIndex = Math.floor(Math.random() * tempEmojis.length)
        } 
        gameEmojis.push(tempEmojis[tempIndex])
        if(!temp[tempEmojis[tempIndex]]) temp[tempEmojis[tempIndex]] = 1
        else tempEmojis.splice(tempIndex, 1) 
        last = tempIndex   
    }
    // add event listener to each card
    for(let c of document.querySelector('.grid').children) {
        c.addEventListener('click', (e) => {
            if(!KEY_LOCK) {
                KEY_LOCK = true
                c.classList.toggle('flipped')
                setTimeout(() => {                
                    c.innerText = gameEmojis[c.dataset.index]                
                    checkGameMove(e.target.dataset.index)
                }, 600) 
            }
        })
    }
}

const addCardToGame = idx => {
    const grid = document.querySelector('.grid')
    const newCard = document.createElement('span')
    newCard.innerText = topSide
    newCard.className = 'grid-item'
    newCard.style.backgroundColor = '#ebfcfc'
    newCard.dataset.index = idx
    grid.append(newCard)
}

const checkGameMove = (newIndex) => {    
    if(currentCardIndex == -1) {
        currentCardIndex = newIndex
        KEY_LOCK = false
    } else if(gameEmojis[currentCardIndex] == gameEmojis[newIndex]) {
        completedCards[currentCardIndex] = 1
        completedCards[newIndex] = 1
        updateScore(currentCardIndex, newIndex)
    } else {
        resetCards(currentCardIndex, newIndex) 
        document.querySelector('#your-score span').innerText = ++totalMoves
    }    
}

const updateScore = (i, j) => {
    let t = document.querySelector('.grid').children 
    t[i].style.backgroundColor ='#efeaf0'
    t[j].style.backgroundColor = '#efeaf0'    
    currentCardIndex = -1
    KEY_LOCK = false
    winCount++
    if(winCount == 18 && (!bestScore || totalMoves < bestScore)) {
        bestScore = totalMoves
        document.querySelector('#best-score span').innerText = bestScore
        localStorage.setItem("bestScore", bestScore)
    }
}

const resetCards = (i, j) => {
    setTimeout(() => {
        let t = document.querySelector('.grid').children 
        t[i].classList.toggle('flipped')
        t[j].classList.toggle('flipped')
        setTimeout(() => {
            t[i].innerText = topSide
            t[j].innerText = topSide
            KEY_LOCK = false
        }, 600) 
    }, 1000)  
    currentCardIndex = -1     
}

document.querySelector('#start-game').addEventListener('click', () => {
    startGame();
})

startGame();

