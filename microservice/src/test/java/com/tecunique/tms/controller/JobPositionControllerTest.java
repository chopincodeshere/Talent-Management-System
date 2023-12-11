package com.tecunique.tms.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.tecunique.tms.dto.JobPositionDto;
import com.tecunique.tms.services.JobPositionService;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class JobPositionControllerTest {

  @Mock private JobPositionService jobPositionService;
  @InjectMocks private JobPositionController jobPositionController;

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testGetTotalNumberOfRecords() {
    Long totalRecords = 10L;
    when(jobPositionService.getTotalNumberOfRecords()).thenReturn(totalRecords);

    ResponseEntity<Long> response = jobPositionController.getTotalNumberOfRecords();

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(totalRecords, response.getBody());
    verify(jobPositionService, times(1)).getTotalNumberOfRecords();
  }

  @Test
  void testGetAllJobs() {
    Integer pageNumber = 0;
    Integer pageSize = 20;
    String sortField = "id";
    String sortOrder = "ASC";
    Sort.Direction sortDirection = Sort.Direction.ASC;
    List<JobPositionDto> jobPositions = new ArrayList<>();
    jobPositions.add(new JobPositionDto());

    when(jobPositionService.getAllJobs(pageNumber, pageSize, sortField, sortDirection))
        .thenReturn(jobPositions);

    ResponseEntity<List<JobPositionDto>> response =
        jobPositionController.getAllJobs(pageNumber, pageSize, sortField, sortOrder);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(jobPositions, response.getBody());
    verify(jobPositionService, times(1)).getAllJobs(pageNumber, pageSize, sortField, sortDirection);
  }

  @Test
  void testGetAllJobsException() {
    Integer pageNumber = 0;
    Integer pageSize = 20;
    String sortField = "id";
    String sortOrder = "ASC";
    Sort.Direction sortDirection = Sort.Direction.ASC;

    when(jobPositionService.getAllJobs(pageNumber, pageSize, sortField, sortDirection))
        .thenThrow(new RuntimeException());

    try {
      jobPositionController.getAllJobs(pageNumber, pageSize, sortField, sortOrder);
    } catch (Exception e) {
      assertEquals(RuntimeException.class, e.getClass());
    }

    verify(jobPositionService, times(1)).getAllJobs(pageNumber, pageSize, sortField, sortDirection);
  }
}
