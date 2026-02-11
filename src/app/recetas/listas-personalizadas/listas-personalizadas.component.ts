import { Component, inject, OnInit } from '@angular/core';
import {
  ExtendedIngredient,
  ListaRecetasPersonalizadas,
  RecipeInfo,
} from '../../interfaces/recetas';
import { ListasPersonalizadasService } from '../../service/listas-personalizadas.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavBarLoginComponent } from '../../navegadores/nav-bar-login/nav-bar-login.component';
import { UsuariosService } from '../../service/usuarios.service';
import { UserActivo } from '../../interfaces/user-activo';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-listas-personalizadas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    FooterComponent,
    NavBarLoginComponent,
    CommonModule,
  ],
  templateUrl: './listas-personalizadas.component.html',
  styleUrl: './listas-personalizadas.component.css',
})
export class ListasPersonalizadasComponent implements OnInit {


  ngOnInit(): void {
    this.servicioUsuario.getUserActivo().subscribe({
      next: (usuario) => {
        this.userACT = usuario[0];
        this.servicioUsuario.getUSerById(this.userACT.id).subscribe({
          next: (usuario) => {
            this.userComun = usuario;
          },
          error: (err: Error) => {
            console.log(err.message);
          },
        });
      },
      error: (err: Error) => {
        console.log(err.message);
      },
    });
  }

  userACT: UserActivo = {
    id: 0,
    nombreUsuario: '',
  };
  userComun: User = {
    nombreUsuario: '',
    contrasena: '',
    listas: [],
  };

  servicioUsuario = inject(UsuariosService);

  listas: ListaRecetasPersonalizadas[] = []; //esta variable solo sirve para mostrar las todas las listas
  servicio = inject(ListasPersonalizadasService);
  fb = inject(FormBuilder);
  router= inject(Router)

  nombreLista? = '';
  arrayRecetas: RecipeInfo[] = [];
  arrayIngredientes: ExtendedIngredient[] =[];

  constructor() {}

  formulario = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
  });

  setNombreLista() {
    if (this.formulario.invalid) return;
    this.nombreLista = this.formulario.get('nombre')?.value || '';
  }

  postLista() {
    this.setNombreLista();
    const listaNueva: ListaRecetasPersonalizadas = {
      id: this.userComun.listas.length + 1,
      nombre: this.nombreLista,
      recetas: this.arrayRecetas.map((receta) => ({
        ...receta,
        ingredientes: [],
      })),
    };
    this.userComun.listas.push(listaNueva);

    this.servicioUsuario.editUser(this.userComun).subscribe({
      next: () => {
        console.log('Lista creada correctamente');
       this.alertRecetarioCreado();
        this.router.navigate(['/mis-listas']);

      },
      error: (e: Error) => {
        console.log(e.message);
      },
    });
  }

  eliminarLista(id: string) {
    this.servicio.deleteLista(id).subscribe({
      next: (lista) => {
        console.log('Lista eliminada correctamente', lista);
      },
      error: (e: Error) => {
        console.log(e.message);
      },
    });
  }

  alertRecetarioCreado()
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
      title: "Lista creada con exito"
    }); 
  }

  
}
