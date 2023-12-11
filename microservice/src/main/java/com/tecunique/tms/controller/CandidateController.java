package com.tecunique.tms.controller;

import com.tecunique.tms.dto.CandidateDetailsDto;
import com.tecunique.tms.entity.CandidateFeedback;
import com.tecunique.tms.entity.Candidates;
import com.tecunique.tms.entity.JobPosition;
import com.tecunique.tms.exceptions.ResourceNotFoundException;
import com.tecunique.tms.repository.CandidateFeedbackRepository;
import com.tecunique.tms.services.CandidateService;
import com.tecunique.tms.services.CandidatesExcelExporter;
import com.tecunique.tms.services.JobPositionService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import lombok.AllArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/candidates")
@AllArgsConstructor
public class CandidateController {
  private CandidateService candidateService;
  private JobPositionService jobPositionService;

  @Autowired private CandidateFeedbackRepository candidateFeedbackRepository;

  @GetMapping("/count")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Long> getTotalNumberOfRecords() {
    try {
      Long count = candidateService.getTotalNumberOfRecords();
      return new ResponseEntity<>(count, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<List<CandidateDetailsDto>> getAllCandidatesDto(
      @RequestParam(value = "pageNumber", defaultValue = "0") Integer pageNumber,
      @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
      @RequestParam(value = "sortField", defaultValue = "id") String sortField,
      @RequestParam(value = "sortOrder", defaultValue = "ASC") String sortOrder) {

    try {
      Sort.Direction direction =
          sortOrder.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
      List<CandidateDetailsDto> list =
          candidateService.getAllCandidates(pageNumber, pageSize, sortField, direction);

      if (list.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }

      return new ResponseEntity<>(list, HttpStatus.OK);
    } catch (Exception e) {
      System.out.println(e);
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/search")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<List<CandidateDetailsDto>> searchCandidates(
      @RequestParam String[] keywords,
      @RequestParam(value = "page", defaultValue = "1") int pageNumber,
      @RequestParam(value = "size", defaultValue = "10") int pageSize) {
    try {
      System.out.println(Arrays.toString(keywords));
      List<CandidateDetailsDto> candidates =
          candidateService.searchCandidates(keywords, pageNumber, pageSize);
      return new ResponseEntity<>(candidates, HttpStatus.OK);
    } catch (Exception e) {
      System.out.println(e);
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/search/{jobId}")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<List<CandidateDetailsDto>> searchCandidatesByKeywordAndJobId(
      @RequestParam String[] keywords,
      @PathVariable("jobId") Long jobId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    try {
      List<CandidateDetailsDto> candidates =
          candidateService.findByKeywordAndJobId(keywords, jobId, page, size);
      return new ResponseEntity<>(candidates, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/filter")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<List<CandidateDetailsDto>>
      searchCandidatesByCurrentCTCAndLocationAndTotalExperience(
          @RequestParam(value = "location", required = false) String[] location,
          @RequestParam(value = "minCtc", required = false) Integer minCurrentCTC,
          @RequestParam(value = "maxCtc", required = false) Integer maxCurrentCTC,
          @RequestParam(value = "experience", required = false) Integer totalExperience,
          @RequestParam(value = "pageIndex", defaultValue = "0") int page,
          @RequestParam(value = "pageSize", defaultValue = "10") int size) {
    try {
      int minCtc = minCurrentCTC != null ? minCurrentCTC : 0;
      int maxCtc = maxCurrentCTC != null ? maxCurrentCTC : 100;
      int experience = totalExperience != null ? totalExperience : 0;

      Page<CandidateDetailsDto> candidatesPage =
          candidateService.findCandidatesByLocationAndCtcAndExperience(
              location, minCtc, maxCtc, experience, page, size);

      return new ResponseEntity<>(candidatesPage.getContent(), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/{jobId}/filter")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<Page<CandidateDetailsDto>> findCandidatesByFilters(
      @RequestParam(required = false) String[] location,
      @RequestParam(required = false) Integer minCtc,
      @RequestParam(required = false) Integer maxCtc,
      @RequestParam(required = false) Integer experience,
      @PathVariable Long jobId,
      @RequestParam(value = "pageIndex", defaultValue = "0") int page,
      @RequestParam(value = "pageSize", defaultValue = "10") int size,
      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
      @RequestParam(value = "sortOrder", defaultValue = "asc") String sortOrder) {

    Pageable pageable =
        PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortOrder), sortBy));

    Page<CandidateDetailsDto> candidatePage =
        candidateService.findCandidatesByLocationAndCtcAndExperienceAndJobPosition(
            location,
            minCtc,
            maxCtc,
            experience,
            jobPositionService.getJobPositionById(jobId),
            pageable);

    return ResponseEntity.ok(candidatePage);
  }

  @GetMapping("/job/{jobId}")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<List<CandidateDetailsDto>> getCandidatesByJobId(
      @PathVariable Long jobId,
      @RequestParam(value = "pageNumber", defaultValue = "0") Integer pageNumber,
      @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
      @RequestParam(value = "sortField", defaultValue = "id") String sortField,
      @RequestParam(value = "sortOrder", defaultValue = "ASC") String sortOrder)
      throws Exception {
    Sort.Direction direction =
        sortOrder.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
    JobPosition jobPosition = jobPositionService.getJobPositionById(jobId);
    if (jobPosition == null) {
      return ResponseEntity.notFound().build();
    }

    List<CandidateDetailsDto> candidates =
        candidateService.getCandidatesByJobPosition(
            jobPosition, pageNumber, pageSize, sortField, direction);
    return ResponseEntity.ok(candidates);
  }

  @GetMapping("/{jobId}/count")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Long> getCountOfJob(@PathVariable Long jobId) {
    try {
      Long count = candidateService.getNumberOfCandidatesByJobId(jobId);

      return new ResponseEntity<>(count, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/name/{candidateId}")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<String> getCandidateName(@PathVariable Long candidateId) {
    try {
      return new ResponseEntity<String>(
          candidateService.getCandidateByName(candidateId), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/position/{candidateId}")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Long> getCandidatePosition(@PathVariable Long candidateId) {
    try {
      return new ResponseEntity<Long>(
          candidateService.getCandidateByPosition(candidateId), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/{candidateId}")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Candidates> getCandidateById(@PathVariable Long candidateId) {
    try {
      return new ResponseEntity<>(candidateService.getCandidateById(candidateId), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/resume/{id}")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<ByteArrayResource> getResumeFileById(@PathVariable Long id)
      throws ResourceNotFoundException {
    byte[] resumeFile = candidateService.getResumeFileById(id);

    if (resumeFile == null) {
      return ResponseEntity.notFound().build();
    }

    String contentType = determineContentType(resumeFile);

    ByteArrayResource resource = new ByteArrayResource(resumeFile);

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .contentLength(resource.contentLength())
        .body(resource);
  }

  private String determineContentType(byte[] fileContent) {
    Tika tika = new Tika();

    try {
      String mimeType = tika.detect(fileContent);

      if (mimeType.equals("application/pdf")) {
        return "application/pdf";
      } else if (mimeType.equals("application/msword")) {
        return "application/msword";
      } else if (mimeType.equals("image/jpeg")) {
        return "image/jpeg";
      } else if (mimeType.equals("image/png")) {
        return "image/png";
      } else {
        throw new IllegalArgumentException("Unsupported file format");
      }
    } catch (Exception e) {
      throw new RuntimeException("Failed to determine content type", e);
    }
  }

  // create
  @PostMapping("/")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<Candidates> addCandidate(
      @Valid @RequestParam(name = "pdfFile", required = false) MultipartFile pdfFile,
      @RequestBody Candidates candidate) {
    try {
      if (pdfFile != null && !pdfFile.isEmpty()) {
        // If a PDF file is uploaded, save it to the database
        candidate.setResume(pdfFile.getBytes());
      }

      return new ResponseEntity<>(candidateService.addCandidate(candidate), HttpStatus.CREATED);
    } catch (Exception e) {
      System.out.println(e);
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
  }

  @PostMapping("/{candidateId}/feedback/add")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<CandidateFeedback> addCandidateFeedback(
      @PathVariable("candidateId") Long candidateId,
      @RequestBody CandidateFeedback candidateFeedback) {
    CandidateFeedback savedFeedback =
        candidateService.addCandidateFeedback(candidateId, candidateFeedback);
    return ResponseEntity.ok(savedFeedback);
  }

  @PutMapping("/{candidateId}/note")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<Void> updateCandidateNote(
      @PathVariable Long candidateId, @RequestBody String note) {
    candidateService.addInterviewerNote(candidateId, note);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/{candidateId}/round")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Void> updateCandidateRound(
      @PathVariable Long candidateId, @RequestBody Integer round) {
    candidateService.updateRound(candidateId, round);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/{candidateId}/stage")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Void> updateCandidateStage(
      @PathVariable Long candidateId, @RequestBody String stage) {
    candidateService.updateStage(candidateId, stage);
    return ResponseEntity.ok().build();
  }

  // delete
  @Transactional
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<?> deleteCandidate(@PathVariable("id") Long id) {
    try {
      candidateService.deleteCandidate(id);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
  }

  // update
  @Modifying
  @Transactional
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<Candidates> updateCandidate(
      @PathVariable(value = "id") Long candidateId,
      @Valid @RequestBody Candidates candidateDetails) {
    try {
      Candidates updatedCandidate = candidateService.updateCandidate(candidateId, candidateDetails);
      return ResponseEntity.ok(updatedCandidate);
    } catch (ResourceNotFoundException e) {
      return ResponseEntity.notFound().build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/count/shortlisted")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Integer> getNumberOfShortlistedCandidates() {
    try {
      Integer count = candidateService.getNumberOfShortlistedCandidates();
      return new ResponseEntity<Integer>(count, HttpStatus.OK);
    } catch (Exception e) {
      throw e;
    }
  }

  @GetMapping("/count/hired")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Integer> getNumberOfHiredCandidates() {
    try {
      Integer count = candidateService.getNumberOfHiredCandidates();
      return new ResponseEntity<Integer>(count, HttpStatus.OK);
    } catch (Exception e) {
      throw e;
    }
  }

  @GetMapping("/count/rejected")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Integer> getNumberOfRejectedCandidates() {
    try {
      Integer count = candidateService.getNumberOfRejectedCandidates();
      return new ResponseEntity<Integer>(count, HttpStatus.OK);
    } catch (Exception e) {
      throw e;
    }
  }

  @GetMapping("/count/on-hold")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Integer> getNumberOfOnHoldCandidates() {
    try {
      Integer count = candidateService.getNumberOfOnHoldCandidates();
      return new ResponseEntity<Integer>(count, HttpStatus.OK);
    } catch (Exception e) {
      throw e;
    }
  }

  @GetMapping("/count/inactive")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Integer> getNumberOfInactiveCandidates() {
    try {
      Integer count = candidateService.getNumberOfInactiveCandidates();
      return new ResponseEntity<Integer>(count, HttpStatus.OK);
    } catch (Exception e) {
      throw e;
    }
  }

  @GetMapping("/stage/{key}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<List<CandidateDetailsDto>> getCandidatesWithStage(
      @PathVariable Integer key,
      @RequestParam(value = "pageNumber", defaultValue = "0") Integer pageNumber,
      @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize,
      @RequestParam(value = "sortField", defaultValue = "id") String sortField,
      @RequestParam(value = "sortOrder", defaultValue = "ASC") String sortOrder) {
    try {
      Sort.Direction direction =
          sortOrder.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
      List<CandidateDetailsDto> list =
          candidateService.getCandidatesWithStage(key, pageNumber, pageSize, sortField, direction);

      if (list.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }

      return new ResponseEntity<>(list, HttpStatus.OK);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/search/stage/{key}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<List<CandidateDetailsDto>> searchCandidatesByKeywordAndStage(
      @RequestParam String[] keywords,
      @PathVariable("key") Integer key,
      @RequestParam(value = "pageIndex", defaultValue = "0") int page,
      @RequestParam(value = "pageSize", defaultValue = "10") int size) {
    try {
      List<CandidateDetailsDto> candidatesPage =
          candidateService.getCandidatesWithStageAndKeywords(keywords, key, page, size);
      return new ResponseEntity<>(candidatesPage, HttpStatus.OK);
    } catch (Exception e) {
      System.out.println(e);
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/filter/stage/{key}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<Page<CandidateDetailsDto>> searchCandidatesByStageAndFilters(
      @RequestParam(required = false) String[] location,
      @RequestParam(required = false, defaultValue = "0") Integer minCtc,
      @RequestParam(required = false, defaultValue = "100") Integer maxCtc,
      @RequestParam(required = false, defaultValue = "0") Integer experience,
      @PathVariable Integer key,
      @RequestParam(value = "pageIndex", defaultValue = "0") int page,
      @RequestParam(value = "pageSize", defaultValue = "10") int size) {
    try {
      Pageable pageable = PageRequest.of(page, size);
      Page<CandidateDetailsDto> candidateDtoPage =
          candidateService.findCandidatesByLocationAndCtcAndExperienceAndStage(
              location, minCtc, maxCtc, experience, key, pageable);
      return ResponseEntity.ok(candidateDtoPage);
    } catch (ResourceNotFoundException e) {
      // Handle the specific exception for "ResourceNotFoundException"
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }

  @GetMapping("/getAll")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<List<Candidates>> findAllCandidates() {
    List<Candidates> candidates = candidateService.findAllCandidates();

    return new ResponseEntity<>(candidates, HttpStatus.OK);
  }

  @GetMapping(value = "/export/AllCandidates", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<byte[]> exportAllCandidatesDataAsExcel() throws IOException {

    List<Candidates> candidates = candidateService.findAllCandidates();
    ByteArrayOutputStream outputStream = CandidatesExcelExporter.exportDataToExcel(candidates);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.setContentDispositionFormData("attachment", "Data.xlsx");

    return ResponseEntity.ok().headers(headers).body(outputStream.toByteArray());
  }

  @GetMapping(value = "/export/JobPositions", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<byte[]> exportJobPositionsToExcel() {
    try {
      List<JobPosition> jobPositions = jobPositionService.getJobPositionRepository().findAll();

      byte[] excelData =
          CandidatesExcelExporter.exportJobPositionToExcel(jobPositions).toByteArray();

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
      headers.setContentDispositionFormData("attachment", "job_positions.xlsx");

      return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping(
      value = "/export/CandidateFeedback",
      produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<byte[]> exportCandidateFeedbackToExcel() {
    try {
      List<CandidateFeedback> feedbackList = candidateFeedbackRepository.findAll();

      byte[] excelData =
          CandidatesExcelExporter.exportCandidateFeedbackToExcel(feedbackList).toByteArray();

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
      headers.setContentDispositionFormData("attachment", "candidate_feedback.xlsx");

      return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
    } catch (IOException e) {
      // Handle exception and return error response
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } catch (NullPointerException e) {
      // Handle null values and return error response
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping(value = "/export/SampleExcel", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<byte[]> exportSampleExcel() {
    try {
      byte[] excelData = CandidatesExcelExporter.exportSampleExcel().toByteArray();

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
      headers.setContentDispositionFormData("attachment", "sample_excel.xlsx");
      return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
