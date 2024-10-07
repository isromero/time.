import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from '@core/auth/login/login.component';
import { RegisterComponent } from '@core/auth/register/register.component';
import { authGuard, publicGuard } from '@core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login | time.',
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register | time.',
    canActivate: [publicGuard],
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Home | time.',
    canActivate: [authGuard],
  },
  { path: 'home', redirectTo: '' },
  { path: '**', redirectTo: '' },
];
