import { Component, OnInit } from '@angular/core';
import { PerfisService, Perfil } from 'src/app/services/perfil.service';
import { forkJoin } from 'rxjs';
import { Permissao, PermissaoService } from 'src/app/services/permissao.service';

@Component({
  selector: 'app-perfis',
  templateUrl: './perfis.component.html'
})
export class PerfisComponent implements OnInit {
  perfis: Perfil[] = [];
  perfilForm: Perfil = { nome: '', descricao: '', protegido: false, tipo: '' };
  editando = false;
  tiposDePerfil: string[] = [];

  permissoes: Permissao[] = [];
  perfilSelecionado: Perfil | null = null;
  mostrarPermissoes = false;
  carregandoPermissoes = false;

  constructor(
    private perfisService: PerfisService,
    private permissaoService: PermissaoService
  ) {}

  ngOnInit(): void {
    this.listarPerfis();
    this.listarTiposPerfil();
  }

  listarPerfis(): void {
    this.perfisService.listar().subscribe(data => this.perfis = data);
  }

 salvar(): void {
   if (!this.perfilForm.permissoes) this.perfilForm.permissoes = [];
   if (!this.perfilForm.usuarios) this.perfilForm.usuarios = [];

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

  abrirPermissoes(perfil: Perfil): void {
    this.carregandoPermissoes = true;
    this.perfilSelecionado = perfil;
    this.mostrarPermissoes = true;

    this.permissaoService.carregarPermissoesComMarcadas(perfil.perfilId!).subscribe(permissoes => {
      this.permissoes = permissoes;
      this.carregandoPermissoes = false;
    });
  }

  salvarPermissoes(): void {
    if (!this.perfilSelecionado) return;

    this.permissaoService
      .atualizarPermissoes(this.perfilSelecionado.perfilId!, this.permissoes)
      .subscribe(() => {
        alert('Permissões atualizadas com sucesso!');
        this.fecharPermissoes();
      });
  }

  fecharPermissoes(): void {
    this.mostrarPermissoes = false;
    this.perfilSelecionado = null;
    this.permissoes = [];
  }


}
