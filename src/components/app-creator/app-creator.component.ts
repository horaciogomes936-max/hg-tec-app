import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenaiService } from '../../services/genai.service';
import { HistoryService } from '../../services/history.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Type } from '@google/genai';

interface AppBlueprint {
  appName: string;
  description: string;
  features: Array<{
    name: string;
    description: string;
    aiModelUsed?: string;
  }>;
  techStack: string[];
  pseudoCodeSnippet?: string;
  userStories?: string[];
}

@Component({
  selector: 'app-app-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './app-creator.component.html',
  styleUrls: [],
})
export class AppCreatorComponent {
  private genaiService = inject(GenaiService);
  private historyService = inject(HistoryService);

  appIdea = signal('');
  aiModelPreference = signal('gemini-2.5-flash'); // Default AI model

  generatedAppBlueprint = signal<AppBlueprint | null>(null);

  isLoading = this.genaiService.isLoading;
  error = this.genaiService.error;

  aiModels = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Texto e Código)' },
    { value: 'imagen-4.0-generate-001', label: 'Imagen 4.0 (Geração de Imagens)' },
    { value: 'veo-2.0-generate-001', label: 'Veo 2.0 (Geração de Vídeos)' },
  ];

  private readonly appBlueprintSchema = {
    type: Type.OBJECT,
    properties: {
      appName: { type: Type.STRING, description: 'Nome sugerido para o aplicativo.' },
      description: { type: Type.STRING, description: 'Descrição detalhada do aplicativo.' },
      features: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Nome da funcionalidade.' },
            description: { type: Type.STRING, description: 'Descrição da funcionalidade.' },
            aiModelUsed: { type: Type.STRING, description: 'Modelo de IA preferencial para esta funcionalidade, se aplicável.' }
          },
          propertyOrdering: ["name", "description", "aiModelUsed"],
        },
      },
      techStack: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Pilha tecnológica recomendada (ex: Angular, React, Node.js).' },
      userStories: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Histórias de usuário exemplares.' },
      pseudoCodeSnippet: { type: Type.STRING, description: 'Um snippet de pseudo-código ou estrutura de alto nível para uma funcionalidade chave.' }
    },
    propertyOrdering: ["appName", "description", "features", "techStack", "userStories", "pseudoCodeSnippet"],
  };

  async generateAppBlueprint() {
    this.generatedAppBlueprint.set(null);

    if (!this.appIdea()) {
      this.error.set('Por favor, descreva sua ideia de aplicativo.');
      return;
    }

    const prompt = `Gere um blueprint completo para um aplicativo baseado na seguinte ideia: "${this.appIdea()}". O aplicativo deve considerar o uso de modelos de IA, idealmente com preferência pelo modelo "${this.aiModelPreference()}". Inclua:
    1. Um nome sugerido para o APP.
    2. Uma descrição detalhada.
    3. Lista de funcionalidades chave, descrevendo cada uma e indicando qual modelo de IA pode ser usado (se relevante).
    4. Uma pilha tecnológica recomendada.
    5. Algumas histórias de usuário.
    6. Um snippet de pseudo-código ou uma estrutura de alto nível para uma funcionalidade principal.
    Formate a resposta como um JSON estruturado seguindo o schema fornecido.`;

    try {
      const blueprint: AppBlueprint = await this.genaiService.generateJson(
        prompt,
        this.appBlueprintSchema
      );
      this.generatedAppBlueprint.set(blueprint);

      this.historyService.addHistoryItem({
        type: 'app-creator',
        title: `App: ${blueprint.appName}`,
        input: {
          appIdea: this.appIdea(),
          aiModelPreference: this.aiModelPreference(),
        },
        output: {
          blueprint: blueprint
        }
      });

    } catch (e) {
      console.error('Erro ao gerar blueprint do app:', e);
      // Error message is already set by genaiService
    }
  }
}
