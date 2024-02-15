import { fadeInAudio, fadeOutAudio } from '../../utils/audioHelpers';

export default class Music {
  constructor() {
    this.lootChestTheme = new Audio('/music/lootchest_theme_song.mp3');
    this.lootChestOpeningTheme = new Audio('/music/lootchest_opening_song.mp3');
    this.lootChestOpenSuccess = new Audio('/music/lootchest_success_open.mp3');
    this.lootChestOpenFailure = new Audio('/music/lootchest_failure_open.mp3');
  }

  // setOceanAmbience(isLooped) {
  //   fadeInAudio(this.oceanAmbience, isLooped);
  // }

  // removeOceanAmbience() {
  //   fadeOutAudio(this.oceanAmbience);
  // }

  setLootChestTheme(isLooped) {
    fadeInAudio(this.lootChestTheme, isLooped);
  }

  removeLootChestTheme() {
    fadeOutAudio(this.lootChestTheme);
  }

  setLootChestOpeningTheme(isLooped) {
    fadeInAudio(this.lootChestOpeningTheme, isLooped);
  }

  removeLootChestOpeningTheme() {
    fadeOutAudio(this.lootChestOpeningTheme);
  }

  setLootChestOpenSuccess(isLooped) {
    fadeInAudio(this.lootChestOpenSuccess, isLooped);
  }

  removeLootChestOpenSuccess() {
    fadeOutAudio(this.lootChestOpenSuccess);
  }

  setLootChestOpenFailure(isLooped) {
    fadeInAudio(this.lootChestOpenFailure, isLooped);
  }

  removeLootChestOpenFailure() {
    fadeOutAudio(this.lootChestOpenFailure);
  }

  remove() {
    // this.removeOceanAmbience();
    this.removeLootChestTheme();
  }
}
