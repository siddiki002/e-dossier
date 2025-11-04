import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ado } from './ado/ado';

const routes: Routes = [
  {path: 'data-entry', loadComponent: () => import('./data-entry/data-entry').then(m => m.DataEntry)},
  {path : 'instructor', loadComponent: () => import('./instructor/instructor').then(m => m.Instructor)},
  {path: 'oic', loadComponent: () => import('./oic/oic').then(m => m.Oic)},
  {path: 'ado', loadComponent: () => import('./ado/ado').then(m => m.Ado)},
  {path: 'academics/:id', loadComponent: () => import('./data-entry/marks-entering-screen/marks-entering-screen').then(m => m.MarksEnteringScreen)},
  {path: 'personalInformation/:id', loadComponent: () => import('./data-entry/marks-entering-screen/marks-entering-screen').then(m => m.MarksEnteringScreen)},
  {path: 'discipline/:id', loadComponent: () => import('./data-entry/marks-entering-screen/marks-entering-screen').then(m => m.MarksEnteringScreen)},
  {path: 'traits/:id', loadComponent: () => import('./data-entry/marks-entering-screen/marks-entering-screen').then(m => m.MarksEnteringScreen)},
  {path: 'extraCurricular/:id', loadComponent: () => import('./data-entry/marks-entering-screen/marks-entering-screen').then(m => m.MarksEnteringScreen)},
  {path: 'miscRecords/:id', loadComponent: () => import('./data-entry/marks-entering-screen/marks-entering-screen').then(m => m.MarksEnteringScreen)},
  {path : 'personal-information-entry/:classId', loadComponent: () => import('./ado/personal-information-entry/personal-information-entry').then(m => m.PersonalInformationEntry)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
