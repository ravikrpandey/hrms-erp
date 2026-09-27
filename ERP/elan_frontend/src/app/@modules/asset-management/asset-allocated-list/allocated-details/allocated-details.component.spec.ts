import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedDetailsComponent } from './allocated-details.component';

describe('AllocatedDetailsComponent', () => {
  let component: AllocatedDetailsComponent;
  let fixture: ComponentFixture<AllocatedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocatedDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocatedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
