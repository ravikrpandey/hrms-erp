import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAllotmentCompAction } from './asset-allotment-comp-action';

describe('AssetAllotmentCompAction', () => {
  let component: AssetAllotmentCompAction;
  let fixture: ComponentFixture<AssetAllotmentCompAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAllotmentCompAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAllotmentCompAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
