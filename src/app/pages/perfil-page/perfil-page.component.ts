import { Component, inject, OnInit } from '@angular/core';
import { UsuariosService } from '../../service/usuarios.service';
import { UserActivo } from '../../interfaces/user-activo';
import { User } from '../../interfaces/user';
import { NavBarLoginComponent } from "../../navegadores/nav-bar-logeado/nav-bar-login.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { RouterLink, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [NavBarLoginComponent, FooterComponent, RouterModule],
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.css'
})
export class PerfilPageComponent implements OnInit{

  servicio = inject(UsuariosService);
  router = inject(Router);
  imagenPerfil = "img/perfil-de-usuario.webp";
  isDeleting = false;
  isLoadingImage = false;

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
    if (this.isDeleting) return;
    
    this.servicio.getUserActivo().subscribe(
      {
        next:(usuario)=>{
          this.userACT=usuario[0];
          this.servicio.getUSerById(this.userACT.id).subscribe({
            next:(usuario)=>
            {
              this.userComun=usuario;
              // Cargar la foto de perfil si existe en la BD
              if (usuario.fotoPerfil) {
                this.imagenPerfil = usuario.fotoPerfil;
              }
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    console.log('Archivo seleccionado:', file.name, 'Tipo:', file.type, 'Tamaño:', file.size);

    this.isLoadingImage = true;

    // Validar el tamaño (máximo 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert('La imagen es muy grande. Máximo 5MB');
      this.isLoadingImage = false;
      input.value = '';
      return;
    }

    // Validar que sea una imagen por extensión o MIME type
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop() || '';
    const isValidImage = file.type.startsWith('image/') || validExtensions.includes(fileExtension);

    if (!isValidImage) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, WebP, etc.)');
      this.isLoadingImage = false;
      input.value = '';
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (result && typeof result === 'string') {
          this.imagenPerfil = result;
          
          // Guardar la foto en la BD
          const userActualizado = { ...this.userComun, fotoPerfil: result };
          this.servicio.editUser(userActualizado).subscribe({
            next: () => {
              this.userComun = userActualizado;
              console.log('Imagen de perfil actualizada y guardada exitosamente');
              this.isLoadingImage = false;
              input.value = '';
            },
            error: (err: Error) => {
              console.error('Error al guardar la imagen en la BD:', err.message);
              alert('Error al guardar la imagen');
              this.isLoadingImage = false;
              input.value = '';
            }
          });
        }
      } catch (error) {
        console.error('Error al procesar la imagen:', error);
        alert('Error al procesar la imagen');
        this.isLoadingImage = false;
        input.value = '';
      }
    };

    reader.onerror = () => {
      console.error('Error al leer el archivo');
      alert('Error al leer el archivo de imagen');
      this.isLoadingImage = false;
      input.value = '';
    };

    reader.readAsDataURL(file);
  }

  resetProfileImage(): void {
    this.imagenPerfil = 'img/perfil-de-usuario.webp';
    
    // Guardar el cambio en la BD
    const userActualizado = { ...this.userComun, fotoPerfil: 'img/perfil-de-usuario.webp' };
    this.servicio.editUser(userActualizado).subscribe({
      next: () => {
        this.userComun = userActualizado;
        console.log('Foto de perfil eliminada, se ha restaurado la imagen predeterminada');
      },
      error: (err: Error) => {
        console.error('Error al restablecer la imagen:', err.message);
      }
    });
  }

  deleteUser() {
    if (this.userComun.id && this.userACT.id) {
      this.isDeleting = true;
      
      // Primero: eliminar de UsuarioActivo
      this.servicio.deleteUserActivo(this.userACT.id.toString()).subscribe({
        next: () => {
          // Segundo: eliminar el usuario
          this.servicio.deleteUser(this.userComun.id!).subscribe({
            next: () => {
              console.log('Usuario eliminado');
              localStorage.removeItem('token');
              // Redirigir a inicio
              this.router.navigate(['']);
            },
            error: (err: Error) => {
              console.log('Error al eliminar usuario:', err.message);
              this.isDeleting = false;
            }
          });
        },
        error: (err: Error) => {
          console.log('Error al eliminar sesión:', err.message);
          this.isDeleting = false;
        }
      });
    }
  }
}
