import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenaiService } from '../../services/genai.service';
import { HistoryService } from '../../services/history.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Type } from '@google/genai';

interface WebsiteBlueprint {
  title: string;
  niche: string;
  type: string;
  sections: Array<{
    heading: string;
    content: string;
    callToAction?: string;
    imagePrompt?: string; // Prompt for image generation
  }>;
}

@Component({
  selector: 'app-website-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './website-creator.component.html',
  styleUrls: [],
})
export class WebsiteCreatorComponent {
  private genaiService = inject(GenaiService);
  private historyService = inject(HistoryService);

  nicheInput = signal('');
  siteType = signal('landing-page'); // 'single-page', 'landing-page', 'e-commerce', 'catalog'

  generatedBlueprint = signal<WebsiteBlueprint | null>(null);
  generatedImages = signal<Record<string, string>>({}); // Stores image URLs by section heading

  isLoading = this.genaiService.isLoading;
  error = this.genaiService.error;

  siteTypes = [
    { value: 'single-page', label: 'Página Única' },
    { value: 'landing-page', label: 'Landing Page' },
    { value: 'e-commerce', label: 'E-commerce (Esboço)' },
    { value: 'catalog', label: 'Catálogo de Produtos' }
  ];

  private readonly websiteSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'Título principal do site.' },
      niche: { type: Type.STRING, description: 'Nicho de mercado do site.' },
      type: { type: Type.STRING, description: 'Tipo do site (landing-page, e-commerce, etc).' },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            heading: { type: Type.STRING, description: 'Título da seção.' },
            content: { type: Type.STRING, description: 'Conteúdo textual da seção.' },
            callToAction: { type: Type.STRING, description: 'Chamada para ação, se aplicável.' },
            imagePrompt: { type: Type.STRING, description: 'Prompt para gerar uma imagem relevante para a seção.' }
          },
          propertyOrdering: ["heading", "content", "callToAction", "imagePrompt"],
        },
      },
    },
    propertyOrdering: ["title", "niche", "type", "sections"],
  };

  async generateWebsite() {
    this.generatedBlueprint.set(null);
    this.generatedImages.set({});

    if (!this.nicheInput()) {
      this.error.set('Por favor, descreva o nicho do site.');
      return;
    }

    const prompt = `Crie um blueprint detalhado para um site de vendas de tipo "${this.siteType()}" no nicho de "${this.nicheInput()}". Inclua título, seções (com títulos, conteúdo, chamadas para ação e prompts de imagem descritivos), estrutura e layout. O objetivo é gerar um site profissional e otimizado para vendas.`;

    try {
      const blueprint: WebsiteBlueprint = await this.genaiService.generateJson(
        prompt,
        this.websiteSchema
      );
      this.generatedBlueprint.set(blueprint);
      
      this.historyService.addHistoryItem({
        type: 'website-creator',
        title: `Site: ${blueprint.title}`,
        input: {
          niche: this.nicheInput(),
          siteType: this.siteType()
        },
        output: {
          blueprint: blueprint
        }
      });

      // Generate images for each section concurrently
      const imagePromises = blueprint.sections.map(async (section) => {
        if (section.imagePrompt) {
          try {
            const imageUrl = await this.genaiService.generateImage(section.imagePrompt, '16:9');
            this.generatedImages.update(images => ({ ...images, [section.heading]: imageUrl }));
          } catch (imgError) {
            console.warn(`Could not generate image for section "${section.heading}":`, imgError);
          }
        }
      });
      await Promise.all(imagePromises);

    } catch (e) {
      console.error('Erro ao gerar blueprint do site:', e);
      // Error message is already set by genaiService
    }
  }
}
