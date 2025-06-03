package com.travelease.repository;

import com.travelease.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByBusId(Long busId);
    Optional<Booking> findByTicketNumber(String ticketNumber);
    List<Booking> findByStatus(Booking.BookingStatus status);
}
