package com.travelease.controller;

import com.travelease.model.Booking;
import com.travelease.model.User;
import com.travelease.service.BookingService;
import com.travelease.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> bookingData) {
        try {
            Long userId = Long.valueOf(bookingData.get("userId").toString());
            Long busId = Long.valueOf(bookingData.get("busId").toString());
            Integer seatNumber = Integer.valueOf(bookingData.get("seatNumber").toString());
            Integer numberOfSeats = Integer.valueOf(bookingData.get("numberOfSeats").toString());
            String passengerName = bookingData.get("passengerName").toString();
            String idNumber = bookingData.get("idNumber").toString();
            String phoneNumber = bookingData.get("phoneNumber").toString();
            
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
            }
            
            Booking booking = bookingService.createBooking(userOpt.get(), busId, seatNumber, 
                                                         numberOfSeats, passengerName, idNumber, phoneNumber);
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.confirmBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingService.getUserBookings(userId);
    }
    
    @GetMapping("/ticket/{ticketNumber}")
    public ResponseEntity<Booking> getBookingByTicket(@PathVariable String ticketNumber) {
        return bookingService.findByTicketNumber(ticketNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.findAll();
    }
}
