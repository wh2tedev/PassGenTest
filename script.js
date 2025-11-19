const passwordInput = document.getElementById("password");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const eyeBtn = document.getElementById("eyeBtn");
const lengthInput = document.getElementById("length");
const uppercaseCheckbox = document.getElementById("uppercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const historyList = document.getElementById("history");
const checkmark = document.querySelector(".checkmark");

function generatePassword(){
    const length=parseInt(lengthInput.value);
    let chars="abcdefghijklmnopqrstuvwxyz";
    if(uppercaseCheckbox.checked) chars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if(numbersCheckbox.checked) chars+="0123456789";
    if(symbolsCheckbox.checked) chars+="!@#$%^&*()_+[]{}|;:,.<>?";
    if(!chars) return;
    let password="";
    const cryptoObj=window.crypto||window.msCrypto;
    const randomValues=new Uint32Array(length);
    cryptoObj.getRandomValues(randomValues);
    randomValues.forEach(v=>password+=chars[v%chars.length]);
    passwordInput.value=password;
    animatePasswordInput();
    savePasswordToHistory(password);
}

function animatePasswordInput(){
    passwordInput.style.transform="scale(1.05)";
    setTimeout(()=>passwordInput.style.transform="scale(1)",200);
}

function savePasswordToHistory(p){
    let history=JSON.parse(localStorage.getItem("passwordHistory"))||[];
    if(history.length>=5) history.pop();
    history.unshift(p);
    localStorage.setItem("passwordHistory",JSON.stringify(history));
    loadHistory(true);
}

function loadHistory(animate=false){
    const history=JSON.parse(localStorage.getItem("passwordHistory"))||[];
    historyList.innerHTML="";
    history.forEach((p,i)=>{
        const li=document.createElement("li");
        li.classList.add("history-item");
        li.title=p;

        const spanText = document.createElement("span");
        spanText.textContent = p;
        spanText.classList.add("history-text");

        const btnDelete=document.createElement("button");
        btnDelete.textContent="Eliminar";
        btnDelete.addEventListener("click",()=>removeHistory(i,li));

        const btnCopy = document.createElement("button");
        btnCopy.classList.add("copy-history-btn");
        btnCopy.title="Copiar";
        btnCopy.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                             </svg>
                             <span class="checkmark-history">✔</span>`;

        btnCopy.addEventListener("click",()=>{
            navigator.clipboard.writeText(p).then(()=>{
                const check = btnCopy.querySelector(".checkmark-history");
                check.style.opacity=1;
                check.style.transform="scale(1)";
                setTimeout(()=>{
                    check.style.opacity=0;
                    check.style.transform="scale(0)";
                },1000);
            });
        });

        li.appendChild(spanText);
        li.appendChild(btnCopy);
        li.appendChild(btnDelete);
        historyList.appendChild(li);

        if(animate) setTimeout(()=>li.classList.add("show"),50*i);
        else li.classList.add("show");
    });
}

function removeHistory(i,li){
    li.style.opacity=0;
    li.style.transform="translateX(20px)";
    setTimeout(()=>{
        let history=JSON.parse(localStorage.getItem("passwordHistory"))||[];
        history.splice(i,1);
        localStorage.setItem("passwordHistory",JSON.stringify(history));
        loadHistory();
    },300);
}

function copyPassword(){
    if(!passwordInput.value) return;
    navigator.clipboard.writeText(passwordInput.value).then(()=>{
        checkmark.style.opacity=1;
        checkmark.style.transform="scale(1)";
        setTimeout(()=>{
            checkmark.style.opacity=0;
            checkmark.style.transform="scale(0)";
        },1000);
    });
}

function togglePasswordVisibility(){
    if(passwordInput.type==="password"){
        passwordInput.type="text";
        eyeBtn.style.transform="translateX(-50%) scale(1.1)";
    } else {
        passwordInput.type="password";
        eyeBtn.style.transform="translateX(-50%) scale(1)";
    }
}

// Settings
function saveSettings(){
    const settings={
        length:parseInt(lengthInput.value),
        uppercase:uppercaseCheckbox.checked,
        numbers:numbersCheckbox.checked,
        symbols:symbolsCheckbox.checked
    };
    localStorage.setItem("passwordSettings",JSON.stringify(settings));
}

function loadSettings(){
    const settings=JSON.parse(localStorage.getItem("passwordSettings"))||{};
    lengthInput.value=settings.length||16;
    uppercaseCheckbox.checked=settings.uppercase??false;
    numbersCheckbox.checked=settings.numbers??true;
    symbolsCheckbox.checked=settings.symbols??true;
}

[lengthInput,uppercaseCheckbox,numbersCheckbox,symbolsCheckbox].forEach(el=>el.addEventListener("change",saveSettings));
generateBtn.addEventListener("click",generatePassword);
copyBtn.addEventListener("click",copyPassword);
eyeBtn.addEventListener("click",togglePasswordVisibility);

loadSettings();
loadHistory();
passwordInput.type="password";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker registrado"))
    .catch((err) => console.log("Error Service Worker:", err));
}