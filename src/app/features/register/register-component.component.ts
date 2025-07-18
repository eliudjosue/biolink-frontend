import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-component.component.html',
  styleUrl: './register-component.component.scss'
})
export class RegisterComponentComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router)
  loading = false;
  errorMessage = '';
  showDebug = false; // Cambiar a true para mostrar debug info
 

  constructor(){

  }
 
    registerForm: FormGroup = this.fb.group({
    // name: [''],
    username: ['', [Validators.required, Validators.minLength(3)]],
    // email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required] ]
  })
  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  // passwordMatchValidator(form: FormGroup) {
  //   const password = form.get('password');
  //   const confirmPassword = form.get('confirmPassword');

  //   if (password && confirmPassword && password.value !== confirmPassword.value) {
  //     confirmPassword.setErrors({ passwordMismatch: true });
  //     return { passwordMismatch: true };
  //   } else {
  //     if (confirmPassword?.errors?.['passwordMismatch']) {
  //       delete confirmPassword.errors['passwordMismatch'];
  //       if (Object.keys(confirmPassword.errors).length === 0) {
  //         confirmPassword.setErrors(null);
  //       }
  //     }
  //     return null;
  //   }
  // }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { confirmPassword, ...userData } = this.registerForm.value;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['login']),
        error: error => {
          console.error('Registration error:', error);
          this.errorMessage = error.error?.message || 'Error al crear la cuenta. Intenta nuevamente.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      })
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
