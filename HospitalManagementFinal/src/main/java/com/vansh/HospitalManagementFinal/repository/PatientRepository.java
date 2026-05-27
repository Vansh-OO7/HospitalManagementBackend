package com.vansh.HospitalManagementFinal.repository;

import com.vansh.HospitalManagementFinal.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PatientRepository
        extends JpaRepository<Patient, Integer> {

    @Modifying
    @Transactional
    @Query("UPDATE Patient p SET p.assignedDoctorId = null WHERE p.assignedDoctorId = :doctorId")
    void clearAssignedDoctorId(@Param("doctorId") Integer doctorId);

    @Modifying
    @Transactional
    @Query("UPDATE Patient p SET p.assignedWardId = null WHERE p.assignedWardId = :wardId")
    void clearAssignedWardId(@Param("wardId") Integer wardId);
}