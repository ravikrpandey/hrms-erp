import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagementDialogueComponent } from './store-management-dialogue.component';

describe('StoreManagementDialogueComponent', () => {
  let component: StoreManagementDialogueComponent;
  let fixture: ComponentFixture<StoreManagementDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreManagementDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreManagementDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
