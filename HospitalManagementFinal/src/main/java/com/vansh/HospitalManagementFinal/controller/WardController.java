package com.vansh.HospitalManagementFinal.controller;

import com.vansh.HospitalManagementFinal.model.Ward;
import com.vansh.HospitalManagementFinal.repository.WardRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wards")
@CrossOrigin

public class WardController {

    private final WardRepository repository;

    public WardController(WardRepository repository) {

        this.repository = repository;
    }

    @GetMapping
    public List<Ward> getAllWards() {

        return repository.findAll();
    }

    @PostMapping
    public Ward addWard(@RequestBody Ward ward) {

        return repository.save(ward);
    }

    @PutMapping("/{id}")

    public Ward updateWard(@PathVariable Integer id,
                           @RequestBody Ward updatedWard) {

        Ward ward = repository.findById(id)
                .orElseThrow();

        ward.setWardNumber(updatedWard.getWardNumber());
        ward.setWardType(updatedWard.getWardType());
        ward.setCapacity(updatedWard.getCapacity());
        ward.setOccupiedBeds(updatedWard.getOccupiedBeds());

        return repository.save(ward);
    }

    @DeleteMapping("/{id}")

    public void deleteWard(@PathVariable Integer id) {

        repository.deleteById(id);
    }
}