import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Receta, RecipeInfo } from '../../interfaces/recetas';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-delete-update-output',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delete-update-output.component.html',
  styleUrl: './delete-update-output.component.css'
})
export class DeleteUpdateOutputComponent {
  @Input() receta!:Receta | RecipeInfo;
  @Input() listaId!: number;
  @Output() delete = new EventEmitter<number>();
  @Output() update = new EventEmitter<{ listaId: number; recetaId: number }>();
  @Output() detalles = new EventEmitter<{ listaId: number; recetaId: number }>();

  onUpdate(){
    this.update.emit({ listaId: this.listaId, recetaId: this.receta.id! });
  }
  onDelete(){
    this.delete.emit(this.receta.id);
  }
  onDetalles() {
    this.detalles.emit({ listaId: this.listaId, recetaId: this.receta.id! }); // Emitiendo ambos IDs como un objeto
  }

}
