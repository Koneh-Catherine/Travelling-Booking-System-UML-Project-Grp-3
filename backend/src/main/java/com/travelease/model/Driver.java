package com.travelease.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "drivers")
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;
    
    @Min(value = 21, message = "Driver must be at least 21 years old")
    @Column(nullable = false)
    private Integer age;
    
    @NotBlank(message = "ID card number is required")
    @Column(nullable = false, unique = true)
    private String idCardNumber;
    
    // Constructors
    public Driver() {}
    
    public Driver(String name, Integer age, String idCardNumber) {
        this.name = name;
        this.age = age;
        this.idCardNumber = idCardNumber;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Integer getAge() {
        return age;
    }
    
    public void setAge(Integer age) {
        this.age = age;
    }
    
    public String getIdCardNumber() {
        return idCardNumber;
    }
    
    public void setIdCardNumber(String idCardNumber) {
        this.idCardNumber = idCardNumber;
    }
}
