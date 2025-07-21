import { Component, inject } from '@angular/core';
import { Link, LinkData } from '../../models/link.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.interface';
import { CommonModule } from '@angular/common';
import { LinkItemComponent } from '../../shared/link-item/link-item.component';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { LinksService } from '../../services/links/links.service';
import { title } from 'process';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, LinkItemComponent],
  templateUrl: './dashboard-component.component.html',
  styleUrl: './dashboard-component.component.scss'
})
export class DashboardComponentComponent {
  private authService = inject(AuthService);
  private linkService = inject(LinksService);
  private fb = inject(FormBuilder);
  private router = inject(Router);


  currentUser: User | null = null;
  links: Link[] = [];
  showAddForm = false;
  editingLink: Link | null = null;
  loadingLinks = false;
  loadingLink = false;
  successMessage = '';
  errorMessage = '';
  showDebug = false; // Cambiar a true para mostrar debug info


  linkForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
  });

  constructor() {
    this.loadLinks()
  }

  loadLinks() {
    this.loadingLink = true
    this.linkService.getLinks().subscribe({
      next: (response) => {
        if (response) {
          this.links = response;
        } else {
          this.links = [];
        }
        this.loadingLink = false;
      },
      error: (error) => {
        console.error('Error loading links:', error);
        this.showErrorMessage('Error al cargar los links');
        this.loadingLinks = false;
      }
    })
  }

  toggleAddForm():void{
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.cancelEdit()
    }
  }

  onSubmitLink(){
    if (this.linkForm.valid) {
      this.loadingLink = true;
      const linkData: LinkData = {
        ...this.linkForm.value,
        order: this.editingLink ? this.editingLink.order : this.links.length
      };

      const operation = this.editingLink 
        ? this.linkService.updateLink(this.editingLink.id, linkData)
        : this.linkService.createLink(linkData);

      operation.subscribe({
        next: (response) => {
          if (response) {
            this.showSuccessMessage(
              this.editingLink ? 'Link actualizado exitosamente' : 'Link creado exitosamente'
            );
            this.loadLinks();
            this.cancelEdit();
          } else {
            this.showErrorMessage(response|| 'Error al procesar el link');
          }
          this.loadingLink = false;
        },
        error: (error) => {
          console.error('Error with link operation:', error);
          this.showErrorMessage('Error al procesar el link');
          this.loadingLink = false;
        }
      });
    }
  }

  editLink(link: Link) {
    this.editingLink = link;
    this.linkForm.patchValue({
      title:link.title,
      url:link.url
    });
    this.showAddForm = true;
  }

  deleteLink(link: Link) {
    this.linkService.deleteLink(link.id).subscribe({
      next: (response) =>{
        if (response) {
          this.showSuccessMessage('Link eliminado exitosamente');
          this.loadLinks();
        } else {
          this.showErrorMessage(response || 'Error al eliminar el link');
        }
      },
      error: (error) => {
        console.error('Error deleting link:', error);
        this.showErrorMessage('Error al eliminar el link');
      }
    })
   }

  cancelEdit():void{
    this.editingLink = null;
    this.linkForm.reset();
    this.showAddForm = false;
  }

  /**
   * Maneja el reordenamiento de links con drag and drop
   */
  onDrop(event: CdkDragDrop<Link[]>){
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.links, event.previousIndex, event.currentIndex);
      
      // Actualizar el orden en el servidor
      this.linkService.updateLinksOrder(this.links).subscribe({
        next: (response) => {
          if (response.message) {
            this.showSuccessMessage(response.message);
          } else {
            this.showErrorMessage('Error al actualizar el orden');
            // Revertir el cambio localmente
            this.loadLinks();
          }
        },
        error: (error) => {
          console.error('Error updating order:', error);
          this.showErrorMessage('Error al actualizar el orden');
          // Revertir el cambio localmente
          this.loadLinks();
        }
      });
    }
  }

  trackByLinkId(index: number, link: Link) { }

  getTotalClicks() { }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  /**
   * Muestra un mensaje de éxito
   */
  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  /**
   * Muestra un mensaje de error
   */
  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

    /**
   * Navega a la página de analytics
   */
  goToAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

}
