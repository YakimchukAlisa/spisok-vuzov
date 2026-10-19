package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Dop_Vozm")
@Data
public class DopVozm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Voz")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 200)
    private String name;
}