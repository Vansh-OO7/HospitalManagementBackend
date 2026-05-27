package com.vansh.HospitalManagementFinal.repository;

import com.vansh.HospitalManagementFinal.model.Doctor;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository
        extends JpaRepository<Doctor, Integer> {

}