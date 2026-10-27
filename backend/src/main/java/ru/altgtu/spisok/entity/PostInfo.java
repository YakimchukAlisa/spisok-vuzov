package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Post_info")
@Data
public class PostInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Info")
    private Integer id;

    @Column(name = "Kol_mest", nullable = false)
    private Integer kolMest; // Количество мест

    @Column(name = "Stoimost", nullable = false)
    private Integer stoimost; // Стоимость

    @Column(name = "Prohodnoi", nullable = false)
    private Integer prohodnoi; // Проходной балл

    @Column(name = "God", nullable = false)
    private Integer god; // Год приёма

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Profile")
    private Profile profile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Osnov")
    private OsnovPriema osnovPriema;
}