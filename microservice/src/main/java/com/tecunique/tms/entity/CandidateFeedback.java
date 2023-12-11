package com.tecunique.tms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.time.LocalDate;
import lombok.*;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CandidateFeedback {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "feedback_id", nullable = false, updatable = false)
  private Long id;

  private String candidateName;

  @Temporal(TemporalType.DATE)
  private LocalDate dateOfInterview;

  private String positionAppliedFor;

  private String interviewer;

  private Integer round;

  private Integer educationalBackgroundRating;
  private Integer workExperienceRating;
  private Integer technicalSkillsRating;
  private Integer communicationSkillsRating;
  private Integer candidateInterestRating;
  private Integer interpersonalSkillsRating;

  private Integer overallRating;

  @Column(length = 2000)
  private String comments;

  private String result;

  @ManyToOne
  @JoinColumn(name = "candidate_id")
  @JsonIgnore
  private Candidates candidates;
}
