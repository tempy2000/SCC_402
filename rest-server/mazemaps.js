const fs = require("fs");
const path = require("path");
const util = require("util");
const turf = require("@turf/turf");
const { getRouteColour } = require("./constants");


const config = {
    origin_directory: path.join("raw", "official"),
    target_directory: path.join("routes", "official"),
    paths: {
        a: {
            origin: "a-mm.json",
            target: "a.geojson",
            origin_location: "The Roundhouse",
            target_location: "The Chaplaincy Centre",
        },
        b: {
            origin: "b-mm.json",
            target: "b.geojson",
            origin_location: "Lancaster House Hotel",
            target_location: "The Red Lion",
        },
        c: {
            origin: "c-mm.json",
            target: "c.geojson",
            origin_location: "Cartmel College Bus Stop",
            target_location: "Graduate College Study Room",
        },
        combined: {
            target: "combined.geojson"
        }
    }
};

function load_geojson(path) {
    return JSON.parse(fs.readFileSync(path));
}

function save_geojson(path, geojson) {
    fs.writeFileSync(path, JSON.stringify(geojson, null));
}

function process_all() {

    // File paths
    const route_a_origin_path = path.join(__dirname, "data", config.origin_directory, config.paths.a.origin);
    const route_a_target_path = path.join(__dirname, "data", config.target_directory, config.paths.a.target);
    const route_b_origin_path = path.join(__dirname, "data", config.origin_directory, config.paths.b.origin);
    const route_b_target_path = path.join(__dirname, "data", config.target_directory, config.paths.b.target);
    const route_c_origin_path = path.join(__dirname, "data", config.origin_directory, config.paths.c.origin);
    const route_c_target_path = path.join(__dirname, "data", config.target_directory, config.paths.c.target);

    // Load and pre-process
    const route_a_geojson = clean_geojson(load_geojson(route_a_origin_path), { route: "a", origin: config.paths.a.origin_location, target: config.paths.a.target_location });
    const route_b_geojson = clean_geojson(load_geojson(route_b_origin_path), { route: "b", origin: config.paths.b.origin_location, target: config.paths.b.target_location });
    const route_c_geojson = clean_geojson(load_geojson(route_c_origin_path), { route: "c", origin: config.paths.c.origin_location, target: config.paths.c.target_location });

    // const route_a_geojson = Object.assign({}, clean(load_geojson(route_a_origin_path)), { properties: { route: "a", origin: config.paths.a.origin_location, target: config.paths.a.target_location } });
    // const route_b_geojson = Object.assign({}, clean(load_geojson(route_b_origin_path)), { properties: { route: "b", origin: config.paths.b.origin_location, target: config.paths.b.target_location } });
    // const route_c_geojson = Object.assign({}, clean(load_geojson(route_c_origin_path)), { properties: { route: "c", origin: config.paths.c.origin_location, target: config.paths.c.target_location } });

    // Save
    save_geojson(route_a_target_path, route_a_geojson);
    save_geojson(route_b_target_path, route_b_geojson);
    save_geojson(route_c_target_path, route_c_geojson);

    // Combine all
    combine_all_clean();
};

function combine_all_clean() {

    // File paths
    const route_a_target_path = path.join(__dirname, "data", config.target_directory, config.paths.a.target);
    const route_b_target_path = path.join(__dirname, "data", config.target_directory, config.paths.b.target);
    const route_c_target_path = path.join(__dirname, "data", config.target_directory, config.paths.c.target);
    const route_combined_target_path = path.join(__dirname, "data", config.target_directory, config.paths.combined.target);

    // Load pre-processed data
    const route_a_geojson = load_geojson(route_a_target_path);
    const route_b_geojson = load_geojson(route_b_target_path);
    const route_c_geojson = load_geojson(route_c_target_path);

    // Combine
    const combined = turf.featureCollection([
        ...route_a_geojson.features,
        ...route_b_geojson.features,
        ...route_c_geojson.features
    ]);

    save_geojson(route_combined_target_path, combined);
}

function clean_geojson(geojson, properties = { route, origin, target }) {

    // Check if geojson is valid
    if (!geojson) {
        console.warn("no geojson provided");
        return {};
    }

    // Extract properties
    const { route, origin, target } = properties;

    // Get colour
    const colour = getRouteColour(route).primary;

    // Create points array
    const points = turf.cleanCoords(turf.lineString(geojson.path.features.flatMap(feature => feature.geometry.coordinates), {
        route,
        "stroke": colour,
        "stroke-width": 10
    }));

    const origin_point = turf.point(points.geometry.coordinates[0], {
        route,
        name: origin,
        fill: colour,
        type: "origin",
        glyph: "A",
    });

    const target_point = turf.point(points.geometry.coordinates.slice(-1)[0], {
        route,
        name: target,
        fill: colour,
        type: "target",
        glyph: "B",
    });

    const feature_collection = turf.featureCollection([
        points,
        origin_point,
        target_point
    ]);

    // console.log("[clean]: result", util.inspect(feature_collection, { showHidden: false, colors: true, depth: null }));

    return feature_collection;
}

// Main
process_all();