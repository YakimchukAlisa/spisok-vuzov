package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Napravlenie")
@Data
public class Napravlenie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Napravlenie")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @Column(name = "Kod", length = 20)
    private String kod;

    @Column(name = "Opisanie", columnDefinition = "TEXT")
    private String opisanie;

    // Связь с факультетом
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Fakultet")
    private Fakultet fakultet;
}