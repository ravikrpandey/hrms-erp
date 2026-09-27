import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRootPodComponent } from './delivery-root-pod.component';

describe('DeliveryRootPodComponent', () => {
  let component: DeliveryRootPodComponent;
  let fixture: ComponentFixture<DeliveryRootPodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryRootPodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryRootPodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
