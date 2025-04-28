import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockAuthRedirectComponent } from './mock-auth-redirect.component';

describe('MockAuthRedirectComponent', () => {
  let component: MockAuthRedirectComponent;
  let fixture: ComponentFixture<MockAuthRedirectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockAuthRedirectComponent]
    });
    fixture = TestBed.createComponent(MockAuthRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
