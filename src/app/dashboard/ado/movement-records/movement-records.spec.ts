import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementRecords } from './movement-records';

describe('MovementRecords', () => {
  let component: MovementRecords;
  let fixture: ComponentFixture<MovementRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovementRecords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
