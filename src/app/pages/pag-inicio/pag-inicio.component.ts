import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../navegadores/navbar/navbar.component";
import { UsuariosService } from '../../service/usuarios.service';

@Component({
  selector: 'app-pag-inicio',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './pag-inicio.component.html',
  styleUrl: './pag-inicio.component.css'
})
export class PagInicioComponent implements OnInit{

  //remueve el token cuando llega a esta pag tambien, en caso de que se cierre la app
  //sin haber cerrado sesion.
  private servicio = inject(UsuariosService)
  ngOnInit(): void {
    localStorage.removeItem('token');
    this.servicio.clearUserActivo().subscribe({
      next : () => {
        console.log("UserActivo vacio");
      }
    })
  }

}
