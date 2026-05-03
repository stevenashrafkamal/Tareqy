import { TasksService } from './../../../services/tasks.service';
import { CheckpointService } from './../../../services/checkpoint.service';
import { FeedbackService } from './../../../services/feedback.service';
import { AuthService } from './../../../services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, Input, Output, EventEmitter, signal, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step.component.html',
  styleUrl: './step.component.css'
})
export class StepComponent implements OnChanges {

  @Input() step: any = null;
  @Input() trackId: string = '';
  @Input() levelId: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() markDone = new EventEmitter<any>();

  code = signal<string>('');
  isCompleted = signal<boolean>(false);
  submitting = signal<boolean>(false);
  safeVideoUrl = signal<SafeResourceUrl | null>(null);
  
  // Feedback & Reporting
  rating = signal<number>(0);
  feedbackText = signal<string>('');
  isFeedbackSubmitted = signal<boolean>(false);
  
  showReportForm = signal<boolean>(false);
  reportTitle = signal<string>('');
  reportDesc = signal<string>('');
  isReportSubmitted = signal<boolean>(false);

  constructor(
    private tasksService: TasksService,
    private checkpointService: CheckpointService,
    private feedbackService: FeedbackService,
    private auth: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['step'] && this.step) {
      this.checkIfCompleted();
      this.resetForms();
    }
    
    if (changes['step'] && this.step?.videoUrl) {
      this.safeVideoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.step.videoUrl));
    } else if (changes['step'] && !this.step?.videoUrl) {
      this.safeVideoUrl.set(null);
    }
  }

  private checkIfCompleted(): void {
    const user = this.auth.getUser();
    if (!user || !this.levelId || !this.step) return;
    
    // Check local progress first
    const progress = this.checkpointService.getLevelProgress(this.levelId, this.trackId, user._id);
    // Note: our local progress uses numbers for mock steps but IDs for backend. 
    // We check against step.id or the mapped numeric id.
    const stepIdToCheck = this.step?.id || this.step?._id;
    this.isCompleted.set(progress.includes(stepIdToCheck));
  }

  private resetForms(): void {
    this.rating.set(0);
    this.feedbackText.set('');
    this.isFeedbackSubmitted.set(false);
    this.reportTitle.set('');
    this.reportDesc.set('');
    this.showReportForm.set(false);
    this.isReportSubmitted.set(false);
  }

  submit(): void {
    if (this.step?.type === 'task' && !this.code().trim()) return;
    this.submitting.set(true);

    if (this.step.type === 'video') {
      this.markAsDone();
    } else {
      this.submitTask();
    }
  }

  private markAsDone(): void {
    const stepId = this.step?.id || this.step?._id;
    
    if (!this.trackId || !this.levelId || !stepId) {
      console.error('Missing IDs for checkpoint:', { track: this.trackId, level: this.levelId, stepId });
      this.submitting.set(false);
      return;
    }

    const payload = {
      track_id: this.trackId,
      level_id: this.levelId,
      last_step_id: stepId
    };

    this.checkpointService.createCheckpoint(payload).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.isCompleted.set(true);
        this.markDone.emit(this.step);
      },
      error: (err) => {
        console.error('Mark as done error:', err);
        this.submitting.set(false);
      }
    });
  }

  private submitTask(): void {
    const stepId = this.step?.id || this.step?._id;
    const payload = {
      title: this.step?.title || 'Task Submission',
      description: this.step?.description || 'Task code submission',
      stepId: stepId,
      answer: this.code(),
      status: 'done'
    };

    this.tasksService.createTask(payload as any).subscribe({
      next: (res: any) => {
        this.submitting.set(false);
        this.isCompleted.set(true);
        this.markDone.emit(this.step);
      },
      error: (err: any) => {
        console.error('Submit Task error:', err);
        this.submitting.set(false);
      }
    });
  }

  submitFeedback(): void {
    if (this.rating() === 0) return;
    
    const stepId = this.step?.id || this.step?._id;
    const payload = {
      total_stars: this.rating(),
      title: `Feedback for ${this.step.title}`,
      description: this.feedbackText(),
      target_type: 'step' as any,
      target_id: stepId
    };

    this.feedbackService.addReview(payload).subscribe({
      next: () => {
        this.isFeedbackSubmitted.set(true);
      },
      error: (err) => console.error('Feedback error:', err)
    });
  }

  submitReport(): void {
    if (!this.reportTitle().trim()) return;

    const stepId = this.step?.id || this.step?._id;
    const payload = {
      type: 'report' as any,
      title: this.reportTitle(),
      description: this.reportDesc(),
      target_type: 'step' as any,
      target_id: stepId
    };

    this.feedbackService.createReport(payload).subscribe({
      next: () => {
        this.isReportSubmitted.set(true);
        setTimeout(() => this.showReportForm.set(false), 2000);
      },
      error: (err) => console.error('Report error:', err)
    });
  }

  onClose(): void {
    this.onReset();
    this.close.emit();
  }

  private onReset(): void {
    this.code.set('');
    this.submitting.set(false);
  }
}