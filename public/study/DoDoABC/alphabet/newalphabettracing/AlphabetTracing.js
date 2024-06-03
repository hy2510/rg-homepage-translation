let pathIndex = 0;                          // svg 내부 path 인덱스
let maxPathCount = 0;
let isEnd = false;
let caseType = "big";                       // 대문자, 소문자 구별을 위한 변수
let folderType = "UpperCase";

let bigAlphabetData, smallAlphabetData;     // 알파벳 데이터
let sndCastingSpell = effectAlphabet + "correct_1.mp3"          // (2500) 알파벳 쓰기 성공
let sndCorrect = effectAlphabet + "correct_alphabet.mp3"        // (500) 획 쓰기 성공
let sndIncorrect = effectAlphabet + "incorrect_alphabet.mp3"    // (500) 획 쓰기 실패

let dodo, stage, layer, canvas, isDrawing, startPointer, endPointer, paths, emptyImage
    , dotPath, dotPathData
    , isGuide = true, mouseIndex = 2, guideImage, fingerImage, movingTween, createdPath;

$(document).ready(() => {
    isWorking = true;
    lockScreen(true);
    step = 1;
    quizType = "A";
    currentActivity = "A1A";    // 제일 먼저 세팅해야함.
    focusCurrent(currentActivity);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndCorrect);
    $("#preload2").attr('src', sndIncorrect);
    $("#preload3").attr('src', sndCastingSpell);

    const imgArr = [];

    doPreloadImages(imgArr, loadQuiz);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizData = data[0];
    //console.log(quizData);

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        checkGetDataSuccess();
        checkStudyType();

        setupQuiz();
        playBGM(sndBgmA1A);
    }
    catch (e) {
        swal({ text: "Setup Quiz Error: " + e }).then(function () { doLogout(); });
    }
}

const setupQuiz = () => {
    bigAlphabetData = alphabetData[quizData.CorrectText.toUpperCase()];
    smallAlphabetData = alphabetData[quizData.CorrectText.toLowerCase()];

    // 2-1. 알파벳 이미지 설정
    setCanvas();
}

const setCanvas = () => {
    stage = new Konva.Stage({
        container: "konva",
        width: 1280,
        height: 720
    })

    layer = new Konva.Layer();
    stage.add(layer);

    // 알파벳 두개 보여줄때는 나이트 --> 쓰기때는 bg_alphabet_tracing 변경
    setBackgroundImage('bg_alphabet_tracing.png', Konva.Easings.StrongEaseIn, 3, true);

    setSetAlphabet("start");
}

const setBackgroundImage = (pSrc, pEffect, pDuration, pBool) => {
    const backgroungImg = new Konva.Image({
        x: 0,
        y: 0,
        width: 1280,
        height: 720,
        opacity: 0
    })

    layer.add(backgroungImg);

    let backgroundImgObj = new Image();

	backgroundImgObj.onload = () => {
        const bgTween = new Konva.Tween({
            node: backgroungImg,
            duration: pDuration,
            opacity: 1,
            easing: pEffect,
            onFinish: () => {
                if (pBool) {
                    dodo = new Dodo();
                } else {
                    dodo.destroy();
                }
            }
        });

        backgroungImg.image(backgroundImgObj);
      
        bgTween.play();
    }

    backgroundImgObj.src = './images/' + pSrc;
}

const setSetAlphabet = type => {
    const setImg = new Konva.Image({
        x: 224,
        y: 150,
        width: 832,
        height: 583
    })

    let imageObj = new Image();

    imageObj.onload = () => {
        if (type == "start") {
            layer.add(setImg);
            setImg.image(imageObj);

            playSound(`https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/letter/${quizData.CorrectText}.mp3`, () => {
                setImg.remove();
                setEmptyImage();
            })
        }
        else if (type == "end") {
            const particle = new Particle();
            
            playEffect1(`https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/letter/${quizData.CorrectText}.mp3`);

            // 끝날을 때 배경을 나이트로 변경, 도도 감추기
            setBackgroundImage('bg_night.png', Konva.Easings.StrongEaseOut, 0.3, false);
            
            layer.add(setImg);
            setImg.image(imageObj);
            
            setTimeout(() => {
                popNext();
            }, 1500);
        }
    }

    imageObj.src = `./images/Set/img_${quizData.CorrectText}.png`;
}

