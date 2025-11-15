import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path : 'instructor', loadComponent: () => import('./instructor/instructor').then(m => m.Instructor)},
  {path: 'oic', loadComponent: () => import('./oic/oic').then(m => m.Oic)},
  {
    path: 'ado', loadComponent: () => import('./ado/ado').then(m => m.Ado)
  },
  {
    path: 'chief-exam', loadComponent: () => import('./ado/ado').then(m => m.Ado),
  },
  {path : 'personal-information-entry/:classId', loadComponent: () => import('./ado/personal-information-entry/personal-information-entry').then(m => m.PersonalInformationEntry)},
  {path: 'discipline-observation-entry/:classId', loadComponent: () => import('./ado/discipline-observation/discipline-observation').then(m => m.DisciplineObservation)},
  {path: 'medical-records-entry/:classId', loadComponent: () => import('./ado/medical-records/medical-records').then(m => m.MedicalRecords)},
  {path: 'leave-records-entry/:classId', loadComponent: () => import('./ado/leave-records/leave-records').then(m => m.LeaveRecords)},
  {path: 'pet-sports-entry/:classId', loadComponent: () => import('./ado/pet-sports/pet-sports').then(m => m.PetSports)},
  {path: 'kit-item-issued-entry/:classId', loadComponent: () => import('./ado/kit-item-issued/kit-item-issued').then(m => m.KitItemIssued)},
  {path: 'chief-exam/class-overview/:id', loadComponent: () => import('./chief-exam/class-overview/class-overview').then(m => m.ClassOverview)},
  {path: 'chief-exam/marks-entering/:classId/:option', loadComponent: () => import('./chief-exam/marks-entering/marks-entering').then(m => m.MarksEntering)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
