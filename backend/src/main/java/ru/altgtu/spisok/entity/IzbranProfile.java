package ru.altgtu.spisok.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Izbran_naprav")
public class IzbranNaprav {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "Izbran_naprav_ID_Izbr_napr_seq")
    @SequenceGenerator(name = "Izbran_naprav_ID_Izbr_napr_seq", sequenceName = "Izbran_naprav_ID_Izbr_napr_seq", allocationSize = 1)
    @Column(name = "ID_Izbr_napr")
    private Integer id;

    @Column(name = "ID_User", nullable = false)
    private Integer userId;

    @Column(name = "ID_Napravlenie", nullable = false)
    private Integer napravlenieId;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Integer getNapravlenieId() { return napravlenieId; }
    public void setNapravlenieId(Integer napravlenieId) { this.napravlenieId = napravlenieId; }
}
