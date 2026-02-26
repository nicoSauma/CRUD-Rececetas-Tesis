import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-menu-inicio',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu-inicio.component.html',
  styleUrl: './menu-inicio.component.css'
})
export class MenuInicioComponent {

  router = inject(Router);

  verReceta(){
    this.router.navigate([`/recetas`])
  }

}
