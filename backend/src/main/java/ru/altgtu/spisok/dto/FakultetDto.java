package ru.altgtu.spisok.dto;

public class FakultetDto {
    private Integer id;
    private String name;
    private String description;
    private String logoUrl;

    public FakultetDto(Integer id, String name, String description, String logoUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.logoUrl = logoUrl;
    }

    public Integer getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getLogoUrl() { return logoUrl; }
}