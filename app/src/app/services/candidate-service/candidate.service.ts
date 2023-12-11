import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Candidate } from '../../core/models/candidate';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';
import { CandidateFeedback } from 'src/app/core/models/CandidateFeedback';

import { Page } from 'src/app/core/models/page';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private http: HttpClient) {}

  public getTotalNumberOfRecords(): Observable<number> {
    return this.http
      .get<number>(`candidates/count`)
      .pipe(catchError(this.handleError<number>('getTotalNumberOfRecords', 0)));
  }

  getResumeFileById(id: number): Observable<Blob> {
    const url = `candidates/resume/${id}`;
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  public getNumberOfShortlistedCandidates(): Observable<number> {
    return this.http
      .get<number>(`candidates/count/shortlisted`)
      .pipe(
        catchError(
          this.handleError<number>('getNumberOfShortlistedCandidates', 0)
        )
      );
  }

  public getNumberOfHiredCandidates(): Observable<number> {
    return this.http
      .get<number>(`candidates/count/hired`)
      .pipe(
        catchError(this.handleError<number>('getNumberOfHiredCandidates', 0))
      );
  }

  public getNumberOfRejectedCandidates(): Observable<number> {
    return this.http
      .get<number>(`candidates/count/rejected`)
      .pipe(
        catchError(this.handleError<number>('getNumberOfrejectedCandidates', 0))
      );
  }

  public getNumberOfOnHoldCandidates(): Observable<number> {
    return this.http
      .get<number>(`candidates/count/on-hold`)
      .pipe(
        catchError(this.handleError<number>('getNumberOfOnHoldCandidates', 0))
      );
  }

  public getNumberOfInactiveCandidates(): Observable<number> {
    return this.http
      .get<number>(`candidates/count/inactive`)
      .pipe(
        catchError(this.handleError<number>('getNumberOfInactiveCandidates', 0))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  public getCandidates(
    pageNumber: number,
    pageSize: number = 10,
    sortField: string = 'asc',
    sortOrder: string
  ): Observable<CandidateResponse[]> {
    return this.http
      .get<CandidateResponse[]>(
        `candidates?pageNumber=${pageNumber}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
      )
      .pipe(
        catchError(this.handleError<CandidateResponse[]>('getCandidates', []))
      );
  }

  public getCandidateById(candidateId: number): Observable<Candidate> {
    return this.http.get<Candidate>(`/candidates/${candidateId}`);
  }

  public addCandidate(candidate: Candidate): Observable<Candidate> {
    return this.http.post<Candidate>(`/candidates/`, candidate);
  }

  public updateCandidate(
    candidate: Candidate,
    candidateId: number
  ): Observable<Candidate> {
    return this.http.put<Candidate>(`/candidates/${candidateId}`, candidate);
  }

  public deleteCandidate(candidateId: number): Observable<void> {
    return this.http.delete<void>(`/candidates/${candidateId}`);
  }

  public addInterviewerNote(
    note: string,
    candidateId: number
  ): Observable<any> {
    const url = `/candidates/${candidateId}/note`;

    return this.http.put(url, note).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

 

  public getCandidatesByJobPosition(
    jobId: number,
    pageNumber: number,
    pageSize: number,
    sortField: string = 'asc',
    sortOrder: string
  ): Observable<CandidateResponse[]> {
    return this.http.get<CandidateResponse[]>(
      `/candidates/job/${jobId}?&pageNumber=${pageNumber}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
    );
  }

  public getCandidateByJobAndKeywords(
    jobId: number,
    keywords: string[],
    pageIndex: number,
    pageSize: number
  ): Observable<CandidateResponse[]> {
    const searchKeywords = keywords?.join(',');
    return this.http.get<CandidateResponse[]>(
      `/candidates/search/${jobId}?keywords=${searchKeywords}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }

  public getCandidateByJobAndFilters(
    jobId: number,
    params: URLSearchParams,
    pageIndex?: number,
    pageSize?: number,
    sortField?: string,
    sortDirection?: string
  ): Observable<CandidateResponse[]> {
    console.log(params);
    
    return this.http.get<CandidateResponse[]>(
      `/candidates/${jobId}/filter?${params.toString()}&pageIndex=${pageIndex}&pageSize=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}`
    );
  }

  public getCandidateName(candidateId: number): Observable<string> {
    return this.http
      .get(`/candidates/name/${candidateId}`, { responseType: 'text' })
      .pipe(map((response) => response.trim()));
  }

  public getCandidatePosition(candidateId: number): Observable<number> {
    return this.http.get<number>(`/candidates/position/${candidateId}`);
  }

  public addCandidateFeedback(
    candidateId: number,
    feedback: CandidateFeedback
  ): Observable<CandidateFeedback> {
    const url = `/candidates/${candidateId}/feedback/add`;
    return this.http.post<CandidateFeedback>(url, feedback);
  }

  public getCandidateFeedback(
    candidateId: number
  ): Observable<CandidateFeedback[]> {
    return this.http
      .get<CandidateFeedback[]>(`/candidates/candidateFeedback/${candidateId}`)
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  public updateCandidateRound(
    candidateId: number,
    round: number
  ): Observable<any> {
    console.log(round);

    return this.http.put(`/candidates/${candidateId}/round`, round).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  public updateCandidateStage(
    candidateId: number,
    stage: string
  ): Observable<any> {
    const url = `/candidates/${candidateId}/stage`;

    return this.http.put(url, stage);
  }

  public getCandidatesWithStage(
    stage: number,
    pageNumber: number,
    pageSize: number,
    sortField: string = 'asc',
    sortOrder: string
  ): Observable<CandidateResponse[]> {
    const url = `/candidates/stage/${stage}?&pageNumber=${pageNumber}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`;

    return this.http.get<CandidateResponse[]>(url);
  }

  public getCandidatesWithStageAndKeywords(
    stage: number,
    keywords: string[],
    pageIndex: number,
    pageSize: number
  ): Observable<CandidateResponse[]> {
    const searchKeywords = keywords?.join(',');
    const url = `/candidates/search/stage/${stage}?keywords=${searchKeywords}&pageIndex=${pageIndex}&pageSize=${pageSize}`;

    return this.http.get<CandidateResponse[]>(url);
  }

  public getCandidatesWithStageAndFilters(
    stage: number,
    pageIndex: number,
    pageSize: number,
    params: URLSearchParams
  ): Observable<Page<CandidateResponse>> {
    const url = `/candidates/filter/stage/${stage}?${params.toString()}&pageIndex=${pageIndex}&pageSize=${pageSize}`;

    return this.http.get<Page<CandidateResponse>>(url);
  }
}
