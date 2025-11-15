import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetSports } from './pet-sports';

describe('PetSports', () => {
  let component: PetSports;
  let fixture: ComponentFixture<PetSports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetSports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetSports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
