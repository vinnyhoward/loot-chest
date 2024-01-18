import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import EventEmitter from './EventEmitter';

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();
    this.experience = window.experience;
    this.sources = sources;
    this.loadingBar = this.experience.loadingBar;
    this.overlayMaterial = this.experience.planeLoader.material;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    this.loaders.gltfLoader.setDRACOLoader(dracoLoader);
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === 'gltfModel' || source.type === 'glbModel') {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === 'texture') {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded += 1;

    const progressRatio = (this.loaded / this.toLoad) * 100;
    if (progressRatio <= 100) {
      this.loadingBar.updateLoadingBar(progressRatio);
    }

    if (this.loaded === this.toLoad) {
      console.log('complete');
      this.loadingBar.hideLoadingScreen();

      window.setTimeout(() => {
        gsap.to(this.overlayMaterial.uniforms.uAlpha, {
          duration: 3,
          value: 0,
          delay: 0,
        });
      }, 2000);

      this.trigger('ready');
    }
  }
}
