package com.vansh.HospitalManagementFinal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")

public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;

    private String name;

    private String specialization;

    private String contact;

    private String email;

    public Doctor() {
    }

    public Doctor(Integer id, String name,
                  String specialization,
                  String contact,
                  String email) {

        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.contact = contact;
        this.email = email;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}