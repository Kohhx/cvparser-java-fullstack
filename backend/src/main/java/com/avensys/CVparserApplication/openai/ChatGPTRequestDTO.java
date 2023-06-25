package com.avensys.CVparserApplication.openai;

import java.util.ArrayList;
import java.util.List;

public class ChatGPTRequestDTO {
    private String model;
    private List<Message> messages;
    private double temperature;


    public ChatGPTRequestDTO(String model, String prompt, double temperature) {
        this.model = model;
        this.messages = new ArrayList<>();
        this.messages.add(new Message("user",prompt));
        this.temperature = temperature;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}
