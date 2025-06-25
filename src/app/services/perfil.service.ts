import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Perfil {
  perfilId?: number;
  nome: string;
  descricao: string;
  protegido: boolean;
  tipo: string;
}

@Injectable({ providedIn: 'root' })
export class PerfisService {
  private apiUrl = 'http://localhost:8081/api/perfis';

  constructor(private http: HttpClient) {}

  listar(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/${id}`);
  }

  criar(perfil: Perfil): Observable<Perfil> {
    return this.http.post<Perfil>(this.apiUrl, perfil);
  }

  atualizar(id: number, perfil: Perfil): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.apiUrl}/${id}`, perfil);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listarTiposPerfil(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tipos`);
  }
}
