const $gridTd = Array.from(document.querySelectorAll(".grid-td"));
const $tr = document.querySelectorAll('tr');
const $keyboard = document.querySelector(".keyboard");
const $keyboardKey = Array.from(document.querySelectorAll('.key'));
let actual = 0;
let column = 0;
let wordInput = ""
const maxRow = $tr.length - 1;
let row = 0;
const keywords = ["abeja","zorro","araña","burro","cabra","cebra","gallo","mosca","raton","perro","pulpo","erizo","cerdo","tigre","cisne","corzo","ganso","gamba","hiena","huron","koala","lince","llama","mamut","morsa","oruga","ostra","oveja","potro","pulga","tejon","yegua"];
const allowLetters = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l", "ñ", "z","x","c","v","b","n","m"];
const maxValue = keywords.length - 1;
const maxColumn = 5
const btnClose = document.getElementById('btn-close');
const message = document.querySelector('.message');
const gameOver = document.querySelector('.message--game-over');
const closeDialogGameOver = gameOver.querySelector('.close');
const messageVictory = document.querySelector('.message--victory');
const showInstruction = (sessionStorage.getItem('instruction') !== null)? sessionStorage.getItem('instruction') : null; 
let wordDiscover = false;

if(!showInstruction){
    message.classList.remove('hidden');
    sessionStorage.setItem('instruction',true)
}

const restarGame = () =>{
    location.reload();
}

const getRandomWorld = (maxValue) =>{
    const randomIndex = Math.round(Math.random() * maxValue);
    return keywords[randomIndex];
}

const showVictory = () =>{
    messageVictory.classList.remove('hidden');
}

const deletedListeners = () =>{
    $keyboard.removeEventListener('click',responseClick);
    document.body.removeEventListener('keydown',responseKeyboard);
}


const keyword = getRandomWorld(maxValue);


console.log(` Palabra clave ${keyword}`);

const endGame = () =>{
    const $answerText = gameOver.querySelector('.answer__text');
    $answerText.textContent = keyword;
    setTimeout(()=>{
        gameOver.classList.remove('hidden');
    },1000)
    deletedListeners();
}

const incrementRow = () =>{
    if(row === maxRow){
        console.log("No hay mas filas");
       if(!wordDiscover) endGame();
        return
    }

    row++;
}

const incrementColumn = () =>{
    if(column === maxColumn) return;
    column++;
}

const validateColumn = () =>{
    const maxRow = $tr[row].childElementCount - 1;
    if(column > maxRow){
        console.log("No hay mas columnas");
        return false;
    }

    return true;
}

const addLetter = (letter) =>{
   if(validateColumn()){
        $tr[row].children[column].classList.add('active-border');
        $tr[row].children[column].classList.add('animateLetteer');
        $tr[row].children[column].textContent = letter;
        incrementColumn();
   }
} 

const decreaseColumn = () =>{
    if(column === 0) return;
    column--;
}

const resetColumn = () =>{
    column = 0;
}


const deletedLetter = () =>{    
    if(column <= 0) return;
    $tr[row].children[column-1].classList.remove('active-border');
    $tr[row].children[column-1].classList.remove('animateLetteer');
    $tr[row].children[column-1].textContent = "";
    decreaseColumn();
}

const victory = () =>{
    if(keyword === wordInput){
        wordDiscover = true;
        setTimeout(()=>{
            showVictory();
        },1000)
        deletedListeners();
        return true;
    }

    return false;
}

const paintKeyboard = ({keyStyle, letter}) =>{
    $keyboardKey.forEach(($key)=>{
        if($key.textContent.toLowerCase() === letter){
            $key.classList.add(keyStyle);
        }
    })
}

const checkLetters = () =>{
    const word = Array.from($tr[row].querySelectorAll(".grid-td"));
    const final = keyword.length - 1;

    for(let i = 0; i <= final; i++){
        wordInput+= word[i].textContent;
        if(keyword[i] === word[i].textContent){
            word[i].classList.add('letter-correct')
            paintKeyboard({
                keyStyle: 'letter-correct',
                letter: word[i].textContent
            });

        } else if(keyword.includes(word[i].textContent)){
            word[i].classList.add('letter-is')
            paintKeyboard({
                keyStyle: 'letter-is',
                letter: word[i].textContent
            })
        }else{
            word[i].classList.add('letter-not')
            paintKeyboard({
                keyStyle: 'letter-not',
                letter: word[i].textContent
            })
        }
    }
    victory();
    wordInput = '';
    incrementRow();
    resetColumn();
}

const check = () =>{
    if(column < $tr[0].childElementCount) return;
    checkLetters();
}


const responseClick = (event) =>{
    const target = event.target;

    if(target.matches(".key-deleted") || target.matches(".key-deleted > * ")){
        deletedLetter();;
    }

    if(target.matches(".key-enter") || target.matches(".key-enter > *")){
        check();
    }


    if(target.matches(".key")){
        const letter = target.textContent.toLowerCase();
        if(allowLetters.includes(letter)){
            addLetter(letter);
        }       
    }
}


const responseKeyboard = (event) =>{
    const key = event.key.toLowerCase();

    if(key === "backspace"){
        deletedLetter();
    }

    if(key === "enter"){
        check()
    }

    if(allowLetters.includes(key)){
        addLetter(key);
    }
}


document.addEventListener('click',(event)=>{
    const target = event.target;

    if(target.matches('.close')){
        const message = target.closest('.message');
        message.classList.add('hidden');
    }

    if(target.matches('.btngame')){
        restarGame();
    }
})


$keyboard.addEventListener('click',responseClick);

document.body.addEventListener('keydown',responseKeyboard)

