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
            { path: 'academics', loadComponent: () => import('./officer-details/academics/academics').then(m => m.Academics)},
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
