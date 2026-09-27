import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetWriteOffApprovalComponent } from './asset-write-off-approval.component';

describe('AssetWriteOffApprovalComponent', () => {
  let component: AssetWriteOffApprovalComponent;
  let fixture: ComponentFixture<AssetWriteOffApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetWriteOffApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetWriteOffApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
