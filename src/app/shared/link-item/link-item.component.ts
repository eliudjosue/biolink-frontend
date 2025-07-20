import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Link } from '../../models/link.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link-item.component.html',
  styleUrl: './link-item.component.scss'
})
export class LinkItemComponent {
@Input() link!: Link;
  @Output() edit = new EventEmitter<Link>();
  @Output() delete = new EventEmitter<Link>();
  @Output() dragStart = new EventEmitter<Link>();

  isDragging = false;

  /**
   * Maneja el inicio del drag
   */
  onDragStart(event: MouseEvent): void {
    this.isDragging = true;
    this.dragStart.emit(this.link);
    
    // Resetear el estado después de un tiempo
    setTimeout(() => {
      this.isDragging = false;
    }, 300);
  }

  /**
   * Emite el evento de edición
   */
  onEdit(): void {
    this.edit.emit(this.link);
  }

  /**
   * Emite el evento de eliminación
   */
  onDelete(): void {
    if (confirm(`¿Estás seguro de que quieres eliminar "${this.link.title}"?`)) {
      this.delete.emit(this.link);
    }
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }
}
