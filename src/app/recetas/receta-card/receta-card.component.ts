import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecipeInfo } from '../../interfaces/recetas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receta-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receta-card.component.html',
  styleUrl: './receta-card.component.css'
})
export class RecetaCardComponent {

  @Input() receta!: RecipeInfo;
  @Output() verDetalles = new EventEmitter<number>()

  onVerDetalles() {
    this.verDetalles.emit(this.receta.id);
    console.log(this.receta.id);
  }

 
}