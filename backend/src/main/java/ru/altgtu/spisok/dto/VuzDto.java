package ru.altgtu.spisok.dto;

public class VuzDto {
    private Integer id;
    private String name;
    private String abbreviatura;
    private String opisanie;
    private String adress;
    private String site;
    private String email;
    private String phone;
    private String gorod;
    private String vkUrl;
    private String telegramUrl;
    private String maxUrl;
    private String imageUrl;
    private String logoUrl;
    private Integer budgetPlaces;
    private Integer budgetMinScore;
    private Integer paidPlaces;
    private Integer paidMinScore;
    private Integer paidMinPrice;

    public VuzDto() {
    }

    // Конструктор
    public VuzDto(Integer id, String name, String abbreviatura, String opisanie, String adress,
                  String site, String email, String phone,
                  String imageUrl, String logoUrl, String vkUrl, String telegramUrl, String maxUrl,
                  Integer budgetPlaces, Integer budgetMinScore,
                  Integer paidPlaces, Integer paidMinScore, Integer paidMinPrice) {
        this.id = id;
        this.name = name;
        this.abbreviatura = abbreviatura;
        this.opisanie = opisanie;
        this.adress = adress;
        this.site = site;
        this.email = email;
        this.phone = phone;
        this.imageUrl = imageUrl;
        this.logoUrl = logoUrl;
        this.vkUrl = vkUrl;
        this.telegramUrl = telegramUrl;
        this.maxUrl = maxUrl;
        this.budgetPlaces = budgetPlaces;
        this.budgetMinScore = budgetMinScore;
        this.paidPlaces = paidPlaces;
        this.paidMinScore = paidMinScore;
        this.paidMinPrice = paidMinPrice;
    }

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAbbreviatura() { return abbreviatura; }
    public void setAbbreviatura(String abbreviatura) { this.abbreviatura = abbreviatura; }

    public String getOpisanie() { return opisanie; }
    public void setOpisanie(String opisanie) { this.opisanie = opisanie; }

    public String getAdress() { return adress; }
    public void setAdress(String adress) { this.adress = adress; }

    public String getSite() { return site; }
    public void setSite(String site) { this.site = site; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGorod() { return gorod; }
    public void setGorod(String gorod) { this.gorod = gorod; }

    public String getVkUrl() { return vkUrl; }
    public void setVkUrl(String vkUrl) { this.vkUrl = vkUrl; }

    public String getTelegramUrl() { return telegramUrl; }
    public void setTelegramUrl(String telegramUrl) { this.telegramUrl = telegramUrl; }

    public String getMaxUrl() { return maxUrl; }
    public void setMaxUrl(String maxUrl) { this.maxUrl = maxUrl; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

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