const setEmptyImage = () => {
    isGuide = true;
    stage.off("mousedown touchstart mousemove touchmove mouseup mouseleave touchend");

    // 대소문자 설정
    pathIndex = 0;
    paths = caseType == "big" ? new Array(bigAlphabetData.paths.length) : new Array(smallAlphabetData.paths.length);
    paths.fill(null);

    // 빈 알파벳 이미지
    emptyImage = new Konva.Image({
        x: 315,
        y: caseType == "big" ? 60 : smallAlphabetData?.y == undefined ? 60 : smallAlphabetData.y,
        width: 650,
        height: 600,
        opacity: 0
    })

    layer.add(emptyImage);

    let imageObj = new Image();

    imageObj.onload = () => {
        const tween = new Konva.Tween({
            node: emptyImage,
            duration: 1.55,
            opacity: 1,
            onFinish: () => {
                playSound(`https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/letter/${caseType}${quizData.CorrectText}.mp3`, () => {
                    setGuideArrow();
                })
            }
        })

        emptyImage.image(imageObj);
        tween.play();
    }

    imageObj.src = `./images/${folderType}/img_${quizData.CorrectText}_${caseType}_empty.png`;
}

const setGuideArrow = () => {
    isGuide = true;
    mouseIndex = 0;
    stage.off("mousedown touchstart mousemove touchmove mouseup mouseleave touchend");

    // 알파벳 그리기 가이드
    const alphabet = caseType == "big" ? quizData.CorrectText.toUpperCase() : quizData.CorrectText.toLowerCase();
    dotPathData = alphabetData[alphabet].paths[pathIndex];

    dotPath = new Konva.Path({
        x: 0,
        y: 0,
        data: dotPathData,
        //stroke: "orange",
        //strokeWidth: 10
    });

    layer.add(dotPath);

    // 알파벳 이미지
    guideImage = new Konva.Image({
        x: 315,
        y: caseType == "big" ? 60 : smallAlphabetData?.y == undefined ? 60 : smallAlphabetData.y,
        width: 650,
        height: 600
    })

    layer.add(guideImage);

    let imageObj = new Image();

    imageObj.onload = () => {
        guideImage.image(imageObj);

        afterSetImage();
    }

    imageObj.src = `./images/${folderType}/img_${quizData.CorrectText}_${caseType}_dot_0${pathIndex + 1}.png`;
}

