package com.avensys.CVparserApplication.utility;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Iterator;
import java.util.Map;

public class JSONUtil {

    public static String mergeJsonObjects(String... jsonObjects) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode mergedNode = objectMapper.createObjectNode();

            for (String jsonObject : jsonObjects) {
                JsonNode jsonNode = objectMapper.readTree(jsonObject);
                mergeJsonNode(mergedNode, jsonNode);
            }

            return objectMapper.writeValueAsString(mergedNode);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static void mergeJsonNode(ObjectNode target, JsonNode source) {
        for (Iterator<Map.Entry<String, JsonNode>> it = source.fields(); it.hasNext();) {
            Map.Entry<String, JsonNode> entry = it.next();
            String fieldName = entry.getKey();
            JsonNode sourceValue = entry.getValue();

            JsonNode targetValue = target.get(fieldName);
            if (targetValue != null && targetValue.isObject() && sourceValue.isObject()) {
                // Recursive merge for nested JSON objects
                mergeJsonNode((ObjectNode) targetValue, sourceValue);
            } else {
                // Non-nested merge or overwrite
                target.set(fieldName, sourceValue);
            }
        }
    }
}
