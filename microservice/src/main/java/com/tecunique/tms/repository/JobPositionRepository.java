package com.tecunique.tms.repository;

import com.tecunique.tms.entity.JobPosition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobPositionRepository extends JpaRepository<JobPosition, Long> {
  JobPosition findJobPositionById(Long id);

  @Override
  void deleteById(Long id);
}
