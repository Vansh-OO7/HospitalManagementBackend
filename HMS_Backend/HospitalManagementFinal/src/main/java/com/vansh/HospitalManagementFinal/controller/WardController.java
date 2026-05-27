package com.vansh.HospitalManagementFinal.controller;

import com.vansh.HospitalManagementFinal.model.Ward;
import com.vansh.HospitalManagementFinal.repository.PatientRepository;
import com.vansh.HospitalManagementFinal.repository.WardRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/wards")
@CrossOrigin

public class WardController {

    private final WardRepository repository;
    private final PatientRepository patientRepository;

    public WardController(WardRepository repository, PatientRepository patientRepository) {

        this.repository = repository;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public List<Ward> getAllWards() {

        return repository.findAll();
    }

    @PostMapping
    public Ward addWard(@RequestBody Ward ward) {
        if (ward.getCapacity() < 0 || ward.getOccupiedBeds() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Capacity and occupied beds must be non-negative");
        }
        if (ward.getOccupiedBeds() > ward.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Occupied beds cannot exceed capacity");
        }

        return repository.save(ward);
    }

    @PutMapping("/{id}")

    public Ward updateWard(@PathVariable Integer id,
                           @RequestBody Ward updatedWard) {

        Ward ward = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ward not found"));

        if (updatedWard.getCapacity() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Capacity must be non-negative");
        }
        if (ward.getOccupiedBeds() > updatedWard.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Capacity cannot be less than currently occupied beds");
        }

        ward.setWardNumber(updatedWard.getWardNumber());
        ward.setWardType(updatedWard.getWardType());
        ward.setCapacity(updatedWard.getCapacity());

        return repository.save(ward);
    }

    @DeleteMapping("/{id}")

    public void deleteWard(@PathVariable Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ward not found");
        }

        patientRepository.clearAssignedWardId(id);
        repository.deleteById(id);
    }
}
