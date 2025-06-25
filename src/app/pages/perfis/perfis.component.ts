import { Component, OnInit } from '@angular/core';
import { PerfisService, Perfil } from 'src/app/services/perfil.service';

@Component({
  selector: 'app-perfis',
  templateUrl: './perfis.component.html'
})
export class PerfisComponent implements OnInit {
  perfis: Perfil[] = [];
  perfilForm: Perfil = { nome: '', descricao: '', protegido: false, tipo: '' };
  editando = false;
  tiposDePerfil: string[] = [];

  constructor(private perfisService: PerfisService) {}

  ngOnInit(): void {
    this.listarPerfis();
    this.listarTiposPerfil();
  }

  listarPerfis(): void {
    this.perfisService.listar().subscribe(data => this.perfis = data);
  }

  salvar(): void {
    if (this.editando && this.perfilForm.perfilId) {
      this.perfisService.atualizar(this.perfilForm.perfilId, this.perfilForm).subscribe(() => {
        this.cancelar();
        this.listarPerfis();
      });
    } else {
      this.perfisService.criar(this.perfilForm).subscribe(() => {
        this.cancelar();
        this.listarPerfis();
      });
    }
  }

  editar(perfil: Perfil): void {
    this.perfilForm = { ...perfil };
    this.editando = true;
  }

  deletar(id?: number): void {
    if (id && confirm('Deseja realmente deletar este perfil?')) {
      this.perfisService.deletar(id).subscribe(() => this.listarPerfis());
    }
  }

  listarTiposPerfil(): void {
    this.perfisService.listarTiposPerfil().subscribe(tipos => {
      this.tiposDePerfil = tipos;
    });
  }

  cancelar(): void {
    this.perfilForm = { nome: '', descricao: '', protegido: false, tipo: '' };
    this.editando = false;
  }
}
