export default class BulletGroup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, scene.cannon.x, scene.cannon.y, 'bullet');
        this.scene = scene;
    }

    static preload(scene) {
        scene.load.image("bullet", "./images/Acorn/img_bullet.png");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.x < -80 || this.x > 1360 || this.y < -60 || this.y > 780) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

    fire(angle, x, y) {
        this.enableBody(true, x, y, true, true);
        this.body.setCircle(30, 0.5, 0.5);
        this.scene.physics.velocityFromRotation(angle, 1000, this.body.velocity);

        this.setActive(true);
        this.setVisible(true);
    }
}