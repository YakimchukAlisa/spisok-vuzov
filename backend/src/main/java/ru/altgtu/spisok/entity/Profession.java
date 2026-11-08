package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

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

    // Если вам нужна связь со сферами прямо в сущности (для Hibernate):
    // @ManyToMany(mappedBy = "professions")
    // @ToString.Exclude
    // @EqualsAndHashCode.Exclude
    // private Set<Sphere> spheres = new HashSet<>();
}