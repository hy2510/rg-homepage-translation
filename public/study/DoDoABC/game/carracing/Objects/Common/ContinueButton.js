export default class ContinueButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "btnContinue");
        this.scene = scene;

        this.setOrigin(0);

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.once("pointerdown", () => {
            const getNextRoundSucc = data => {
                try {
                    const nextRoundData = data;
                    const errorNo = nextRoundData.ErrorNo;
                    const studyId = nextRoundData.StudyId;
                    const studentHistoryId = nextRoundData.StudentHistoryId;
                    const bookCode = nextRoundData.BookCode;

                    if (errorNo === 0) {
                        const newStudyInfo = { 
                            ...ssStudyInfo,
                            stdid: studyId,
                            sthid: studentHistoryId,
                            book: bookCode.substring(6, 9),
                        }
                        updateREF(newStudyInfo, bookCode)
                        window.location.replace('../../Default.html');
                    }
                    else {
                        throw new Error(errorNo);
                    }
                }
                catch (e) {
                    console.log(e)
                    alert(`Reading Gate에 문의해주세요. error : ${e}`);

                    doLogout();
                }
            }

            const getNextRoundFail = () => {
                alert(`Reading Gate에 문의해주세요.`);

                doLogout();
            }

            getNextRoundDodoABC(getNextRoundSucc, getNextRoundFail);
        })

        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("btnContinue", "./images/Common/img_btn_continue.png");
    }
}