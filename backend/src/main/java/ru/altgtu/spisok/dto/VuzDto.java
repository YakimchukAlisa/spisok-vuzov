package ru.altgtu.spisok.dto;

import lombok.Data;

@Data
public class VuzDto {
    private Integer id;
    private String name;
    private String abbreviatura;
    private String opisanie;
    private String adress;
    private String site;
    private String email;
    private String phone;
    private String gorod;    // название города
    private String region;   // название региона
}