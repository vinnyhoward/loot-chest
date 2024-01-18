/* eslint-disable import/extensions */
// packages
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
  constructor() {
    this.experience = window.experience;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.originalCameraAngle = new THREE.Vector3(6, 6, 8);
    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35, // focal length
      this.sizes.width / this.sizes.height,
      0.1, // near
      100, // far
    );

    this.instance.position.set(
      this.originalCameraAngle.x,
      this.originalCameraAngle.y,
      this.originalCameraAngle.z,
    );
    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.maxDistance = 15;
    this.controls.minDistance = 5;
    this.controls.rotateSpeed = 0.25;
    this.controls.autoRotate = false;

    // Disable panning for now. However in the future we would need
    // to enable it but restrict how far a user can pan
    this.controls.enablePan = false;

    // Don't allow the camera to go past a certain distance vertically
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI / 2.6;

    // Don't allow the camera to go a certain distance horizontally
    this.controls.minAzimuthAngle = -Math.PI / 2.4;
    this.controls.maxAzimuthAngle = Math.PI / 2.4;
  }

  resetCamera() {
    this.controls.reset();
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }

  updateCameraAndControls(x, y, z) {
    this.instance.position.set(x, y, z);
    this.controls.update();

    this.controls.target.set(x, y, z);
    this.controls.update();
  }
}
