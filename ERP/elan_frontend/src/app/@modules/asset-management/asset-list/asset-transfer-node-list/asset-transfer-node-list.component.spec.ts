import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferNodeListComponent } from './asset-transfer-node-list.component';

describe('AssetTransferNodeListComponent', () => {
  let component: AssetTransferNodeListComponent;
  let fixture: ComponentFixture<AssetTransferNodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetTransferNodeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTransferNodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
