package edu.itmo.is.lab1.controllers;

import edu.itmo.is.lab1.dto.RouteDto;
import edu.itmo.is.lab1.entities.Route;
import edu.itmo.is.lab1.services.RouteService;
import edu.itmo.is.lab1.websocket.Topics;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/routes", produces = "application/json")
public class RouteRestController {

    private final RouteService service;
    private final SimpMessagingTemplate ws;

    @GetMapping
    public Page<RouteDto> list(@RequestParam(required = false) String column,
                               @RequestParam(required = false) String equals,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "10") int size,
                               @RequestParam(defaultValue = "id,asc") String sort) {
        var parts = sort.split(",");
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.fromString(parts[1]), parts[0]));
        Page<Route> routes = service.list(column, equals, pageable);
        return routes.map(RouteDto::fromEntity);
    }

    @GetMapping("/{id}")
    public RouteDto get(@PathVariable Integer id) {
        return RouteDto.fromEntity(service.get(id));
    }

    @PostMapping(consumes = "application/json")
    public RouteDto create(@RequestBody @Valid RouteDto dto) {
        var saved = service.create(dto.toEntity());
        ws.convertAndSend(Topics.ROUTES, "changed");
        return RouteDto.fromEntity(saved);
    }

    @PutMapping(path="/{id}", consumes = "application/json")
    public RouteDto update(@PathVariable Integer id, @RequestBody @Valid RouteDto dto) {
        var saved = service.update(id, dto.toEntity());
        ws.convertAndSend(Topics.ROUTES, "changed");
        return RouteDto.fromEntity(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
        ws.convertAndSend(Topics.ROUTES, "changed");
    }

    // спец-операции (JSON)
    @PostMapping("/ops/deleteByRating")
    public long deleteByRating(@RequestParam Double rating) {
        long n = service.deleteByRating(rating);
        ws.convertAndSend(Topics.ROUTES, "changed");
        return n;
    }

    @GetMapping("/ops/countByRating")
    public long countByRating(@RequestParam Double rating) {
        return service.countByRating(rating);
    }
}
