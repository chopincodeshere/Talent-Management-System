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
import java.io.Serializable;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Employment implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "employment_id", nullable = false, updatable = false)
  private Long id;

  private String companyName;
  private String designation;
  private String previousCTC;
  private String location;

  private String workingStatus;

  @Temporal(TemporalType.DATE)
  private LocalDate start;

  @Temporal(TemporalType.DATE)
  private LocalDate finish;

  @ManyToOne
  @JoinColumn(name = "candidate_id")
  @JsonIgnore
  private Candidates candidates;
}
