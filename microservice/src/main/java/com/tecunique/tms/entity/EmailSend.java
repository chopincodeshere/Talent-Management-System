package com.tecunique.tms.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailSend {
  private String receiverEmail;
  private String subject;
  private String messageBody;
  private String attachmentFile;
}
