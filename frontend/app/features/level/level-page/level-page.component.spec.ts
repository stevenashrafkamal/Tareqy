import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelPageComponent } from './level-page.component';

describe('LevelPageComponent', () => {
  let component: LevelPageComponent;
  let fixture: ComponentFixture<LevelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LevelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
