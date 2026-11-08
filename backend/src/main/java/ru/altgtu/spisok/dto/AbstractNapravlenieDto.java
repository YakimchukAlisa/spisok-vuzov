package ru.altgtu.spisok.dto;

import lombok.Data;

@Data
public class AbstractNapravlenieDto {
    private Integer id;        // "якорный" id — MIN(ID_Napravlenie) из группы
    private String kod;        // 08.04.01
    private String name;       // Строительство
    private String opisanie;
    private Long vuzCount;     // сколько вузов предлагают это направление
    private String uroven;
    private Long professionCount;
}