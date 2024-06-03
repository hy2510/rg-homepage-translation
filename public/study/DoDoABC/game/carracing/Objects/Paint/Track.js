export default class Track extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y } = data;

        let track = new Phaser.GameObjects.TileSprite(scene, 0, 0, 1280, 542, "track")
            .setOrigin(0)
            .setDepth(1)
            .setScrollFactor(0);

        let startLine = new Phaser.GameObjects.Sprite(scene, 0, 0, "startLine").setOrigin(0).setDepth(2);
        let finishLine = new Phaser.GameObjects.Sprite(scene, 1280, 0, "finishLine").setOrigin(0).setDepth(2);

        super(scene, x, y, [track, startLine, finishLine]);
        this.scene = scene;
        this.startLine = startLine;
        this.finishLine = finishLine;
        this.track = track;
        this.isActive = false
        this.isFinish = false;

        this.setDepth(3);
        this.create();
    }

    static preload(scene) {
        scene.load.image("startLine", "./images/Common/img_track_start.png");
        scene.load.image("track", "./images/Paint/img_track.png");
        scene.load.image("finishLine", "./images/Common/img_track_finish.png");
    }

    create() {
        this.scene.add.existing(this);
    }

    preUpdate() {
        if (this.isActive) {
            if (this.startLine) {
                if (this.startLine.x > -403) {
                    this.startLine.x -= this.scene.carSpeed;
                }
            }

            if (this.isFinish) {
                if (this.finishLine.x > 750) {
                    this.finishLine.x -= this.scene.carSpeed;
                }

                if (this.finishLine.x <= 750) {
                    this.afterAppearFinishLine();
                }
            }
            else {
                if (this.scene.examples.children.entries[this.scene.examples.children.entries.length - 1].x < 660) {
                    this.scene.createExample();
                }
            }

            this.scene.bg.tilePositionX += this.scene.carSpeed / 10;
            this.track.tilePositionX += this.scene.carSpeed;
        }
    }

    activeTrack() {
        this.isActive = true;
    }

    appearFinishLine() {
        this.scene.player.fireKeyEvent();
        this.scene.examples.clear(this, true);
        this.isFinish = true;
    }

    afterAppearFinishLine() {
        this.scene.player.moveFinishLine();

        
    }

    stopTrack() {
        this.isActive = false;
    }
}