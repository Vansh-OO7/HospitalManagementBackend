package com.vansh.HospitalManagementFinal.controller;

import com.vansh.HospitalManagementFinal.model.Doctor;
import com.vansh.HospitalManagementFinal.repository.DoctorRepository;
import com.vansh.HospitalManagementFinal.repository.PatientRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@CrossOrigin

public class DoctorController {

    private final DoctorRepository repository;
    private final PatientRepository patientRepository;

    public DoctorController(DoctorRepository repository, PatientRepository patientRepository) {

        this.repository = repository;
        this.patientRepository = patientRepository;
    }

    // GET ALL DOCTORS

    @GetMapping
    public List<Doctor> getAllDoctors() {

        return repository.findAll();
    }

    // ADD DOCTOR

    @PostMapping
    public Doctor addDoctor(@RequestBody Doctor doctor) {

        return repository.save(doctor);
    }

    // UPDATE DOCTOR

    @PutMapping("/{id}")

    public Doctor updateDoctor(@PathVariable Integer id,
                               @RequestBody Doctor updatedDoctor) {

        Doctor doctor = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));

        doctor.setName(updatedDoctor.getName());
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setContact(updatedDoctor.getContact());
        doctor.setEmail(updatedDoctor.getEmail());

        return repository.save(doctor);
    }

    // DELETE DOCTOR

    @DeleteMapping("/{id}")

    public void deleteDoctor(@PathVariable Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found");
        }

        patientRepository.clearAssignedDoctorId(id);
        repository.deleteById(id);
    }
}
