import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomStatusComponent } from './bom-status.component';

describe('BomStatusComponent', () => {
  let component: BomStatusComponent;
  let fixture: ComponentFixture<BomStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BomStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BomStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
