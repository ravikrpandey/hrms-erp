import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedDeclarationListComponent } from './approved-declaration-list.component';

describe('ApprovedDeclarationListComponent', () => {
  let component: ApprovedDeclarationListComponent;
  let fixture: ComponentFixture<ApprovedDeclarationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedDeclarationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedDeclarationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
