import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthCallbackComponent } from './auth-callback.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthCallbackComponent', () => {
  let component: AuthCallbackComponent;
  let fixture: ComponentFixture<AuthCallbackComponent>;

  beforeEach(async () => {
    // Mock window.crypto for testing
    Object.defineProperty(window, 'crypto', {
      value: {
        subtle: {
          digest: jest.fn()
        }
      }
    });

    await TestBed.configureTestingModule({
      imports: [
        AuthCallbackComponent,
        HttpClientModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
