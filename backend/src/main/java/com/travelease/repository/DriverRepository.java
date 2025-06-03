package com.travelease.repository;

import com.travelease.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByIdCardNumber(String idCardNumber);
    boolean existsByIdCardNumber(String idCardNumber);
}
