import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TracksService } from '../../services/tracks.service';
import { LevelsService } from '../../services/levels.service';
import { CheckpointService } from '../../services/checkpoint.service';
import { SubmissionsService } from '../../services/submissions.service';
import { ChallengesService } from '../../services/challenges.service';
import { AuthService } from '../../services/auth.service';
import { ShipService, ShipType } from '../../services/ship.service';
import { combineLatest, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Island {
  id: string;
  name: string;
  x: number;
  y: number;
  locked: boolean;
  completed: boolean;
  difficulty: string;
  steps: number;
}

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './track.component.html',
  styleUrl: './track.component.css'
})
export class TrackMapComponent implements OnInit {
  trackName = signal('Loading Map...');
  islands: Island[] = [];
  selectedIsland = signal<Island | null>(null);

  shipType = signal<ShipType>('rowboat');
  currentShipPos = signal<{x: number, y: number} | null>(null);

  completedCount = computed(() => this.islands.filter(i => i.completed).length);

  // Hardcoded map coordinates for sequence of islands
  private islandCoords = [
    { x: 80, y: 380 }, { x: 220, y: 280 }, { x: 360, y: 200 },
    { x: 480, y: 130 }, { x: 620, y: 180 }, { x: 650, y: 320 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tracksService: TracksService,
    private levelsService: LevelsService,
    private checkpointService: CheckpointService,
    private submissionsService: SubmissionsService,
    private challengesService: ChallengesService,
    private auth: AuthService,
    public shipService: ShipService
  ) {}

  ngOnInit(): void {
    const trackId = this.route.snapshot.paramMap.get('id');
    if (!trackId) return;

    this.tracksService.getTrackById(trackId).subscribe({
      next: (track: any) => {
        console.log('[TrackMapComponent] Track loaded:', track);
        this.trackName.set(track?.title || 'The Grand Navigation');
      },
      error: () => this.trackName.set('The Grand Navigation')
    });

    const levels$ = this.levelsService.getLevelsByTrack(trackId).pipe(
      catchError(err => {
        console.error('[TrackMapComponent] Failed to load levels:', err);
        return of([]);
      })
    );

    // Checkpoint requires auth; avoid 401/404 noise when browsing as guest.
    const checkpoint$ = this.auth.isLoggedIn()
      ? this.checkpointService.getCheckpointByTrack(trackId).pipe(
          map((res: any) => res?.checkpoint ?? res ?? null),
          catchError(() => of(null))
        )
      : of(null);

    // Fetch all user submissions to determine REAL completion (challenge submitted)
    const submissions$ = this.auth.isLoggedIn()
      ? this.submissionsService.getUserSubmissions().pipe(
          catchError(() => of([]))
        )
      : of([]);

    // Fetch challenges for this track to cross-reference submissions
    const challenges$ = this.challengesService.getChallengesByTrack(trackId).pipe(
      catchError(() => of([]))
    );

    combineLatest([levels$, checkpoint$, submissions$, challenges$]).subscribe(([levels, checkpoint, submissions, challenges]: [any[], any, any[], any[]]) => {
      const completedLevelIds = this.checkpointService.getTrackProgress(trackId);
      const checkpointLevelId = checkpoint?.levelId?._id || checkpoint?.levelId || null;

      // Build a set of level IDs that have a confirmed challenge submission
      const submittedChallengeIds = new Set<string>(
        submissions
          .filter(s => s.type === 'challenge')
          .map(s => s.challengeId?._id || s.challengeId)
          .filter(Boolean)
      );

      // Map each challenge to its levelId for cross-reference
      const challengeLevelMap = new Map<string, string>(); // levelId -> challengeId
      (challenges || []).forEach((c: any) => {
        const lvlId = c.levelId?._id || c.levelId;
        if (lvlId) challengeLevelMap.set(lvlId.toString(), c._id?.toString());
      });

      if (checkpointLevelId) {
        this.checkpointService.saveTrackProgress(trackId, checkpointLevelId);
      }

      const checkpointIndex = levels.findIndex((lvl: any) => lvl?._id === checkpointLevelId);
      const completedIndexes = levels
        .map((lvl: any, idx: number) => completedLevelIds.includes(lvl?._id) ? idx : -1)
        .filter((idx: number) => idx >= 0);
      const maxCompletedIndex = completedIndexes.length ? Math.max(...completedIndexes) : -1;
      const currentLevelIndex = Math.max(checkpointIndex, maxCompletedIndex + 1, 0);
      
      this.islands = levels.map((lvl, idx) => {
        const coords = this.islandCoords[idx % this.islandCoords.length];
        const levelIdStr = lvl._id?.toString();
        
        // A level is completed if its ID exists in the track progress checkpoints
        // or if it strictly precedes the highest recorded checkpoint index.
        const isCompleted = completedLevelIds.includes(levelIdStr) || idx < checkpointIndex;
        const isLocked = idx > currentLevelIndex;
        
        return {
          id: levelIdStr,
          name: lvl.levelDifficulty ? (lvl.levelDifficulty.charAt(0).toUpperCase() + lvl.levelDifficulty.slice(1)) : `Level ${lvl.levelNumber || idx + 1}`,
          x: coords.x,
          y: coords.y,
          locked: isLocked,
          completed: isCompleted,
          difficulty: lvl.levelDifficulty || 'Medium',
          steps: 5
        };
      });

      // Find current ship position
      const activeIsland = this.islands[currentLevelIndex] || this.islands[0];
      if (activeIsland) {
        this.currentShipPos.set({ x: activeIsland.x, y: activeIsland.y });
      }

      this.shipService.setShipBasedOnLevel(currentLevelIndex);
    });

    this.shipService.currentShip$.subscribe(type => this.shipType.set(type));
  }

  selectIsland(island: Island): void {
    if (!island.locked) {
      this.selectedIsland.set(island);
    }
  }

  enterIsland(): void {
    const island = this.selectedIsland();
    if (island) {
      this.router.navigate(['/level', island.id], {
        queryParams: { trackId: this.route.snapshot.paramMap.get('id') }
      });
    }
  }

  private getTrackId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  getPathD(): string {
    if (this.islands.length < 2) return '';
    return this.islands.reduce((path, island, i) => {
      if (i === 0) return `M ${island.x},${island.y}`;
      const prev = this.islands[i - 1];
      const cpX = (prev.x + island.x) / 2;
      const cpY = prev.y - 60; // Curve arc upwards
      return `${path} Q ${cpX},${cpY} ${island.x},${island.y}`;
    }, '');
  }
}