import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectDeclarationListComponent } from './reject-declaration-list.component';

describe('RejectDeclarationListComponent', () => {
  let component: RejectDeclarationListComponent;
  let fixture: ComponentFixture<RejectDeclarationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectDeclarationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectDeclarationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
