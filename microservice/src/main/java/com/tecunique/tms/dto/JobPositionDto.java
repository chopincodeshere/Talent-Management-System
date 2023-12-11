package com.tecunique.tms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobPositionDto {
  private Long id;
  private String jobTitle;
  private String[] hiringManagers;
  private String jobStatus;
  private String requirements;
  private byte[] jobDescription;
}
