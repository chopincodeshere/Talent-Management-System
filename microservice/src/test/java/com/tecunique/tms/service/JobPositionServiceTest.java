package com.tecunique.tms.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.tecunique.tms.dto.JobPositionDto;
import com.tecunique.tms.entity.JobPosition;
import com.tecunique.tms.exceptions.ResourceNotFoundException;
import com.tecunique.tms.repository.JobPositionRepository;
import com.tecunique.tms.services.JobPositionService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class JobPositionServiceTest {
  @Mock private JobPositionRepository jobPositionRepository;
  @InjectMocks private JobPositionService jobPositionService;

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testGetAllJobs() {
    int pageNumber = 0;
    int pageSize = 10;
    String sortField = "id";
    Sort.Direction sortOrder = Sort.Direction.ASC;

    JobPosition job1 =
        JobPosition.builder().jobTitle("Software Developer").id(1L).jobStatus("Open").build();
    JobPosition job2 =
        JobPosition.builder().jobTitle("QA Engineer").id(2L).jobStatus("Closed").build();

    List<JobPosition> jobPositions = Arrays.asList(job1, job2);
    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);
    Page<JobPosition> pageJobPositions =
        new PageImpl<>(jobPositions, pageRequest, jobPositions.size());

    // Mock repository method
    when(jobPositionRepository.findAll(pageRequest)).thenReturn(pageJobPositions);

    // Call the service method
    List<JobPositionDto> result =
        jobPositionService.getAllJobs(pageNumber, pageSize, sortField, sortOrder);

    // Annotations
    assertEquals(jobPositions.size(), result.size());
    assertEquals(job1.getId(), result.get(0).getId());
    assertEquals(job1.getJobTitle(), result.get(0).getJobTitle());
    assertEquals(job1.getJobStatus(), result.get(0).getJobStatus());
    assertEquals(job2.getId(), result.get(1).getId());
    assertEquals(job2.getJobTitle(), result.get(1).getJobTitle());
    assertEquals(job2.getJobStatus(), result.get(1).getJobStatus());

    verify(jobPositionRepository).findAll(pageRequest);
  }

  @Test
  void testUpdateCandidateJobStatus() {
    // Prepare
    Long candidateId = 1L;
    String jobStatus = "Hired";

    JobPosition jobPosition = new JobPosition();
    jobPosition.setId(candidateId);

    when(jobPositionRepository.findById(candidateId)).thenReturn(Optional.of(jobPosition));

    // Execute
    jobPositionService.updateCandidateJobStatus(candidateId, jobStatus);

    // Verify
    assertEquals(jobStatus, jobPosition.getJobStatus());
    verify(jobPositionRepository).save(jobPosition);
  }

  @Test
  void testUpdateCandidateJobStatus_ThrowsEntityNotFoundException() {
    // Prepare
    Long candidateId = 1L;
    String jobStatus = "Hired";

    when(jobPositionRepository.findById(candidateId)).thenReturn(Optional.empty());

    // Execute and Verify
    assertThrows(
        EntityNotFoundException.class,
        () -> jobPositionService.updateCandidateJobStatus(candidateId, jobStatus));
    verify(jobPositionRepository, never()).save(any(JobPosition.class));
  }

  @Test
  void testGetJobPositionById() {
    // Prepare
    Long jobId = 1L;
    JobPosition jobPosition = new JobPosition();
    jobPosition.setId(jobId);
    when(jobPositionRepository.findJobPositionById(jobId)).thenReturn(jobPosition);

    // Execute
    JobPosition result = jobPositionService.getJobPositionById(jobId);

    // Verify
    assertEquals(jobId, result.getId());
    verify(jobPositionRepository).findJobPositionById(jobId);
  }

  @Test
  void testAddJobPosition() {
    // Prepare
    JobPosition jobPosition = new JobPosition();
    when(jobPositionRepository.save(jobPosition)).thenReturn(jobPosition);

    // Execute
    JobPosition result = jobPositionService.addJobPosition(jobPosition);

    // Verify
    assertEquals(jobPosition, result);
    verify(jobPositionRepository).save(jobPosition);
  }

  @Test
  void testDeleteJobPosition() {
    // Prepare
    Long jobId = 1L;

    // Execute
    assertDoesNotThrow(() -> jobPositionService.deleteJobPosition(jobId));

    // Verify
    verify(jobPositionRepository).deleteById(jobId);
  }

  @Test
  void testUpdateJobPosition() {
    // Prepare
    Long jobId = 1L;
    JobPosition existingJobPosition = new JobPosition();
    existingJobPosition.setId(jobId);
    existingJobPosition.setJobTitle("Job 1");
    existingJobPosition.setJobStatus("Open");

    JobPosition updatedJobPosition = new JobPosition();
    updatedJobPosition.setJobTitle("Updated Job");
    updatedJobPosition.setJobStatus("Closed");

    when(jobPositionRepository.findById(jobId)).thenReturn(Optional.of(existingJobPosition));
    when(jobPositionRepository.save(existingJobPosition)).thenReturn(existingJobPosition);

    // Execute
    JobPosition result = jobPositionService.updateJobPosition(jobId, updatedJobPosition);

    // Verify
    assertEquals(updatedJobPosition.getJobTitle(), result.getJobTitle());
    assertEquals(updatedJobPosition.getJobStatus(), result.getJobStatus());
    verify(jobPositionRepository).findById(jobId);
    verify(jobPositionRepository).save(existingJobPosition);
  }

  @Test
  void testUpdateJobPosition_ThrowsResourceNotFoundException() {
    // Prepare
    Long jobId = 1L;
    JobPosition updatedJobPosition = new JobPosition();
    updatedJobPosition.setJobTitle("Updated Job");
    updatedJobPosition.setJobStatus("Closed");

    when(jobPositionRepository.findById(jobId)).thenReturn(Optional.empty());

    // Execute and Verify
    assertThrows(
        ResourceNotFoundException.class,
        () -> jobPositionService.updateJobPosition(jobId, updatedJobPosition));
    verify(jobPositionRepository, never()).save(any(JobPosition.class));
  }

  @Test
  void testGetTotalNumberOfRecords() {
    // Prepare
    long totalRecords = 10L;
    when(jobPositionRepository.count()).thenReturn(totalRecords);

    // Execute
    Long result = jobPositionService.getTotalNumberOfRecords();

    // Verify
    assertEquals(totalRecords, result);
    verify(jobPositionRepository).count();
  }

  @Test
  void testConvertEntityToDto() {
    // Prepare
    JobPosition jobPosition = new JobPosition();
    jobPosition.setId(1L);
    jobPosition.setJobTitle("Job 1");
    jobPosition.setJobStatus("Open");

    // Execute
    JobPositionDto result = jobPositionService.convertEntityToDto(jobPosition);

    // Verify
    assertEquals(jobPosition.getId(), result.getId());
    assertEquals(jobPosition.getJobTitle(), result.getJobTitle());
    assertEquals(jobPosition.getJobStatus(), result.getJobStatus());
  }
}
