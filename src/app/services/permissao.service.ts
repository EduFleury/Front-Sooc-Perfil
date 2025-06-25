import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

export interface Permissao {
  permissaoId?: number;
  descricao: string;
  atribuida?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PermissaoService {
  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  listar(): Observable<Permissao[]> {
    return this.http.get<Permissao[]>(`${this.api}/permissoes`);
  }

  getPermissoesAtribuidas(perfilId: number): Observable<Permissao[]> {
    return this.http.get<Permissao[]>(`${this.api}/perfis/${perfilId}/permissoes`);
  }

  carregarPermissoesComMarcadas(perfilId: number): Observable<Permissao[]> {
    return forkJoin({
      todas: this.listar(),
      atribuídas: this.getPermissoesAtribuidas(perfilId)
    }).pipe(
      map(({ todas, atribuídas }) => {
        const atribuídasIds = new Set(atribuídas.map(p => p.permissaoId));
        return todas.map(p => ({
          ...p,
          atribuida: atribuídasIds.has(p.permissaoId)
        }));
      })
    );
  }

  atualizarPermissoes(perfilId: number, permissoes: Permissao[]): Observable<string> {
    const ids = permissoes.filter(p => p.atribuida).map(p => p.permissaoId);
    return this.http.put(`${this.api}/perfis/${perfilId}/permissoes`, ids, { responseType: 'text' });
  }

}
