package com.vansh.HospitalManagementFinal.controller;

import com.vansh.HospitalManagementFinal.model.Patient;
import com.vansh.HospitalManagementFinal.model.Ward;
import com.vansh.HospitalManagementFinal.repository.DoctorRepository;
import com.vansh.HospitalManagementFinal.repository.PatientRepository;
import com.vansh.HospitalManagementFinal.repository.WardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/assignments")
@CrossOrigin
public class AssignmentController {

    private final PatientRepository patientRepository;
    private final WardRepository wardRepository;
    private final DoctorRepository doctorRepository;

    public AssignmentController(PatientRepository patientRepository,
                                WardRepository wardRepository,
                                DoctorRepository doctorRepository) {
        this.patientRepository = patientRepository;
        this.wardRepository = wardRepository;
        this.doctorRepository = doctorRepository;
    }

    @PostMapping("/assign-doctor")
    public Patient assignDoctor(@RequestParam Integer patientId,
                                @RequestParam Integer doctorId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found");
        }
        patient.setAssignedDoctorId(doctorId);
        return patientRepository.save(patient);
    }

    @PostMapping("/assign-ward")
    public Patient assignWard(@RequestParam Integer patientId,
                              @RequestParam Integer wardId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        
        // If patient is already assigned to this ward, do nothing
        if (wardId.equals(patient.getAssignedWardId())) {
            return patient;
        }

        // If patient was assigned to a different ward, decrement that ward's occupied beds
        if (patient.getAssignedWardId() != null) {
            wardRepository.findById(patient.getAssignedWardId()).ifPresent(oldWard -> {
                oldWard.setOccupiedBeds(Math.max(0, oldWard.getOccupiedBeds() - 1));
                wardRepository.save(oldWard);
            });
        }

        Ward ward = wardRepository.findById(wardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ward not found"));
        if (ward.getOccupiedBeds() < ward.getCapacity()) {
            patient.setAssignedWardId(wardId);
            ward.setOccupiedBeds(ward.getOccupiedBeds() + 1);
            wardRepository.save(ward);
            return patientRepository.save(patient);
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ward is full");
    }

    @PostMapping("/discharge")
    public Patient discharge(@RequestParam Integer patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        if (patient.getAssignedWardId() != null) {
            wardRepository.findById(patient.getAssignedWardId()).ifPresent(ward -> {
                ward.setOccupiedBeds(Math.max(0, ward.getOccupiedBeds() - 1));
                wardRepository.save(ward);
            });
        }

        patient.setAssignedDoctorId(null);
        patient.setAssignedWardId(null);
        return patientRepository.save(patient);
    }
}
