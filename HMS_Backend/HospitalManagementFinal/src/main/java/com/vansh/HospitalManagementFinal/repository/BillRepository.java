package com.vansh.HospitalManagementFinal.repository;

import com.vansh.HospitalManagementFinal.model.Bill;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository
        extends JpaRepository<Bill, Integer> {

}