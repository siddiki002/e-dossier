import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./authentication/authentication-module').then(m => m.AuthenticationModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule)
    },
    {
        path: 'officer-details/:id',
        loadComponent: () => import('./officer-details/officer-details-layout.component').then(m => m.OfficerDetailsLayoutComponent),
        children: [
            {path: '', redirectTo: 'personal-information', pathMatch: 'full'},
            { path: 'personal-information', loadComponent: () => import('./officer-details/personal-information/personal-information').then(m => m.PersonalInformation) },
            { path: 'academics', loadComponent: () => import('./officer-details/report/report').then(m => m.Report)},
            { path: 'discipline', loadComponent: () => import('./officer-details/discipline/discipline').then(m => m.Discipline)},
            { path: 'traits-assessment', loadComponent: () => import('./officer-details/traits-assessment/traits-assessment').then(m => m.TraitsAssessmentComponent)},
            { path: 'pet', loadComponent: () => import('./officer-details/pet/pet').then(m => m.PetRecords)},
            { path: 'medical', loadComponent: () => import('./officer-details/medical-records/medical-records').then(m => m.MedicalRecords)},
            { path: 'ai-summary', loadComponent: () => import('./officer-details/ai-summary/ai-summary').then(m => m.AiSummary)},
        ]
    },
    {
        path: 'officer-details/report/:officerId',
        loadComponent: () => import('./officer-details/report/report').then(m => m.Report)
    },
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    // {
    //     path: '**',
    //     redirectTo: 'auth/login',
    // }
];
