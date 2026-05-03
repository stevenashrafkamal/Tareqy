import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocialBarComponent } from './shared/components/social-bar/social-bar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, SocialBarComponent, RouterOutlet],
  templateUrl: './app.component.html'  
})
export class AppComponent {
}
