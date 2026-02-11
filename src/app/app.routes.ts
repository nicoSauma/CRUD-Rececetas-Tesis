import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegistrarseComponent } from './usuarios/registrarse/registrarse.component';
import { IniciarSesionComponent } from './usuarios/iniciar-sesion/iniciar-sesion.component';
import { PagInicioComponent } from './pages/pag-inicio/pag-inicio.component';
import { RecetaDetailComponent } from './recetas/receta-detail/receta-detail.component';
import { RecetaFormComponent } from './recetas/receta-form/receta-form.component';
import { RecetaListComponent } from './recetas/receta-list/receta-list.component';
import { ListasPersonalizadasComponent } from './recetas/listas-personalizadas/listas-personalizadas.component';
import { MiListasComponent } from './recetas/mi-listas/mi-listas.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { Component } from '@angular/core';
import { RecetaUpdateComponent } from './recetas/receta-update/receta-update.component';
import { ListaDetailComponent } from './recetas/lista-detail/lista-detail.component';
import { DetalleMiReceteComponent } from './recetas/detalle-mi-recete/detalle-mi-recete.component';
import { authUsuariosGuard } from './usuarios/auth-usuarios.guard/auth-usuarios.guard';
import { EditarPerfilComponent } from './usuarios/editar-perfil/editar-perfil.component';


export const routes: Routes = [
    {
      path:'',
      component:PagInicioComponent
    },
    //rutas para inicio,registro, homepage una vez iniciado
    {
      path:'registrarse',
      component:RegistrarseComponent
    },
    {
      path:'iniciarSesion',
      component:IniciarSesionComponent
    },
    {
      path:'home',
      component:HomePageComponent,
      canActivate: [authUsuariosGuard]
    },
    //rutas para detalle recetas, agregar,modificar
    {
      path:'recetas-detalles/:id',
      component: RecetaDetailComponent,
      canActivate: [authUsuariosGuard]
    },
    {
      path:'agregar-receta',
      component: RecetaFormComponent,
      canActivate: [authUsuariosGuard]
    },
    {
      path:'receta-update/:idLista/:id',
      component: RecetaUpdateComponent,
      canActivate: [authUsuariosGuard]
    },
    //ruta para buscador de receta
    {
      path: 'recetas',
      component: RecetaListComponent,
      canActivate: [authUsuariosGuard]
    },
    //rutas para las listas personales
    {
      path:'agregar-lista',
      component:ListasPersonalizadasComponent,
      canActivate: [authUsuariosGuard]
    },
    {
      path:'perfil',
      component:PerfilPageComponent,
      canActivate: [authUsuariosGuard]
    },
    {
      path:'edit-perfil/:id',
      component:EditarPerfilComponent,
      canActivate: [authUsuariosGuard]
    },
    {
      path:'mis-listas',
      component: MiListasComponent,
      canActivate: [authUsuariosGuard]
    },
    {
      path:'lista/:id',
      component:ListaDetailComponent,
      canActivate: [authUsuariosGuard]
    },
    {
      path: 'receta-lista-detalle/:idLista/:idReceta',
      component: DetalleMiReceteComponent,
      canActivate: [authUsuariosGuard]
    },
    {path:'**', redirectTo:''}
];
