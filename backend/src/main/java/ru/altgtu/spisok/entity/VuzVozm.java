package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Vuz_vozm")
@Data
public class VuzVozm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Vuz_Vozm")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Vuz")
    private Vuz vuz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Voz")
    private DopVozm dopVozm;
}
