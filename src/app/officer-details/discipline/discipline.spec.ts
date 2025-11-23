import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Discipline } from './discipline';

describe('Discipline', () => {
  let component: Discipline;
  let fixture: ComponentFixture<Discipline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Discipline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Discipline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
