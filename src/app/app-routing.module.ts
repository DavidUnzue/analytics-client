import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './page.component';
import { PlotComponent } from './plot/plot.component';

const routes: Routes = [
  { path: 'dashboard', component: PlotComponent },
  { path: 'page-1', component: PageComponent },
  { path: 'page-2', component: PageComponent },
  { path: 'page-3', component: PageComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
