package com.vansh.HospitalManagementFinal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bills")

public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;

    private Integer patientId;

    private double consultationFee;

    private double medicationCost;

    private double wardCharges;

    private int daysAdmitted;

    private String description;

    private double totalAmount;

    @Column(name = "bill_date")
    private java.sql.Timestamp billDate;

    public Bill() {
    }

    public Bill(
            Integer id,
            Integer patientId,
            double consultationFee,
            double medicationCost,
            double wardCharges,
            int daysAdmitted,
            String description,
            double totalAmount,
            java.sql.Timestamp billDate
    ) {

        this.id = id;
        this.patientId = patientId;
        this.consultationFee = consultationFee;
        this.medicationCost = medicationCost;
        this.wardCharges = wardCharges;
        this.daysAdmitted = daysAdmitted;
        this.description = description;
        this.totalAmount = totalAmount;
        this.billDate = billDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
        this.patientId = patientId;
    }

    public double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public double getMedicationCost() {
        return medicationCost;
    }

    public void setMedicationCost(double medicationCost) {
        this.medicationCost = medicationCost;
    }

    public double getWardCharges() {
        return wardCharges;
    }

    public void setWardCharges(double wardCharges) {
        this.wardCharges = wardCharges;
    }

    public int getDaysAdmitted() {
        return daysAdmitted;
    }

    public void setDaysAdmitted(int daysAdmitted) {
        this.daysAdmitted = daysAdmitted;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public java.sql.Timestamp getBillDate() {
        return billDate;
    }

    public void setBillDate(java.sql.Timestamp billDate) {
        this.billDate = billDate;
    }
}