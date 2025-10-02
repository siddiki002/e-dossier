import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oic } from './oic';

describe('Oic', () => {
  let component: Oic;
  let fixture: ComponentFixture<Oic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Oic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Oic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
