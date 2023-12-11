package com.tecunique.tms.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

import com.tecunique.tms.dto.EmailResponse;
import com.tecunique.tms.entity.EmailSend;
import com.tecunique.tms.services.EmailSenderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

public class EmailSenderControllerTest {

  @InjectMocks private EmailController emailController;

  @Mock private EmailSenderService emailSenderService;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void sendSimpleMail() {
    EmailSend emailSend =
        new EmailSend("receiver@example.com", "Test Subject", "Test Message", null);
    ResponseEntity<EmailResponse> expectedResponse =
        ResponseEntity.ok(new EmailResponse("Email sent successfully....."));

    ResponseEntity<EmailResponse> response = emailController.sendSimpleEmail(emailSend);

    assertEquals(expectedResponse.getStatusCode(), response.getStatusCode());
    assertEquals(expectedResponse.getBody(), response.getBody());
    verify(emailSenderService).sendEmail(emailSend);
  }

  @Test
  public void sendEmailWithAttachments() throws Exception {
    EmailSend emailSend =
        new EmailSend("receiver@example.com", "Test Subject", "Test Message", null);
    MockMultipartFile file1 =
        new MockMultipartFile("file", "test.txt", "text/plain", "Test File Content".getBytes());
    MockMultipartFile file2 =
        new MockMultipartFile("file", "test2.txt", "text/plain", "Test File Content 2".getBytes());
    MockMultipartFile[] files = {file1, file2};

    ResponseEntity<?> expectedResponse =
        ResponseEntity.ok(new EmailResponse("Email sent successfully!"));

    ResponseEntity<?> response = emailController.sendEmail(emailSend, files);

    assertEquals(expectedResponse.getStatusCode(), response.getStatusCode());
    assertEquals(expectedResponse.getBody(), response.getBody());
    verify(emailSenderService).sendEmailWithAttachments(emailSend, files);
  }
}
