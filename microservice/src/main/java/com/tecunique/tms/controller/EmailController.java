package com.tecunique.tms.controller;

import com.tecunique.tms.dto.EmailResponse;
import com.tecunique.tms.entity.EmailSend;
import com.tecunique.tms.services.EmailSenderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/email")
@AllArgsConstructor
public class EmailController {
  private EmailSenderService emailSenderService;

  @PostMapping("/sendEmail")
  public ResponseEntity<EmailResponse> sendSimpleEmail(@RequestBody EmailSend details) {
    emailSenderService.sendEmail(details);
    return ResponseEntity.ok(new EmailResponse("Email sent successfully....."));
  }

  @PostMapping(value = "/sendEmailWithAttachment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> sendEmail(
      @ModelAttribute EmailSend email, @RequestParam("files") MultipartFile[] files) {
    try {
      emailSenderService.sendEmailWithAttachments(email, files);
      return ResponseEntity.ok(new EmailResponse("Email sent successfully!"));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email");
    }
  }
}
