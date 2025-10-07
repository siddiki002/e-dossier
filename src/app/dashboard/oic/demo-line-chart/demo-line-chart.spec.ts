import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoLineChart } from './demo-line-chart';

describe('DemoLineChart', () => {
  let component: DemoLineChart;
  let fixture: ComponentFixture<DemoLineChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoLineChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoLineChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
