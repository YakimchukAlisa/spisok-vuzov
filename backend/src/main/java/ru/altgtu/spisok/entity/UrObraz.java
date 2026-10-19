package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Ur_obraz")
@Data
public class UrObraz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Ur")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 50)
    private String name;
}