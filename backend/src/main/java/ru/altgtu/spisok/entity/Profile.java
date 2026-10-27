package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Profile")
@Data
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Profile")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @Column(name = "Srok_obuch_mes")
    private Integer srokObuchMes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Napravlenie")
    private Napravlenie napravlenie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Form")
    private FormObuch formObuch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Ur")
    private UrObraz urObraz;
}