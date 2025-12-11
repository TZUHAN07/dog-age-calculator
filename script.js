// 插畫切換：幼犬 / 成犬 / 老犬
const pics = {
    puppy: "images/pup.png",
    adult: "images/adult.png",
    senior: "images/senior.png"
};

const calcBtn = document.getElementById("calc-btn");
const birthdateInput = document.getElementById("birthdate"); 
const sizeSelect = document.getElementById("size");
const resultBox = document.getElementById("result");
const dogImg = document.getElementById("dog-illustration");
const ageText = document.getElementById("age-text");
const stageText = document.getElementById("stage-text");
const progressBar = document.getElementById("progress-bar");
const saveMsg = document.getElementById("save-msg");

function calculateAndDisplay() {
    const birthdate = birthdateInput.value;
    const size = sizeSelect.value;

    if (!birthdate) {
        // 如果沒有生日，不執行換算
        resultBox.classList.add("hidden");
        saveMsg.textContent = "";
        return;
    }

    const birth = new Date(birthdate);
    const now = new Date();

    let dogAgeYears = (now - birth) / (1000 * 60 * 60 * 24 * 365);

    // 體型加權（大型犬老化快）
    const sizeFactor = { small: 0.95, medium: 1, large: 1.15 };
    dogAgeYears *= sizeFactor[size];
    
    // 檢查 log 函數輸入必須大於 0
    if (dogAgeYears <= 0) {
        dogAgeYears = 0.01; 
    }

    // Cell Systems公式：human = 16 * ln(dogAge) + 31
    const humanAge = Math.round(16 * Math.log(dogAgeYears) + 31);

    // ---- 年齡階段判定 ----
    let stage = "";
    if (humanAge < 25) {
        stage = "幼犬";
        dogImg.src = pics.puppy;
    } else if (humanAge < 55) {
        stage = "成犬";
        dogImg.src = pics.adult;
    } else {
        stage = "老犬";
        dogImg.src = pics.senior;
    }
    ageText.textContent = `人類年齡：約 ${humanAge} 歲`;
    stageText.textContent = `年齡階段：${stage}`;
    progressBar.style.width = Math.min((humanAge / 80) * 100, 100) + "%";

    resultBox.classList.remove("hidden");

    // ---- 存到 LocalStorage ----
    const data = {
        birthdate,
        size,
        humanAge,
        stage,
        time: new Date().toLocaleString()
    };
    localStorage.setItem("dogAgeRecord", JSON.stringify(data));

    saveMsg.textContent = "✔ 已為你紀錄此次換算結果（LocalStorage）";
}

// --- 載入 LocalStorage 紀錄 ---
function loadFromLocalStorage() {
    const savedData = localStorage.getItem("dogAgeRecord");
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // 填入上次儲存的值
            birthdateInput.value = data.birthdate;
            sizeSelect.value = data.size;
            
            // 自動觸發換算，顯示結果
            calculateAndDisplay(); 
            
            // 顯示載入成功的訊息
            saveMsg.textContent = `上次換算結果 (於 ${data.time}) 已自動載入。`;

        } catch (e) {
            console.error("解析 LocalStorage 失敗:", e);
            localStorage.removeItem("dogAgeRecord"); // 清除無效的紀錄
        }
    }
}

// --- 事件監聽器與初始化 ---

// 點擊按鈕時執行換算
calcBtn.addEventListener("click", calculateAndDisplay);

// 頁面載入完成後，嘗試載入上次儲存的資料
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);