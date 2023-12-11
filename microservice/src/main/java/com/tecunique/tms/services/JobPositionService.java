package com.tecunique.tms.services;

import com.tecunique.tms.dto.JobPositionDto;
import com.tecunique.tms.entity.JobPosition;
import com.tecunique.tms.exceptions.ResourceNotFoundException;
import com.tecunique.tms.repository.JobPositionRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Data
@AllArgsConstructor
public class JobPositionService {

  public JobPositionRepository jobPositionRepository;
  public CandidateService candidateService;

  public List<JobPositionDto> getAllJobs(
      Integer pageNumber, Integer pageSize, String sortField, Sort.Direction sortOrder) {
    try {
      PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);
      Page<JobPosition> pageJobPositions = jobPositionRepository.findAll(pageRequest);
      List<JobPosition> jobPositions = pageJobPositions.getContent();

      return jobPositions.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    } catch (Exception e) {
      throw e;
    }
  }

  public void updateCandidateJobStatus(Long candidateId, String jobStatus) {
    Optional<JobPosition> jobsOptional = jobPositionRepository.findById(candidateId);

    if (jobsOptional.isPresent()) {
      JobPosition jobPosition = jobsOptional.get();
      jobPosition.setJobStatus(jobStatus);
      jobPositionRepository.save(jobPosition);
    } else {
      throw new EntityNotFoundException("Job Position not found");
    }
  }

  public JobPosition getJobPositionById(Long id) {
    return jobPositionRepository.findJobPositionById(id);
  }

  public JobPosition addJobPosition(JobPosition jobPosition) {
    try {
      return jobPositionRepository.save(jobPosition);
    } catch (Exception e) {
      throw e;
    }
  }

  @Transactional
  public void deleteJobPosition(Long jobId) {
    try {
      jobPositionRepository.deleteById(jobId);
      System.out.println(jobId);
    } catch (Exception e) {
      throw e;
    }
  }

  public JobPosition updateJobPosition(Long jobId, JobPosition updatedJobPosition) {
    JobPosition existingJobPosition =
        jobPositionRepository
            .findById(jobId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Job position not found for this id :: " + jobId));
    System.out.println(updatedJobPosition.getRequirements());

    existingJobPosition.setJobTitle(updatedJobPosition.getJobTitle());
    existingJobPosition.setHiringManagers(updatedJobPosition.getHiringManagers());
    existingJobPosition.setJobStatus(updatedJobPosition.getJobStatus());
    existingJobPosition.setRequirements(updatedJobPosition.getRequirements());
    existingJobPosition.setJobDescription(updatedJobPosition.getJobDescription());

    return jobPositionRepository.save(existingJobPosition);
  }

  public Long getTotalNumberOfRecords() {
    try {
      return jobPositionRepository.count();
    } catch (Exception e) {
      throw e;
    }
  }

  public JobPositionDto convertEntityToDto(JobPosition jobPosition) {
    JobPositionDto jobPositionDto = new JobPositionDto();

    jobPositionDto.setId(jobPosition.getId());
    jobPositionDto.setJobTitle(jobPosition.getJobTitle());
    jobPositionDto.setHiringManagers(jobPosition.getHiringManagers());
    jobPositionDto.setJobDescription(jobPosition.getJobDescription());
    jobPositionDto.setRequirements(jobPosition.getRequirements());
    jobPositionDto.setJobStatus(jobPosition.getJobStatus());

    return jobPositionDto;
  }
}
