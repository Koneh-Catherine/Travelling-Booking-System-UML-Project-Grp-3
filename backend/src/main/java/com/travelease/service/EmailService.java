package com.travelease.service;

import com.travelease.model.Booking;
import com.travelease.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private TemplateEngine templateEngine;
    
    @Value("${app.email.from}")
    private String fromEmail;
    
    public void sendBookingConfirmation(User user, Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Booking Confirmation - TravelEase");
            
            Context context = new Context();
            context.setVariable("user", user);
            context.setVariable("booking", booking);
            context.setVariable("bus", booking.getBus());
            context.setVariable("agency", booking.getBus().getAgency());
            context.setVariable("driver", booking.getBus().getDriver());
            
            String htmlContent = templateEngine.process("booking-confirmation", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            // Log error and send simple text email as fallback
            sendSimpleBookingConfirmation(user, booking);
        }
    }
    
    public void sendBookingCancellation(User user, Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Booking Cancelled - TravelEase");
            message.setText(String.format(
                "Dear %s,\n\n" +
                "Your booking has been cancelled.\n\n" +
                "Ticket Number: %s\n" +
                "Route: %s → %s\n" +
                "Bus: %s\n\n" +
                "If you have any questions, please contact our support team.\n\n" +
                "Best regards,\n" +
                "TravelEase Team",
                user.getName(),
                booking.getTicketNumber(),
                booking.getBus().getCurrentLocation(),
                booking.getBus().getDestination(),
                booking.getBus().getBusNumber()
            ));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send cancellation email: " + e.getMessage());
        }
    }
    
    public void sendDepartureReminder(User user, Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Departure Reminder - TravelEase");
            message.setText(String.format(
                "Dear %s,\n\n" +
                "This is a reminder that your bus departs today!\n\n" +
                "Ticket Number: %s\n" +
                "Route: %s → %s\n" +
                "Bus: %s\n" +
                "Departure Time: %s\n" +
                "Seat Number: %d\n\n" +
                "Please arrive at the station at least 30 minutes before departure.\n\n" +
                "Have a safe journey!\n\n" +
                "Best regards,\n" +
                "TravelEase Team",
                user.getName(),
                booking.getTicketNumber(),
                booking.getBus().getCurrentLocation(),
                booking.getBus().getDestination(),
                booking.getBus().getBusNumber(),
                booking.getBus().getDepartureTime(),
                booking.getSeatNumber()
            ));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send departure reminder: " + e.getMessage());
        }
    }
    
    private void sendSimpleBookingConfirmation(User user, Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Booking Confirmation - TravelEase");
            message.setText(String.format(
                "Dear %s,\n\n" +
                "Your booking has been confirmed!\n\n" +
                "Ticket Number: %s\n" +
                "Route: %s → %s\n" +
                "Bus: %s\n" +
                "Departure: %s\n" +
                "Arrival: %s\n" +
                "Seat Number: %d\n" +
                "Total Amount: %.2f CFA\n\n" +
                "Please keep this ticket number for your records.\n\n" +
                "Best regards,\n" +
                "TravelEase Team",
                user.getName(),
                booking.getTicketNumber(),
                booking.getBus().getCurrentLocation(),
                booking.getBus().getDestination(),
                booking.getBus().getBusNumber(),
                booking.getBus().getDepartureTime(),
                booking.getBus().getArrivalTime(),
                booking.getSeatNumber(),
                booking.getTotalPrice()
            ));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send simple booking confirmation: " + e.getMessage());
        }
    }
}
