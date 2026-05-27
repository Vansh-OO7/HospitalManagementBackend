package com.vansh.HospitalManagementFinal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "patients")

public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;

    private String name;

    private int age;

    private String gender;

    private String contact;

    private String address;

    private String medicalHistory;

    private Integer assignedDoctorId;

    private Integer assignedWardId;

    public Patient() {
    }

    public Patient(Integer id,
                   String name,
                   int age,
                   String gender,
                   String contact,
                   String address,
                   String medicalHistory,
                   Integer assignedDoctorId,
                   Integer assignedWardId) {

        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.contact = contact;
        this.address = address;
        this.medicalHistory = medicalHistory;
        this.assignedDoctorId = assignedDoctorId;
        this.assignedWardId = assignedWardId;
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public Integer getAssignedDoctorId() {
        return assignedDoctorId;
    }

    public void setAssignedDoctorId(Integer assignedDoctorId) {
        this.assignedDoctorId = assignedDoctorId;
    }

    public Integer getAssignedWardId() {
        return assignedWardId;
    }

    public void setAssignedWardId(Integer assignedWardId) {
        this.assignedWardId = assignedWardId;
    }
}