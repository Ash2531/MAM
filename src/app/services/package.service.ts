import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface PackageInfo {
  name: string;
  version: string;
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
}

export interface LibraryVersion {
  name: string;
  oldVersion?: string;
  newVersion: string;
  hasUpdate?: boolean;
}

export interface NpmPackageInfo {
  'dist-tags': {
    latest: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private npmRegistryUrl = '/api/npm-registry';

  constructor(private http: HttpClient) {}

  getPackageInfo(): Observable<PackageInfo> {
    return this.http.get<PackageInfo>('/assets/package.json');
  }

  getLatestVersion(packageName: string): Observable<string> {
    return this.http.get<NpmPackageInfo>(`${this.npmRegistryUrl}/${packageName}`).pipe(
      map(info => info['dist-tags'].latest),
      catchError(() => of('unknown'))
    );
  }

  getLibraryVersions(): Observable<LibraryVersion[]> {
    return this.getPackageInfo().pipe(
      switchMap(pkg => {
        const allDeps = {
          ...pkg.dependencies,
          ...pkg.devDependencies
        };

        // Define the libraries we want to track
        const trackedLibraries = [
          '@angular/material',
          '@ngx-translate/core',
          'tailwindcss',
          'date-fns',
          'keycloak-js',
          'shaka-player',
          'rxjs',
          'eslint',
          'jose'
        ];

        const initialLibraries = trackedLibraries.map(libName => {
          const currentVersion = allDeps[libName]?.replace('^', '') || '-';
          return {
            name: libName,
            oldVersion: currentVersion,
            newVersion: 'Checking...'
          };
        });

        // Create an array of observables for fetching latest versions
        const versionChecks = initialLibraries.map(lib => 
          this.getLatestVersion(lib.name).pipe(
            map(latestVersion => ({
              ...lib,
              newVersion: latestVersion,
              hasUpdate: latestVersion !== 'unknown' && 
                        latestVersion !== lib.oldVersion
            }))
          )
        );

        // Return a new observable that combines all version checks
        return forkJoin(versionChecks);
      })
    );
  }
} 