import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInformationEntry } from './personal-information-entry';

describe('PersonalInformationEntry', () => {
  let component: PersonalInformationEntry;
  let fixture: ComponentFixture<PersonalInformationEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalInformationEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalInformationEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
