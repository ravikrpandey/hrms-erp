import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupWarehouseBifurcationComponent } from './setup-warehouse-bifurcation.component';

describe('SetupWarehouseBifurcationComponent', () => {
  let component: SetupWarehouseBifurcationComponent;
  let fixture: ComponentFixture<SetupWarehouseBifurcationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupWarehouseBifurcationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupWarehouseBifurcationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
