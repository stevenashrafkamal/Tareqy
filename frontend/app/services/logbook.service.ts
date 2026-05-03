import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SubmissionsService } from './submissions.service';
import { ScoresService } from './scores.service';

export interface LogbookEntry {
  submission: any;
  score?: any;
  status: 'pending' | 'scored';
}

@Injectable({
  providedIn: 'root'
})
export class LogbookService {
  constructor(
    private submissionsService: SubmissionsService,
    private scoresService: ScoresService
  ) {}

  getUserLogbook(): Observable<LogbookEntry[]> {
    return this.submissionsService.getUserSubmissions().pipe(
      switchMap(submissions => {
        const scoreRequests = submissions.map(sub => 
          this.scoresService.getScoreBySubmission(sub._id).pipe(
            map(score => ({
              submission: sub,
              score: score,
              status: score ? 'scored' : 'pending'
            } as LogbookEntry))
          )
        );
        return forkJoin(scoreRequests);
      })
    );
  }
}
