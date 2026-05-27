package com.vansh.HospitalManagementFinal.controller;

import com.vansh.HospitalManagementFinal.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin
public class DashboardController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final WardRepository wardRepository;
    private final BillRepository billRepository;

    public DashboardController(PatientRepository patientRepository,
                               DoctorRepository doctorRepository,
                               WardRepository wardRepository,
                               BillRepository billRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.wardRepository = wardRepository;
        this.billRepository = billRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalWards", wardRepository.count());

        int totalBeds = wardRepository.findAll().stream()
                .mapToInt(w -> w.getCapacity()).sum();
        int occupiedBeds = wardRepository.findAll().stream()
                .mapToInt(w -> w.getOccupiedBeds()).sum();

        stats.put("totalBeds", totalBeds);
        stats.put("occupiedBeds", occupiedBeds);
        stats.put("availableBeds", totalBeds - occupiedBeds);

        double revenue = billRepository.findAll().stream()
                .mapToDouble(b -> b.getTotalAmount()).sum();
        stats.put("totalRevenue", revenue);

        return stats;
    }
}