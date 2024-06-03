export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        let { scene, x, y, image } = data;

        super(scene, x, y, image, 0);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.image = image;
        this.dodoState = "defaultLeft";
        this.key;

        // 애니메이션 생성
        this.create();
    }

    static preload(scene) {
        // 캐릭터
        scene.load.spritesheet("dodo", "./images/Star/img_character_dodo.png", { frameWidth: 188, frameHeight: 193 });
    }

    create() {
        this.scene.physics.world.enable(this);                          // 물리 추가

        this.body.setAllowGravity(false);                               // 중력의 영향을 받지 않도록
        this.setCollideWorldBounds(true);                               // 화면 밖으로 못 나가게
        this.body.setSize(120, 30);                                     // 충돌체 사이즈 조정(바구니)
        this.setOffset(0, 80);                                          // 충돌체 위치 조정

        // 애니메이션 [
        // 기본
        this.anims.create({
            key: "defaultLeft",
            frames: this.anims.generateFrameNumbers("dodo", { frames: [0, 1] }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: "defaultRight",
            frames: this.anims.generateFrameNumbers("dodo", { frames: [3, 2] }),
            frameRate: 2,
            repeat: -1
        });

        // 왼쪽으로 걷는 모션
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dodo", { frames: [4, 5] }),
            frameRate: 6,
            repeat: -1
        })

        // 오른쪽으로 걷는 모션
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dodo", { frames: [7, 6] }),
            frameRate: 6,
            repeat: -1
        })
        // ] 애니메이션 end

        // 키보드 이벤트
        this.key = this.scene.input.keyboard.createCursorKeys();

        // 캐릭터 내보내기
        this.scene.add.existing(this);
        this.anims.play("defaultLeft");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.key.left.isDown) {

            this.dodoState = "left";

            this.setOffset(0, 80);

            this.setVelocityX(-400);
            this.anims.play('left', true);
                        
            if (!this.scene.walkingSound.isPlaying) {                
                this.scene.walkingSound.play();
            }            
        }
        else if (this.key.right.isDown) {

            this.dodoState = "right";

            this.setOffset(70, 80);

            this.setVelocityX(400);
            this.anims.play('right', true);

            if (!this.scene.walkingSound.isPlaying) {
                this.scene.walkingSound.play();
            }
        }
        else {
            if (this.scene.walkingSound.isPlaying) {
                this.scene.walkingSound.stop();
            }

            this.setVelocityX(0);
            this.dodoState != "right" ? this.anims.play("defaultLeft", true) : this.anims.play("defaultRight", true);
        }
    }

    fireKeyEvent() {
        this.scene.input.keyboard.resetKeys();
        this.scene.input.keyboard.removeAllKeys();
    }
}