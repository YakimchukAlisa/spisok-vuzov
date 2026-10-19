package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Form_obuch")
@Data
public class FormObuch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Form")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 50)
    private String name;
}