package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

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

    @OneToMany(mappedBy = "napravlenie", fetch = FetchType.LAZY)
    private Set<Profile> profiles = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "Sphere_napravlenie",
            joinColumns = @JoinColumn(name = "ID_Napravlenie"),
            inverseJoinColumns = @JoinColumn(name = "ID_Sphere")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Sphere> spheres = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "Profession_napravlenie",
            joinColumns = @JoinColumn(name = "ID_Napravlenie"),
            inverseJoinColumns = @JoinColumn(name = "ID_Profession")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Profession> professions = new HashSet<>();
}