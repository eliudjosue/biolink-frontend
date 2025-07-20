import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.scss'
})
export class LoginComponentComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showDebug = false; // Cambiar a true para mostrar debug info
  private authService = inject(AuthService)

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    // Inicializar el formulario reactivo con validaciones
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['dashboard']),
      error: (err) => alert(`Error de login: ${JSON.stringify(err)}`)
    })
  }
}
