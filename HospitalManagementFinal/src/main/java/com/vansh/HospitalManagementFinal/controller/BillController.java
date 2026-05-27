package com.vansh.HospitalManagementFinal.controller;

import com.vansh.HospitalManagementFinal.model.Bill;
import com.vansh.HospitalManagementFinal.repository.BillRepository;
import com.vansh.HospitalManagementFinal.repository.PatientRepository;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bills")
@CrossOrigin

public class BillController {

    private final BillRepository repository;

    private final PatientRepository patientRepository;

    public BillController(
            BillRepository repository,
            PatientRepository patientRepository
    ) {

        this.repository = repository;
        this.patientRepository = patientRepository;
    }

    // =========================
    // GET ALL BILLS
    // =========================

    @GetMapping

    public List<Map<String, Object>> getAllBills() {

        return repository.findAll()
                .stream()
                .map(bill -> {

                    Map<String, Object> billData =
                            new HashMap<>();

                    billData.put(
                            "id",
                            bill.getId()
                    );

                    billData.put(
                            "patientId",
                            bill.getPatientId()
                    );

                    billData.put(
                            "consultationFee",
                            bill.getConsultationFee()
                    );

                    billData.put(
                            "medicationCost",
                            bill.getMedicationCost()
                    );

                    billData.put(
                            "wardCharges",
                            bill.getWardCharges()
                    );

                    billData.put(
                            "daysAdmitted",
                            bill.getDaysAdmitted()
                    );

                    billData.put(
                            "description",
                            bill.getDescription()
                    );

                    billData.put(
                            "totalAmount",
                            bill.getTotalAmount()
                    );

                    billData.put(
                            "billDate",
                            bill.getBillDate()
                    );

                    patientRepository.findById(
                            bill.getPatientId()
                    ).ifPresent(patient ->

                            billData.put(
                                    "patientName",
                                    patient.getName()
                            )
                    );

                    return billData;

                })
                .collect(Collectors.toList());
    }

    private void calculateAndSetFields(Bill bill) {
        double total = bill.getConsultationFee()
                + bill.getMedicationCost()
                + (bill.getWardCharges() * bill.getDaysAdmitted());
        bill.setTotalAmount(total);
        if (bill.getBillDate() == null) {
            bill.setBillDate(new java.sql.Timestamp(System.currentTimeMillis()));
        }
    }

    // =========================
    // ADD BILL
    // =========================

    @PostMapping

    public Bill addBill(
            @RequestBody Bill bill
    ) {

        calculateAndSetFields(bill);
        return repository.save(bill);
    }

    // =========================
    // UPDATE BILL
    // =========================

    @PutMapping("/{id}")

    public Bill updateBill(
            @PathVariable Integer id,
            @RequestBody Bill updatedBill
    ) {

        Bill bill =
                repository.findById(id)
                        .orElseThrow();

        bill.setPatientId(
                updatedBill.getPatientId()
        );

        bill.setConsultationFee(
                updatedBill.getConsultationFee()
        );

        bill.setMedicationCost(
                updatedBill.getMedicationCost()
        );

        bill.setWardCharges(
                updatedBill.getWardCharges()
        );

        bill.setDaysAdmitted(
                updatedBill.getDaysAdmitted()
        );

        bill.setDescription(
                updatedBill.getDescription()
        );

        bill.setBillDate(
                updatedBill.getBillDate()
        );

        calculateAndSetFields(bill);

        return repository.save(bill);
    }

    // =========================
    // DELETE BILL
    // =========================

    @DeleteMapping("/{id}")

    public void deleteBill(
            @PathVariable Integer id
    ) {

        repository.deleteById(id);
    }
}