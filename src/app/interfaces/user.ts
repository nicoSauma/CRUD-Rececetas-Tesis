import { ListaRecetasPersonalizadas } from "./recetas";


export interface User {
    id?:number,
    nombreUsuario:string,
    email?:string,
    contrasena:string, 
    listas: ListaRecetasPersonalizadas[],
    fotoPerfil?:string
}



