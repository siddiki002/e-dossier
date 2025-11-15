import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitItemIssued } from './kit-item-issued';

describe('KitItemIssued', () => {
  let component: KitItemIssued;
  let fixture: ComponentFixture<KitItemIssued>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitItemIssued]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitItemIssued);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
