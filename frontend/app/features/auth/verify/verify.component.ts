import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {
  loading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');
  verified = signal(false);

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.errorMsg.set('Verification link is invalid. Please use the link sent to your email.');
      return;
    }
    
    this.loading.set(true);
    this.userService.verifyEmailToken(token).subscribe({
      next: () => {
        this.loading.set(false);
        this.verified.set(true);
        this.successMsg.set('Email verified successfully! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message || 'Verification failed. Please try again.');
      }
    });
  }
}
