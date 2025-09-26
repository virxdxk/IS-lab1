package edu.itmo.is.lab1.controllers;

import edu.itmo.is.lab1.entities.Route;
import edu.itmo.is.lab1.services.RouteService;
import edu.itmo.is.lab1.websocket.Topics;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/routes")
public class RouteController {
    private final RouteService service;
    private final SimpMessagingTemplate ws;

    @GetMapping
    public String list(@RequestParam(required = false) String column,
                       @RequestParam(required = false) String equals,
                       @RequestParam(defaultValue = "0") int page,
                       @RequestParam(defaultValue = "10") int size,
                       @RequestParam(defaultValue = "id,asc") String sort,
                       Model model) {
        var parts = sort.split(",");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(parts[1]), parts[0]));
        Page<Route> routes = service.list(column, equals, pageable);
        model.addAttribute("routes", routes);
        model.addAttribute("column", column);
        model.addAttribute("equals", equals);
        model.addAttribute("sort", sort);
        return "routes/list";
    }

    @GetMapping("/{id}")
    public String details(@PathVariable Integer id, Model m) {
        m.addAttribute("route", service.get(id));
        return "routes/details";
    }

    @PostMapping
    public String create(@ModelAttribute @Valid Route r) {
        service.create(r);
        ws.convertAndSend(Topics.ROUTES, "changed");
        return "redirect:/routes";
    }

    @PostMapping("/{id}")
    public String update(@PathVariable Integer id, @ModelAttribute @Valid Route r) {
        service.update(id, r);
        ws.convertAndSend(Topics.ROUTES, "changed");
        return "redirect:/routes/" + id;
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Integer id) {
        service.delete(id);
        ws.convertAndSend(Topics.ROUTES, "changed");
        return "redirect:/routes";
    }

    // спец-операции
    @PostMapping("/ops/deleteByRating")
    @ResponseBody
    public long deleteByRating(@RequestParam Double rating) {
        long n = service.deleteByRating(rating);
        ws.convertAndSend(Topics.ROUTES, "changed");
        return n;
    }

    @GetMapping("/ops/countByRating")
    @ResponseBody
    public long countByRating(@RequestParam Double rating) {
        return service.countByRating(rating);
    }
}
