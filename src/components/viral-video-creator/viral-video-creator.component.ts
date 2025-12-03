import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenaiService } from '../../services/genai.service';
import { HistoryService } from '../../services/history.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-viral-video-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './viral-video-creator.component.html',
})
export class ViralVideoCreatorComponent {
  private genaiService = inject(GenaiService);
  private historyService = inject(HistoryService);

  videoTopic = signal('');
  videoPlatform = signal('TikTok');
  viralStyle = signal('user-generated-content');

  generatedVideoUrl = signal<string | null>(null);

  isLoading = this.genaiService.isLoading;
  error = this.genaiService.error;

  platforms = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Facebook Videos'];
  styles = [
    { value: 'user-generated-content', label: 'Conteúdo Gerado por Usuário (UGC)' },
    { value: 'documentary', label: 'Estilo Documentário Curto' },
    { value: 'news-report', label: 'Reportagem Rápida' },
    { value: 'cinematic-short', label: 'Curta Cinematográfico' },
    { value: 'comedy-skit', label: 'Esquete de Comédia' }
  ];

  async generateViralVideo() {
    this.generatedVideoUrl.set(null);

    if (!this.videoTopic()) {
        this.error.set('Por favor, insira um tema para o vídeo.');
        return;
    }

    const prompt = `Crie um vídeo realista com alto potencial de viralização para a plataforma ${this.videoPlatform()} sobre o seguinte tema: "${this.videoTopic()}".
    O estilo deve ser "${this.viralStyle()}", imitando conteúdo autêntico e cativante.
    O vídeo deve ser curto (menos de 60 segundos), impactante e prender a atenção do espectador nos primeiros 3 segundos.
    Inclua elementos que incentivem o compartilhamento, como uma reviravolta surpreendente, humor, uma forte chamada emocional, ou um fato chocante.
    A qualidade visual deve ser realista e crível para o estilo escolhido.`;

    try {
      const videoUrl = await this.genaiService.generateVideo(prompt);
      if (videoUrl) {
        this.generatedVideoUrl.set(videoUrl);
        
        this.historyService.addHistoryItem({
          type: 'viral-video',
          title: `Vídeo Viral: ${this.videoTopic().substring(0, 30)}...`,
          input: {
            topic: this.videoTopic(),
            platform: this.videoPlatform(),
            style: this.viralStyle(),
          },
          output: {
            videoUrl: videoUrl,
          }
        });

      } else {
        this.error.set('Não foi possível gerar o vídeo.');
      }
    } catch (e) {
      console.error('Erro ao gerar vídeo viral:', e);
      // Error message is already set by genaiService
    }
  }
}
