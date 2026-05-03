import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { TracksSectionComponent } from '../../components/tracks-section/tracks-section.component';
import { HowItWorksComponent } from '../../components/how-it-work/how-it-work.component';
import { SocialBarComponent } from '../../../../shared/components/social-bar/social-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, TracksSectionComponent, HowItWorksComponent, SocialBarComponent],
  template: `
    <app-hero></app-hero>
    <app-tracks-section></app-tracks-section>
    <app-how-it-work></app-how-it-work>
    <app-social-bar></app-social-bar>
  `
})
export class HomeComponent {}