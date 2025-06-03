package com.travelease.controller;

import com.travelease.model.Admin;
import com.travelease.model.Booking;
import com.travelease.model.Bus;
import com.travelease.model.User;
import com.travelease.service.AdminService;
import com.travelease.service.BookingService;
import com.travelease.repository.BusRepository;
import com.travelease.repository.UserRepository;
import com.travelease.repository.AgencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AgencyRepository agencyRepository;
    
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> loginData) {
        try {
            String username = loginData.get("username");
            String password = loginData.get("password");
            
            Admin admin = adminService.loginAdmin(username, password);
            // Don't return password in response
            admin.setPassword(null);
            
            return ResponseEntity.ok(admin);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        try {
            Admin createdAdmin = adminService.createAdmin(admin);
            createdAdmin.setPassword(null);
            return ResponseEntity.ok(createdAdmin);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            long totalUsers = userRepository.count();
            long totalBuses = busRepository.count();
            long totalAgencies = agencyRepository.count();
            long totalBookings = bookingService.findAll().size();
            
            Map<String, Object> stats = Map.of(
                "totalUsers", totalUsers,
                "totalBuses", totalBuses,
                "totalAgencies", totalAgencies,
                "totalBookings", totalBookings
            );
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/users")
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Remove passwords from response
        users.forEach(user -> user.setPassword(null));
        return users;
    }
    
    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingService.findAll();
    }
    
    @GetMapping("/buses")
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }
    
    @PostMapping("/buses")
    public Bus createBus(@RequestBody Bus bus) {
        return busRepository.save(bus);
    }
    
    @PutMapping("/buses/{id}")
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @RequestBody Bus busDetails) {
        return busRepository.findById(id)
                .map(bus -> {
                    bus.setBusNumber(busDetails.getBusNumber());
                    bus.setDestination(busDetails.getDestination());
                    bus.setDepartureTime(busDetails.getDepartureTime());
                    bus.setArrivalTime(busDetails.getArrivalTime());
                    bus.setTotalSeats(busDetails.getTotalSeats());
                    bus.setAvailableSeats(busDetails.getAvailableSeats());
                    bus.setPrice(busDetails.getPrice());
                    bus.setCurrentLocation(busDetails.getCurrentLocation());
                    return ResponseEntity.ok(busRepository.save(bus));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/buses/{id}")
    public ResponseEntity<?> deleteBus(@PathVariable Long id) {
        return busRepository.findById(id)
                .map(bus -> {
                    busRepository.delete(bus);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
