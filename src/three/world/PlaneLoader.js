// packages
import * as THREE from 'three';

export default class PlaneLoader {
  constructor() {
    this.experience = window.experience;
    this.scene = this.experience.scene;

    // Setup
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: { value: 1 },
      },
      vertexShader: `
            void main()
            {
                gl_Position = vec4(position, 1.0);
            }
        `,
      fragmentShader: `
            uniform float uAlpha;
    
            void main()
            {
                gl_FragColor = vec4(1.0, 2.0, 1.0, uAlpha);
            }
        `,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}
