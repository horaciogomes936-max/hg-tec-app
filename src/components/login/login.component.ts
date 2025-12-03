import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);

  login() {
    this.authService.login();
  }
}
