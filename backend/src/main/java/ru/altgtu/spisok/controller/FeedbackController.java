package ru.altgtu.spisok.controller;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    @Autowired
    private JavaMailSender emailSender;

    @PostMapping("/feedback")
    public String sendFeedback(@RequestBody Map<String, String> payload) {
        try {
            String name = payload.get("name");
            String contact = payload.get("contact");
            String message = payload.get("message");
            String vuzName = payload.get("vuzName");

            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo("alicayakimchuk@yandex.ru");
            helper.setFrom("alicayakimchuk@yandex.ru");
            helper.setSubject("Новый вопрос от абитуриента: " + vuzName);
            if (contact != null && !contact.trim().isEmpty()) {
                helper.setReplyTo(contact);
            }

            // HTML-шаблон письма
            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">Новое сообщение</h2>
                    </div>
                    <div style="padding: 20px; background-color: #f9f9f9;">
                        <p style="font-size: 16px; color: #333;"><strong>Вуз:</strong> %s</p>
                        <p style="font-size: 16px; color: #333;"><strong>От кого:</strong> %s</p>
                        <p style="font-size: 16px; color: #333;"><strong>Контакт:</strong> %s</p>
                        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
                        <h3 style="color: #4CAF50;">Сообщение:</h3>
                        <p style="font-size: 16px; color: #555; line-height: 1.6; background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #4CAF50;">
                            %s
                        </p>
                    </div>
                    <div style="background-color: #eee; padding: 10px; text-align: center; font-size: 12px; color: #888;">
                        Это письмо отправлено с сайта "Список вузов".
                    </div>
                </div>
            """.formatted(vuzName, name, contact, message);

            helper.setText(htmlContent, true); // true = это HTML

            emailSender.send(mimeMessage);
            return "OK";
        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR";
        }
    }
}