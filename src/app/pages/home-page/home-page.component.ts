import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RecetasService } from '../../service/recetas.service';
import { RecetasRandom, Recipe } from '../../interfaces/recetasRandom';
import { RecetaCardComponent } from "../../recetas/receta-card/receta-card.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavBarLoginComponent } from "../../navegadores/nav-bar-login/nav-bar-login.component";
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../service/usuarios.service';
import { UserActivo } from '../../interfaces/user-activo';
import { User } from '../../interfaces/user';
import { RecetaListComponent } from '../../recetas/receta-list/receta-list.component';
import { MenuInicioComponent } from '../../menu/menu-inicio/menu-inicio.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RecetaCardComponent, FooterComponent, NavBarLoginComponent
  ,MenuInicioComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, OnDestroy{
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {  //aca se autentifica el usuario y se guarda en una variable
    this.sub = this.servicioUser.auth().subscribe({
      next: (activeUser) => {
        if (activeUser){
          this.usuario = activeUser
          this.obtenerRecetasRandom()
        }
      }
    });
  }

  usuario:UserActivo = {
    id:0,
    nombreUsuario:"invitado"
  }

  private sub? : Subscription;

  rutas = inject(Router);
  servicio= inject(RecetasService);
  servicioUser = inject(UsuariosService)

  listaRecetas: Array<Recipe>= []

  obtenerRecetasRandom()
  {
    this.servicio.getRandomRecipe(5).subscribe(
      {
        next:(data)=>{
        console.log(data);
        this.listaRecetas=data.recipes;
        },
        error:(err:Error)=>{
          console.log(err.message);
        }
      }
    )
  }

  navigateToDetails(id: number) {
   this.rutas.navigate([`recetas-detalles/${id}`]);
  }




}
