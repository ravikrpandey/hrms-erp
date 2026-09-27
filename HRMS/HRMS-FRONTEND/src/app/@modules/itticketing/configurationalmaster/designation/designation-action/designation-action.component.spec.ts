import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationActionComponent } from './designation-action.component';

describe('DesignationActionComponent', () => {
  let component: DesignationActionComponent;
  let fixture: ComponentFixture<DesignationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
