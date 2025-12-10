// 插畫路徑
const pics = {
    puppy: "images/pup.png",
    adult: "images/adult.png",
    senior: "images/senior.png"
};

// 初始化：讀取 localStorage
window.onload = () => {
    const last = localStorage.getItem("dogAgeRecord");
    if (last) {
        const data = JSON.parse(last);
        document.getElementById("lastRecord").style.display = "block";
        document.getElementById("lastRecord").innerHTML =
            `📌 上次計算：你的狗狗大約是 <b>${data.humanAge} 歲人類年齡</b>（${data.stage}）`;
    }
};

document.getElementById("calcBtn").addEventListener("click", function () {
    const birthDate = document.getElementById("birthDate").value;
    const size = document.getElementById("dogSize").value;
    if (!birthDate) return alert("請輸入狗狗出生日期！");

    const dogAgeYears = calculateDogAge(birthDate);
    const humanAge = convertToHumanAge(dogAgeYears, size);

    // 更新畫面
    document.getElementById("humanAge").innerText = `人類年齡：約 ${humanAge} 歲`;

    // 年齡階段
    const stage = getLifeStage(dogAgeYears);
    document.getElementById("lifeStage").innerText = `（年齡階段：${stage}）`;

    // 插畫更新
    updateIllustration(stage);

    // 進度條
    updateProgressBar(dogAgeYears);

    // 儲存 localStorage
    const record = { humanAge, stage };
    localStorage.setItem("dogAgeRecord", JSON.stringify(record));
});

// 計算狗狗實際年齡（以年為單位）
function calculateDogAge(birth) {
    const birthDate = new Date(birth);
    const now = new Date();
    const diff = now - birthDate;
    return diff / (1000 * 60 * 60 * 24 * 365);
}

// Cell Systems (2020) 換算公式
function convertToHumanAge(dogAge, size) {
    if (dogAge <= 0) return 0;

    // 原始模型：human ≈ 16 ln(dogAge) + 31
    let humanAge = 16 * Math.log(dogAge) + 31;

    // 體型補正（大型犬老化更快）
    if (size === "small") humanAge *= 0.9;
    if (size === "large") humanAge *= 1.1;

    return Math.round(humanAge);
}

// 回傳年齡階段
function getLifeStage(age) {
    if (age < 1) return "幼犬";
    if (age < 7) return "成犬";
    return "老犬";
}

// 插畫更換
function updateIllustration(stage) {
    const img = document.getElementById("dogFace");
    if (stage === "幼犬") img.src = pics.puppy;
    if (stage === "成犬") img.src = pics.adult;
    if (stage === "老犬") img.src = pics.senior;
}

// 進度條：以 20 年為壽命基準
function updateProgressBar(age) {
    const percent = Math.min((age / 20) * 100, 100);
    document.getElementById("progressBar").style.width = percent + "%";
}
