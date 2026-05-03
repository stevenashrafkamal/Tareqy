import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TracksService } from '../../../services/tracks.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin', // Kept as app-admin for routing compatibility
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  tracks = signal<any[]>([]);
  loading = signal(true);

  // Modal State
  showModal = signal(false);
  isSubmitting = signal(false);
  form = {
    title: '',
    description: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    is_published: false
  };

  constructor(
    private tracksService: TracksService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.loadTracks();
  }

  loadTracks() {
    this.loading.set(true);
    this.tracksService.getAllTracks().subscribe({
      next: (res) => {
        this.tracks.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load tracks', err);
        this.loading.set(false);
      }
    });
  }

  deleteTrack(id: string) {
    if (!confirm('Are you certain you want to delete this track? This action cannot be undone.')) return;
    
    this.adminService.deleteTrack(id).subscribe({
      next: () => this.loadTracks(),
      error: (err) => console.error('Failed to delete track', err)
    });
  }

  openModal() {
    this.form = { title: '', description: '', difficulty: 'beginner', is_published: false };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  createTrack() {
    if (!this.form.title.trim() || !this.form.description.trim()) return;
    
    this.isSubmitting.set(true);
    this.adminService.createTrack(this.form).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadTracks();
      },
      error: (err) => {
        console.error('Failed to create track', err);
        this.isSubmitting.set(false);
        alert('Failed to create track. Check console for details.');
      }
    });
  }
}