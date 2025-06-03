package com.travelease.repository;

import com.travelease.model.Agency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AgencyRepository extends JpaRepository<Agency, Long> {
    List<Agency> findByLocationContainingIgnoreCase(String location);
    List<Agency> findByNameContainingIgnoreCase(String name);
}
