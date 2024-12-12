package com.apartmentservices.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    @Autowired
    JavaMailSender javaMailSender;

    /**
     * Gửi email đến người dùng
     *
     * @param to      Địa chỉ email của người nhận
     * @param subject Chủ đề của email
     * @param body    Nội dung của email
     */
//    public void sendEmail(String to, String subject, String body) {
//        try {
//            MimeMessage message = javaMailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true);
//            helper.setTo(to);
//            helper.setSubject(subject);
//            helper.setText(body, true);  // true để cho phép HTML trong nội dung email
//            javaMailSender.send(message);
//        } catch (MessagingException e) {
//            // Ghi log hoặc xử lý lỗi ở đây
//            e.printStackTrace();
//            // Có thể ném một ngoại lệ tùy chỉnh nếu cần thiết
//        }
//    }

    public void sendEmail(String to, String subject, String body, boolean isHtml) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, isHtml);  // Chỉ định sử dụng HTML nếu isHtml là true
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

}
