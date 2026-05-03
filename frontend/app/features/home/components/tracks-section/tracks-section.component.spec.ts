import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracksSectionComponent } from './tracks-section.component';

describe('TracksSectionComponent', () => {
  let component: TracksSectionComponent;
  let fixture: ComponentFixture<TracksSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracksSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TracksSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
