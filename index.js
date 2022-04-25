
document.addEventListener('keyup', logKey);
window.GameSettings = {
    IsGameStarted: false,
    WordsSample: [],
    WordSampleIndex: 0
};
window.Current = {
    WordLength: 0,
    TypingIndex: 0
}
$(document).ready(function () {
    setTimeout(() => {
        $(".main").css("display", "block");
        $(".matrix").addClass("displayNone");
        RenderKeyButtons();
    }, 6000);
});

function logKey(e) {
    if (window.GameSettings.IsGameStarted) {
        if (e.code === "Backspace" && window.Current.TypingIndex >= 0) {
            removeCharBox();
        } else if ((e.which <= 90 && e.which >= 48 || [219, 221, 186, 222, 191, 220].includes(e.which))
            && (window.Current.TypingIndex <= window.Current.WordLength && window.Current.TypingIndex >= 0)) {
            setCharBox(e.key);
            window.Current = { WordLength: window.Current.WordLength, TypingIndex: (window.Current.TypingIndex + 1) };
        }
    }
}

function StartNewGame() {
    $(".main").css("display", "none");
    $(".game").css("display", "block");
    window.GameSettings.IsGameStarted = true;
    window.GameSettings.WordSampleIndex = 0;
    SetGameSample();
}

function SetGameSample() {
    ClearGameSample();
    GenerateGamePanel(window.GameSettings.WordsSample[window.GameSettings.WordSampleIndex]);
}

function ClearGameSample() {
    $(".game-panel").html("");
    $(".game-text-panel > span").html("");
}

function GenerateGamePanel(wordSample) {
    if ('content' in document.createElement('template')) {
        var gamePanel = document.querySelector(".game-panel");
        var template = document.querySelector('#gamepanelbox');
        var whitespaceIndexes = findWhiteSpace(wordSample.Text);
        wordSample.Text.replace(' ', '').split("").forEach((element, index) => {
            var clone = template.content.cloneNode(true);
            var box = clone.querySelectorAll(".game-panel-char-box");
            box[0].id = "divchar" + index;
            var boxSpan = clone.querySelectorAll(".game-panel-char-box>span");
            boxSpan[0].id = "char" + index;;
            boxSpan[0].textContent = " ";
            if (index == 0)
                boxSpan[0].classList.add('typing');
            else
                box[0].classList.add('closed');
            if (whitespaceIndexes.includes(index)) {
                box[0].style.marginLeft = "30px";
            }
            gamePanel.appendChild(clone);
        });
        window.GameText = {
            className: "game-text-panel > span",
            text: wordSample.Meaning,
            index: 0,
            typeSpeed: 20
        };
        window.Current = { WordLength: wordSample.Length, TypingIndex: 0 };
        gameTextTypeAnimation()
    } else {
        console.error("template")
    }
}

function RenderKeyButtons() {
    if ('content' in document.createElement('template')) {
        var keyPanel1 = document.querySelector("#keys1");
        var template1 = document.querySelector('#keybutton');
        var letters1 = "QWERTYUIOPĞÜ";
        letters1.split('').forEach((key, index) => {
            var clone = template1.content.cloneNode(true);
            var box = clone.querySelectorAll(".key-button");
            box[0].id = "div_" + key;
            box[0].textContent = key;
            box[0].addEventListener('click', function (key) { keyButtonClick(key) }.bind(this, key));
            keyPanel1.appendChild(clone);
        });

        var keyPanel2 = document.querySelector("#keys2");
        var template2 = document.querySelector('#keybutton');
        var letters2 = "ASDFGHJKLŞİ";
        letters2.split('').forEach((key, index) => {
            var clone = template2.content.cloneNode(true);
            var box = clone.querySelectorAll(".key-button");
            box[0].id = "div_" + key;
            box[0].textContent = key;
            box[0].addEventListener('click', function (key) { keyButtonClick(key) }.bind(this, key));
            keyPanel2.appendChild(clone);
        });

        var keyPanel3 = document.querySelector("#keys3");
        var template3 = document.querySelector('#keybutton');
        var letters3 = "ZXCVBNMÖÇ";
        letters3.split('').forEach((key, index) => {
            var clone = template3.content.cloneNode(true);
            var box = clone.querySelectorAll(".key-button");
            box[0].id = "div_" + key;
            box[0].textContent = key;
            box[0].addEventListener('click', function (key) { keyButtonClick(key) }.bind(this, key));
            keyPanel3.appendChild(clone);
        });
    } else {
        console.error("template")
    }
}

function setCharBox(char) {
    let index = window.Current.TypingIndex;
    $("#char" + index).html(char.turkishToUpper());
    $("#char" + index).removeClass("typing");
    $("#divchar" + index).removeClass("closed");
    $("#divchar" + index).addClass("opened");
    $("#divchar" + (index + 1)).removeClass("closed");
    $("#char" + (index + 1)).addClass("typing");
}

function removeCharBox() {
    let index = window.Current.TypingIndex;
    $("#char" + index).removeClass("typing");
    $("#divchar" + index).addClass("closed");
    $("#divchar" + (index - 1)).removeClass("opened");
    $("#divchar" + (index - 1)).addClass("closed");
    $("#char" + (index - 1)).addClass("typing");
    $("#char" + (index - 1)).html("");

    let ind = (window.Current.TypingIndex - 1) < 0 ? 0 : (window.Current.TypingIndex - 1);
    window.Current = { WordLength: window.Current.WordLength, TypingIndex: ind };
}

function keyButtonClick(key) {
    setCharBox(key);
    window.Current = {
        WordLength: window.Current.WordLength, TypingIndex: (window.Current.TypingIndex + 1)
    }
}

function gameTextTypeAnimation() {
    if (window.GameText.index < window.GameText.text.length) {
        let txt = $("." + window.GameText.className).html() + window.GameText.text.charAt(window.GameText.index)
        $("." + window.GameText.className).html(txt);
        window.GameText.index++;
        setTimeout(gameTextTypeAnimation, window.GameText.typeSpeed);
    }
}

function findWhiteSpace(text) {
    var indexes = [];
    text.split("").forEach((element, index) => {
        if (element === " ") {
            indexes.push(index);
        }
    });
    return indexes;
}

function nextSample() {
    if (window.GameSettings.WordSampleIndex < (window.GameSettings.WordsSample.length - 1)) {
        window.GameSettings.WordSampleIndex = window.GameSettings.WordSampleIndex + 1;
        SetGameSample();
    }
}