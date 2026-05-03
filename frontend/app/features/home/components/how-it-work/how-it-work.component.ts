import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-work',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-work.component.html',
  styleUrl: './how-it-work.component.css'
})
export class HowItWorksComponent {
  steps = [
    { num: '01', icon: '🧭', title: 'Choose Your Track', desc: 'Find your field and choose the track that suits you from the knowledge map' },
    { num: '02', icon: '🗺️', title: 'Follow the Map', desc: 'Each track has interconnected islands (levels). Start from the first and progress step by step' },
    { num: '03', icon: '⚡', title: 'Solve the Challenges', desc: 'Each step has a video + a practical task. Complete it and submit it for review' },
    { num: '04', icon: '🏆', title: 'Collect Rewards', desc: 'Complete each level to earn points and badges. Unlock new levels and keep going!' },
  ];
}
