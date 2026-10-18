package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "\"Vuz\"")
@Data
public class Vuz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Vuz")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @Column(name = "Abbreviatura", nullable = false, length = 100)
    private String abbreviatura;

    @Column(name = "Site", nullable = false, length = 100)
    private String site;

    @Column(name = "Email", nullable = false, length = 100)
    private String email;

    @Column(name = "Phone", nullable = false, length = 50)
    private String phone;
}