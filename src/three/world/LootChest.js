import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import gsap from 'gsap';
import { EVENTS } from '../../constants/events';

export default class LootChest {
  constructor() {
    this.experience = window.experience;
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;
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
    this.points = [];

    this.animation = {};
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('lootChest');
    }

    this.setModel = this.setModel.bind(this);
    this.setAnimation = this.setAnimation.bind(this);
    this.setLootChest = this.setLootChest.bind(this);
    this.getLootChest = this.getLootChest.bind(this);
    this.startSuccessAnimation = this.startSuccessAnimation.bind(this);
    this.startFailureAnimation = this.startFailureAnimation.bind(this);
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
        this.points = [new THREE.Vector3(0, 3, 0)];
      }

      const modelPosition = { x: 0, y: 3, z: 0 };
      this.model = this.resource[assetName].scene;
      this.model.scale.set(1, 1, 1);
      this.model.position.y = modelPosition.y;
      this.scene.add(this.model);

      this.model.traverse((child) => {
        const target = new THREE.Vector3();
        const { x, y, z } = child.getWorldPosition(target);
        const chestPoint = new THREE.Vector3(x - 4, y + 3, z);
        this.points.push(chestPoint);

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

  startSuccessAnimation() {
    this.setNewAnimation('success');
  }

  startFailureAnimation() {
    this.setNewAnimation('failure');
  }

  startOpeningCutScene(tempCallback) {
    this.music.setLootChestOpeningTheme(false);
    this.music.removeLootChestTheme();
    this.camera.controls.enabled = false;

    // GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        this.camera.controls.enabled = true;
        this.music.removeLootChestOpeningTheme(false);
        this.music.setLootChestTheme(true);
        tempCallback(); // Final callback
      },
    });

    // Initial zoom and pan
    tl.to(this.camera.instance.position, {
      x: '-=5.35',
      y: 3,
      z: '-=5.25',
      duration: 2,
      ease: 'power1.in',
      onUpdate: () => this.camera.instance.lookAt(this.model.position),
    });

    tl.to(
      this.camera.instance.position,
      {
        onStart: () => {
          this.camera.instance.position.set(3.65, 3, 2.25);
        },
        x: 3.65,
        y: 3,
        z: 2.25 + 0.5,
        duration: 2,
        ease: 'none',
        onUpdate: () => this.camera.instance.lookAt(this.model.position),
      },
      '+=2',
    );

    tl.to(
      this.camera.instance.position,
      {
        onStart: () => {
          this.camera.instance.position.set(0, 3.5, 3.25);
        },
        x: 0 + 0.5, // Slight movement in X for panning
        y: 3.5,
        z: 3.25,
        duration: 2,
        ease: 'none',
        onUpdate: () => this.camera.instance.lookAt(this.model.position),
      },
      '+=2',
    );

    // Third cut with panning
    tl.to(
      this.camera.instance.position,
      {
        onStart: () => {
          this.camera.instance.position.set(0, 5.5, 5.75);
        },
        x: 0,
        y: 2.5 + 0.5, // Slight movement in Y for panning
        z: 5.75,
        duration: 2,
        ease: 'none',
        onUpdate: () => this.camera.instance.lookAt(this.model.position),
      },
      '+=2',
    );
  }

  endOpeningCutScene(tempCallback) {
    // Kill all GSAP animations
    gsap.killTweensOf(this.camera.instance.position);

    // If you have animations on other properties or objects, kill them too
    // e.g., gsap.killTweensOf([this.camera.instance.rotation, anotherObject.position]);

    // Reset the camera to the desired position and orientation
    this.camera.controls.enabled = true;
    this.camera.instance.position.set(0, 3, 5);
    this.camera.instance.lookAt(this.model.position);
    this.camera.controls.update(); // This might be redundant if controls.enabled automatically updates the camera

    // Handle music and callbacks as before
    this.music.removeLootChestOpeningTheme(false);
    this.music.setLootChestTheme(true);
    tempCallback(); // Execute any final actions now that the cutscene is skipped
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

    if (this.points.length > 0) {
      document.dispatchEvent(
        new CustomEvent(EVENTS.CHEST_POINTS_UPDATED, {
          detail: { points: this.points, cameraInstance: this.camera.instance },
        }),
      );
    }
  }
}
