import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraitsAssessment } from './traits-assessment';

describe('TraitsAssessment', () => {
  let component: TraitsAssessment;
  let fixture: ComponentFixture<TraitsAssessment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraitsAssessment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraitsAssessment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
