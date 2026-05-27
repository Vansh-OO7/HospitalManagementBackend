package com.vansh.HospitalManagementFinal.repository;

import com.vansh.HospitalManagementFinal.model.Ward;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WardRepository
        extends JpaRepository<Ward, Integer> {

}