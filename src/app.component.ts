import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoCreationComponent } from './components/video-creation/video-creation.component';
import { ImageToVideoComponent } from './components/image-to-video/image-to-video.component';
import { WebsiteCreatorComponent } from './components/website-creator/website-creator.component';
import { AppCreatorComponent } from './components/app-creator/app-creator.component';
import { LoginComponent } from './components/login/login.component';
import { HistoryComponent } from './components/history/history.component';
import { ViralVideoCreatorComponent } from './components/viral-video-creator/viral-video-creator.component';
import { AuthService } from './services/auth.service';
import { LanguageService, Language } from './services/language.service';
import { TranslatePipe } from './pipes/translate.pipe';

type Feature = 'video-creation' | 'image-to-video' | 'website-creator' | 'app-creator' | 'viral-video-creator';
type View = 'creator' | 'history' | 'settings' | 'support';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    VideoCreationComponent,
    ImageToVideoComponent,
    WebsiteCreatorComponent,
    AppCreatorComponent,
    LoginComponent,
    HistoryComponent,
    TranslatePipe,
    ViralVideoCreatorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent {
  authService = inject(AuthService);
  languageService = inject(LanguageService);
  
  isLoggedIn = this.authService.isLoggedIn;
  
  isSidenavOpen = signal(false);
  currentView = signal<View>('creator');
  selectedFeature = signal<Feature>('video-creation');

  selectFeature(feature: Feature) {
    this.selectedFeature.set(feature);
  }
  
  toggleSidenav() {
    this.isSidenavOpen.update(v => !v);
  }
  
  selectView(view: View) {
    this.currentView.set(view);
    if(this.isSidenavOpen()) {
        this.toggleSidenav();
    }
  }

  setLanguage(lang: Language) {
    this.languageService.setLanguage(lang);
  }
}