const afterSetImage = () => {
    isDrawing = false;

    const regEx = /[A-Z]/gi;
    const regDotPath = dotPathData.replace(regEx, "").trim().split(" ");

    // 가이드 이미지 따라서 이동하는 손
    fingerImage = new Konva.Image({
        x: regDotPath[0] * 1,
        y: regDotPath[1] * 1,
        width: 130,
        height: 94,
        opacity: 0
    })

    layer.add(fingerImage);

    let imageObj = new Image();

    imageObj.onload = () => {
        fingerImage.opacity(1);
        fingerImage.image(imageObj);

        // 손가락 이미지 가이드 라인 애니메이션
        moveMouse();

        // 클릭
        stage.on('mousedown touchstart', function (e) {
            if (isWorking || e.evt.button == 2) return false;
            
            e.evt.preventDefault();

            isGuide = false;
            isDrawing = true;

            movingTween.destroy();
            fingerImage.destroy();

            startPointer = stage.getPointerPosition();

            const betweenDistance = getBetweenDistance(startPointer);

            createdPath = new Konva.Path({
                x: startPointer.x,
                y: startPointer.y,
                stroke: "#7a1bc3",
                strokeWidth: 80,
                lineCap: "round",
                lineJoin: "round",
                data: `M10 10`
            });
            layer.add(createdPath);

            checkDrawCorrectly(betweenDistance, false);
        });

        // 드래그
        stage.on('mousemove touchmove', function (e) {
            if (!isDrawing) {
                return;
            }

            e.evt.preventDefault();

            pointer = stage.getPointerPosition();
            const betweenDistance = getBetweenDistance(pointer);

            let pathData = createdPath.data();
            const moveX = pointer.x - startPointer.x + 10;
            const moveY = pointer.y - startPointer.y + 10;

            createdPath.data(`${pathData}, ${moveX} ${moveY}`);

            checkDrawCorrectly(betweenDistance, false);
        });

        // 드래그 완료
        stage.on('mouseup mouseleave touchend', function (e) {
            if (!isDrawing) {
                return;
            }

            e.evt.preventDefault();

            isDrawing = false;

            endPointer = stage.getPointerPosition();
            const betweenDistance = getBetweenDistance(endPointer);

            // 유저가 그린 path가 너무 짧은 경우
            if (createdPath.getLength <= 100) {
                isDrawing = false;
                playEffect1(sndIncorrect);
                createdPath.remove();

                return false;
            }

            const regEx = /[A-Z]/gi;
            const regDotPath = dotPathData.replace(regEx, "").trim().split(" ");
            const dotPathStartPosition = {
                x: regDotPath[0] * 1,
                y: regDotPath[1] * 1
            };
            const dotPathEndPosition = {
                x: regDotPath[regDotPath.length - 2] * 1,
                y: regDotPath[regDotPath.length - 1] * 1
            };

            // debug [
            //console.log(dotPathStartPosition);
            //console.log(dotPathEndPosition);
            //console.log(dotPathStartPosition.x - startPointer.x);
            //console.log(dotPathEndPosition.x - startPointer.x);

            //console.log(dotPathStartPosition.y - startPointer.y);
            //console.log(dotPathEndPosition.y - startPointer.y);

            //console.log(dotPathStartPosition.x - endPointer.x);
            //console.log(dotPathEndPosition.x - endPointer.x);

            //console.log(dotPathStartPosition.y - endPointer.y);
            //console.log(dotPathEndPosition.y - endPointer.y);

            //console.log(Math.abs(dotPathStartPosition.x - startPointer.x) - Math.abs(dotPathEndPosition.x - startPointer.x));
            //console.log(Math.abs(dotPathStartPosition.y - startPointer.y) - Math.abs(dotPathEndPosition.y - startPointer.y));
            //console.log(Math.abs(dotPathEndPosition.x - endPointer.x) - Math.abs(dotPathStartPosition.x - endPointer.x));
            //console.log(Math.abs(dotPathEndPosition.y - endPointer.y) - Math.abs(dotPathStartPosition.y - endPointer.y));
            // ] debug

            // 역으로 그린 경우
            const betweenX = Math.abs(dotPathStartPosition.x - dotPathEndPosition.x);
            const betweenY = Math.abs(dotPathStartPosition.y - dotPathEndPosition.y);

            // 두 점 사이의 거리 
            const betweenPos = Math.sqrt(Math.pow(betweenX, 2) + Math.pow(betweenY, 2));

            //console.log( betweenX, betweenY, betweenPos);
            // 두 점 사이의 거리/2 가 오차범위(80)보다 작은 경우, 오차범위를 작게 설정
            //const posRange = betweenPos / 2 < 80 ? betweenPos / 2 : 80;
	    const posRange = betweenPos / 2 < 460 ? betweenPos / 2 : 460;

            const checkStartX = (Math.abs(dotPathStartPosition.x - startPointer.x) - Math.abs(dotPathEndPosition.x - startPointer.x));
            const checkStartY = (Math.abs(dotPathStartPosition.y - startPointer.y) - Math.abs(dotPathEndPosition.y - startPointer.y));
            const checkEndX = (Math.abs(dotPathEndPosition.x - endPointer.x) - Math.abs(dotPathStartPosition.x - endPointer.x));
            const checkEndY = (Math.abs(dotPathEndPosition.y - endPointer.y) - Math.abs(dotPathStartPosition.y - endPointer.y));

            //console.log(checkStartX, checkStartY, checkEndX, checkEndY);

            const pathLength = createdPath.getLength();
            const dotPathLength = dotPath.getLength();

            // j, i 점 찍기는 패쓰 길이에 민감하지 않게 예외 처리
            if ((quizData.CorrectText == 'I' || quizData.CorrectText == 'J') && (caseType == 'small' && pathIndex == 1)) {
                //console.log(`checkStartX : ${checkStartX}, checkStartY : ${checkStartY}, posRange : ${posRange}`);
                if (checkStartX < 0) {
                    isDrawing = false;
                    playEffect1(sndIncorrect);
                    createdPath.remove();

                    return false;
                }
            } else {
                //console.log(`checkStartX : ${checkStartX}, checkStartY : ${checkStartY}, posRange : ${posRange}`);
                if (checkStartX >= posRange || checkStartY >= posRange || checkEndX >= posRange || checkEndY >= posRange) {
                    isDrawing = false;
                    playEffect1(sndIncorrect);
                    createdPath.remove();

                    return false;
                }

                //if (pathLength < dotPathLength * 0.8 || pathLength >= (dotPathLength * (1 + betweenPos / 1000))) {
                if (pathLength < dotPathLength * 0.5 || pathLength >= 2 * (dotPathLength * (1 + betweenPos / 1000))) {
                    isDrawing = false;
                    playEffect1(sndIncorrect);
                    createdPath.remove();

                    return false;
                }
            }

            checkDrawCorrectly(betweenDistance, true);
        });
    }

    imageObj.src = `./images/img_finger.png`;
}

