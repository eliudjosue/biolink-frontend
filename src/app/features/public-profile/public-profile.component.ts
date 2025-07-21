import { Component, inject } from '@angular/core';
import { Link } from '../../models/link.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { LinksService } from '../../services/links/links.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.scss'
})
export class PublicProfileComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router)
  private linkService = inject(LinksService)
  username = '';
  displayName = '';
  links: Link[] = [];
  loading = true;
  error = false;

  constructor() {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      if (this.username) {
        this.loadUserProfile();
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }



  /**
   * Carga el perfil público del usuario
   */
  loadUserProfile() {
    this.loading = true;
    this.error = false;

    // Simular obtener información del usuario (en una implementación real, esto vendría de la API)
    this.displayName = this.username.charAt(0).toUpperCase() + this.username.slice(1);

    this.linkService.getPublicLinks(this.username).subscribe({
      next: (response) => {
        if (response) {
          this.links = response.sort((a: { order: number; }, b: { order: number; }) => a.order - b.order);
        } else {
          this.links = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading public profile:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  /**
   * Abre un link y registra el click
   */
  openLink(link: Link): void {
    // Registrar el click
    console.log('Hice click')
    this.linkService.incrementClick(link.id).subscribe({
      next: () => {
        // Actualizar el contador localmente
        link.click_count++;
      },
      error: (error) => {
        console.error('Error registering click:', error);
      }
    });

    // Abrir el link en una nueva pestaña
    window.open(link.url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Obtiene las iniciales del nombre de usuario
   */
  getInitials(username: string): string {
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
  }

  /**
   * Formatea la URL para mostrar
   */
  formatUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  /**
   * Calcula el total de clicks
   */
  getTotalClicks(): number {
    return this.links.reduce((total, link) => total + link.click_count, 0);
  }

  /**
   * Función de tracking para la lista de links
   */
  trackByLinkId(index: number, link: Link): string {
    return link.id;
  }

  /**
   * Navega a la página de inicio
   */
  goHome(): void {
    this.router.navigate(['/']);
  }
}
