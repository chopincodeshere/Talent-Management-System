package com.tecunique.tms.dto;

import com.tecunique.tms.entity.Address;
import com.tecunique.tms.entity.Education;
import com.tecunique.tms.entity.JobPosition;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CandidateDetailsDto {
  private Long id;
  private String firstName;
  private String lastName;
  private String email;
  private Address address;
  private Date enrolledDate;
  private String source;
  private String[] skills;
  private String[] mayKnowSkills;
  private String mobilePhone;
  private String candidateCode;
  private Education education;
  private String currentNoticePeriod;
  private JobPosition jobPosition;
  private String workMode;
  private float expectedCTC;
  private float currentCTC;
  private int totalExperience;
  private Integer round;
  private String stage;
}
