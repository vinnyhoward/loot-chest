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
      const chestAssets = this.resources.sources.filter(
        (source) => source.assetType === 'lootchest',
      );

      if (this.lootChest.sceneLoaded) {
        this.lootChest.setLootChest(chestAssets[0].name);
      } else {
        setTimeout(() => {
          this.lootChest.setLootChest(chestAssets[0].name);
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
