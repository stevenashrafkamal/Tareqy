import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepComponent } from '../step/step.component';
import { AuthService } from '../../../services/auth.service';
import { LevelsService } from '../../../services/levels.service';
import { StepsService } from '../../../services/steps.service';
import { CheckpointService } from '../../../services/checkpoint.service';
import { ChallengesService } from '../../../services/challenges.service';
import { SubmissionsService } from '../../../services/submissions.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Step {
  id: any;        // Local reference (MongoDB _id string)
  rawId: string;  // Guaranteed-string MongoDB _id for backend calls
  title: string;
  type: 'video' | 'task' | 'quiz';
  status: 'locked' | 'available' | 'done';
  duration?: string;
  isPaid: boolean;
  videoUrl?: string;
}

@Component({
  selector: 'app-level-page',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, StepComponent],
  templateUrl: './level-page.component.html',
  styleUrl: './level-page.component.css'
})
export class LevelPageComponent implements OnInit {
  levelName = signal('JavaScript Basics');
  islandName = signal('JavaScript Island');
  selectedStep = signal<Step | null>(null);
  steps: Step[] = [];

  completedCount = 0;
  trackId = '';
  levelId = '';

  currentLevel: any = null;
  challenge: any = null;
  isChallengeRequired = signal(false);
  isReviewMode = signal(false);   // true once challenge is submitted — shows steps + badge
  challengeCode: string = '';
  isSubmittingChallenge = signal(false);
  hasSubmittedChallenge = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private levelsService: LevelsService,
    private stepsService: StepsService,
    private checkpointService: CheckpointService,
    private challengesService: ChallengesService,
    private submissionsService: SubmissionsService
  ) {}

  ngOnInit() {
    this.levelId = this.route.snapshot.paramMap.get('id') || '';
    this.trackId = this.route.snapshot.queryParamMap.get('trackId') || '';
    
    // Fetch Level Info FIRST, then fetch steps so currentLevel is ready
    this.levelsService.getLevelById(this.levelId).subscribe({
      next: (lvl: any) => {
        console.log('[LevelPage] Level loaded:', lvl);
        if (lvl) {
          this.currentLevel = lvl;
          this.levelName.set(lvl.levelDifficulty || lvl.title || 'Level');
          this.islandName.set(lvl.island_name || `Level ${lvl.levelNumber || ''}`);
        }

        // Now fetch steps — currentLevel is guaranteed to be populated
        this.stepsService.getStepsByLevel(this.levelId).pipe(
          catchError(() => of([]))
        ).subscribe((steps: any[]) => {
          console.log('[LevelPage] Steps loaded:', steps);
          this.steps = steps.map((s: any, idx: number) => ({
            id: s._id || idx + 1,
            rawId: String(s._id || ''),  // Always the real MongoDB _id
            title: s.title || s.name || 'Untitled Step',
            type: s.type || 'video',
            status: 'locked' as const,
            duration: s.duration,
            isPaid: s.isPremium || false,
            videoUrl: s.videoUrl
          }));
          this.restoreProgress();
          this.evaluateChallengeGate();
        });
      },
      error: (err) => console.error('[LevelPage] Failed to load level:', err)
    });
  }

  openStep(step: Step) {
    if (step.status !== 'locked') this.selectedStep.set(step);
  }

  closePanel() { this.selectedStep.set(null); }

  markDone(step: Step) {
    const idx = this.steps.findIndex(s => s.id === step.id);
    if (idx !== -1) {
      this.steps[idx].status = 'done';
      // For now we unlock next steps sequentially (including premium steps)
      // so progression works end-to-end.
      if (idx + 1 < this.steps.length && this.steps[idx + 1].status === 'locked') {
        this.steps[idx + 1].status = 'available';
      }
      this.completedCount = this.steps.filter(s => s.status === 'done').length;

      this.persistProgress(step.id);
      this.selectedStep.set(null);
      
      this.checkChallengeRequirement(step);
    }
  }

  private checkChallengeRequirement(lastStep: Step): void {
    const totalStepsCount = this.steps.length;
    const completedStepsCount = this.completedCount;

    if (completedStepsCount === totalStepsCount) {
      this.evaluateChallengeGate();
    } else if (lastStep.title.includes('Reward')) {
      this.finalizeLevel();
    }
  }

  /** Saves progress locally and navigates back to the track map. */
  private finalizeLevel(): void {
    if (this.trackId && this.levelId) {
      this.checkpointService.saveTrackProgress(this.trackId, this.levelId);
      this.router.navigate(['/track', this.trackId]);
      return;
    }
    this.router.navigate(['/track', this.trackId || '1']);
  }

  // --- Challenge Logic ---

  private evaluateChallengeGate(): void {
    const totalStepsCount = this.steps.length;
    const completedStepsCount = this.completedCount;

    // Don't run if level or steps aren't loaded yet
    if (!this.currentLevel || totalStepsCount === 0) return;
    
    // Check if the user already has a Checkpoint for this entire level
    const user = this.auth.getUser();
    const trackProgress = this.checkpointService.getTrackProgress(this.trackId);
    const hasCheckpoint = trackProgress.includes(this.levelId);

    if (hasCheckpoint) {
      // User has already completed this level (Checkpoint exists)
      // Force REVIEW MODE so they can see all steps again + the Completion Badge
      this.isReviewMode.set(true);
      this.isChallengeRequired.set(false);
      return;
    }

    // Always attempt to fetch the challenge for this level.
    // The gate shows if: ALL steps done AND a challenge exists AND challenge not yet submitted.
    this.checkChallengeState(totalStepsCount, completedStepsCount);
  }

  private checkChallengeState(totalStepsCount: number, completedStepsCount: number): void {
    if (completedStepsCount < totalStepsCount) return;

    this.challengesService.getChallengesByLevel(this.levelId).subscribe({
      next: challenges => {
        // Enforce challenge on EVERY level. Mock one if database is empty.
        if (challenges && challenges.length > 0) {
          this.challenge = challenges[0];
        } else {
          this.challenge = {
            _id: this.levelId, // Proxy valid ObjectId for submission constraints
            title: this.levelName() + ' Final Challenge',
            description: 'Prove your mastery of this level to unlock the next destination.',
            content: 'Please upload your final code solution for evaluation.'
          };
        }

        const challengeId = this.challenge._id?.toString();
        this.submissionsService.getUserSubmissions().subscribe({
          next: subs => {
            this.hasSubmittedChallenge = subs.some(s => {
              const sid = s.challengeId?._id?.toString() || s.challengeId?.toString();
              return s.type === 'challenge' && sid === challengeId;
            });

            if (this.hasSubmittedChallenge) {
              this.isChallengeRequired.set(false);
              this.isReviewMode.set(true);
            } else {
              this.isReviewMode.set(false);
              this.isChallengeRequired.set(true);
            }
          },
          error: (err) => {
            console.warn('[LevelPage] Could not verify submissions, enforcing gate:', err);
            this.isReviewMode.set(false);
            this.isChallengeRequired.set(true);
          }
        });
      },
      error: (err) => {
        console.error('[LevelPage] Failed to load challenge:', err);
      }
    });
  }

  submitChallengeForm(): void {
    if (!this.challengeCode.trim() || !this.challenge) return;

    this.isSubmittingChallenge.set(true);

    const submissionPayload = {
      type: 'challenge',
      file_type: 'text',
      challengeId: this.challenge._id,
      answer: this.challengeCode
    };

    this.submissionsService.submitChallenge(submissionPayload).subscribe({
      next: () => {
        // Step 1: Mark submission as done locally
        this.hasSubmittedChallenge = true;
        this.isSubmittingChallenge.set(false);
        this.isChallengeRequired.set(false);
        this.isReviewMode.set(true);

        // Step 2: Create the real backend checkpoint so the Track Map updates
        const lastStep = this.steps[this.steps.length - 1];
        // Use rawId (guaranteed MongoDB ObjectId string) for the backend call
        const lastStepRawId = lastStep?.rawId || String(lastStep?.id || '');
        if (this.trackId && this.levelId && lastStepRawId) {
          const checkpointPayload = {
            track_id: this.trackId,
            level_id: this.levelId,
            last_step_id: lastStepRawId
          };
          this.checkpointService.createCheckpoint(checkpointPayload).subscribe({
            next: () => {
              console.log('[LevelPage] Checkpoint created successfully — map will update.');
              // Save track progress locally so map shows checkmark immediately
              this.checkpointService.saveTrackProgress(this.trackId, this.levelId);
              // Navigate back to the track map
              this.router.navigate(['/track', this.trackId]);
            },
            error: (err) => {
              console.error('[LevelPage] Checkpoint creation failed:', err);
              // Still save locally and navigate so user isn't stuck
              this.checkpointService.saveTrackProgress(this.trackId, this.levelId);
              this.router.navigate(['/track', this.trackId]);
            }
          });
        } else {
          this.checkpointService.saveTrackProgress(this.trackId, this.levelId);
          this.router.navigate(['/track', this.trackId]);
        }
      },
      error: (err) => {
        console.error('Challenge submission error:', err);
        this.isSubmittingChallenge.set(false);
      }
    });
  }

  private restoreProgress(): void {
    const user = this.auth.getUser();
    const doneIds = this.checkpointService.getLevelProgress(this.levelId, this.trackId, user?._id);

    // Reset then rebuild from saved progress.
    this.steps = this.steps.map(s => ({
      ...s,
      status: doneIds.includes(s.id) ? 'done' : 'locked'
    }));

    if (this.steps.length > 0) {
      if (doneIds.length === 0) {
        this.steps[0].status = 'available';
      } else {
        const lastDoneIdx = this.steps.map(s => s.id).lastIndexOf(Math.max(...doneIds));
        if (lastDoneIdx !== -1 && lastDoneIdx + 1 < this.steps.length) {
          this.steps[lastDoneIdx + 1].status = 'available';
        }
      }
    }
    this.completedCount = this.steps.filter(s => s.status === 'done').length;
  }

  private persistProgress(stepId: number): void {
    const user = this.auth.getUser();
    this.checkpointService.saveStepToLevelProgress(this.levelId, stepId, this.trackId, user?._id);
  }
}