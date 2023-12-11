import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { JobResponse } from 'src/app/core/models/JobResponse';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient) {}

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  public getJobs(
    pageSize: number = 5,
    pageIndex: number = 0,
    sortField: string = 'id',
    sortOrder: string = 'asc'
  ): Observable<JobResponse[]> {
    return this.http.get<JobResponse[]>(
      `/jobs?pageNumber=${pageIndex}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
  }

  public getJobById(jobId: number): Observable<JobResponse> {
    return this.http.get<JobResponse>(`/jobs/${jobId}`);
  }

  public postJob(jobPosition: JobResponse): Observable<JobResponse> {
    return this.http.post<JobResponse>(`/jobs/`, jobPosition);
  }

  public getTotalJobCount(): Observable<number> {
    return this.http
      .get<number>(`/jobs/count`)
      .pipe(catchError(this.handleError<number>('getTotalNumberOfRecords', 0)));
  }

  public getCandidateCountByJob(jobId: number): Observable<number> {
    return this.http
      .get<number>(`/candidates/${jobId}/count`)
      .pipe(catchError(this.handleError<number>('getTotalNumberOfRecords', 0)));
  }

  public updateJob(
    jobId: number,
    jobPosition: JobResponse
  ): Observable<JobResponse> {
    const url = `/jobs/${jobId}`;

    return this.http.put<JobResponse>(url, jobPosition).pipe(
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  public deleteJobPosition(jobId: number): Observable<void> {
    return this.http.delete<void>(`/jobs/${jobId}`);
  }
}
