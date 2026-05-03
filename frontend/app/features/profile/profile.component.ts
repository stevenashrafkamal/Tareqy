import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LogbookService, LogbookEntry } from '../../services/logbook.service';
import { TracksService } from '../../services/tracks.service';
import { CheckpointService } from '../../services/checkpoint.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface TrackProgress {
  name: string; icon: string; completed: number; total: number; color: string;
}
interface Badge {
  icon: string; name: string; earned: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  tracks = signal<TrackProgress[]>([]);
  badges = signal<Badge[]>([]);
  logbookEntries = signal<LogbookEntry[]>([]);
  openChest = false;

  constructor(
    private auth: AuthService,
    private logbookService: LogbookService,
    private tracksService: TracksService,
    private checkpointService: CheckpointService
  ) { }

  ngOnInit() {
    const stored = this.auth.getUser();
    this.user = stored ?? { username: 'Captain Blackbeard', email: 'blackbeard@sea.com', role: 'user' };

    // Fetch tracks and progress
    this.tracksService.getAllTracks().subscribe({
      next: (list: any[]) => {
        console.log('[ProfileComponent] Tracks loaded:', list);
        const mapped = list.slice(0, 3).map((t: any, idx: number) => ({
          name: t.title || t.name,
          icon: this.getTrackIcon(idx),
          completed: 0,
          total: t.number_of_levels || 5,
          color: idx % 2 === 0 ? '#D4AF37' : '#9B1B30'
        }));
        this.tracks.set(mapped);
      },
      error: () => {
        this.tracks.set([
          { name: 'The Grand Navigation', icon: 'M12 2L2 22l10-4 10 4L12 2z', completed: 2, total: 5, color: '#D4AF37' },
          { name: 'Swords & Scripts', icon: 'M14.5 17.5L3 6l4-4 11.5 11.5M13 19l6-6', completed: 1, total: 10, color: '#9B1B30' }
        ]);
      }
    });

    // Default badges
    this.badges.set([
      { icon: 'M12 2v4M12 18v4', name: 'First Sail', earned: true },
      { icon: 'M12 2L2 22l10-4 10 4L12 2z', name: 'Kraken Slayer', earned: true },
      { icon: 'M7 11V7a5 5 0 0110 0v4', name: 'Chest Finder', earned: true },
      { icon: 'M12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2', name: 'Pirate Lord', earned: false }
    ]);

    this.logbookService.getUserLogbook().subscribe({
      next: (entries) => this.logbookEntries.set(entries),
      error: () => {
        // Fallback for UI visualization
        this.logbookEntries.set([
          { status: 'scored', score: { score: 95 }, submission: { created_at: new Date(), _id: '1', type: 'task' } },
          { status: 'pending', submission: { created_at: new Date(), _id: '2', type: 'challenge' } }
        ]);
      }
    });
  }

  get initials(): string {
    return this.user?.username?.substring(0, 2).toUpperCase() ?? 'CB';
  }

  get totalPoints(): number { return 1250; }
  get rank(): string {
    const r = this.auth.getRole();
    if (r === 'admin') return 'Fleet Admiral';
    if (r === 'instructor') return 'Quartermaster';
    if (r === 'reviewer') return ' The Oracle';
    return ' Pirate Captain';
  }

  getPercent(t: TrackProgress): number {
    return Math.round((t.completed / t.total) * 100);
  }

  private getTrackIcon(idx: number): string {
    const icons = [
      '<path d="M12 2L2 22l10-4 10 4L12 2z"/>',
      '<path d="M14.5 17.5L3 6l4-4 11.5 11.5M13 19l6-6"/>',
      '<path d="M12 2v4M12 18v4"/>',
      '<path d="M7 11V7a5 5 0 0110 0v4"/>'
    ];
    return icons[idx % icons.length];
  }
}
