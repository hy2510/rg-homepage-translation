let game;
let level;
let config;
let selectedModule;

let quizArr;

// 모듈 동적 import
const getModule = async (type) => {
    let module;
    console.log(type);

    switch (type) {
        case "MOL1":
            module = await import("./Scenes/MoleScene.js");            
            break;

        case "MOL2":
            module = await import("./Scenes/MoleScene2.js");
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
        level = data.Round % 100 - 35;

        getModule(synopsis).then(module => {
            selectedModule = module;

            const setData = data => {
                quizArr = eval(JSON.stringify(data));
                //getStudyStep();

                let sceneType = new module.default(quizArr);

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
                            debug: false
                        },
                    },
                    scene: [sceneType],
                };

                game = new Phaser.Game(config);
            }
            step = 1;
            loadQuizData(step, quizType, setData);
        });
    }
    getStudyInfo(getSynopsisOnSucc);
}

getSynopsis();