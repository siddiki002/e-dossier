import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRecords } from './leave-records';

describe('LeaveRecords', () => {
  let component: LeaveRecords;
  let fixture: ComponentFixture<LeaveRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRecords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
