package edu.itmo.is.lab1.entities;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Max;
import lombok.*;

@Embeddable @Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Coordinates {
    private float x;

    @Max(49)
    private double y;
}
