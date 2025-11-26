import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSummary } from './ai-summary';

describe('AiSummary', () => {
  let component: AiSummary;
  let fixture: ComponentFixture<AiSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
