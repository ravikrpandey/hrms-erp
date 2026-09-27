import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationActionComponent } from './depreciation-action.component';

describe('DepreciationActionComponent', () => {
  let component: DepreciationActionComponent;
  let fixture: ComponentFixture<DepreciationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepreciationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
