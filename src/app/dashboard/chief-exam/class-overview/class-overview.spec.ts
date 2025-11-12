import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassOverview } from './class-overview';

describe('ClassOverview', () => {
  let component: ClassOverview;
  let fixture: ComponentFixture<ClassOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
