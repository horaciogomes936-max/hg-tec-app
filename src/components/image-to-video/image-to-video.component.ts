import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenaiService } from '../../services/genai.service';
import { HistoryService } from '../../services/history.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-image-to-video',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './image-to-video.component.html',
  styleUrls: [],
})
export class ImageToVideoComponent {
  private genaiService = inject(GenaiService);
  private historyService = inject(HistoryService);

  selectedFile = signal<File | null>(null);
  imageBase64 = signal<string | null>(null);
  imageMimeType = signal<string | null>(null);
  animationStyle = signal('cinematic'); // 'cinematic', 'dynamic', 'subtle-motion', 'zoom-pan'
  customPrompt = signal('');

  generatedVideoUrl = signal<string | null>(null);
  generatedVideoDescription = signal<string | null>(null);

  isLoading = this.genaiService.isLoading;
  error = this.genaiService.error;

  animationStyles = [
    { value: 'cinematic', label: 'Cinematográfico (movimentos suaves, zoom)' },
    { value: 'dynamic', label: 'Dinâmico (transições rápidas, efeitos)' },
    { value: 'subtle-motion', label: 'Movimento Sutil (panorâmicas leves, focagem)' },
    { value: 'dreamy', label: 'Sonhador (desfoque, cores suaves)' }
  ];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile.set(file);
      this.imageMimeType.set(file.type);
      this.convertToBase64(file);
    } else {
      this.selectedFile.set(null);
      this.imageBase64.set(null);
      this.imageMimeType.set(null);
    }
  }

  private convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.imageBase64.set(base64String);
    };
    reader.onerror = (error) => {
      console.error('Error converting file to base64:', error);
      this.error.set('Não foi possível ler a imagem.');
    };
    reader.readAsDataURL(file);
  }

  async transformImageToVideo() {
    this.generatedVideoUrl.set(null);
    this.generatedVideoDescription.set(null);

    if (!this.imageBase64() || !this.imageMimeType() || !this.selectedFile()) {
      this.error.set('Por favor, selecione uma imagem para transformar.');
      return;
    }

    const videoPrompt = `Transforme esta imagem em um vídeo animado com um estilo "${this.animationStyle()}". Adicione movimentos, transições, e efeitos visuais que realcem a imagem. ${this.customPrompt() ? `Instruções adicionais: ${this.customPrompt()}` : ''}`;

    try {
      const videoUrl = await this.genaiService.generateVideo(
        videoPrompt,
        this.imageBase64()!,
        this.imageMimeType()!,
        1
      );
      if (videoUrl) {
        this.generatedVideoUrl.set(videoUrl);
        this.generatedVideoDescription.set(`Vídeo gerado a partir da imagem com estilo "${this.animationStyle()}".`);
        
        this.historyService.addHistoryItem({
            type: 'image-to-video',
            title: `Vídeo de Imagem: ${this.selectedFile()?.name}`,
            input: {
              fileName: this.selectedFile()?.name,
              animationStyle: this.animationStyle(),
              customPrompt: this.customPrompt()
            },
            output: {
              videoUrl: videoUrl,
              imageBase64: this.imageBase64()
            }
        });

      } else {
        this.generatedVideoDescription.set('Não foi possível gerar o vídeo a partir da imagem.');
      }
    } catch (e) {
      console.error('Erro ao transformar imagem em vídeo:', e);
      // Error message is already set by genaiService
    }
  }
}
