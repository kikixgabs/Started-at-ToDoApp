import { Injectable, signal, computed, inject } from '@angular/core';
import { UserPreferencesService } from '../user-preferences-service/user-preferences-service';
import { en } from './translations/en';
import { es } from './translations/es';

type LanguageCode = 'en' | 'es';
type TranslationMap = typeof en; // Tipado automático

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private userPreference = inject(UserPreferencesService);
  private language = signal<LanguageCode>('en');
  private translations: Record<LanguageCode, TranslationMap> = { en, es };

  constructor() {
    this.initLanguage();
  }

  async initLanguage() {
    try {
      const prefs = await this.userPreference.getPreferredLanguage();
      this.language.set((prefs as LanguageCode) ?? 'en');
    } catch {
      this.language.set('en');
    }
  }

  async setLanguage(lang: LanguageCode) {
    this.language.set(lang);
    await this.userPreference.updatePreferredLanguage(lang);
  }

  /**
   * Traduce un texto a partir de su ruta en el objeto de traducciones.
   * Ej: t('filters.reset')
   */
  t(path: string): string {
    const keys = path.split('.');
    let value: any = this.translations[this.language()];
    for (const key of keys) {
      value = value?.[key];
    }
    return value ?? path;
  }

  /** Reactive getter */
  currentLang = computed(() => this.language());
}
