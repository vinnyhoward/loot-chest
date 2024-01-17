import Experience from '../experience/Experience';
import Environment from './Environment';
import Trapdoor from './Trapdoor';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      this.trapdoor = new Trapdoor();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.trapdoor) this.trapdoor.update();
  }
}
