package com.tecunique.tms.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

import com.tecunique.tms.entity.EmailSend;
import com.tecunique.tms.services.EmailSenderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class EmailSenderServiceTest {
  @Mock private JavaMailSender mailSender;

  @InjectMocks private EmailSenderService emailSenderService;

  @Captor private ArgumentCaptor<SimpleMailMessage> messageCaptor;

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void sendEmail_shouldSendEmailSuccessfully() {
    EmailSend emailSend = new EmailSend();
    emailSend.setReceiverEmail("test@example.com");
    emailSend.setSubject("Test Subject");
    emailSend.setMessageBody("Test Message");

    emailSenderService.sendEmail(emailSend);

    verify(mailSender).send(messageCaptor.capture());
    SimpleMailMessage sentMessage = messageCaptor.getValue();

    assertNotNull(sentMessage);
    assertEquals("test@example.com", sentMessage.getTo()[0]);
    assertEquals("Test Subject", sentMessage.getSubject());
    assertEquals("Test Message", sentMessage.getText());
  }
}
