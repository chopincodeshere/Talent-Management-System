package com.tecunique.tms.repository;

import static org.junit.jupiter.api.Assertions.*;

import com.tecunique.tms.entity.JobPosition;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTestContextBootstrapper;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.BootstrapWith;

@DataJpaTest
@SpringBootTest
@ActiveProfiles("test")
@BootstrapWith(value = SpringBootTestContextBootstrapper.class)
public class JobPositionRepositoryTest {
  @Autowired private JobPositionRepository jobPositionRepository;

  @Autowired private TestEntityManager entityManager;

  private JobPosition jobPosition;

  @BeforeEach
  void setup() {
    jobPosition =
        JobPosition.builder()
            .jobTitle("Software Developer")
            .hiringManagers(new String[] {"Jaydeep Chhasatia", "Ankur Gupta"})
            .jobStatus("Open")
            .jobDescription(null)
            .build();
  }

  @Test
  @DisplayName("It should save Job Positions")
  void saveJobPosition() {
    JobPosition savedJobPosition = jobPositionRepository.save(jobPosition);
    assertNotNull(savedJobPosition.getId());
  }

  @Test
  void findJobPositionById() {
    JobPosition savedJobPosition = entityManager.persistAndFlush(jobPosition);
    JobPosition foundJobPosition =
        jobPositionRepository.findJobPositionById(savedJobPosition.getId());

    assertEquals(savedJobPosition.getId(), foundJobPosition.getId());
    assertEquals(savedJobPosition.getJobTitle(), foundJobPosition.getJobTitle());
    assertArrayEquals(savedJobPosition.getHiringManagers(), foundJobPosition.getHiringManagers());
    assertEquals(savedJobPosition.getJobStatus(), foundJobPosition.getJobStatus());
    assertEquals(savedJobPosition.getJobDescription(), foundJobPosition.getJobDescription());
  }

  @Test
  @DisplayName("It should delete Job Position by Id")
  void deleteJobPositionById() {
    JobPosition savedJobPosition = entityManager.persistAndFlush(jobPosition);
    jobPositionRepository.deleteById(savedJobPosition.getId());
    assertFalse(jobPositionRepository.existsById(savedJobPosition.getId()));
  }

  @Test
  @DisplayName("Find all Job Position by Id")
  void findAllJobPositionById() {
    JobPosition jobPosition1 =
        JobPosition.builder()
            .jobTitle("Project Manager")
            .hiringManagers(new String[] {"Jaydeep Chhasatia", "Ross Brown"})
            .jobStatus("Open")
            .jobDescription(null)
            .build();

    JobPosition jobPosition2 =
        JobPosition.builder()
            .jobTitle("HR Intern")
            .hiringManagers(new String[] {"Mohit More"})
            .jobStatus("Closed")
            .jobDescription(null)
            .build();

    entityManager.persistAndFlush(jobPosition1);
    entityManager.persistAndFlush(jobPosition2);

    List<JobPosition> jobPositions = jobPositionRepository.findAll();
    assertEquals(2, jobPositions.size());
  }
}
