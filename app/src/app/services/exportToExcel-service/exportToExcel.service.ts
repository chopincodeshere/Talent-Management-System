import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExportToExcelService {
  constructor(private http: HttpClient) {}

  exportAllCandidatesData(): any {
    return this.http.get('candidates/export/AllCandidates', {
      responseType: 'arraybuffer',
    });
  }

  exportJobPositionsData(): any {
    return this.http.get('/candidates/export/JobPositions', {
      responseType: 'arraybuffer',
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  exportCandidateFeedbackData(): any {
    return this.http.get('/candidates/export/CandidateFeedback', {
      responseType: 'arraybuffer',
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  exportSampleExcelFile(): any {
    return this.http.get('/candidates/export/SampleExcel', {
      responseType: 'arraybuffer',
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>('/candidates/uploadExcel', formData);
  }
}
