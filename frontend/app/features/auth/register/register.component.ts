import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { TracksService } from '../../../services/tracks.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  confirm = '';
  errorMsg = signal('');
  loading = signal(false);
  showPw = signal(false);
  step = signal<'form' | 'verify'>('form');

  tracks: any[] = [];
  selected: string[] = [];

  constructor(
    private auth: AuthService,
    private tracksService: TracksService,
    private router: Router
  ) { }

  ngOnInit() {
    this.tracksService.getAllTracks().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : (res?.tracks ?? res?.data ?? []);
        this.tracks = list.map((t: any) => t.title || t.name);
      },
      error: () => {
        this.tracks = ['Frontend', 'Backend', 'Mobile', 'AI & ML', 'DevOps', 'Cybersecurity', 'UI/UX'];
      }
    });
  }

  toggleTrack(t: string) {
    const i = this.selected.indexOf(t);
    if (i > -1) this.selected.splice(i, 1);
    else this.selected.push(t);
  }

  onRegister() {
    if (!this.username || !this.email || !this.password) { this.errorMsg.set('Please fill all fields'); return; }
    if (this.password !== this.confirm) { this.errorMsg.set('Passwords do not match'); return; }
    if (this.password.length < 6) { this.errorMsg.set('Password must be at least 6 characters'); return; }

    this.loading.set(true); this.errorMsg.set('');
    this.auth.register(this.username, this.email, this.password).subscribe({
      next: () => { this.loading.set(false); this.step.set('verify'); },
      error: (err) => { this.loading.set(false); this.errorMsg.set(err?.error?.message || 'Registration failed'); }
    });
  }
}
