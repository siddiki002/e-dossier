import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksEntering } from './marks-entering';

describe('MarksEntering', () => {
  let component: MarksEntering;
  let fixture: ComponentFixture<MarksEntering>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarksEntering]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarksEntering);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
