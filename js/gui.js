class MyGUI {
    constructor(scene, models, avatarAnimation) {
        this.scene = scene;
        this.models = models;
        this.anim = avatarAnimation;
        this.rightObject = null;
        this.leftObject = null;
        this.rightIndex = 0;
        this.leftIndex = 1;
        this.pressed = false;
        this.animFinished = true;
        this.objectPos = {
            right: [
                new BABYLON.Vector3(-2.45, 10.45, -0.38),
                new BABYLON.Vector3(2.45, 10.45, -0.38),
                new BABYLON.Vector3(-2.45, 10.45, -0.38),
                new BABYLON.Vector3(2.45, 10.398, -0.335),
                new BABYLON.Vector3(2.417, 10.397, -0.361),
                new BABYLON.Vector3(2.45, 10.45, -0.38)
            ],
            left: [
                new BABYLON.Vector3(-2.416, 10.454, -0.577),
                new BABYLON.Vector3(2.416, 10.454, -0.577),
                new BABYLON.Vector3(-2.416, 10.454, -0.577),
                new BABYLON.Vector3(2.418, 10.4, -0.577),
                new BABYLON.Vector3(2.392, 10.395, -0.567),
                new BABYLON.Vector3(2.416, 10.454, -0.577)
            ]
        };
    }

    draw() {
        this.withAir = false;
        var setRightObject = (index) => {
            switch (index) {
                case 0:
                    this.rightIndex = index;
                    break;
                case 1:
                    this.rightIndex = index;
                    break;
                case 2:
                    this.rightIndex = index;
                    break;
                case 3:
                    this.rightIndex = index;
                    break;
                case 4:
                    this.rightIndex = index;
                    break;
                case 5:
                    this.rightIndex = index;
                    break;
            }
            this.anim.reset();
            if (this.rightObject) this.rightObject.dispose();
            this.rightObject = this.models[this.rightIndex].clone();
            this.rightObject.position = this.objectPos.right[this.rightIndex];
            this.rightObject.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
            /* if feather or paper */
            if (this.rightIndex === 3 || this.rightIndex == 4) {
                this.rightObject.rotation = new BABYLON.Vector3(0, 0, -10 / 180 * Math.PI);
            }
            this.scene.activeCameras[0].lockedTarget = this.rightObject;
        }

        var setLeftObject = (index) => {
            switch (index) {
                case 0:
                    this.leftIndex = index;
                    break;
                case 1:
                    this.leftIndex = index;
                    break;
                case 2:
                    this.leftIndex = index;
                    break;
                case 3:
                    this.leftIndex = index;
                    break;
                case 4:
                    this.leftIndex = index;
                    break;
                case 5:
                    this.leftIndex = index;
                    break;
            }
            this.anim.reset();
            if (this.leftObject) this.leftObject.dispose();
            this.leftObject = this.models[this.leftIndex].clone();
            this.leftObject.position = this.objectPos.left[this.leftIndex];
            this.leftObject.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
            /* if feather or paper */
            if (this.leftIndex === 3 || this.leftIndex == 4) {
                this.leftObject.rotation = new BABYLON.Vector3(0, 0, -10 / 180 * Math.PI);
            }
            this.scene.activeCameras[1].lockedTarget = this.leftObject;
        }

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.layer.layerMask = 1;
        var selectBox = new BABYLON.GUI.SelectionPanel("sp");
        selectBox.width = 0.22;
        // selectBox.height = 0.8;
        selectBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        selectBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        advancedTexture.addControl(selectBox);

        var headerGroup = new BABYLON.GUI.CheckboxGroup("Simulation Options");

        var checkBoxGroup = new BABYLON.GUI.CheckboxGroup("");
        checkBoxGroup.addCheckbox("Atmosphere ON/OFF", isChecked => { this.withAir = isChecked; });

        var object1Group = new BABYLON.GUI.RadioGroup("Choose the Right Object");
        object1Group.addRadio("Basketball", setRightObject, true);
        object1Group.addRadio("Iron Ball", setRightObject);
        object1Group.addRadio("Tennis Ball", setRightObject);
        object1Group.addRadio("Cardboard", setRightObject);
        object1Group.addRadio("Feather", setRightObject);
        object1Group.addRadio("Watermelon", setRightObject);

        var object2Group = new BABYLON.GUI.RadioGroup("Choose the Left Object");
        object2Group.addRadio("Basketball", setLeftObject);
        object2Group.addRadio("Iron Ball", setLeftObject, true);
        object2Group.addRadio("Tennis Ball", setLeftObject);
        object2Group.addRadio("Cardboard", setLeftObject);
        object2Group.addRadio("Feather", setLeftObject);
        object2Group.addRadio("Watermelon", setLeftObject);

        selectBox.addGroup(headerGroup);
        selectBox.addGroup(checkBoxGroup);
        selectBox.addGroup(object1Group);
        selectBox.addGroup(object2Group);

        // selectBox.fontFamily = "times new roman";
        // selectBox.fontSize = "20pt";

        selectBox.color = "blue";
        selectBox.background = "#D3D3D3";
        selectBox.barColor = "#4F7DF2";
        selectBox.headerColor = "blue";
        selectBox.buttonColor = "orange";
        selectBox.buttonBackground = "#684502";
        selectBox.labelColor = "brown";

        var fallBtn = BABYLON.GUI.Button.CreateSimpleButton("btn1", "Drop & Test Gravity");
        fallBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        fallBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        fallBtn.paddingTop = -10;
        fallBtn.paddingBottom = 10;
        fallBtn.width = "250px"
        fallBtn.height = "40px";
        fallBtn.color = "white";
        fallBtn.cornerRadius = 20;
        fallBtn.background = "green";
        fallBtn.onPointerUpObservable.add(() => {
            if (this.rightObject && this.leftObject && this.animFinished && !this.pressed) {
                this.pressed = true;
                this.animFinished = false;
            }
        });
        advancedTexture.addControl(fallBtn);
    }

}