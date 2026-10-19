package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Ispitania")
@Data
public class Ispitania {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Ispit")
    private Integer id;

    // Ссылка на условия приёма (Post_info)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Info")
    private PostInfo postInfo;
}