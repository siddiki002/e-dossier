import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ado } from './ado';

describe('Ado', () => {
  let component: Ado;
  let fixture: ComponentFixture<Ado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
