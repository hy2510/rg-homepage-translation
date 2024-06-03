let game;
let level;
let config;
let selectedModule;
let quizArr;
let exampleArr;

// 모듈 동적 import
const getModule = async (type) => {
    let module;

    switch (type) {
        case "STAR":
            module = await import("./Scenes/StarScene.js");
            break;

        case "LEAF":
            module = await import("./Scenes/LeafScene.js");
            break;

        case "SNOW":
            module = await import("./Scenes/WinterScene.js");
            break;
    }

    return module;
}

// 문제 타입 설정
const getSynopsis = () => {
    const getSynopsisOnSucc = data => {
        if(!isValidateRound(data.Round)){
            throw Error('Round Invalid')
        }
        const synopsis = data.Synopsis;
        level = data.Round % 100;

        getModule(synopsis).then(module => {
            selectedModule = module;

            const setData = data => {
                quizArr = eval(JSON.stringify(data));
                
                // 예제 데이터 가져오기
                const setAlphabetArr = data => {
                    exampleArr = eval(JSON.stringify(data));

                    let sceneType = new module.default({
                        quizData: quizArr,
                        exampleData: exampleArr
                    });

                    config = {
                        key: "game",
                        type: Phaser.AUTO,
                        parent: "phaser",
                        background: "#fff",
                        width: 1280,
                        height: 720,
                        physics: {
                            default: 'arcade',
                            arcade: {
                                //debug: false
                            },
                        },
                        scene: [sceneType],
                        level: 1
                    };
                    game = new Phaser.Game(config);
                }
                getDoDoAbcGameExample(setAlphabetArr);
            }
            step = 1;
            loadQuizData(step, quizType, setData);
        });
    }
    getStudyInfo(getSynopsisOnSucc);
}

getSynopsis();