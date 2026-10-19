package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Osnov_priema")
@Data
public class OsnovPriema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Osnov")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 50)
    private String name;
}