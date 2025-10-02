import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksEnteringScreen } from './marks-entering-screen';

describe('MarksEnteringScreen', () => {
  let component: MarksEnteringScreen;
  let fixture: ComponentFixture<MarksEnteringScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarksEnteringScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarksEnteringScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
