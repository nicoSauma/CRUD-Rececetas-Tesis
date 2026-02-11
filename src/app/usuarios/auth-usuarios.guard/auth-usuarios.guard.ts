import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authUsuariosGuard: CanActivateFn = () => {

  const router = inject(Router);

  //si existe token en storage
  if(localStorage.getItem('token') !== null){

    //permite el acceso
    return true;
  }else{
    //sino redirije el acceso
    router.navigate(['']);
    return false;
  }
};
