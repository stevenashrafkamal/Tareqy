import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard, adminGuard, codeReviewerGuard } from './guards/guards';

export const routes: Routes = [
  
  { path: '',     redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/home/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'level/:id', loadComponent: () => import('./features/level/level-page/level-page.component').then(m => m.LevelPageComponent), canActivate: [authGuard] },
  { path: 'track/:id', loadComponent: () => import('./features/track/track.component').then(m => m.TrackMapComponent) },
  { path: 'resource/:id', loadComponent: () => import('./features/level/resource-view/resource-view.component').then(m => m.ResourceViewComponent), canActivate: [authGuard] },
  { path: 'checkpoint/:id', loadComponent: () => import('./features/level/checkpoint/checkpoint.component').then(m => m.CheckpointComponent), canActivate: [authGuard] },
  { path: 'challenge/:id', loadComponent: () => import('./features/challenge/challenge-detail/challenge-detail.component').then(m => m.ChallengeDetailComponent), canActivate: [authGuard] },
  { path: 'profile',   loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },

  {
    path: 'auth',
    children: [
      { path: 'login',    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),canActivate: [guestGuard] },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent), canActivate: [guestGuard] },
      { path: 'verify/:token', loadComponent: () => import('./features/auth/verify/verify.component').then(m => m.VerifyComponent) },
      { path: 'verify',   loadComponent: () => import('./features/auth/verify/verify.component').then(m => m.VerifyComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // ── New Enterprise Admin Dashboard ──────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/overview/admin-overview.component').then(m => m.AdminOverviewComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'tasks', loadComponent: () => import('./features/admin/tasks/admin-tasks.component').then(m => m.AdminTasksComponent) },
      { path: 'feedback', loadComponent: () => import('./features/admin/feedback/admin-feedback.component').then(m => m.AdminFeedbackComponent) },
      { path: 'reports', loadComponent: () => import('./features/admin/reports/admin-reports.component').then(m => m.AdminReportsComponent) },
      { path: 'tracks', loadComponent: () => import('./features/dashboard/admin/admin.component').then(m => m.AdminComponent) } // Reusing existing tracks management logic
    ]
  },

  { path: 'dashboard/instructor', loadComponent: () => import('./features/dashboard/instructor/instructor.component').then(m => m.InstructorComponent ), canActivate: [authGuard, roleGuard(['instructor'])] },
  { path: 'dashboard/reviewer',  loadComponent: () => import('./features/dashboard/code-reviewer/code-reviewer.component').then(m => m.CodeReviewerComponent), canActivate: [authGuard, codeReviewerGuard] },
  { path: 'code-reviewer',       loadComponent: () => import('./features/dashboard/code-reviewer/code-reviewer.component').then(m => m.CodeReviewerComponent), canActivate: [authGuard, codeReviewerGuard] },

  { path: '**', redirectTo: 'home' }
];
