import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAllotmentComponent } from './asset-allotment-component';

describe('AssetAllotmentComponent', () => {
  let component: AssetAllotmentComponent;
  let fixture: ComponentFixture<AssetAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAllotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