const getBetweenDistance = point => {
    const pathLength = dotPath.getLength();
    let precision = 8,
        best,
        bestLength,
        bestDistance = Infinity;

    for (let scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
        if ((scanDistance = distance2(scan = dotPath.getPointAtLength(scanLength))) < bestDistance) {
            best = scan;
            bestLength = scanLength;
            bestDistance = scanDistance;
        }
    }

    precision /= 2;

    while (precision > 0.5) {
        let before,
            after,
            beforeLength,
            afterLength,
            beforeDistance,
            afterDistance;

        if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = dotPath.getPointAtLength(beforeLength))) < bestDistance) {
            best = before, bestLength = beforeLength, bestDistance = beforeDistance;
        }
        else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = dotPath.getPointAtLength(afterLength))) < bestDistance) {
            best = after, bestLength = afterLength, bestDistance = afterDistance;
        }
        else {
            precision /= 2;
        }
    }

    best = {
        x: best?.x,
        y: best?.y 
    };
    best.distance = Math.sqrt(bestDistance);

    return Math.sqrt(bestDistance);

    function distance2(p) {
        const dx = p.x - point.x,
            dy = p.y - point.y;
        return dx * dx + dy * dy;
    }
}

const checkDrawCorrectly = (betweenDistance, v) => {
    //if (betweenDistance >= 65) {
    if (betweenDistance >= 120) {
        isDrawing = false;

        playEffect1(sndIncorrect);
        createdPath.remove();

        return false;
    }

    layer.batchDraw();

    if (v) {
        drawSuccess();
    }    
}

const drawSuccess = () => {
    if (isWorking) return false;

    setWorking(true);
    lockScreen(isWorking);

    paths[pathIndex] = createdPath;
    createdPath = null;

    guideImage.remove();
    guideImage = null;

    dotPath.remove();
    dotPath = null;

    fingerImage.destroy();
    movingTween.destroy();

    pathIndex++;

    if (pathIndex >= paths.length) {
        emptyImage.remove();
        emptyImage = null;

        paths.map(el => {
            el.remove();
        })

        dodo.changeState("happy");
        const particle = new Particle();
        playEffect1(sndCastingSpell);
    }
    else {
        stage.off("mousedown touchstart mousemove touchmove mouseup mouseleave touchend");
        playEffect1(sndCorrect);

        setGuideArrow();
    }
}

const setImage = () => {
    // 알파벳 이미지
    const alphabetImage = new Konva.Image({
        x: 315,
        y: caseType == "big" ? 60 : smallAlphabetData ?.y == undefined ? 60 : smallAlphabetData.y,
        width: 650,
        height: 600,
        opacity: 0
    })

    layer.add(alphabetImage);

    let imageObj = new Image();

    imageObj.onload = () => {
        const tween = new Konva.Tween({
            node: alphabetImage,
            duration: 1.55,
            opacity: 1,
            onFinish: () => {
                alphabetImage.remove();

                if (caseType == "big") {
                    isGuide = true;
                    stage.off("mousedown touchstart mousemove touchmove mouseup mouseleave touchend");
                    caseType = "small";
                    folderType = "LowerCase";

                    setTimeout(() => {
                        dodo.changeState("default");
                        setEmptyImage();
                    }, 1000)
                }
                else if (caseType == "small") {
                    isEnd = true;

                    setSetAlphabet("end");
                }
            }
        })

        alphabetImage.image(imageObj);
        tween.play();
    }

    imageObj.src = `./images/${folderType}/img_${quizData.CorrectText}_${caseType}.png`;
}

