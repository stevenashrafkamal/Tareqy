import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChallengesService } from '../../../services/challenges.service';
import { ScoresService } from '../../../services/scores.service';
import { Challenge } from '../../../shared/models/challenge.model';
import { Score } from '../../../shared/models/score.model';

interface PirateLord {
  rank: number;
  userId: string;
  username: string;
  points: number;
  scoreId: string;
}

@Component({
  selector: 'app-challenge-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './challenge-detail.component.html',
  styleUrl: './challenge-detail.component.css'
})
export class ChallengeDetailComponent implements OnInit {
  challengeId = '';
  challenge = signal<Challenge | null>(null);
  loading = signal(true);
  
  pirateLords = signal<PirateLord[]>([]);

  constructor(
    private route: ActivatedRoute,
    private challengesApi: ChallengesService,
    private scoresApi: ScoresService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.challengeId = params.get('id') || '';
      if (this.challengeId) {
        this.loadChallengeAndLeaderboard();
      }
    });
  }

  loadChallengeAndLeaderboard() {
    this.loading.set(true);
    
    // Fetch Basic Challenge Data
    this.challengesApi.getChallengeById(this.challengeId).subscribe({
      next: (data) => {
        this.challenge.set(data);
        this.fetchLeaderboard();
      },
      error: () => {
        // Fallback mock
        this.challenge.set({
          _id: this.challengeId,
          title: 'The Great Flexbox Galleon',
          description: 'Master the alignment of the galleon cannons to earn maximum bounty.',
          points: 1000,
          difficulty: 'Hard'
        } as any);
        this.fetchLeaderboard();
      }
    });
  }

  fetchLeaderboard() {
    this.scoresApi.getChallengeScores(this.challengeId).subscribe({
      next: (scores: Score[]) => {
        // Sort descending
        scores.sort((a, b) => b.score - a.score);
        
        const mappedLords = scores.map((s, index) => ({
          rank: index + 1,
          userId: s.user_id,
          username: `Captain ${s.user_id.substring(0, 5)}`, // Mock username until user API integrated
          points: s.score,
          scoreId: s._id
        }));
        
        this.pirateLords.set(mappedLords);
        this.loading.set(false);
      },
      error: () => {
        // Fallback Mock Leaderboard
        this.pirateLords.set([
          { rank: 1, userId: 'u1', username: 'Blackbeard', points: 980, scoreId: 's1' },
          { rank: 2, userId: 'u2', username: 'Anne Bonny', points: 950, scoreId: 's2' },
          { rank: 3, userId: 'u3', username: 'Captain Kidd', points: 900, scoreId: 's3' },
          { rank: 4, userId: 'u4', username: 'Jack Rackham', points: 820, scoreId: 's4' }
        ]);
        this.loading.set(false);
      }
    });
  }
}
