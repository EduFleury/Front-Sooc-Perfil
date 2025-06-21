import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfisComponent } from './pages/perfis/perfis.component';

const routes: Routes = [
  { path: 'perfis', component: PerfisComponent },
  { path: '**', redirectTo: 'perfis' } // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
