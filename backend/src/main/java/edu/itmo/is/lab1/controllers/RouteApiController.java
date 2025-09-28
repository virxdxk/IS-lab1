package edu.itmo.is.lab1.controllers;

import edu.itmo.is.lab1.dto.RouteDto;
import edu.itmo.is.lab1.services.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteApiController {

    private final RouteService service;

    @GetMapping
    public Page<RouteDto> list(
            @RequestParam(required = false) String column,
            @RequestParam(required = false) String equals,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort
    ) {
        String[] parts = sort.split(",", 2);
        String sortProp = parts[0];
        String sortDir = parts.length > 1 ? parts[1] : "asc";

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.fromString(sortDir), sortProp)
        );

        return service.list(column, equals, pageable).map(RouteDto::fromEntity);
    }

    @GetMapping("/{id}")
    public RouteDto get(@PathVariable Integer id) {
        return RouteDto.fromEntity(service.get(id));
    }

    @PostMapping
    public RouteDto create(@RequestBody @Valid RouteDto dto) {
        return RouteDto.fromEntity(service.create(dto.toEntity()));
    }

    @PutMapping("/{id}")
    public RouteDto update(@PathVariable Integer id, @RequestBody @Valid RouteDto dto) {
        return RouteDto.fromEntity(service.update(id, dto.toEntity()));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    // ops
    @PostMapping("/ops/deleteByRating")
    public long deleteByRating(@RequestParam Double rating) {
        return service.deleteByRating(rating);
    }

    @GetMapping("/ops/countByRating")
    public long countByRating(@RequestParam Double rating) {
        return service.countByRating(rating);
    }
}
