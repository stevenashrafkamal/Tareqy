import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShipService } from '../../../services/ship.service';

@Component({
  selector: 'app-checkpoint',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkpoint.component.html',
  styleUrl: './checkpoint.component.css'
})
export class CheckpointComponent implements OnInit {
  checkpointId = '';
  checkpoint = signal<any>(null);
  currentQuestionIndex = signal(0);
  selectedOption = signal<number | null>(null);
  showResult = signal(false);
  score = signal(0);

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private shipService: ShipService
  ) {}

  ngOnInit() {
    this.checkpointId = this.route.snapshot.paramMap.get('id') || '1';
    
    this.checkpoint.set({
      title: 'HTML Forms Basics',
      questions: [
        {
          text: 'Which HTML tag is used to define an interactive control for forms?',
          options: ['<input>', '<form>', '<control>', '<button>'],
          correct: 0
        },
        {
          text: 'What attribute specifies the URL where the form data should be submitted?',
          options: ['method', 'target', 'action', 'submit'],
          correct: 2
        },
        {
          text: 'Which input type is best for a multi-line text input?',
          options: ['<input type="textarea">', '<textarea>', '<input type="longtext">', '<text>'],
          correct: 1
        }
      ]
    });
  }

  selectOption(index: number) {
    if (this.showResult()) return;
    this.selectedOption.set(index);
  }

  nextQuestion() {
    if (this.selectedOption() === null) return;
    
    const cp = this.checkpoint();
    const qIndex = this.currentQuestionIndex();
    
    if (this.selectedOption() === cp.questions[qIndex].correct) {
      this.score.update(s => s + 1);
    }

    if (qIndex < cp.questions.length - 1) {
      this.currentQuestionIndex.set(qIndex + 1);
      this.selectedOption.set(null);
    } else {
      this.showResult.set(true);
    }
  }

  finish() {
    const totalQuestions = this.checkpoint().questions.length;
    const userScore = this.score();
    
    // Ship upgrade logic: if > 70% score, update level
    if (userScore >= totalQuestions * 0.7) {
      const levelId = parseInt(this.checkpointId) || 2; 
      this.shipService.setShipBasedOnLevel(levelId);
    }
    
    this.router.navigate(['/level/1']);
  }
}
