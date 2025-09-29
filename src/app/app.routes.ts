import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: 'auth',
    loadChildren: () => import('./authentication/authentication-module').then(m => m.AuthenticationModule)
    },
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'auth/login',
    }
];
