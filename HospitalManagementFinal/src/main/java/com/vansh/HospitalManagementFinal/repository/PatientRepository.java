package com.vansh.HospitalManagementFinal.repository;

import com.vansh.HospitalManagementFinal.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository
        extends JpaRepository<Patient, Integer> {

}