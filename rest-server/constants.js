// https://cs.uwaterloo.ca/~dmasson/tools/latin_square/
function balancedLatinSquare(conditions, participant_id) {
    result = [];

    // Based on "Bradley, J. V. Complete counterbalancing of immediate sequential effects in a Latin square design. J. Amer. Statist. Ass.,.1958, 53, 525-528. "
    for (let i = 0, j = 0, h = 0; i < conditions.length; ++i) {
        let val = 0;
        if (i < 2 || i % 2 != 0) {
            val = j++;
        } else {
            val = conditions.length - h - 1;
            ++h;
        }

        let idx = (val + participant_id) % conditions.length;
        result.push(conditions[idx]);
    }

    if (conditions.length % 2 != 0 && participant_id % 2 != 0) {
        result = result.reverse();
    }

    return result;
}

/**
 * const LATIN_SQUARE = [
 *     { participant: 1, route_a: "ar", route_b: "2d", route_c: "ar-minimap" },
 *     { participant: 2, route_a: "ar", route_b: "ar-minimap", route_c: "2d" },
 *     { participant: 3, route_a: "ar-minimap", route_b: "ar", route_c: "2d" },
 *     { participant: 4, route_a: "ar-minimap", route_b: "2d", route_c: "ar" },
 *     { participant: 5, route_a: "2d", route_b: "ar-minimap", route_c: "ar" },
 *     { participant: 6, route_a: "2d", route_b: "ar", route_c: "ar-minimap" },
 * 
 *     // repeated as "balanced latin square"
 *     { participant: 7, route_a: "ar", route_b: "2d", route_c: "ar-minimap" },
 *     { participant: 8, route_a: "ar", route_b: "ar-minimap", route_c: "2d" },
 *     { participant: 9, route_a: "ar-minimap", route_b: "ar", route_c: "2d" },
 *     { participant: 10, route_a: "ar-minimap", route_b: "2d", route_c: "ar-minimap" },
 *     { participant: 11, route_a: "2d", route_b: "ar-minimap", route_c: "ar-minimap" },
 *     { participant: 12, route_a: "2d", route_b: "ar", route_c: "ar-minimap" },
 * ];
 */
module.exports.generateLatinSquare = function ({ participants = 12, conditions = ["ar", "2d", "ar-minimap"], route_ids = ["a", "b", "c"] } = {}) {
    return Array.from({ length: participants }, (_, i) => i).map(i => {
        const order = balancedLatinSquare(conditions, i);
        return { participant_id: i + 1, ...route_ids.reduce((prev, curr, idx) => ({ ...prev, [curr]: order[idx] }), {}) };
    });
};

module.exports.getParticipantId = function ({ a = "?", b = "?", c = "?", conditions = ["ar", "2d", "ar-minimap"], latin_square } = {}) {
    // Validation
    if (!latin_square) {
        throw new Error("latin square must not be undefined");
    }

    if (conditions.includes(a)) {
        conditions.splice(conditions.indexOf(a), 1);
    } else {
        throw new Error(`expected a to be either "ar", "2d" or "ar-minimap" but instead got ${a}`);
    }

    if (conditions.includes(b)) {
        conditions.splice(conditions.indexOf(b), 1);
    } else {
        throw new Error(`expected b to be either "ar", "2d" or "ar-minimap" but instead got ${b}`);
    }

    if (conditions.includes(c)) {
        conditions.splice(conditions.indexOf(c), 1);
    } else {
        throw new Error(`expected c to be either "ar", "2d" or "ar-minimap" but instead got ${c}`);
    }

    // Return possible rows
    return latin_square.filter(row => row.a === a && row.b === b && row.c === c);
};;

module.exports.getParticipantColour = function (participant_id) {
    switch (participant_id) {
        case 1:
            return { primary: "#e6194B", secondary: "#ffffff" }; // Red
        case 2:
            return { primary: "#3cb44b", secondary: "#ffffff" }; // Green
        case 3:
            return { primary: "#aaff19", secondary: "#000000" }; // Lime
        case 4:
            return { primary: "#4363d8", secondary: "#ffffff" }; // Blue
        case 5:
            return { primary: "#f58231", secondary: "#ffffff" }; // Orange
        case 6:
            return { primary: "#42d4f4", secondary: "#000000" }; // Cyan
        case 7:
            return { primary: "#f032e6", secondary: "#ffffff" }; // Magenta
        case 8:
            return { primary: "#fabed4", secondary: "#000000" }; // Pink
        case 9:
            return { primary: "#000075", secondary: "#ffffff" }; // Navy
        case 10:
            return { primary: "#9A6324", secondary: "#ffffff" }; // Brown
        case 11:
            return { primary: "#dcbeff", secondary: "#000000" }; // Lavender
        case 12:
            return { primary: "#800000", secondary: "#ffffff" }; // Maroon
        default:
            return { primary: "#000000", secondary: "#ffffff" }; // Black
    }
};

module.exports.getRouteColour = function (route_id) {
    switch (route_id) {
        case "a":
            return { primary: "#e6194B", secondary: "#ffffff" }; // Red
        case "b":
            return { primary: "#3cb44b", secondary: "#ffffff" }; // Green
        case "c":
            return { primary: "#4363d8", secondary: "#ffffff" }; // Blue
        default:
            return { primary: "#000000", secondary: "#ffffff" }; // Black
    }
};

module.exports.getInterfaceColour = function (interface_type) {
    switch (interface_type) {
        case "2d":
            return { primary: "#e9723d", secondary: "#ffffff" }; // Orange
        case "ar":
            return { primary: "#7e14ed", secondary: "#ffffff" }; // Purple
        case "ar-minimap":
            return { primary: "#0a9ad7", secondary: "#ffffff" }; // Cyan
        default:
            return { primary: "#000000", secondary: "#ffffff" }; // Black
    }
};

// #0a9ad7 cyan
// #d70a9a magenta
// #9ad70a lime

// switch (interface_type) {
//     case "2d":
//         return { primary: "#e6194B", secondary: "#ffffff" }; // Red
//     case "ar":
//         return { primary: "#3cb44b", secondary: "#ffffff" }; // Green
//     case "ar-minimap":
//         return { primary: "#4363d8", secondary: "#ffffff" }; // Blue
//     default:
//         return { primary: "#000000", secondary: "#ffffff" }; // Black
// }

// switch (interface_type) {
//     case "2d":
//         return { primary: "#42d4f4", secondary: "#000000" }; // Cyan
//     case "ar":
//         return { primary: "#aaff19", secondary: "#000000" }; // Lime
//     case "ar-minimap":
//         return { primary: "#f032e6", secondary: "#ffffff" }; // Magenta
//     default:
//         return { primary: "#000000", secondary: "#ffffff" }; // Black
// }