import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatePipelineFunnelComponent } from './candidate-pipeline-funnel.component';

describe('CandidatePipelineFunnelComponent', () => {
  let component: CandidatePipelineFunnelComponent;
  let fixture: ComponentFixture<CandidatePipelineFunnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidatePipelineFunnelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatePipelineFunnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
