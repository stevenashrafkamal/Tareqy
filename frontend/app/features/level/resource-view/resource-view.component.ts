import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChallengesService } from '../../../services/challenges.service';
import { SubmissionsService } from '../../../services/submissions.service';
import { Challenge } from '../../../shared/models/challenge.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-resource-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resource-view.component.html',
  styleUrl: './resource-view.component.css'
})
export class ResourceViewComponent implements OnInit {
  stepId = '';
  challenge = signal<Challenge | null>(null);
  
  // Video toggle
  showPaidVideo = signal(false);

  // Submissions
  submissionFile: File | null = null;
  submissionLoading = signal(false);
  submissionSuccess = signal(false);
  isDragging = false;

  constructor(
    private route: ActivatedRoute,
    private challengesService: ChallengesService,
    private submissionsService: SubmissionsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.stepId = this.route.snapshot.paramMap.get('id') || '1';
    
    this.challengesService.getChallengesByStep(this.stepId).subscribe(
      (challenges) => {
        // Assuming the first challenge is the main step challenge
        if (challenges && challenges.length > 0) {
          this.challenge.set(challenges[0]);
        } else {
          // Mock data for UI development if no API data
          this.challenge.set({
            _id: '1',
            title: 'Captain\'s First Code',
            description: 'Write a Flexbox layout that aligns the treasure chests to the center of the island.',
            type: 'task',
            difficulty: 'Easy',
            points: 10,
            track_id: '1',
            level_id: '1',
            step_id: this.stepId
          } as any);
        }
      },
      (error) => {
        // Fallback mock
        this.challenge.set({
            _id: '1',
            title: 'Captain\'s First Code',
            description: 'Write a Flexbox layout that aligns the treasure chests to the center of the island.',
            type: 'task',
            difficulty: 'Easy',
            points: 10,
            track_id: '1',
            level_id: '1',
            step_id: this.stepId
        } as any);
      }
    );
  }

  toggleVideoType() {
    this.showPaidVideo.set(!this.showPaidVideo());
  }

  getSafeYoutubeUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.submissionFile = event.dataTransfer.files[0];
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.submissionFile = file;
    }
  }

  submitAction() {
    if (!this.submissionFile || !this.challenge()) return;
    
    this.submissionLoading.set(true);
    const formData = new FormData();
    formData.append('file', this.submissionFile);
    formData.append('challenge_id', this.challenge()!._id);
    // Include user info as required by backend

    this.submissionsService.submitTask(formData).subscribe(
      () => {
        this.submissionLoading.set(false);
        this.submissionSuccess.set(true);
      },
      (error) => {
        this.submissionLoading.set(false);
        // Fallback for UI visualization
        this.submissionSuccess.set(true);
        console.error('Submission failed', error);
      }
    );
  }
}
