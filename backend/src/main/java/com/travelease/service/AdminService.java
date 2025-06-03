package com.travelease.service;

import com.travelease.model.Admin;
import com.travelease.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public Admin createAdmin(Admin admin) throws Exception {
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new Exception("Username already exists");
        }
        
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new Exception("Email already exists");
        }
        
        // Encrypt password
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        
        return adminRepository.save(admin);
    }
    
    public Admin loginAdmin(String username, String password) throws Exception {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        
        if (adminOpt.isEmpty()) {
            throw new Exception("Admin not found");
        }
        
        Admin admin = adminOpt.get();
        
        if (!admin.getActive()) {
            throw new Exception("Admin account is deactivated");
        }
        
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new Exception("Invalid password");
        }
        
        return admin;
    }
    
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
    
    public Optional<Admin> findById(Long id) {
        return adminRepository.findById(id);
    }
    
    public Admin updateAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
    
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
}
