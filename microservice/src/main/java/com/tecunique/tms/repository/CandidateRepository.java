package com.tecunique.tms.repository;

import com.tecunique.tms.entity.Candidates;
import com.tecunique.tms.entity.JobPosition;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CandidateRepository extends JpaRepository<Candidates, Long> {

  Optional<Candidates> findCandidateById(Long id);

  @Override
  void deleteById(Long id);

  @Query(
      value =
          "SELECT c.* FROM Candidates c "
              + "LEFT JOIN job_position jp ON c.job_id = jp.job_id "
              + "WHERE "
              + "(:keyword IS NULL OR LOWER(c.first_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.last_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.email) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.stage) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.highest_degree) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.specialization) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR CONCAT(',', c.key_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR CONCAT(',', c.may_know_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(jp.job_title) LIKE CONCAT('%', :keyword, '%'))"
              + "LIMIT :size OFFSET :page * :size",
      nativeQuery = true)
  List<Candidates> findByKeyword(
      @Param("keyword") String keyword, @Param("page") int page, @Param("size") int size);

  @Query(
      value =
          "SELECT c.* FROM Candidates c "
              + "LEFT JOIN job_position jp ON c.job_id = jp.job_id "
              + "WHERE "
              + "(:keyword IS NULL OR LOWER(c.first_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.last_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.email) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.highest_degree) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.stage) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.specialization) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR CONCAT(',', c.key_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR CONCAT(',', c.may_know_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(jp.job_title) LIKE CONCAT('%', :keyword, '%'))"
              + "AND c.job_id = :jobId",
      countQuery =
          "SELECT COUNT(c.*) FROM Candidates c "
              + "LEFT JOIN job_position jp ON c.job_id = jp.job_id "
              + "WHERE "
              + "(:keyword IS NULL OR LOWER(c.first_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.last_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.email) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.highest_degree) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.stage) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.specialization) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR CONCAT(',', c.key_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR CONCAT(',', c.may_know_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(jp.job_title) LIKE CONCAT('%', :keyword, '%'))"
              + "AND c.job_id = :jobId",
      nativeQuery = true)
  Page<Candidates> findByKeywordAndJobId(
      @Param("keyword") String keyword, @Param("jobId") Long jobId, Pageable pageable);

  Page<Candidates>
      findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThan(
          String[] location, Integer minCtc, Integer maxCtc, Integer experience, Pageable pageable);

  Page<Candidates> findByCurrentCTCBetweenAndTotalExperienceGreaterThan(
      Integer minCtc, Integer maxCtc, Integer experience, Pageable pageable);

  Page<Candidates> findByJobPosition(JobPosition jobPosition, Pageable pageable);

  List<Candidates> findByJobPosition(JobPosition jobPosition);

  Page<Candidates> findByStage(String stage, PageRequest pageRequest);

  List<Candidates> findByStage(String stage);

  @Query("SELECT c FROM Candidates c WHERE c.round >= 2")
  Page<Candidates> findAllWithRoundTwoOrMore(Pageable pageable);

  @Query("SELECT c FROM Candidates c WHERE c.round >= 2")
  List<Candidates> findAllWithRoundTwoOrMore();

  @Query("SELECT COUNT(c) FROM Candidates c WHERE c.jobPosition.id = :jobId")
  Long countCandidatesByJobId(@Param("jobId") Long jobId);

  Page<Candidates>
      findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndJobPosition(
          String[] location,
          int minCtc,
          int maxCtc,
          int experience,
          JobPosition jobPosition,
          Pageable pageable);

  Page<Candidates> findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndJobPosition(
      int minCtc, int maxCtc, int experience, JobPosition jobPosition, Pageable pageable);

  @Query(
      value =
          "SELECT * FROM candidates c "
              + "WHERE c.current_city IN :location "
              + "AND c.currentctc BETWEEN :minCtc AND :maxCtc "
              + "AND c.total_experience > :experience "
              + "AND c.stage = :stage",
      countQuery =
          "SELECT COUNT(*) FROM candidates c "
              + "JOIN address a ON c.address_id = a.id "
              + "JOIN current_address ca ON a.current_address_id = ca.id "
              + "WHERE ca.current_city IN :location "
              + "AND c.currentctc BETWEEN :minCtc AND :maxCtc "
              + "AND c.total_experience > :experience "
              + "AND c.stage = :stage",
      nativeQuery = true)
  Page<Candidates>
      findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
          @Param("location") String[] location,
          @Param("minCtc") int minCtc,
          @Param("maxCtc") int maxCtc,
          @Param("experience") int experience,
          @Param("stage") String stage,
          Pageable pageable);

  @Query(
      value =
          "SELECT * FROM candidates "
              + "WHERE currentctc BETWEEN :minCtc AND :maxCtc "
              + "AND total_experience > :experience "
              + "AND stage = :stage",
      countQuery =
          "SELECT COUNT(*) FROM candidates "
              + "WHERE currentctc BETWEEN :minCtc AND :maxCtc "
              + "AND total_experience > :experience "
              + "AND stage = :stage",
      nativeQuery = true)
  Page<Candidates> findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
      @Param("minCtc") int minCtc,
      @Param("maxCtc") int maxCtc,
      @Param("experience") int experience,
      @Param("stage") String stage,
      Pageable pageable);

  @Query(
      value =
          "SELECT * FROM candidates c "
              + "WHERE c.current_city IN :location "
              + "AND c.currentctc BETWEEN :minCtc AND :maxCtc "
              + "AND c.total_experience > :experience "
              + "AND c.round >= 2 ",
      countQuery =
          "SELECT COUNT(*) FROM candidates c "
              + "JOIN address a ON c.address_id = a.id "
              + "JOIN current_address ca ON a.current_address_id = ca.id "
              + "WHERE ca.current_city IN :location "
              + "AND c.currentctc BETWEEN :minCtc AND :maxCtc "
              + "AND c.total_experience > :experience "
              + "AND c.round >= 2 ",
      nativeQuery = true)
  Page<Candidates>
      findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndTwoOrMore(
          @Param("location") String[] location,
          @Param("minCtc") int minCtc,
          @Param("maxCtc") int maxCtc,
          @Param("experience") int experience,
          Pageable pageable);

  @Query(
      value =
          "SELECT * FROM candidates "
              + "WHERE currentctc BETWEEN :minCtc AND :maxCtc "
              + "AND total_experience > :experience "
              + "AND round >= 2 ",
      countQuery =
          "SELECT COUNT(*) FROM candidates "
              + "WHERE currentctc BETWEEN :minCtc AND :maxCtc "
              + "AND total_experience > :experience "
              + "AND round >= 2 ",
      nativeQuery = true)
  Page<Candidates> findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndTwoOrMore(
      @Param("minCtc") int minCtc,
      @Param("maxCtc") int maxCtc,
      @Param("experience") int experience,
      Pageable pageable);

  @Query(
      value =
          "SELECT c.* FROM Candidates c "
              + "LEFT JOIN job_position jp ON c.job_id = jp.job_id "
              + "WHERE "
              + "c.stage = :stage "
              + "AND "
              + "(:keyword IS NULL OR "
              + "(LOWER(c.first_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.last_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.email) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.current_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.current_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.current_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.permanent_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.permanent_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.permanent_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.highest_degree) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.stage) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(c.specialization) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (CONCAT(',', c.key_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (CONCAT(',', c.may_know_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (LOWER(jp.job_title) LIKE CONCAT('%', :keyword, '%')))",
      nativeQuery = true)
  Page<Candidates> findByKeywordAndStage(
      @Param("keyword") String keyword, @Param("stage") String stage, Pageable pageable);

  @Query(
      value =
          "SELECT c.* FROM Candidates c "
              + "LEFT JOIN job_position jp ON c.job_id = jp.job_id "
              + "WHERE c.round >= 2 "
              + "AND "
              + "(:keyword IS NULL OR LOWER(c.first_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.last_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.email) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.highest_degree) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.stage) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.specialization) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR CONCAT(',', c.key_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR CONCAT(',', c.may_know_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(jp.job_title) LIKE CONCAT('%', :keyword, '%')) ",
      countQuery =
          "SELECT COUNT(*) FROM Candidates c "
              + "LEFT JOIN job_position jp ON c.job_id = jp.job_id "
              + "WHERE c.round >= 2 "
              + "AND "
              + "(:keyword IS NULL OR LOWER(c.first_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.last_name) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.email) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.current_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_country) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_state) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.permanent_city) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.highest_degree) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.stage) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(c.specialization) LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR CONCAT(',', c.key_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR CONCAT(',', c.may_know_skills, ',') LIKE CONCAT('%', :keyword, '%')) "
              + "OR (:keyword IS NULL OR LOWER(jp.job_title) LIKE CONCAT('%', :keyword, '%')) ",
      nativeQuery = true)
  Page<Candidates> findAllWithRoundTwoOrMoreAndKeyword(
      @Param("keyword") String keyword, Pageable pageable);
}
