import { Settings } from '../models/settings.model.js';

class SettingsRepository {
  async get() {
    return Settings.getSingleton();
  }

  async update(data) {
    const settings = await Settings.getSingleton();
    Object.assign(settings, data);
    return settings.save();
  }
}

export const settingsRepository = new SettingsRepository();
