create table locations (
    id bigserial primary key,
    x  bigint not null,
    y  real not null,
    name text not null
);

create table routes (
    id serial primary key,
    name text not null,
    coord_x real not null,
    coord_y double precision not null check (coord_y <= 49),
    creation_date timestamp not null,
    from_location_id bigint references locations(id) on delete restrict,
    to_location_id   bigint references locations(id) on delete restrict,
    distance double precision check (distance is null or distance > 1),
    rating   double precision not null check (rating > 0)
);
