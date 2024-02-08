import * as THREE from 'three';

export default class LootChest {
  constructor() {
    this.experience = window.experience;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.resource = this.resources.items;
    this.physics = this.experience.world.physics;
    this.isChestPhysicsSet = false;
    this.sceneLoaded = false;

    this.animation = {};
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('lootChest');
    }

    this.setModel = this.setModel.bind(this);
    this.setAnimation = this.setAnimation.bind(this);
    this.setLootChest = this.setLootChest.bind(this);
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