const moveMouse = () => {
    if (!isGuide) {
        fingerImage.destroy();
        movingTween.destroy();

        return false;
    }

    const regEx = /[A-Z]/gi;
    const regDotPath = dotPathData.replace(regEx, "").trim().split(" ");
    const dotPathLength = regDotPath.length;
    const duration = 2.5 / dotPathLength;
       
    movingTween = new Konva.Tween({
        node: fingerImage,
        duration: duration,
        x: regDotPath[mouseIndex] * 1,
        y: regDotPath[mouseIndex + 1] * 1,

        onUpdate: () => {
            if (!isGuide || regDotPath[mouseIndex] == undefined || !fingerImage) {
                fingerImage.destroy();
                movingTween.destroy();
            }
        },

        onFinish: () => {
            movingTween.destroy();

            if (fingerImage) {
                mouseIndex += 2;

                if (dotPathLength <= mouseIndex) {
                    setWorking(false);
                    lockScreen(isWorking);

                    Konva.autoDrawEnable = true;

                    mouseIndex = 0;

                    setTimeout(() => {
                        fingerImage.attrs.x = regDotPath[mouseIndex] * 1;
                        fingerImage.attrs.y = regDotPath[mouseIndex + 1] * 1;

                        if (isGuide) {
                            moveMouse();
                        }
                        else {
                            fingerImage.destroy();
                        }
                    }, 250)
                }
                else {
                    if (isGuide) {
                        moveMouse();
                    }
                    else {
                        fingerImage.destroy();
                    }
                }
            }
        }
    })

    movingTween.play();
}

const setWorking = state => {
    isWorking = state;
}

const resetAll = (pStart) => {
    setWorking(true);
    lockScreen(isWorking);

    Konva.autoDrawEnable = false;
    isGuide = true;
    stage.off("mousedown touchstart mousemove touchmove mouseup mouseleave touchend");

    isEnd = false;
    caseType = "big";
    folderType = "UpperCase";

    dodo.destroy();

    stage.clear();
    setCanvas();

    hideNext();
    playBGM(sndBgmA1A);
}

// 클래스
class Particle {
    constructor() {
        this.sprite;
        const px = 500;
        const animations = {
            click: [
                // x, y, width, height
                px * 0, 0, px, px,
                px * 1, 0, px, px,
                px * 2, 0, px, px,
                px * 3, 0, px, px,
                px * 4, 0, px, px,
                px * 5, 0, px, px,
                px * 6, 0, px, px,
                px * 7, 0, px, px,
                px * 8, 0, px, px,
                px * 9, 0, px, px,
                px * 10, 0, px, px,
                px * 11, 0, px, px,
                px * 12, 0, px, px,
                px * 13, 0, px, px,
                px * 14, 0, px, px,
                px * 15, 0, px, px,
                px * 16, 0, px, px,
                px * 17, 0, px, px,
                px * 18, 0, px, px
            ]
        }

        // 생성
        let particle = new Image();

        particle.onload = () => {
            this.sprite = new Konva.Sprite({
                x: 385,
                y: 90,
                image: particle,
                animation: 'click',
                animations: animations,
                frameIndex: 0
            });

            layer.add(this.sprite);

            this.playParticle();

            if (!isEnd) setImage();
        };

        particle.src = './images/img_particle_alphabet.png'

        this.playParticle = () => {
            this.sprite.start();

            setTimeout(() => {
                this.sprite.stop();
                this.destroy();
            }, 1000);
        }

        this.destroy = () => {
            this.sprite.destroy();
        }
    }
}

class Dodo {
    constructor() {
        this.sprite;
        const width = 240;
        const animations = {
            default: [
                // x, y, width, height
                width * 0, 0, width, 254,
                width * 1, 0, width, 254,
                width * 2, 0, width, 254,
                width * 3, 0, width, 254
            ],
            happy: [
                // x, y, width, height
                width * 4, 0, width, 254,
                width * 5, 0, width, 254,
                width * 6, 0, width, 254,
                width * 7, 0, width, 254,
                width * 8, 0, width, 254
            ],
            sad: [
                // x, y, width, height
                width * 9, 0, width, 254,
                width * 10, 0, width, 254,
                width * 11, 0, width, 254,
                width * 12, 0, width, 254
            ],
            dnone: [
                // x, y, width, height
                width * 9, 0, 0, 0,
                width * 10, 0, 0, 0,
                width * 11, 0, 0, 0,
                width * 12, 0, 0, 0
            ]
        }

        // 생성
        let dodo = new Image();

        dodo.onload = () => {
            this.sprite = new Konva.Sprite({
                x: 10,
                y: 410,
                image: dodo,
                animation: 'default',
                animations: animations,
                frameRate: 6,
                frameIndex: 0
            });

            this.sprite.start();

            layer.add(this.sprite);
        };

        dodo.src = './images/Dodo/img_dodo.png';

        this.changeState = state => {
            this.sprite.animation(state);
        }

        this.destroy = () => {
            this.sprite.destroy();
        }
    }
}

const playQuestion = () => {
    playEffect1(quizData.Sound1);
}