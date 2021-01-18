var load_icon = document.getElementById("loader");
function show() {
    load_icon.style.display = 'block';
}
function hide() {
    load_icon.style.display = 'none';
}


class BRApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingsBuffer: true, stencil: true });
        this.scene = new BABYLON.Scene(this.engine);
        this.gui = null;
        this.avatarAnimation = null;
    }

    start() {
        // this.scene.debugLayer.show({ showExplorer: true, embedMode: true });
        var dome = new BABYLON.PhotoDome(
            'sky',
            './assets/sky.jpg',
            { resolution: 64, size: 1000 },
            this.scene
        );
        this.camera2 = new BABYLON.ArcRotateCamera("camera2", 4.4, 1.46, 2, new BABYLON.Vector3(0, 5, 0), this.scene);
        this.camera2.viewport = new BABYLON.Viewport(0.7, 0.5, 0.3, 0.5);
        this.camera2.layerMask = 2;
        this.scene.activeCameras.push(this.camera2);


        this.camera3 = new BABYLON.ArcRotateCamera("camera3", 2.37, 1.51, 2, new BABYLON.Vector3(0, 5, 0), this.scene);
        this.camera3.attachControl(this.canvas, true);
        this.camera3.viewport = new BABYLON.Viewport(0.7, 0, 0.3, 0.5);
        this.camera3.layerMask = 2;
        this.camera3.upperRadiusLimit = 2;
        this.camera3.lowerRadiusLimit = 2;
        this.camera3.upperAlphaLimit = 4;
        this.camera3.lowerAlphaLimit = 2;
        this.camera3.upperBetaLimit = 1.3;
        this.scene.activeCameras.push(this.camera3);


        this.camera = new BABYLON.ArcRotateCamera("camera", 2, 1.59, 17.65, new BABYLON.Vector3(0, 5, 0), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.lowerRadiusLimit = 10;
        this.camera.upperRadiusLimit = 25;
        this.camera.upperBetaLimit = Math.PI / 2;
        this.camera.wheelPrecision = 50;
        this.camera.lockedTarget = new BABYLON.Vector3(1.760, 5.813, 0.428);
        this.camera.viewport = new BABYLON.Viewport(0, 0, 0.7, 1);
        this.scene.activeCameras.push(this.camera);
        this.camera.layerMask = 1;

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
        this.scene.clearColor = new BABYLON.Color3(0, 0, 0);
        light.intensity = 0.6;
        light.specular = BABYLON.Color3.Black();
        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./assets/environment.dds", this.scene);
        hdrTexture.gammaSpace = false;
        this.scene.environmentTexture = hdrTexture;

        var ground = new BABYLON.MeshBuilder.CreateGround('ground', { width: 1000, height: 1000 }, this.scene);
        ground.position.y = -0.15;
        var groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMat.diffuseTexture = new BABYLON.Texture('./assets/floor.jpg');
        groundMat.diffuseTexture.uScale = 100;
        groundMat.diffuseTexture.vScale = 100;
        ground.material = groundMat;
        this.loadModel();
    }


    loadModel() {
        var models = [];
        Promise.all([
            BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/", "tower_grass.glb", this.scene).then((result) => {
                let assets = result.meshes[0];
                assets.scaling = new BABYLON.Vector3(10, 10, 10)
                assets.position.y = 0.05;
            }),

            BABYLON.SceneLoader.ImportMeshAsync(null, './assets/', 'avatar.glb', this.scene).then(result => {
                let avatar = result.meshes[0];
                avatar.position = new BABYLON.Vector3(-2.1, 9.6, -0.4);
                avatar.rotation = new BABYLON.Vector3(0, -100 / 180 * Math.PI, 0);
                avatar.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);
                this.avatarAnimation = result.animationGroups[0];
                this.avatarAnimation.stop();
            }),

            BABYLON.SceneLoader.ImportMeshAsync(null, './assets/', 'objects.glb', this.scene).then(result => {
                let basketball = BABYLON.Mesh.MergeMeshes([result.meshes[4], result.meshes[5]], true, true, undefined, true, true);
                basketball.name = 'basketball';
                let ironball = result.meshes[6];
                let tennisball = BABYLON.Mesh.MergeMeshes([result.meshes[2], result.meshes[3]], true, true, undefined, true, true);
                tennisball.name = 'tennisball'
                let paper = result.meshes[8];
                let feather = result.meshes[7];
                let watermelon = result.meshes[1];
                models.push(basketball);
                models.push(ironball);
                models.push(tennisball);
                models.push(paper);
                models.push(feather);
                models.push(watermelon);
            })
        ]).then(() => {
            hide()
            this.gui = new MyGUI(this.scene, models, this.avatarAnimation);
            this.gui.draw();
            this.animate();
        });
    }

    animate() {
        this.engine.runRenderLoop(() => {
            if (this.gui.pressed) {
                this.gui.pressed = false;
                let anim = new Animation(this.avatarAnimation, this.gui);
                anim.play();
            }
            this.scene.render();
        });
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    moveCamera(targetPos, speed) {
        var ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        BABYLON.Animation.CreateAndStartAnimation('at5', this.camera.lockedTarget, 'position', speed,
            120, this.camera.lockedTarget.position, targetPos, 0, ease);
    }
}

BABYLON.ArcRotateCamera.prototype.spinTo = function (whichprop, targetval, speed) {
    var ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    BABYLON.Animation.CreateAndStartAnimation('at4', this, whichprop, speed, 120, this[whichprop], targetval, 0, ease);
}

var app = new BRApp();
app.start();