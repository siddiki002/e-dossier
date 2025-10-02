import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'data-entry', loadComponent: () => import('./data-entry/data-entry').then(m => m.DataEntry)},
  {path : 'instructor', loadComponent: () => import('./instructor/instructor').then(m => m.Instructor)},
  {path: 'oic', loadComponent: () => import('./oic/oic').then(m => m.Oic)},
  {path: 'class/:id', loadComponent: () => import('./data-entry/marks-entering-screen/marks-entering-screen').then(m => m.MarksEnteringScreen)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
