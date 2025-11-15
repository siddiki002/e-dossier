import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplineObservation } from './discipline-observation';

describe('DisciplineObservation', () => {
  let component: DisciplineObservation;
  let fixture: ComponentFixture<DisciplineObservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisciplineObservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplineObservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
