import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

export default class LootChest {
  constructor() {
    this.experience = window.experience;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.resource = this.resources.items;
    this.physics = this.experience.world.physics;
    this.music = this.experience.world.music;
    this.trapdoor = this.experience.world.trapdoor;
    this.isChestPhysicsSet = false;
    this.sceneLoaded = false;
    this.timerOne = null;
    this.timerTwo = null;
    this.timerThree = null;
    this.timerFour = null;

    this.animation = {};
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('lootChest');
    }

    this.setModel = this.setModel.bind(this);
    this.setAnimation = this.setAnimation.bind(this);
    this.setLootChest = this.setLootChest.bind(this);
    this.getLootChest = this.getLootChest.bind(this);
  }

  setLootChest(assetName) {
    if (assetName) {
      this.isChestPhysicsSet = true;
      this.setModel(assetName);
      this.setAnimation(assetName);
      this.sceneLoaded = true;
    }
  }

  setModel(assetName) {
    if (assetName) {
      if (this.model) {
        this.physics.boxBody.position.set(0, 3, 0);
        this.remove();
      }

      const modelPosition = { x: 0, y: 3, z: 0 };
      this.model = this.resource[assetName].scene;
      this.model.scale.set(1, 1, 1);
      this.model.position.y = modelPosition.y;
      this.scene.add(this.model);

      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.physics.addBox(1, 0, 1, 3, modelPosition);
    }
  }

  setAnimation(assetName) {
    if (assetName) {
      this.animation.mixer = new THREE.AnimationMixer(this.model);
      this.animation.actions = {};

      if (this.resource[assetName] && this.resource[assetName].animations[0]) {
        this.animation.actions.failure = this.animation.mixer.clipAction(
          this.resource[assetName].animations[0],
        );
      }

      if (this.resource[assetName] && this.resource[assetName].animations[1]) {
        this.animation.actions.fall = this.animation.mixer.clipAction(
          this.resource[assetName].animations[1],
        );
      }

      if (this.resource[assetName] && this.resource[assetName].animations[2]) {
        this.animation.actions.shake = this.animation.mixer.clipAction(
          this.resource[assetName].animations[2],
        );
      }

      if (this.resource[assetName] && this.resource[assetName].animations[2]) {
        this.animation.actions.success = this.animation.mixer.clipAction(
          this.resource[assetName].animations[3],
        );
      }
    }

    if (this.animation.actions.shake) {
      this.animation.actions.shake.play();
    }
  }

  resetAnimations() {
    this.animation.actions.failure.reset();
    this.animation.actions.success.reset();

    this.animation.actions.failure.paused = true;
    this.animation.actions.success.paused = true;
  }

  setNewAnimation(name) {
    return new Promise((resolve) => {
      if (!name) {
        return;
      }

      if (this.currentHighlightAnimationName === name) {
        this.animation.actions.currentHighlight.setLoop(THREE.LoopOnce);
        return;
      }

      this.animation.actions.currentHighlight = this.animation.actions[name];
      this.animation.actions.previousHighlight =
        this.animation.actions.currentHighlight;

      this.animation.actions.currentHighlight.setLoop(THREE.LoopRepeat);
      this.animation.actions.previousHighlight.setLoop(THREE.LoopOnce);
      this.currentHighlightAnimationName = name;

      this.animation.actions.currentHighlight.reset();
      this.animation.actions.currentHighlight.timeScale = 1;
      this.animation.actions.currentHighlight.clampWhenFinished = true;
      this.animation.actions.currentHighlight.play();

      this.animation.mixer.addEventListener('finished', () => {
        this.animation.actions.previousHighlight =
          this.animation.actions.currentHighlight;
        this.animation.actions.currentHighlight = null;
        this.currentHighlightAnimationName = '';

        resolve();
      });
    });
  }

  getLootChest(chestFileName) {
    this.trapdoor.openTrapdoor();
    this.animation.actions.fall.reset();
    this.animation.actions.fall.play();

    setTimeout(() => {
      this.setLootChest(chestFileName);
    }, 650);
  }

  startOpeningCutScene(tempCallback) {
    // hide UI
    // show skip button

    this.music.setLootChestOpeningTheme(false);
    this.music.removeLootChestTheme();
    this.camera.controls.enabled = false;
    const firstTweenDuration = 2000;
    const firstCoords = {
      x: -4,
      y: 3,
      z: 2.5,
    };
    new TWEEN.Tween(firstCoords)
      .to(
        {
          x: firstCoords.x - 0.35,
          y: firstCoords.y,
          z: firstCoords.z - 0.25,
        },
        firstTweenDuration,
      )
      .easing(TWEEN.Easing.Quadratic.In)
      .onUpdate(() => {
        this.camera.instance.position.set(
          firstCoords.x,
          firstCoords.y,
          firstCoords.z,
        );
        this.camera.instance.lookAt(this.model.position);
      })
      .start();

    this.timerOne = setTimeout(() => {
      const secondTweenDuration = 2000;
      const secondCoords = {
        x: 4,
        y: 3,
        z: 2.5,
      };
      new TWEEN.Tween(secondCoords)
        .to(
          {
            x: secondCoords.x - 0.25,
            y: secondCoords.y,
            z: secondCoords.z - 0.45,
          },
          secondTweenDuration,
        )
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(() => {
          this.camera.instance.position.set(
            secondCoords.x,
            secondCoords.y,
            secondCoords.z,
          );
          this.camera.instance.lookAt(this.model.position);
        })
        .start();
    }, 2000);

    this.timerTwo = setTimeout(() => {
      const tweenDuration = 3800;
      const thirdCoords = {
        x: 0,
        y: 3.5,
        z: 5,
      };
      new TWEEN.Tween(thirdCoords)
        .to(
          { x: thirdCoords.x, y: thirdCoords.y, z: thirdCoords.z - 1.75 },
          tweenDuration,
        )
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(() => {
          this.camera.instance.position.set(
            thirdCoords.x,
            thirdCoords.y,
            thirdCoords.z,
          );
          this.camera.instance.lookAt(this.model.position);
        })
        .start();
    }, 4000);

    this.timerThree = setTimeout(() => {
      const tweenDuration = 1000;
      const thirdCoords = {
        x: this.camera.instance.position.x,
        y: this.camera.instance.position.y,
        z: this.camera.instance.position.z,
      };
      new TWEEN.Tween(thirdCoords)
        .to(
          { x: thirdCoords.x, y: thirdCoords.y + 2, z: thirdCoords.z + 2.5 },
          tweenDuration,
        )
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(() => {
          this.camera.instance.position.set(
            thirdCoords.x,
            thirdCoords.y,
            thirdCoords.z,
          );
          this.camera.instance.lookAt(this.model.position);
        })
        .start();

      this.camera.controls.enabled = true;
      this.music.removeLootChestOpeningTheme(false);
      // hide skip button
    }, 10000);

    this.timerFour = setTimeout(() => {
      // show UI
      tempCallback();
      this.music.setLootChestTheme(true);
    }, 12000);
  }

  endOpeningCutScene(tempCallback) {
    TWEEN.removeAll();
    this.camera.controls.enabled = true;
    this.camera.instance.position.set(0, 3, 5);
    this.camera.instance.lookAt(this.model.position);
    this.camera.controls.update();

    clearTimeout(this.timerOne);
    clearTimeout(this.timerTwo);
    clearTimeout(this.timerThree);
    clearTimeout(this.timerFour);

    this.music.removeLootChestOpeningTheme(false);
    this.music.setLootChestTheme(true);
    tempCallback();
  }

  remove() {
    this.scene.remove(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    });
  }

  update() {
    if (Object.keys(this.animation).length !== 0) {
      this.animation.mixer.update(this.time.delta * 0.001);
    }

    if (this.physics && this.physics.boxBody && this.isChestPhysicsSet) {
      this.model.position.copy(this.physics.boxBody.position);
    }
  }
}
