import { Component, OnInit, inject } from '@angular/core';
import {Router, RouterModule } from '@angular/router';
import { NavBarLoginComponent } from '../../navegadores/nav-bar-logeado/nav-bar-login.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ListasPersonalizadasComponent } from '../listas-personalizadas/listas-personalizadas.component';
import { ListasPersonalizadasService } from '../../service/listas-personalizadas.service';
import { ListaRecetasPersonalizadas } from '../../interfaces/recetas';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../service/usuarios.service';
import { UserActivo } from '../../interfaces/user-activo';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-mi-listas',
  standalone: true,
  imports: [RouterModule, NavBarLoginComponent, FooterComponent, CommonModule],
  templateUrl: './mi-listas.component.html',
  styleUrl: './mi-listas.component.css'
})
export class MiListasComponent implements OnInit{

  listas: ListaRecetasPersonalizadas[]= [];
  servicio =inject(ListasPersonalizadasService);
  router= inject(Router)
  serviciouser= inject(UsuariosService);

  userACT:UserActivo={
    id:0,
    nombreUsuario:''
  };

  userComun:User={
    nombreUsuario:'',
    contrasena:'',
    listas:[]
  };


 ngOnInit(): void {
    this.serviciouser.getUserActivo().subscribe(
      {
        next:(usuario)=>{
          this.userACT=usuario[0];
          this.serviciouser.getUSerById(this.userACT.id).subscribe({

            next:(usuario)=>
            {
              this.userComun=usuario;
              this.listas=this.userComun.listas;
              this.mostrarNlistas();
            },
            error:(err:Error)=>
            {
              console.log(err.message);
            }
          })
        },
        error:(err:Error)=>{
          console.log(err.message);
        }
      }
    )
  }

  mostrarNlistas() {
    if (this.listas && this.listas.length > 0) {
        this.listas.forEach((lista, index) => {
            console.log(`Lista personalizada ${index + 1}:`, lista);
        });
    } else {
        console.log("No hay listas personalizadas para mostrar.");
    }
}
  verDetallesLista(id: number){
    if(this.listas.some(u=>u.id === id))
    {
      this.router.navigate([`lista/${id}`]);
    }

  }


  borrarLista(id: number) {
    if (this.listas.some(lista => lista.id === id)) {
      // Actualiza las listas en el usuario
      this.userComun.listas = this.listas.filter(lista => lista.id !== id);
  
      // Llama al servicio para actualizar el usuario en la base de datos
      this.serviciouser.editUser(this.userComun).subscribe({
        next: () => {
          // Actualiza las listas locales solo si la operación fue exitosa
          this.listas = [...this.userComun.listas];
          this.alertRecetarioEliminado();
        },
        error: (err: Error) => {
          console.error("Error al eliminar la lista:", err.message);
        }
      });
    } else {
      alert("No se encontró la lista para eliminar");
    }
  }

  alertRecetarioEliminado()
  {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Lista eliminada con exito"
    }); 
  }




}
