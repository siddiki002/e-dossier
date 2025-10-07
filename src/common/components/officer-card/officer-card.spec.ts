import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerCard } from './officer-card';

describe('OfficerCard', () => {
  let component: OfficerCard;
  let fixture: ComponentFixture<OfficerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
