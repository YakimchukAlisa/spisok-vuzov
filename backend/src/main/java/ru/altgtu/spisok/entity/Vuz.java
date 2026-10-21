package ru.altgtu.spisok.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Vuz")
@Data
public class Vuz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Vuz")
    private Integer id;

    @Column(name = "Name")
    private String name;

    @Column(name = "Abbreviatura")
    private String abbreviatura;

    @Column(name = "Opisanie", columnDefinition = "TEXT")
    private String opisanie;

    @Column(name = "Adress", columnDefinition = "TEXT")
    private String adress;

    @Column(name = "Site")
    private String site;

    @Column(name = "Email")
    private String email;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "VK_Url")
    private String vkUrl;

    @Column(name = "Telegram_Url")
    private String telegramUrl;

    @Column(name = "Max_Url")
    private String maxUrl;

    @Column(name = "Image_Url")
    private String imageUrl;

    @Column(name = "Logo_Url")
    private String logoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Gorod")
    private Gorod gorod;
}