import * as THREE from 'three';

export default class Trapdoor {
  constructor() {
    this.experience = window.experience;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.resource = this.resources.items.trapDoorModel;
    this.physics = this.experience.world.physics;

    this.animation = {};

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('trapdoor');
    }

    this.setModel();
    this.setAnimation();

    this.setModel = this.setModel.bind(this);
    this.setAnimation = this.setAnimation.bind(this);
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(1, 1, 1);
    this.model.position.y = 0.5;
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const assetName = child.name;
        if (assetName === 'Door_low003') {
          const target = new THREE.Vector3();
          const { x, y } = child.getWorldPosition(target);
          this.trapdoorPosition = { x, y: y + 0.5, z: 0 };
          this.physics.addFloor(this.trapdoorPosition);
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  setAnimation() {
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions = {};

    this.animation.actions.openAndClose = this.animation.mixer.clipAction(
      this.resource.animations[0],
    );

    this.animation.actions.openAndClose.setLoop(THREE.LoopOnce);
    this.animation.actions.openAndClose.timeScale = 1.5;
    this.animation.actions.openAndClose.clampWhenFinished = true;
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

    if (this.physics && this.physics.floorBody) {
      this.physics.floorBody.position.copy(this.model.position);
    }
  }
}
