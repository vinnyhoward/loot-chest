import * as CANNON from 'cannon-es';
import { degreesToRadians } from '../../utils/degreesToRadians';

function playCollisionSound(collisionEvent) {
  const hitSound = new Audio('/sounds/wood_impact.mp3');
  const impactStrength = collisionEvent.contact.getImpactVelocityAlongNormal();

  hitSound.volume = 0.01;
  if (impactStrength > 2) {
    hitSound.currentTime = 0;
    hitSound.play();
  }
}

export default class Physics {
  constructor() {
    this.experience = window.experience;
    this.time = this.experience.time;
    this.instance = new CANNON.World();
    this.instance.gravity.set(0, -9.82, 0);
    this.instance.solver.tolerance = 0.001;
    this.boxBody = null;

    const defaultMaterial = new CANNON.Material('default');
    const defaultPlasticContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      },
    );

    this.instance.addContactMaterial(defaultPlasticContactMaterial);
    this.instance.defaultContactMaterial = defaultPlasticContactMaterial;
  }

  addBox(width, height, depth, mass, modelPosition) {
    const shape = new CANNON.Box(new CANNON.Vec3(width, height, depth));
    const position = new CANNON.Vec3(
      modelPosition.x,
      modelPosition.y,
      modelPosition.z,
    );
    const options = {
      mass,
      shape,
      position,
    };

    if (!this.boxBody) {
      this.boxBody = new CANNON.Body(options);
      this.boxBody.addEventListener('collide', playCollisionSound);
      this.boxBody.allowSleep = true;
      this.instance.addBody(this.boxBody);
    }
  }

  removeBox() {
    this.instance.removeBody(this.boxBody);
  }

  addFloor(modelPosition) {
    const shape = new CANNON.Plane();
    const position = new CANNON.Vec3(
      modelPosition.x,
      modelPosition.y - 0.25,
      modelPosition.z,
    );

    const options = {
      shape,
      position,
      mass: 0,
    };
    if (!this.floorBody) {
      const radians = degreesToRadians(90);
      this.floorBody = new CANNON.Body(options);
      this.floorBody.allowSleep = true;
      this.floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1, 0, 0),
        radians,
      );

      this.instance.addBody(this.floorBody);
    }
  }

  removeFloor() {
    this.instance.removeBody(this.floorBody);
  }

  worldSleep() {
    this.instance.allowSleep = true;
  }

  worldWake() {
    this.instance.allowSleep = false;
  }

  remove() {
    this.boxBody.removeEventListener('collide', playCollisionSound);
    this.instance.removeBody(this.boxBody);
    this.instance.removeBody(this.floorBody);
  }

  update() {
    if (this.instance) {
      this.instance.step(1 / 60, this.time.delta, 3);
    }
  }
}
