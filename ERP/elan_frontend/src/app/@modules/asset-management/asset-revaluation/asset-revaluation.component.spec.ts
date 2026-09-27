import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRevaluationComponent } from './asset-revaluation.component';

describe('AssetRevaluationComponent', () => {
  let component: AssetRevaluationComponent;
  let fixture: ComponentFixture<AssetRevaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetRevaluationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetRevaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
