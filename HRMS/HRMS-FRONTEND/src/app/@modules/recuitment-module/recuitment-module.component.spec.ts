import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuitmentModuleComponent } from './recuitment-module.component';

describe('RecuitmentModuleComponent', () => {
  let component: RecuitmentModuleComponent;
  let fixture: ComponentFixture<RecuitmentModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecuitmentModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuitmentModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
