import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSaleWriteoffFormComponent } from './asset-sale-writeoff-form.component';

describe('AssetSaleWriteoffFormComponent', () => {
  let component: AssetSaleWriteoffFormComponent;
  let fixture: ComponentFixture<AssetSaleWriteoffFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetSaleWriteoffFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetSaleWriteoffFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
