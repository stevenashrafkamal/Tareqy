import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('mapPath') mapPath!: ElementRef<SVGPathElement>;
  stars = Array.from({ length: 200 }, (_, i) => i + 1);

  ngAfterViewInit() {
    const path = this.mapPath?.nativeElement;
    if (path) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      path.style.animation = 'path-draw 5s ease-in-out infinite 0.5s';
    }
  }
}
