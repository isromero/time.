import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@core/auth/login/login.component';
import { RegisterComponent } from '@core/auth/register/register.component';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';
import { MainLayoutComponent } from '@shared/layouts/main-layout/main-layout.component';
import { ProfileComponent } from '@pages/profile/profile.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login | time.',
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register | time.',
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: '',
    component: MainLayoutComponent,
    title: 'time.',
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Home | time.',
      },
      {
        path: 'profile/:userId',
        component: ProfileComponent,
        title: 'Profile | time.',
      },
      {
        path: 'posts/:authorId/:postId',
        loadComponent: () =>
          import(
            './features/feed/components/post/post-detail/post-detail.component'
          ).then((m) => m.PostDetailComponent),
        title: 'Post | time.',
      },
      { path: 'home', redirectTo: '' },
      { path: '**', redirectTo: '' },
    ],
  },
];
