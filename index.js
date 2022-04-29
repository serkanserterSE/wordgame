document.addEventListener('keyup', logKey);
window.WordDb = [];
window.GameSettings = {
    IsGameStarted: false,
    WordsSample: [],
    WordSampleIndex: 0
};
window.Current = {
    WordLength: 0,
    TypingIndex: 0,
    Answer: ""
}
window.PlayerResults = [];
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
    window.Current.Answer = "";
}

function GenerateGamePanel(wordSample) {
    if ('content' in document.createElement('template')) {
        var gamePanel = document.querySelector(".game-panel");
        var wordList = wordSample.Text.split("");
        var charIndex = 0;
        for (let index = 0; index < wordList.length; index++) {
            var element = wordList[index];
            if (element == " ") {
                var template = document.querySelector('#gamepanelboxspace');
                var clone = template.content.cloneNode(true);
                var box = clone.querySelectorAll(".flex-break");
                gamePanel.appendChild(clone);
            } else {
                var template = document.querySelector('#gamepanelbox');
                var clone = template.content.cloneNode(true);
                var box = clone.querySelectorAll(".game-panel-char-box");
                box[0].id = "divchar" + charIndex;
                var boxSpan = clone.querySelectorAll(".game-panel-char-box>span");
                boxSpan[0].id = "char" + charIndex;;
                boxSpan[0].textContent = " ";
                if (charIndex == 0)
                    boxSpan[0].classList.add('typing');
                else
                    box[0].classList.add('closed');
                gamePanel.appendChild(clone);
                charIndex++;
            }
        }
        window.GameText = {
            className: "game-text-panel > span",
            text: wordSample.Meaning,
            index: 0,
            typeSpeed: 20
        };
        window.Current.WordLength = wordSample.Length;
        window.Current.TypingIndex = 0;
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
    window.Current.Answer = window.Current.Answer + char.turkishToUpper()
    window.Current.TypingIndex = (window.Current.TypingIndex + 1);
}

function removeCharBox() {
    let index = window.Current.TypingIndex;
    $("#char" + index).removeClass("typing");
    $("#divchar" + index).addClass("closed");
    $("#divchar" + (index - 1)).removeClass("opened");
    $("#divchar" + (index - 1)).addClass("closed");
    $("#char" + (index - 1)).addClass("typing");
    $("#char" + (index - 1)).html("");
    window.Current.TypingIndex = (window.Current.TypingIndex - 1) < 0 ? 0 : (window.Current.TypingIndex - 1);
    window.Current.Answer = window.Current.Answer.substring(0, (window.Current.Answer.length - 1));
}

function keyButtonClick(key) {
    setCharBox(key);
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
    if (window.GameSettings.WordSampleIndex < window.GameSettings.WordsSample.length) {
        var wordSample = window.GameSettings.WordsSample[window.GameSettings.WordSampleIndex].Text;
        var wsList = wordSample.replace(/\s/g, '').split("");
        var result = 0;
        for (let i = 0; i < wsList.length; i++) {
            let char = wsList[i];
            if (window.Current.Answer[i] == char) {
                result++;
            }
        }
        window.PlayerResults.push({ WordSample: wordSample, Answer: window.Current.Answer, Result: wsList.length == result });
        window.GameSettings.WordSampleIndex = window.GameSettings.WordSampleIndex + 1;
        if (window.GameSettings.WordSampleIndex == window.GameSettings.WordsSample.length) {
            FinishGame();
        } else {
            SetGameSample();
        }

    } else {
        console.log(window.PlayerResults);
    }
}

function FinishGame() {
    ClearGameSample();
    $(".main").css("display", "none");
    $(".game").css("display", "none");
    window.GameSettings.IsGameStarted = false;
    window.PlayerResults=[];
    $(".gameresult").css("display", "block");
    RenderGameResult();
}


function RenderGameResult() {
    $("#answers").html(""); 
    if ('content' in document.createElement('template')) {
        var answers = document.querySelector("#answers");
        var template = document.querySelector('#gameresult');
        window.PlayerResults.forEach((key, index) => {
            var clone = template.content.cloneNode(true);
            var box_word = clone.querySelectorAll("#word");
            var box_answer = clone.querySelectorAll("#answer");
            box_word[0].textContent = key.WordSample;
            box_answer[0].textContent = key.Answer;
            answers.appendChild(clone);
        });

    } else {
        console.error("template")
    }
}

function StartNewGame2() {
    $(".gameresult").css("display", "none");
    SetWordSample();
}


function SetWordSample() {
    window.GameSettings.WordsSample = [];
    let wordSampleCount = 6;
    if (window.WordDb.length > 0) {
        let pageNumber = Math.floor(Math.random() * (window.WordDb.length - 1));
        let element = window.WordDb[pageNumber].List;
        for (let i = 0; i < wordSampleCount; i++) {
            let wordOrder = Math.floor(Math.random() * 100);
            window.GameSettings.WordsSample.push(element[wordOrder]);
        }
        StartNewGame();
    } else {
        let pageNumber = Math.floor(Math.random() * 500);
        let pageName = "W" + pageNumber;
        if (window.WordDb.some(el => el.PageName === pageName)) {
            let element = window.WordDb.find(el => el.PageName === pageName).List;
            for (let i = 0; i < wordSampleCount; i++) {
                let wordOrder = Math.floor(Math.random() * 100);
                window.GameSettings.WordsSample.push(element[wordOrder]);
            }
            StartNewGame();
        } else {
            let dburl = "https://eu2-steady-wallaby-30045.upstash.io/HGETALL/" + pageName
            fetch(dburl, {
                headers: {
                    Authorization: "Bearer AnVdASQgNzUwZjA2ODUtNmRmOS00NTQxLWE1MzQtMzg4OGUzNGQyNjgwl3B3cApOHVL49wf81bliXZMKhZMuX1qO4ZavngoUJJE="
                }
            }).then(response => response.json())
                .then(data => {
                    data.result.forEach(element => {
                        try {
                            let val = JSON.parse(element);
                            if (Array.isArray(val)) {
                                window.WordDb.push({ PageName: pageName, PageNumber: pageNumber, List: val });
                                for (let i = 0; i < wordSampleCount; i++) {
                                    let wordOrder = Math.floor(Math.random() * 100);
                                    window.GameSettings.WordsSample.push(val[wordOrder]);
                                }
                                StartNewGame();
                            }
                        } catch { }
                    });
                });
        }
    }
}
