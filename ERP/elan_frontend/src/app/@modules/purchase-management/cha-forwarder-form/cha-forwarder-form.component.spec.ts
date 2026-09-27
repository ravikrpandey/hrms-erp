import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaForwarderFormComponent } from './cha-forwarder-form.component';

describe('ChaForwarderFormComponent', () => {
  let component: ChaForwarderFormComponent;
  let fixture: ComponentFixture<ChaForwarderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChaForwarderFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChaForwarderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
