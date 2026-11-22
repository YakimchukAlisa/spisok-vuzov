package ru.altgtu.spisok.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MRateParserService {

    private static final String JSON_URL = "https://m-rating.ru/data/ratings-2026.json";

    public record MRateRow(
            int rank,
            String vuzName,
            String code,
            String category,
            Double score,
            int monthNumber,
            String monthName
    ) {}

    private static final List<String> CATEGORIES = List.of(
            "consolidated", "smi", "social", "vk", "tg", "ok", "rt", "site", "agenda"
    );

    public List<MRateRow> parse() throws Exception {
        RestTemplate rest = new RestTemplate();
        String json = rest.getForObject(JSON_URL, String.class);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(json);

        List<MRateRow> result = new ArrayList<>();

        JsonNode months = root.path("months");
        if (!months.isArray()) return result;

        for (JsonNode month : months) {
            int monthNumber = month.path("number").asInt();
            String monthName = month.path("name").asText();
            JsonNode items = month.path("items");
            if (!items.isArray()) continue;

            // Для каждой категории — собираем пары (вуз, балл), сортируем, присваиваем ранг
            for (String category : CATEGORIES) {
                List<Map.Entry<JsonNode, Double>> entries = new ArrayList<>();

                for (JsonNode item : items) {
                    JsonNode scoreNode = item.path("scores").path(category);
                    if (scoreNode.isNull() || scoreNode.isMissingNode()) continue;
                    double score = scoreNode.asDouble();
                    if (score <= 0) continue; // пропускаем нулевые
                    entries.add(Map.entry(item, score));
                }

                // Сортировка по убыванию балла
                entries.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

                int rank = 1;
                for (Map.Entry<JsonNode, Double> e : entries) {
                    String name = e.getKey().path("name").asText();
                    String code = e.getKey().path("code").asText();
                    result.add(new MRateRow(
                            rank++,
                            name,
                            code,
                            category,
                            e.getValue(),
                            monthNumber,
                            monthName
                    ));
                }
            }
        }

        return result;
    }
}