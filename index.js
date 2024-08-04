const typingTest = document.querySelector('.typing-test p');
// .typing-test class ke p tag ko select karne ke liye

const input = document.querySelector('.wrapper .input-field');
// .wrapper class ke andar jo .input-field class hai usko select karne ke liye

const time = document.querySelector('.time span b');
// .time class ke span tag ke andar jo b tag hai usko select karne ke liye

const mistake = document.querySelector('.mistake span');
// .mistake class ke span tag ko select karne ke liye

const wpm = document.querySelector('.wpm span');
// .wpm class ke span tag ko select karne ke liye

const cpm = document.querySelector('.cpm span');
// .cpm class ke span tag ko select karne ke liye

const btn = document.querySelector('button');
// pehle button ko select karne ke liye

// Set value
let timer;
// timer variable ko define karte hain

let maxTime = 60;
// maxTime variable ko 60 seconds set karte hain

let timeLeft = maxTime;
// timeLeft variable ko maxTime ke barabar set karte hain

let charIndex = 0;
// charIndex variable ko 0 set karte hain jo current character index track karega

let mistakes = 0;
// mistakes variable ko 0 set karte hain jo typing mistakes count karega

let isTyping = false;
// isTyping variable ko false set karte hain jo check karega ki typing start hui ya nahi

async function loadParagraph() {
    const response = await fetch('https://api.quotable.io/random?minLength=200&maxLength=300');
    // ek random paragraph fetch karte hain jo 200 to 300 characters ke beech ho

    const data = await response.json();
    // response ko JSON format mein convert karte hain

    const paragraph = data.content;
    // paragraph content ko data se extract karte hain
    
    typingTest.innerHTML = '';
    // typingTest element ka content clear karte hain

    for (const char of paragraph) {
        typingTest.innerHTML += `<span>${char}</span>`;
    }
    // har character ko span tag ke andar dalte hain aur typingTest element mein add karte hain

    typingTest.querySelectorAll('span')[0].classList.add('active');
    // pehle character span ko active class add karte hain

    document.addEventListener('keydown', () => input.focus());
    // jab bhi koi key press hoti hai, input field ko focus karte hain

    typingTest.addEventListener("click", () => {
        input.focus();
    });
    // jab bhi typingTest element pe click hoti hai, input field ko focus karte hain
}

// Handle User Input
function initTyping() {
    const chars = typingTest.querySelectorAll('span');
    // typingTest ke saare span tags ko select karte hain

    const typedChar = input.value.charAt(charIndex);
    // current input character ko select karte hain

    if (charIndex < chars.length && timeLeft > 0) {
        // agar charIndex characters se chhota hai aur timeLeft bacha hai

        if (!isTyping) {
            timer = setInterval(initTime, 1000);
            // agar typing shuru nahi hui, timer set karte hain jo har second initTime function call karega

            isTyping = true;
            // isTyping ko true set karte hain
        }

        if (chars[charIndex].innerText === typedChar) {
            chars[charIndex].classList.add('correct');
            // agar typed character sahi hai to usko correct class add karte hain
        } else {
            mistakes++;
            chars[charIndex].classList.add('incorrect');
            // agar typed character galat hai to mistakes increment karte hain aur incorrect class add karte hain
        }

        chars[charIndex].classList.remove('active');
        // current character se active class remove karte hain

        charIndex++;
        // charIndex increment karte hain

        if (charIndex < chars.length) {
            chars[charIndex].classList.add('active');
            // agla character active banate hain
        }

        mistake.innerText = mistakes;
        // mistakes ko update karte hain

        cpm.innerText = charIndex - mistakes;
        // cpm ko update karte hain (characters per minute)
    } else {
        clearInterval(timer);
        input.value = '';
        // agar character finish ho jaye ya time khatam ho jaye, timer clear karte hain aur input field ko reset karte hain
    }
}

function initTime() {
    if (timeLeft > 0) {
        timeLeft--;
        time.innerText = timeLeft;
        // agar time bacha hai to timeLeft ko decrement karte hain aur time element ko update karte hain

        let wpmVal = Math.round(((charIndex - mistakes) / 5) / ((maxTime - timeLeft) / 60));
        wpm.innerText = wpmVal;
        // wpm (words per minute) ko calculate karte hain aur update karte hain
    } else {
        clearInterval(timer);
        // agar time khatam ho jaye to timer clear karte hain
    }
}

function reset() {
    loadParagraph();
    clearInterval(timer);
    // loadParagraph function call karte hain aur timer clear karte hain

    timeLeft = maxTime;
    time.innerText = timeLeft;
    // timeLeft ko reset karte hain aur time element ko update karte hain

    input.value = '';
    charIndex = 0;
    mistakes = 0;
    isTyping = false;
    // input field aur saare variables ko reset karte hain

    wpm.innerText = 0;
    cpm.innerText = 0;
    mistake.innerText = 0;
    // wpm, cpm aur mistakes ko reset karte hain
}

input.addEventListener("input", initTyping);
// jab bhi input field mein kuch type hota hai, initTyping function call hota hai

btn.addEventListener("click", reset);
// button click pe reset function call hota hai

loadParagraph();
// initial paragraph load karte hain
