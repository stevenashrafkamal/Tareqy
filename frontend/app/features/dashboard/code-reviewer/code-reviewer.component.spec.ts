import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeReviewerComponent } from './code-reviewer.component';

describe('CodeReviewerComponent', () => {
  let component: CodeReviewerComponent;
  let fixture: ComponentFixture<CodeReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeReviewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodeReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
