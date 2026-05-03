import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email    = '';
  password = '';
  role     = 'user'; // user | instructor | codeReviewer
  errorMsg = signal('');
  loading  = signal(false);
  showPw   = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) { this.errorMsg.set('Please fill in all fields'); return; }
    this.loading.set(true); this.errorMsg.set('');

    const call = this.role === 'instructor' ? this.auth.instructorLogin(this.email, this.password)
                : this.role === 'codeReviewer'   ? this.auth.reviewerLogin(this.email, this.password)
               : this.auth.login(this.email, this.password);

    call.subscribe({
      next: () => {
        this.loading.set(false);
        const r = this.auth.getRole();
        if (r === 'admin')      this.router.navigate(['/dashboard/admin']);
        else if (r === 'instructor') this.router.navigate(['/dashboard/instructor']);
        else if (r === 'codeReviewer')   this.router.navigate(['/dashboard/reviewer']);
        else                         this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err?.error?.message || 'Login failed. Check your credentials.');
      }
    });
  }
}
