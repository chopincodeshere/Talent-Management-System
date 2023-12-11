package com.tecunique.tms.controller;

import com.tecunique.tms.dto.JobPositionDto;
import com.tecunique.tms.entity.JobPosition;
import com.tecunique.tms.services.JobPositionService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.zip.GZIPOutputStream;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/jobs")
@Data
@AllArgsConstructor
public class JobPositionController {
  private JobPositionService jobPositionService;

  @GetMapping("/count")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Long> getTotalNumberOfRecords() {
    try {
      Long count = jobPositionService.getTotalNumberOfRecords();
      return new ResponseEntity<>(count, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<List<JobPositionDto>> getAllJobs(
      @RequestParam(value = "pageNumber", defaultValue = "0") Integer pageNumber,
      @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize,
      @RequestParam(value = "sortField", defaultValue = "id") String sortField,
      @RequestParam(value = "sortOrder", defaultValue = "ASC") String sortOrder) {
    try {
      Sort.Direction direction =
          sortOrder.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
      List<JobPositionDto> jobPositions =
          jobPositionService.getAllJobs(pageNumber, pageSize, sortField, direction);

      if (jobPositions.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }
      return new ResponseEntity<>(jobPositions, HttpStatus.OK);
    } catch (Exception e) {
      throw e;
    }
  }

  @GetMapping("/{jobId}")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<JobPositionDto> getJobById(@PathVariable Long jobId) {
    try {
      JobPositionDto jobPositionDto =
          jobPositionService.convertEntityToDto(jobPositionService.getJobPositionById(jobId));
      return new ResponseEntity<JobPositionDto>(jobPositionDto, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }
  }

  @PostMapping("/")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<JobPosition> addJobPosition(
      @RequestParam(name = "pdfFile", required = false) MultipartFile pdfFile,
      @RequestBody JobPosition jobPosition) {
    try {
      System.out.println(jobPosition);

      if (pdfFile != null) {
        byte[] compressedBytes = compressFile(pdfFile.getBytes());
        jobPosition.setJobDescription(compressedBytes);
      }
      return new ResponseEntity<>(
          jobPositionService.addJobPosition(jobPosition), HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
  }

  private byte[] compressFile(byte[] fileBytes) throws IOException {
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    try (GZIPOutputStream gzipOutputStream = new GZIPOutputStream(byteArrayOutputStream)) {
      gzipOutputStream.write(fileBytes);
    }
    return byteArrayOutputStream.toByteArray();
  }

  @PutMapping("/{jobId}")
  @RolesAllowed({"ROLE_ADMIN"})
  public ResponseEntity<JobPosition> updateJobPosition(
      @PathVariable Long jobId, @RequestBody JobPosition updatedJobPosition) {

    JobPosition updatedPosition = jobPositionService.updateJobPosition(jobId, updatedJobPosition);
    return ResponseEntity.ok(updatedPosition);
  }

  @PutMapping("/{jobId}/jobStatus")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<Void> updateCandidateStage(
      @PathVariable Long jobId, @RequestBody String jobStatus) {
    jobPositionService.updateCandidateJobStatus(jobId, jobStatus);
    return ResponseEntity.ok().build();
  }

  @Transactional
  @DeleteMapping("/{jobId}")
  @RolesAllowed({"ROLE_ADMIN"})
  public ResponseEntity<?> deleteJobPosition(@PathVariable Long jobId) {
    try {
      jobPositionService.deleteJobPosition(jobId);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
  }
}
