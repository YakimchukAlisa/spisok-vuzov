package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Treb_exam")
@Data
public class TrebExam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Treb")
    private Integer id;

    @Column(name = "Min_ball")
    private Integer minBall;

    @Column(name = "Forma_sdachi")
    private String formaSdachi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Exam")
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Ispit")
    private Ispitania ispitania;
}