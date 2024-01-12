class Animation {
    constructor(avatar, gui) {
        this.anim = avatar;
        this.gui = gui;
        this.arrivalPosY = [-0.02, -0.02, -0.02, 0.02, 0.02, -0.02];
        this.fallSpeed = [
            22, // baskeball
            35, // iron ball
            20, // tennis
            8, // cardboard
            5, // feather
            25 // watermelon
        ];
        // Total Height 60;
    }

    play() {
        this.animateObjects();
        setTimeout(() => {
            this.anim.start(true, 1.0, this.anim.from, this.anim.to, true);
        }, 150);
        setTimeout(() => {
            this.anim.stop();
        }, this.anim.to * 15 + 150);
    }

    animateObjects() {
        var ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

        var object1 = this.gui.rightObject;
        var targetPos1 = object1.position.clone();
        var speed1 = this.gui.withAir ? this.fallSpeed[this.gui.rightIndex] : 15;
        targetPos1.y = this.arrivalPosY[this.gui.rightIndex];

        var object2 = this.gui.leftObject;
        var targetPos2 = object2.position.clone();
        var speed2 = this.gui.withAir ? this.fallSpeed[this.gui.leftIndex] : 15;
        targetPos2.y = this.arrivalPosY[this.gui.leftIndex];

        BABYLON.Animation.CreateAndStartAnimation('', object1, 'position', speed1, 60, object1.position, targetPos1, 0, ease)
            .onAnimationEnd = () => {
                if (speed1 < speed2) this.animComplete();
            };


        BABYLON.Animation.CreateAndStartAnimation('', object2, 'position', speed2, 60, object2.position, targetPos2, 0, ease)
            .onAnimationEnd = () => {
                if (speed1 >= speed2) this.animComplete();
            };
    }

    animComplete() {
        setTimeout(() => {
            this.gui.animFinished = true;
            this.gui.rightObject.position = this.gui.objectPos.right[this.gui.rightIndex];
            this.gui.leftObject.position = this.gui.objectPos.left[this.gui.leftIndex];
            this.gui.anim.reset();
        }, 1500);
    }
}



