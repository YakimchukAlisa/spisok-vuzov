package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Profession")
@Data
public class Profession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Profession") // Проверьте точное название колонки ID в вашей БД
    private Integer id;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "Description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToMany(mappedBy = "professions")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Napravlenie> napravleniya = new HashSet<>();
}