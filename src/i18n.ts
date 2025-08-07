/**
 * Internationalization (i18n) system for Silli PWA
 * Supports English (en) and Portuguese Brazil (pt_br)
 */

export type Language = 'en' | 'pt_br';

export interface I18nData {
  pwa: {
    title: string;
    mode_label: string;
    button: {
      start: string;
      stop: string;
      process: string;
    };
    score_ring: {
      label: string;
      unit: string;
    };
    badges: {
      label: string;
    };
    badge: {
      speech: string;
      music: string;
      fluctuating: string;
      steady: string;
    };
    tips: {
      title: string;
    };
    tip: {
      lower_volume: string;
      single_sound: string;
      soft_light: string;
      lower_voice: string;
    };
    session: {
      info_id: string;
      duration: string;
    };
    upload: {
      success: string;
      failed: string;
    };
    permission: {
      mic_denied: string;
      mic_not_found: string;
      error_generic: string;
    };
    footer_privacy: string;
  };
  meal: {
    title: string;
    subtitle: string;
    sections: {
      howWasMeal: string;
      whatWouldYouLike: string;
      quickActions: string;
    };
    buttons: {
      snapMeal: string;
      askQuestion: string;
      logMeal: string;
      viewPatterns: string;
      gallery: string;
      settings: string;
      takePhoto: string;
      uploadPhoto: string;
      saveMeal: string;
      cancel: string;
      back: string;
    };
    descriptions: {
      selectRating: string;
      takePhotoOfMeal: string;
      getInsightsAboutFeeding: string;
    };
    privacy: {
      photosStayPrivate: string;
      dataStaysLocal: string;
    };
    form: {
      mealType: string;
      foodItems: string;
      rating: string;
      notes: string;
    };
    insights: {
      title: string;
      moodScore: string;
      imageAnalysis: string;
      personalizedTip: string;
      mealAchievement: string;
    };
    question: {
      title: string;
      placeholder: string;
      suggestions: string;
      askAI: string;
      aiResponse: string;
      askAnother: string;
    };
  };
}

