import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficersTable } from './officers-table';

describe('OfficersTable', () => {
  let component: OfficersTable;
  let fixture: ComponentFixture<OfficersTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficersTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficersTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
