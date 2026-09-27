import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferNodeActionComponent } from './asset-transfer-node-action.component';

describe('AssetTransferNodeActionComponent', () => {
  let component: AssetTransferNodeActionComponent;
  let fixture: ComponentFixture<AssetTransferNodeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetTransferNodeActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransferNodeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