const translations: Record<Language, I18nData> = {
  en: {
    pwa: {
      title: "Parent Night Helper",
      mode_label: "Helper mode",
      button: {
        start: "Start session",
        stop: "Stop session",
        process: "Process results"
      },
      score_ring: {
        label: "Wind-down score",
        unit: "/100"
      },
      badges: {
        label: "Signals detected"
      },
      badge: {
        speech: "Speech present",
        music: "Music or TV",
        fluctuating: "Unsteady sounds",
        steady: "Steady signal"
      },
      tips: {
        title: "Try this"
      },
      tip: {
        lower_volume: "Lower TV or music volume.",
        single_sound: "Use one steady sound (e.g. fan or white noise).",
        soft_light: "Soften the room light.",
        lower_voice: "Speak slower and softer."
      },
      session: {
        info_id: "Session: {id}",
        duration: "Duration: {mm}:{ss}"
      },
      upload: {
        success: "✅ Results saved. Check Telegram for details.",
        failed: "Session saved locally. Will retry. Use /ingest if needed."
      },
      permission: {
        mic_denied: "Microphone access denied. Please allow mic to use this tool.",
        mic_not_found: "No microphone found. Try restarting or check your device.",
        error_generic: "Can't access mic. Please check your settings."
      },
      footer_privacy: "On-device only. No audio is uploaded. [Privacy Policy]"
    },
    meal: {
      title: "Meal Tracker",
      subtitle: "Log your baby's feeding moments",
      sections: {
        howWasMeal: "How was the meal?",
        whatWouldYouLike: "What would you like to do?",
        quickActions: "Quick actions"
      },
      buttons: {
        snapMeal: "Snap a meal photo",
        askQuestion: "Ask a question",
        logMeal: "Log a meal",
        viewPatterns: "View feeding patterns",
        gallery: "View gallery",
        settings: "Settings",
        takePhoto: "Take photo",
        uploadPhoto: "Upload photo",
        saveMeal: "Save meal",
        cancel: "Cancel",
        back: "Back"
      },
      descriptions: {
        selectRating: "Select a rating for the meal",
        takePhotoOfMeal: "Take a photo of the meal to remember it better",
        getInsightsAboutFeeding: "Get insights about feeding patterns"
      },
      privacy: {
        photosStayPrivate: "Photos stay private on your device",
        dataStaysLocal: "Data stays local on your device"
      },
      form: {
        mealType: "Meal type",
        foodItems: "Food items",
        rating: "Rating",
        notes: "Notes"
      },
      insights: {
        title: "Meal Insights",
        moodScore: "Mood score",
        imageAnalysis: "Image analysis",
        personalizedTip: "Personalized tip",
        mealAchievement: "Meal achievement"
      },
      question: {
        title: "Ask AI",
        placeholder: "What's on your mind?",
        suggestions: "Suggestions",
        askAI: "Ask AI",
        aiResponse: "AI response",
        askAnother: "Ask another"
      }
    }
  },
  pt_br: {
    pwa: {
      title: "Auxiliar da Noite",
      mode_label: "Modo de ajuda",
      button: {
        start: "Iniciar sessão",
        stop: "Parar sessão",
        process: "Ver resultados"
      },
      score_ring: {
        label: "Índice de relaxamento",
        unit: "/100"
      },
      badges: {
        label: "Sinais detectados"
      },
      badge: {
        speech: "Voz ativa",
        music: "Música ou TV",
        fluctuating: "Sons instáveis",
        steady: "Som contínuo"
      },
      tips: {
        title: "Tente isto"
      },
      tip: {
        lower_volume: "Abaixe o volume da TV ou música.",
        single_sound: "Use um som contínuo (como ventilador ou ruído branco).",
        soft_light: "Diminua a luz do ambiente.",
        lower_voice: "Fale mais devagar e com suavidade."
      },
      session: {
        info_id: "Sessão: {id}",
        duration: "Duração: {mm}:{ss}"
      },
      upload: {
        success: "✅ Resultados salvos. Veja os detalhes no Telegram.",
        failed: "Sessão salva localmente. Vamos tentar de novo. Use /ingest se precisar."
      },
      permission: {
        mic_denied: "Acesso ao microfone negado. Permita o uso para continuar.",
        mic_not_found: "Nenhum microfone encontrado. Reinicie ou verifique o dispositivo.",
        error_generic: "Não foi possível acessar o microfone. Verifique as configurações."
      },
      footer_privacy: "Análise local. Nenhum áudio é enviado. [Política de Privacidade]"
    },
    meal: {
      title: "Registro de Refeição",
      subtitle: "Registre os momentos de alimentação do seu bebê",
      sections: {
        howWasMeal: "Como foi a refeição?",
        whatWouldYouLike: "O que você gostaria de fazer?",
        quickActions: "Ações rápidas"
      },
      buttons: {
        snapMeal: "Fotografe uma foto da refeição",
        askQuestion: "Faça uma pergunta",
        logMeal: "Registre uma refeição",
        viewPatterns: "Veja padrões de alimentação",
        gallery: "Veja galeria",
        settings: "Configurações",
        takePhoto: "Tirar foto",
        uploadPhoto: "Enviar foto",
        saveMeal: "Salvar refeição",
        cancel: "Cancelar",
        back: "Voltar"
      },
      descriptions: {
        selectRating: "Selecione uma avaliação para a refeição",
        takePhotoOfMeal: "Fotografe uma foto da refeição para lembrar melhor",
        getInsightsAboutFeeding: "Obtenha insights sobre padrões de alimentação"
      },
      privacy: {
        photosStayPrivate: "Fotos ficam privadas no seu dispositivo",
        dataStaysLocal: "Dados ficam locais no seu dispositivo"
      },
      form: {
        mealType: "Tipo de refeição",
        foodItems: "Itens alimentares",
        rating: "Avaliação",
        notes: "Notas"
      },
      insights: {
        title: "Insights de Refeição",
        moodScore: "Pontuação de humor",
        imageAnalysis: "Análise de imagem",
        personalizedTip: "Dica personalizada",
        mealAchievement: "Conquista de refeição"
      },
      question: {
        title: "Perguntar ao AI",
        placeholder: "O que está na sua cabeça?",
        suggestions: "Sugestões",
        askAI: "Perguntar ao AI",
        aiResponse: "Resposta do AI",
        askAnother: "Perguntar outra"
      }
    }
  }
};

class I18nManager {
  private currentLanguage: Language = 'en';

  constructor() {
    this.detectLanguage();
  }

  private detectLanguage(): void {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang') as Language;
    
    if (langParam && translations[langParam]) {
      this.currentLanguage = langParam;
      return;
    }

    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('pt')) {
      this.currentLanguage = 'pt_br';
    } else {
      this.currentLanguage = 'en';
    }

    // Check localStorage for saved preference
    const savedLang = localStorage.getItem('silli_language') as Language;
    if (savedLang && translations[savedLang]) {
      this.currentLanguage = savedLang;
    }
  }

  public setLanguage(language: Language): void {
    if (translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('silli_language', language);
      
      // Update URL parameter
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      window.history.replaceState({}, '', url.toString());
    }
  }

  public getLanguage(): Language {
    return this.currentLanguage;
  }

  public t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = this.getFallbackValue(key);
        break;
      }
    }

    if (typeof value !== 'string') {
      return this.getFallbackValue(key);
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param]?.toString() || match;
      });
    }

    return value;
  }

  private getFallbackValue(key: string): string {
    const keys = key.split('.');
    let value: any = translations.en;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if not found even in English
      }
    }

    return typeof value === 'string' ? value : key;
  }

  public getAvailableLanguages(): Language[] {
    return Object.keys(translations) as Language[];
  }

  public getLanguageName(language: Language): string {
    const names: Record<Language, string> = {
      en: 'English',
      pt_br: 'Português (Brasil)'
    };
    return names[language] || language;
  }
}

// Create singleton instance
export const i18n = new I18nManager();
