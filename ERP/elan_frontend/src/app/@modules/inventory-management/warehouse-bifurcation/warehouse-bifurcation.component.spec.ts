import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseBifurcationComponent } from './warehouse-bifurcation.component';

describe('WarehouseBifurcationComponent', () => {
  let component: WarehouseBifurcationComponent;
  let fixture: ComponentFixture<WarehouseBifurcationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseBifurcationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseBifurcationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
