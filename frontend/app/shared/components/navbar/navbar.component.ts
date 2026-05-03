import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  scrolled  = signal(false);
  menuOpen  = signal(false);

  constructor(public auth: AuthService, private router: Router) {}

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 30); }

  get dashboardRoute(): string {
    const role = this.auth.getRole();
    if (role === 'admin' || role === 'superAdmin') return '/admin';
    if (role === 'instructor') return '/dashboard/instructor';
    if (role === 'reviewer')   return '/dashboard/reviewer';
    return '/profile';
  }

  get dashboardLabel(): string {
    const role = this.auth.getRole();
    if (role === 'admin' || role === 'superAdmin') return 'Admin Panel';
    if (role === 'instructor') return 'Instructor Panel';
    if (role === 'reviewer')   return 'Reviewer Panel';
    return 'Profile';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
