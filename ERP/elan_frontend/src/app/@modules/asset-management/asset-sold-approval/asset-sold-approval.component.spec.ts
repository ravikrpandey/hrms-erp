import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSoldApprovalComponent } from './asset-sold-approval.component';

describe('AssetSoldApprovalComponent', () => {
  let component: AssetSoldApprovalComponent;
  let fixture: ComponentFixture<AssetSoldApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetSoldApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetSoldApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
