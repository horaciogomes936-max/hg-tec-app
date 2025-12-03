import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenaiService } from '../../services/genai.service';
import { HistoryService } from '../../services/history.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-video-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './video-creation.component.html',
  styleUrls: [], // Using Tailwind
})
export class VideoCreationComponent {
  private genaiService = inject(GenaiService);
  private historyService = inject(HistoryService);

  scriptInput = signal('');
  videoStyle = signal('cartoon');
  videoDuration = signal('30-60'); // "30-60 seconds", "1-2 minutes"

  generatedScriptPreview = signal<string | null>(null);
  generatedVideoDescription = signal<string | null>(null); // For animated character description
  generatedVideoUrl = signal<string | null>(null);

  isLoading = this.genaiService.isLoading;
  error = this.genaiService.error;

  videoStyles = [
    'cartoon', '3D', '2D', 'realista', 'minimalista', 'estilo Pixar', 'boneco animado simples'
  ];
  durations = ['30-60 segundos', '1-2 minutos', '2-5 minutos'];

  async generateVideoContent() {
    this.generatedScriptPreview.set(null);
    this.generatedVideoDescription.set(null);
    this.generatedVideoUrl.set(null);

    const promptForScript = `Crie um roteiro visual detalhado e uma descrição para um vídeo com bonecos animados no estilo "${this.videoStyle()}" com a seguinte ideia de conteúdo: "${this.scriptInput()}". O vídeo deve ter aproximadamente ${this.videoDuration()}. Inclua a descrição das cenas, ações dos personagens, e diálogos (se aplicável).`;

    try {
      const scriptText = await this.genaiService.generateText(promptForScript);
      this.generatedScriptPreview.set(scriptText);

      const videoPrompt = `Gere um vídeo animado. Estilo do vídeo: "${this.videoStyle()}". Duração do vídeo: "${this.videoDuration()}". O vídeo deve focar em bonecos animados e seguir estritamente o roteiro fornecido. Roteiro: "${scriptText}"`;

      const videoUrl = await this.genaiService.generateVideo(videoPrompt);
      if (videoUrl) {
        this.generatedVideoUrl.set(videoUrl);
        this.generatedVideoDescription.set(`Vídeo animado gerado no estilo ${this.videoStyle()}.`);
        
        this.historyService.addHistoryItem({
          type: 'video-creation',
          title: `Vídeo: ${this.scriptInput().substring(0, 30)}...`,
          input: {
            script: this.scriptInput(),
            style: this.videoStyle(),
            duration: this.videoDuration(),
          },
          output: {
            scriptPreview: scriptText,
            videoUrl: videoUrl,
          }
        });

      } else {
        this.generatedVideoDescription.set('Não foi possível gerar o vídeo completo, mas o roteiro foi criado.');
      }

    } catch (e) {
      console.error('Erro ao gerar vídeo:', e);
      // Error message is already set by genaiService
    }
  }
}
