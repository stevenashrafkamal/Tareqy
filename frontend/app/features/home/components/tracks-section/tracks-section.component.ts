import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TracksService } from '../../../../services/tracks.service';
import { Track } from '../../../../shared/models/track.model';

interface HomeTrack {
  id: string;
  name: string;
  icon: string;
  levels: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  color: string;
}

@Component({ 
  selector: 'app-tracks-section',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './tracks-section.component.html',
  styleUrl: './tracks-section.component.css'
})
export class TracksSectionComponent implements OnInit {
  tracks: HomeTrack[] = [];

  private readonly palette = ['#0ABFB8', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'];

  constructor(private tracksService: TracksService) {}

  ngOnInit(): void {
    this.tracksService.getAllTracks().subscribe({
      next: (tracks: Track[]) => {
        console.log('[TracksSectionComponent] Tracks loaded:', tracks);
        this.tracks = tracks.map((track, index) => ({
          id: track._id,
          name: track.title || track.name || 'Untitled Track',
          icon: this.getIcon(track.type),
          levels: track.number_of_levels || 0,
          difficulty: this.toDifficulty(track.type),
          description: track.usages || 'Start this journey now.',
          color: this.palette[index % this.palette.length]
        }));
      },
      error: (err) => {
        console.error('[TracksSectionComponent] Failed to load tracks:', err);
        this.tracks = [];
      }
    });
  }

  private toDifficulty(type?: string): 'easy' | 'medium' | 'hard' {
    if (type === 'design' || type === 'develop') return 'easy';
    if (type === 'testing' || type === 'debugging') return 'medium';
    return 'hard';
  }

  private getIcon(type?: string): string {
    if (type === 'develop') {
      return '💻';
    }
    if (type === 'testing') {
      return '🧪';
    }
    if (type === 'hacking') {
      return '🛡️';
    }
    if (type === 'debugging') {
      return '📱';
    }
    return '🎨';
  }
}
