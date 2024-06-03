import Bullet from "./Bullet.js";

export default class BulletGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);
        this.scene = scene;

        this.createMultiple({
            key: 'bullet',
            classType: Bullet,
            frameQuantity: 1,       // 씬에 존재할 수 있는 갯수 제한
            active: false,
            visible: false,
            runChildUpdate: true,
            setXY: {
                x: this.scene.cannon.x,
                y: this.scene.cannon.y
            }
        })
    }

    static preload(scene) {
        Bullet.preload(scene);
    }

    fireBullet(angle, x, y) {
        let bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.fire(angle, x, y);
        }
    }
}