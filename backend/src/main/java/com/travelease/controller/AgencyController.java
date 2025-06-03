package com.travelease.controller;

import com.travelease.model.Agency;
import com.travelease.repository.AgencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/agencies")
@CrossOrigin(origins = "*")
public class AgencyController {
    
    @Autowired
    private AgencyRepository agencyRepository;
    
    @GetMapping
    public List<Agency> getAllAgencies() {
        return agencyRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Agency> getAgencyById(@PathVariable Long id) {
        return agencyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Agency createAgency(@RequestBody Agency agency) {
        return agencyRepository.save(agency);
    }
    
    @GetMapping("/search")
    public List<Agency> searchAgencies(@RequestParam(required = false) String name,
                                     @RequestParam(required = false) String location) {
        if (name != null && !name.isEmpty()) {
            return agencyRepository.findByNameContainingIgnoreCase(name);
        } else if (location != null && !location.isEmpty()) {
            return agencyRepository.findByLocationContainingIgnoreCase(location);
        } else {
            return agencyRepository.findAll();
        }
    }
}
