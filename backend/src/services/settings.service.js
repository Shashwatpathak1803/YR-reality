import { settingsRepository } from '../repositories/settings.repository.js';

class SettingsService {
  async get() {
    return settingsRepository.get();
  }

  async update(payload) {
    return settingsRepository.update(payload);
  }
}

export const settingsService = new SettingsService();
