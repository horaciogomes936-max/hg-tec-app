import { Injectable, signal } from '@angular/core';

export type Language = 'pt' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  currentLang = signal<Language>('pt');
  
  private translations: Record<string, Record<Language, string>> = {
      // General & App Component
      'APP_TITLE': { pt: 'HG Tec – Criador Inteligente', en: 'HG Tec – Intelligent Creator' },
      'CREATOR_HUB': { pt: 'Hub de Criação', en: 'Creator Hub' },
      'HISTORY': { pt: 'Histórico', en: 'History' },
      'SETTINGS': { pt: 'Configurações', en: 'Settings' },
      'SUPPORT': { pt: 'Suporte', en: 'Support' },
      'LANGUAGE': { pt: 'Idioma', en: 'Language' },
      'COMING_SOON': { pt: 'Em Breve', en: 'Coming Soon' },
      'FEATURE_IN_DEVELOPMENT': { pt: 'Esta funcionalidade está em desenvolvimento.', en: 'This feature is under development.' },
      'CREATE_VIDEOS_WITH_CHARACTERS': { pt: 'Criar Vídeos com Bonecos', en: 'Create Videos with Characters' },
      'TRANSFORM_IMAGES_TO_VIDEOS': { pt: 'Transformar Imagens em Vídeos', en: 'Transform Images into Videos' },
      'SALES_WEBSITE_CREATOR': { pt: 'Criador de Sites de Venda', en: 'Sales Website Creator' },
      'AI_APP_CREATOR': { pt: 'Criador de Aplicativos com IA', en: 'AI-Powered App Creator' },
      'ERROR_LABEL': { pt: 'Erro', en: 'Error' },
      'GENERATING': { pt: 'Gerando', en: 'Generating' },
      'GENERATING_CREATION_MESSAGE': { pt: 'Aguarde, sua criação está sendo gerada', en: 'Please wait, your creation is being generated' },
      'VIRAL_VIDEO_CREATOR': { pt: 'Grok: Vídeos Virais', en: 'Grok: Viral Videos' },
      
      // Login Component
      'LOGIN_WELCOME_MESSAGE': { pt: 'Faça login para começar a criar.', en: 'Log in to start creating.' },
      'LOGIN_WITH_GOOGLE': { pt: 'Entrar com Google', en: 'Login with Google' },
      'LOGIN_WITH_FACEBOOK': { pt: 'Entrar com Facebook', en: 'Login with Facebook' },

      // Video Creation
      'CREATE_VIDEOS_WITH_CHARACTERS_TITLE': { pt: 'Criar Vídeos com Bonecos Animados', en: 'Create Videos with Animated Characters' },
      'ADD_VIDEO_SCRIPT_LABEL': { pt: 'Adicione o texto, narração ou roteiro para o vídeo:', en: 'Add the text, narration, or script for the video:' },
      'VIDEO_SCRIPT_PLACEHOLDER': { pt: 'Ex: Uma história de um coelho aventureiro que encontra um tesouro mágico.', en: 'Ex: A story of an adventurous rabbit who finds a magical treasure.' },
      'VIDEO_STYLE_LABEL': { pt: 'Estilo do Vídeo:', en: 'Video Style:' },
      'VIDEO_DURATION_LABEL': { pt: 'Duração do Vídeo:', en: 'Video Duration:' },
      'GENERATE_VIDEO_AND_SCRIPT_BUTTON': { pt: 'Gerar Vídeo e Roteiro', en: 'Generate Video and Script' },
      'SCRIPT_PREVIEW_TITLE': { pt: 'Prévia do Roteiro Visual e Animações', en: 'Visual Script and Animation Preview' },
      'GENERATED_VIDEO_TITLE': { pt: 'Vídeo Gerado', en: 'Generated Video' },
      'OPEN_VIDEO_IN_NEW_TAB': { pt: 'Abrir vídeo em nova aba', en: 'Open video in new tab' },

      // Image to Video
      'TRANSFORM_IMAGES_TO_VIDEOS_TITLE': { pt: 'Transformar Imagens em Vídeos', en: 'Transform Images into Videos' },
      'UPLOAD_IMAGE_LABEL': { pt: 'Envie a imagem para transformar em vídeo:', en: 'Upload the image to transform into a video:' },
      'SELECTED_FILE_LABEL': { pt: 'Arquivo selecionado', en: 'Selected file' },
      'VISUAL_STYLE_EFFECTS_LABEL': { pt: 'Estilo e Efeitos Visuais:', en: 'Style and Visual Effects:' },
      'ADDITIONAL_INSTRUCTIONS_LABEL': { pt: 'Instruções adicionais para o vídeo (opcional):', en: 'Additional instructions for the video (optional):' },
      'ADDITIONAL_INSTRUCTIONS_PLACEHOLDER': { pt: 'Ex: Adicione uma trilha sonora épica e legendas em português.', en: 'Ex: Add an epic soundtrack and subtitles in English.' },
      'TRANSFORMING': { pt: 'Transformando', en: 'Transforming' },
      'TRANSFORM_IMAGE_TO_VIDEO_BUTTON': { pt: 'Transformar Imagem em Vídeo', en: 'Transform Image into Video' },
      'PROCESSING_IMAGE_MESSAGE': { pt: 'Processando sua imagem em vídeo. Pode demorar alguns minutos', en: 'Processing your image into a video. This may take a few minutes' },

      // Website Creator
      'SALES_WEBSITE_CREATOR_TITLE': { pt: 'Criador de Sites de Venda Profissionais', en: 'Professional Sales Website Creator' },
      'DESCRIBE_NICHE_LABEL': { pt: 'Descreva o nicho de mercado ou produto para o site:', en: 'Describe the market niche or product for the site:' },
      'NICHE_PLACEHOLDER': { pt: 'Ex: Loja de café artesanal, consultoria de marketing digital, etc.', en: 'Ex: Artisan coffee shop, digital marketing consulting, etc.' },
      'SITE_MODEL_LABEL': { pt: 'Modelo do Site:', en: 'Site Model:' },
      'GENERATING_SITE': { pt: 'Gerando Site', en: 'Generating Site' },
      'GENERATE_SALES_SITE_BUTTON': { pt: 'Gerar Site de Vendas', en: 'Generate Sales Site' },
      'CREATING_SITE_STRUCTURE_MESSAGE': { pt: 'Criando a estrutura do seu site e gerando conteúdo', en: 'Creating your site structure and generating content' },
      'SITE_BLUEPRINT_TITLE': { pt: 'Blueprint do Site', en: 'Site Blueprint' },
      'NICHE_LABEL': { pt: 'Nicho', en: 'Niche' },
      'TYPE_LABEL': { pt: 'Tipo', en: 'Type' },
      
      // App Creator
      'AI_APP_CREATOR_TITLE': { pt: 'Criador de Aplicativos com Modelos de IA', en: 'Creator of Apps with AI Models' },
      'DESCRIBE_APP_IDEA_LABEL': { pt: 'Descreva sua ideia de aplicativo:', en: 'Describe your app idea:' },
      'APP_IDEA_PLACEHOLDER': { pt: 'Ex: Um aplicativo de fitness que usa IA para personalizar planos de treino e dieta, com um chatbot de suporte.', en: 'Ex: A fitness app that uses AI to personalize workout and diet plans, with a support chatbot.' },
      'AI_MODEL_PREFERENCE_LABEL': { pt: 'Preferência de Modelo de IA Principal:', en: 'Main AI Model Preference:' },
      'GENERATING_BLUEPRINT': { pt: 'Gerando Blueprint', en: 'Generating Blueprint' },
      'GENERATE_APP_BLUEPRINT_BUTTON': { pt: 'Gerar Blueprint do Aplicativo', en: 'Generate App Blueprint' },
      'SKETCHING_APP_MESSAGE': { pt: 'Esboçando seu aplicativo inteligente', en: 'Sketching your smart application' },
      'GENERATED_APP_BLUEPRINT_TITLE': { pt: 'Blueprint do Aplicativo Gerado', en: 'Generated App Blueprint' },
      'FEATURES_TITLE': { pt: 'Funcionalidades', en: 'Features' },
      'SUGGESTED_TECH_STACK_TITLE': { pt: 'Pilha Tecnológica Sugerida', en: 'Suggested Tech Stack' },
      'USER_STORIES_TITLE': { pt: 'Histórias de Usuário', en: 'User Stories' },
      'PSEUDO_CODE_SNIPPET_TITLE': { pt: 'Snippet de Pseudo-código / Estrutura', en: 'Pseudo-code Snippet / Structure' },

      // Viral Video Creator
      'VIRAL_VIDEO_CREATOR_TITLE': { pt: 'Gerador de Vídeos Virais Realistas', en: 'Realistic Viral Video Generator' },
      'VIDEO_TOPIC_LABEL': { pt: 'Qual é o tema do seu vídeo viral?', en: 'What is the topic of your viral video?' },
      'VIDEO_TOPIC_PLACEHOLDER': { pt: 'Ex: Um cão skatista, uma receita inusitada, uma descoberta científica chocante.', en: 'Ex: A skateboarding dog, an unusual recipe, a shocking scientific discovery.' },
      'VIDEO_PLATFORM_LABEL': { pt: 'Plataforma de Destino:', en: 'Target Platform:' },
      'VIRAL_STYLE_LABEL': { pt: 'Estilo Viral:', en: 'Viral Style:' },
      'GENERATE_VIRAL_VIDEO_BUTTON': { pt: 'Gerar Vídeo Viral', en: 'Generate Viral Video' },
      'GENERATING_VIRAL_VIDEO': { pt: 'Gerando seu próximo viral', en: 'Generating your next viral hit' },

      // History
      'HISTORY_TITLE': { pt: 'Histórico de Criações', en: 'Creation History' },
      'NO_HISTORY_MESSAGE': { pt: 'Você ainda não criou nada. Comece a gerar conteúdo!', en: 'You haven\'t created anything yet. Start generating content!' },
  };

  constructor() {
    const savedLang = localStorage.getItem('hg-tec-lang') as Language | null;
    if (savedLang) {
      this.currentLang.set(savedLang);
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    localStorage.setItem('hg-tec-lang', lang);
  }

  translate(key: string): string {
    return this.translations[key]?.[this.currentLang()] ?? key;
  }
}