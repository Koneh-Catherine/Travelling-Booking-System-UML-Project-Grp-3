package com.travelease.service;

import com.travelease.model.Booking;
import com.travelease.model.Bus;
import com.travelease.model.User;
import com.travelease.repository.BookingRepository;
import com.travelease.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private BusRepository busRepository;

    @Autowired
    private EmailService emailService;
    
    @Transactional
    public Booking createBooking(User user, Long busId, Integer seatNumber, Integer numberOfSeats,
                                String passengerName, String idNumber, String phoneNumber) throws Exception {
        
        Optional<Bus> busOpt = busRepository.findById(busId);
        if (busOpt.isEmpty()) {
            throw new Exception("Bus not found");
        }
        
        Bus bus = busOpt.get();
        
        if (bus.getAvailableSeats() < numberOfSeats) {
            throw new Exception("Not enough seats available");
        }
        
        // Calculate total price
        Double totalPrice = bus.getPrice() * numberOfSeats;
        
        // Generate unique ticket number
        String ticketNumber = "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        // Create booking
        Booking booking = new Booking(user, bus, seatNumber, numberOfSeats, passengerName, 
                                    idNumber, phoneNumber, totalPrice, ticketNumber);
        
        // Update bus available seats
        bus.setAvailableSeats(bus.getAvailableSeats() - numberOfSeats);
        busRepository.save(bus);
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send email confirmation
        try {
            emailService.sendBookingConfirmation(user, savedBooking);
        } catch (Exception e) {
            System.err.println("Failed to send booking confirmation email: " + e.getMessage());
        }
        
        return savedBooking;
    }
    
    public Booking confirmBooking(Long bookingId) throws Exception {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new Exception("Booking not found");
        }
        
        Booking booking = bookingOpt.get();
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long bookingId) throws Exception {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new Exception("Booking not found");
        }
        
        Booking booking = bookingOpt.get();
        
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new Exception("Booking is already cancelled");
        }
        
        // Update booking status
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        
        // Restore bus seats
        Bus bus = booking.getBus();
        bus.setAvailableSeats(bus.getAvailableSeats() + booking.getNumberOfSeats());
        busRepository.save(bus);
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send cancellation email
        try {
            emailService.sendBookingCancellation(booking.getUser(), savedBooking);
        } catch (Exception e) {
            System.err.println("Failed to send cancellation email: " + e.getMessage());
        }
        
        return savedBooking;
    }
    
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    public Optional<Booking> findByTicketNumber(String ticketNumber) {
        return bookingRepository.findByTicketNumber(ticketNumber);
    }
    
    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }
}
