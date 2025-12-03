import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';

@Injectable({ providedIn: 'root' })
export class GenaiService {
  private ai: GoogleGenAI;
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    // API Key must be from process.env.API_KEY as per instructions
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateText(prompt: string, model: string = 'gemini-2.5-flash', config?: any): Promise<string> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });
      this.isLoading.set(false);
      return response.text;
    } catch (e: any) {
      this.isLoading.set(false);
      this.error.set(e.message || 'An error occurred during text generation.');
      throw e;
    }
  }

  async generateJson<T>(prompt: string, schema: any, model: string = 'gemini-2.5-flash', config?: any): Promise<T> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          ...config,
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
      this.isLoading.set(false);
      const jsonStr = response.text.trim();
      return JSON.parse(jsonStr);
    } catch (e: any) {
      this.isLoading.set(false);
      this.error.set(e.message || 'An error occurred during JSON generation.');
      throw e;
    }
  }

  async generateImage(prompt: string, aspectRatio: string = '1:1', numberOfImages: number = 1): Promise<string> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const response = await this.ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages,
          outputMimeType: 'image/jpeg',
          aspectRatio,
        },
      });
      this.isLoading.set(false);
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } catch (e: any) {
      this.isLoading.set(false);
      this.error.set(e.message || 'An error occurred during image generation.');
      throw e;
    }
  }

  async generateVideo(prompt: string, imageBase64?: string, imageMimeType?: string, numberOfVideos: number = 1): Promise<string | null> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      let operation;
      if (imageBase64 && imageMimeType) {
        operation = await this.ai.models.generateVideos({
          model: 'veo-2.0-generate-001',
          prompt: prompt,
          image: {
            imageBytes: imageBase64,
            mimeType: imageMimeType,
          },
          config: {
            numberOfVideos,
          },
        });
      } else {
        operation = await this.ai.models.generateVideos({
          model: 'veo-2.0-generate-001',
          prompt: prompt,
          config: {
            numberOfVideos,
          },
        });
      }

      // Poll for operation completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        operation = await this.ai.operations.getVideosOperation({ operation: operation });
      }

      this.isLoading.set(false);
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // Need to append API key for fetching from the download link
        return `${downloadLink}&key=${process.env.API_KEY}`;
      }
      return null;
    } catch (e: any) {
      this.isLoading.set(false);
      this.error.set(e.message || 'An error occurred during video generation.');
      throw e;
    }
  }
}