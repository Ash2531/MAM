import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PackageService, PackageInfo } from './package.service';

describe('PackageService', () => {
  let service: PackageService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PackageService]
    });
    service = TestBed.inject(PackageService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that there are no outstanding requests after each test
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve package info from assets/package.json', () => {
    const mockPackageInfo: PackageInfo = {
      name: 'test-project',
      version: '1.0.0',
      dependencies: {
        'some-lib': '^1.2.0'
      }
    };

    // Subscribe to the observable
    service.getPackageInfo().subscribe(packageInfo => {
      // Assert that the received package info matches the mock data
      expect(packageInfo).toEqual(mockPackageInfo);
    });

    // Expect one request to the package.json path
    const req = httpTestingController.expectOne('/assets/package.json');
    // Assert that the request method is GET
    expect(req.request.method).toBe('GET');

    // Respond to the request with the mock data
    req.flush(mockPackageInfo);
  });

  // You would add more tests here for other methods like getLatestVersion and getLibraryVersions
  // These tests would involve mocking HTTP requests to the npm registry URL
}); 