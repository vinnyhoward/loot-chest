import Experience from '../experience/Experience';
import Environment from './Environment';
import Trapdoor from './Trapdoor';
import Physics from './Physics';
import LootChest from './LootChest';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.physics = new Physics();

    this.resources.on('ready', () => {
      this.environment = new Environment();
      this.trapdoor = new Trapdoor();
      this.lootChest = new LootChest();

      const currentChest = 'chest1';
      if (this.lootChest.sceneLoaded) {
        this.lootChest.setLootChest(currentChest);
      } else {
        setTimeout(() => {
          this.lootChest.setLootChest(currentChest);
        }, 3000);
      }
    });
  }

  update() {
    if (this.physics) this.physics.update();
    if (this.trapdoor) this.trapdoor.update();
    if (this.lootChest) this.lootChest.update();
  }
}
