/**
 * Language Selector Component
 * Allows users to switch between supported languages
 */

import { i18n } from '../i18n.js';
import type { Language } from '../i18n.js';

export class LanguageSelector {
  private container: HTMLElement;
  private isOpen: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(): void {
    const currentLang = i18n.getLanguage();
    const availableLanguages = i18n.getAvailableLanguages();
    
    this.container.innerHTML = `
      <div class="language-selector">
        <button class="language-toggle" id="language-toggle">
          <span class="language-flag">${this.getLanguageFlag(currentLang)}</span>
          <span class="language-name">${i18n.getLanguageName(currentLang)}</span>
          <span class="language-arrow">▼</span>
        </button>
        
        <div class="language-dropdown" id="language-dropdown" style="display: none;">
          ${availableLanguages.map(lang => `
            <button class="language-option ${lang === currentLang ? 'active' : ''}" 
                    data-language="${lang}">
              <span class="language-flag">${this.getLanguageFlag(lang)}</span>
              <span class="language-name">${i18n.getLanguageName(lang)}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private getLanguageFlag(language: Language): string {
    const flags: Record<Language, string> = {
      en: '🇺🇸',
      pt_br: '🇧🇷'
    };
    return flags[language] || '🌐';
  }

  private bindEvents(): void {
    const toggle = this.container.querySelector('#language-toggle') as HTMLElement;
    const options = this.container.querySelectorAll('.language-option');

    // Toggle dropdown
    toggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // Handle language selection
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const language = (e.currentTarget as HTMLElement).dataset.language as Language;
        if (language) {
          this.selectLanguage(language);
        }
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      this.closeDropdown();
    });
  }

  private toggleDropdown(): void {
    const dropdown = this.container.querySelector('#language-dropdown') as HTMLElement;
    if (dropdown) {
      this.isOpen = !this.isOpen;
      dropdown.style.display = this.isOpen ? 'block' : 'none';
      
      const arrow = this.container.querySelector('.language-arrow') as HTMLElement;
      if (arrow) {
        arrow.textContent = this.isOpen ? '▲' : '▼';
      }
    }
  }

  private closeDropdown(): void {
    const dropdown = this.container.querySelector('#language-dropdown') as HTMLElement;
    if (dropdown && this.isOpen) {
      dropdown.style.display = 'none';
      this.isOpen = false;
      
      const arrow = this.container.querySelector('.language-arrow') as HTMLElement;
      if (arrow) {
        arrow.textContent = '▼';
      }
    }
  }

  private selectLanguage(language: Language): void {
    i18n.setLanguage(language);
    this.closeDropdown();
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language } 
    }));
    
    // Re-render the component
    this.render();
  }

  public destroy(): void {
    // Clean up event listeners if needed
    document.removeEventListener('click', this.closeDropdown.bind(this));
  }
}
