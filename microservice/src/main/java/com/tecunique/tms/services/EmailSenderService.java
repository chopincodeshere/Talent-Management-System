package com.tecunique.tms.services;

import com.tecunique.tms.entity.EmailSend;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EmailSenderService {
  @Autowired private JavaMailSender mailSender;

  @Value("${spring.mail.username}")
  private String sender;

  public void sendEmail(EmailSend emailSend) {
    try {
      SimpleMailMessage message = new SimpleMailMessage();

      message.setFrom(sender);

      String receiverEmail = emailSend.getReceiverEmail();

      if (receiverEmail != null) {
        message.setTo(receiverEmail);
      }

      message.setText(emailSend.getMessageBody());
      message.setSubject(emailSend.getSubject());

      mailSender.send(message);
      System.out.println("Mail Sent.......");
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void sendEmailWithAttachments(EmailSend email, MultipartFile[] files)
      throws MessagingException, IOException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true);

    helper.setFrom(sender);
    helper.setTo(email.getReceiverEmail());
    helper.setSubject(email.getSubject());
    helper.setText(email.getMessageBody());

    for (MultipartFile file : files) {
      if (!file.isEmpty()) {
        helper.addAttachment(file.getOriginalFilename(), new ByteArrayResource(file.getBytes()));
      }
    }

    mailSender.send(message);
  }
}
