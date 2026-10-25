package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Fakultet")
@Data
public class Fakultet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Fakultet")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Logo_Url")
    private String logoUrl;

    // Связь с вузом
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Vuz")
    private Vuz vuz;
}