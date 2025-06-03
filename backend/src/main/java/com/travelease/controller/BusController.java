package com.travelease.controller;

import com.travelease.model.Bus;
import com.travelease.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "*")
public class BusController {
    
    @Autowired
    private BusRepository busRepository;
    
    @GetMapping
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
        return busRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/agency/{agencyId}")
    public List<Bus> getBusesByAgency(@PathVariable Long agencyId) {
        return busRepository.findByAgencyId(agencyId);
    }
    
    @GetMapping("/search")
    public List<Bus> searchBuses(@RequestParam(required = false) String destination,
                               @RequestParam(required = false, defaultValue = "0") Integer minSeats) {
        if (destination != null && !destination.isEmpty()) {
            return busRepository.findByDestinationContainingIgnoreCase(destination);
        } else if (minSeats > 0) {
            return busRepository.findByAvailableSeatsGreaterThan(minSeats);
        } else {
            return busRepository.findAll();
        }
    }
    
    @PostMapping
    public Bus createBus(@RequestBody Bus bus) {
        return busRepository.save(bus);
    }
}
