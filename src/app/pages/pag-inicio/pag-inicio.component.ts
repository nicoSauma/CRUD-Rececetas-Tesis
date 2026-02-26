import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../navegadores/navbar/navbar.component";
import { UsuariosService } from '../../service/usuarios.service';
<<<<<<< HEAD
import { FooterComponent } from "../../shared/footer/footer.component";
import { Router} from '@angular/router';
=======
>>>>>>> c3586fe39cf84e1486403381312f83b654918010

@Component({
  selector: 'app-pag-inicio',
  standalone: true,
<<<<<<< HEAD
  imports: [NavbarComponent, FooterComponent],
=======
  imports: [NavbarComponent],
>>>>>>> c3586fe39cf84e1486403381312f83b654918010
  templateUrl: './pag-inicio.component.html',
  styleUrl: './pag-inicio.component.css'
})
export class PagInicioComponent implements OnInit{

  //remueve el token cuando llega a esta pag tambien, en caso de que se cierre la app
  //sin haber cerrado sesion.
  private servicio = inject(UsuariosService)
<<<<<<< HEAD
private rutas = inject(Router)

=======
>>>>>>> c3586fe39cf84e1486403381312f83b654918010
  ngOnInit(): void {
    localStorage.removeItem('token');
    this.servicio.clearUserActivo().subscribe({
      next : () => {
        console.log("UserActivo vacio");
      }
    })
  }

<<<<<<< HEAD
  iraRegistrarse()
{
  this.rutas.navigate(['registrarse']);
}

=======
>>>>>>> c3586fe39cf84e1486403381312f83b654918010
}
