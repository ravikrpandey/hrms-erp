import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRevaluationFormComponent } from './asset-revaluation-form.component';

describe('AssetRevaluationFormComponent', () => {
  let component: AssetRevaluationFormComponent;
  let fixture: ComponentFixture<AssetRevaluationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetRevaluationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetRevaluationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
