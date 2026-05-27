package com.vansh.HospitalManagementFinal.controller;

import com.vansh.HospitalManagementFinal.dto.PatientDTO;
import com.vansh.HospitalManagementFinal.model.Patient;
import com.vansh.HospitalManagementFinal.repository.DoctorRepository;
import com.vansh.HospitalManagementFinal.repository.PatientRepository;
import com.vansh.HospitalManagementFinal.repository.WardRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/patients")
@CrossOrigin

public class PatientController {

    private final PatientRepository repository;

    private final DoctorRepository doctorRepository;

    private final WardRepository wardRepository;

    public PatientController(
            PatientRepository repository,
            DoctorRepository doctorRepository,
            WardRepository wardRepository
    ) {

        this.repository = repository;
        this.doctorRepository = doctorRepository;
        this.wardRepository = wardRepository;
    }

    // =========================
    // GET ALL PATIENTS
    // =========================

    @GetMapping

    public List<PatientDTO> getAllPatients() {

        return repository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PatientDTO convertToDTO(
            Patient patient
    ) {

        PatientDTO dto =
                new PatientDTO();

        dto.setId(
                patient.getId()
        );

        dto.setName(
                patient.getName()
        );

        dto.setAge(
                patient.getAge()
        );

        dto.setGender(
                patient.getGender()
        );

        dto.setContact(
                patient.getContact()
        );

        dto.setAddress(
                patient.getAddress()
        );

        dto.setMedicalHistory(
                patient.getMedicalHistory()
        );

        if (patient.getAssignedDoctorId() != null) {

            doctorRepository.findById(
                    patient.getAssignedDoctorId()
            ).ifPresent(doctor ->
                    dto.setAssignedDoctorName(
                            doctor.getName()
                    )
            );
        }

        if (patient.getAssignedWardId() != null) {

            wardRepository.findById(
                    patient.getAssignedWardId()
            ).ifPresent(ward ->
                    dto.setAssignedWardNumber(
                            ward.getWardNumber()
                    )
            );
        }

        return dto;
    }

    // =========================
    // ADD PATIENT
    // =========================

    @PostMapping

    public Patient addPatient(
            @RequestBody Patient patient
    ) {

        return repository.save(patient);
    }

    // =========================
    // UPDATE PATIENT
    // =========================

    @PutMapping("/{id}")

    public Patient updatePatient(
            @PathVariable Integer id,
            @RequestBody Patient updatedPatient
    ) {

        Patient patient =
                repository.findById(id)
                        .orElseThrow();

        patient.setName(
                updatedPatient.getName()
        );

        patient.setAge(
                updatedPatient.getAge()
        );

        patient.setGender(
                updatedPatient.getGender()
        );

        patient.setContact(
                updatedPatient.getContact()
        );

        patient.setAddress(
                updatedPatient.getAddress()
        );

        patient.setMedicalHistory(
                updatedPatient.getMedicalHistory()
        );

        return repository.save(patient);
    }

    // =========================
    // DELETE PATIENT
    // =========================

    @DeleteMapping("/{id}")

    public void deletePatient(
            @PathVariable Integer id
    ) {

        repository.deleteById(id);
    }
}