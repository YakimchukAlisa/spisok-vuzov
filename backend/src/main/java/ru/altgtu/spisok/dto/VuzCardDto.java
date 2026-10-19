package ru.altgtu.spisok.dto;

public class VuzCardDto {
    private Integer id;
    private String name;
    private String fullName;
    private String imageUrl;
    private Integer budgetPlaces;
    private Integer budgetMinScore;
    private Integer paidPlaces;
    private Integer paidMinScore;
    private Integer paidMinPrice;

    // Пустой конструктор (нужен для Jackson при отправке JSON)
    public VuzCardDto() {
    }

    // Конструктор для Hibernate (ровно 8 аргументов, как в SQL-запросе)
    public VuzCardDto(Integer id, String name, String fullName, Integer budgetPlaces,
                      Integer budgetMinScore, Integer paidPlaces, Integer paidMinScore, Integer paidMinPrice) {
        this.id = id;
        this.name = name;
        this.fullName = fullName;
        this.budgetPlaces = budgetPlaces;
        this.budgetMinScore = budgetMinScore;
        this.paidPlaces = paidPlaces;
        this.paidMinScore = paidMinScore;
        this.paidMinPrice = paidMinPrice;
    }

    // --- Геттеры и сеттеры (без Lombok) ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getBudgetPlaces() { return budgetPlaces; }
    public void setBudgetPlaces(Integer budgetPlaces) { this.budgetPlaces = budgetPlaces; }

    public Integer getBudgetMinScore() { return budgetMinScore; }
    public void setBudgetMinScore(Integer budgetMinScore) { this.budgetMinScore = budgetMinScore; }

    public Integer getPaidPlaces() { return paidPlaces; }
    public void setPaidPlaces(Integer paidPlaces) { this.paidPlaces = paidPlaces; }

    public Integer getPaidMinScore() { return paidMinScore; }
    public void setPaidMinScore(Integer paidMinScore) { this.paidMinScore = paidMinScore; }

    public Integer getPaidMinPrice() { return paidMinPrice; }
    public void setPaidMinPrice(Integer paidMinPrice) { this.paidMinPrice = paidMinPrice; }
}