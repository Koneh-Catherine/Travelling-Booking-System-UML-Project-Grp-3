package com.travelease.repository;

import com.travelease.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findByAgencyId(Long agencyId);
    List<Bus> findByDestinationContainingIgnoreCase(String destination);
    Optional<Bus> findByBusNumber(String busNumber);
    List<Bus> findByAvailableSeatsGreaterThan(Integer seats);
}
