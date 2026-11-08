package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Sphere")
@Data
public class Sphere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Sphere")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "Opisanie", columnDefinition = "TEXT")
    private String opisanie;

    @Column(name = "Logo_Url", length = 255)     // 👈 новое
    private String logoUrl;

    @ManyToMany(mappedBy = "spheres")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Napravlenie> napravleniya = new HashSet<>();
}