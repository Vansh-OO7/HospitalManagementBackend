package com.vansh.HospitalManagementFinal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wards")

public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;

    private String wardNumber;

    private String wardType;

    private int capacity;

    private int occupiedBeds;

    private double dailyCharge;

    public Ward() {
    }

    public Ward(Integer id,
                String wardNumber,
                String wardType,
                int capacity,
                int occupiedBeds,
                double dailyCharge) {

        this.id = id;
        this.wardNumber = wardNumber;
        this.wardType = wardType;
        this.capacity = capacity;
        this.occupiedBeds = occupiedBeds;
        this.dailyCharge = dailyCharge;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getWardNumber() {
        return wardNumber;
    }

    public void setWardNumber(String wardNumber) {
        this.wardNumber = wardNumber;
    }

    public String getWardType() {
        return wardType;
    }

    public void setWardType(String wardType) {
        this.wardType = wardType;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getOccupiedBeds() {
        return occupiedBeds;
    }

    public void setOccupiedBeds(int occupiedBeds) {
        this.occupiedBeds = occupiedBeds;
    }

    public double getDailyCharge() {
        return dailyCharge;
    }

    public void setDailyCharge(double dailyCharge) {
        this.dailyCharge = dailyCharge;
    }
}