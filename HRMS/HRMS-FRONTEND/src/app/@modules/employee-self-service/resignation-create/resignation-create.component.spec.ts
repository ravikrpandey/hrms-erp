import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationCreateComponent } from './resignation-create.component';

describe('ResignationCreateComponent', () => {
  let component: ResignationCreateComponent;
  let fixture: ComponentFixture<ResignationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResignationCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResignationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
