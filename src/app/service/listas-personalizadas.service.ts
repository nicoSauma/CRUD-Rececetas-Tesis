import { inject, Injectable } from '@angular/core';
import { ListaRecetasPersonalizadas, RecipeInfo } from '../interfaces/recetas';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListasPersonalizadasService {

  constructor() { }

  url : string = "http://localhost:3000/listasPersonalizadas"


  http = inject(HttpClient);

   // Obtener todas las listas
  getListas(): Observable<ListaRecetasPersonalizadas[]> {
    return this.http.get<ListaRecetasPersonalizadas[]>(this.url);
  }

  getListabyId(id: string):Observable<ListaRecetasPersonalizadas>{
    return this.http.get<ListaRecetasPersonalizadas>(`${this.url}/${id}`);
  }

  // Crear una nueva lista
  addLista(lista: ListaRecetasPersonalizadas): Observable<ListaRecetasPersonalizadas> {
    return this.http.post<ListaRecetasPersonalizadas>(this.url, lista);
  }

  postLista (lista: ListaRecetasPersonalizadas) : Observable <ListaRecetasPersonalizadas> {
    return this.http.post<ListaRecetasPersonalizadas>(this.url, lista);
  }

  // Actualizar una lista
  updateLista(idLista: string, lista: ListaRecetasPersonalizadas): Observable<ListaRecetasPersonalizadas> {
    return this.http.put<ListaRecetasPersonalizadas>(`${this.url}/${idLista}`, lista);
  }

  // Eliminar una lista
  deleteLista(idLista: string): Observable<ListaRecetasPersonalizadas> {
    return this.http.delete<ListaRecetasPersonalizadas>(`${this.url}/${idLista}`);
  }
}
