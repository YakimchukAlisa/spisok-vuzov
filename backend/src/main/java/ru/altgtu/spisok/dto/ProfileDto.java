package ru.altgtu.spisok.dto;

import lombok.Data;

@Data
public class ProfileDto {
    private Integer id;
    private String name;
    private String forma;       // Название формы обучения
    private String uroven;      // Название уровня образования
    private Integer srokObuchMes; // Срок в месяцах
}