const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const util = require("util");
const turf = require("@turf/turf");
const { generateLatinSquare, getParticipantId, getParticipantColour, getInterfaceColour, getRouteColour } = require("./constants");

function create_entry({ a = { ssid: "?", interface: "?", logs: [] }, b = { ssid: "?", interface: "?", logs: [] }, c = { ssid: "?", interface: "?", logs: [] } } = {}) {
    return { a, b, c };
}

// Collector
const participant_logs = [];

////////////////////////////////////////////////////////////////////////////////
// Manually mapped log files
////////////////////////////////////////////////////////////////////////////////

// 08/12/2021 - 14:32:25 (study iteration = 0)
participant_logs.push(create_entry({
    // 14:32:25
    a: {
        ssid: "05a7f313-84f7-4fb2-b019-601c40e2b0e5",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-a_1638973945092.json",
            "./data/raw/ungrouped/AR_route-a_1638974004162.json",
            "./data/raw/ungrouped/AR_route-a_1638974064213.json",
            "./data/raw/ungrouped/AR_route-a_1638974124265.json",
            "./data/raw/ungrouped/AR_route-a_1638974184308.json",
        ]
    },
    // 14:49:35
    b: {
        ssid: "05a7f313-84f7-4fb2-b019-601c40e2b0e5",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-b_1638974975930.json",
            "./data/raw/ungrouped/2D_route-b_1638975035017.json",
            "./data/raw/ungrouped/2D_route-b_1638975095137.json",
            "./data/raw/ungrouped/2D_route-b_1638975185269.json",
        ]
    },
    // 15:03:05
    c: {
        ssid: "05a7f313-84f7-4fb2-b019-601c40e2b0e5",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-c_1638975785870.json",
            "./data/raw/ungrouped/AR-Minimap_route-c_1638975844953.json",
            "./data/raw/ungrouped/AR-Minimap_route-c_1638975905024.json",
        ]
    },
}));

// 09/12/2021 - 14:42:39 (study iteration = 1)
participant_logs.push(create_entry({
    // 14:42:39
    a: {
        ssid: "bc0eec6f-2f5c-4888-b6f5-cb2fb4cb277d",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-a_1639060959659.json",
            "./data/raw/ungrouped/AR_route-a_1639061018705.json",
            "./data/raw/ungrouped/AR_route-a_1639061078756.json",
            "./data/raw/ungrouped/AR_route-a_1639061138802.json",
        ]
    },
    // 14:58:23
    b: {
        ssid: "bc0eec6f-2f5c-4888-b6f5-cb2fb4cb277d",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-b_1639061903297.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639061962377.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639062022494.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639062082582.json",
        ]
    },
    // 15:06:10
    c: {
        ssid: "bc0eec6f-2f5c-4888-b6f5-cb2fb4cb277d",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-c_1639062370909.json",
            "./data/raw/ungrouped/2D_route-c_1639062429997.json",
            "./data/raw/ungrouped/2D_route-c_1639062490074.json",
        ]
    },
}));

// 10/12/2021 - 10:06:41 (study iteration = 2)
participant_logs.push(create_entry({
    // 10:06:41
    a: {
        ssid: "2949c464-2d78-499b-aea2-b103a3007c96",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-a_1639130801553.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639130860654.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639130920765.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639130980876.json",
        ]
    },
    b: {
        ssid: "2949c464-2d78-499b-aea2-b103a3007c96",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-b_1639131674172.json",
            "./data/raw/ungrouped/AR_route-b_1639131733281.json",
            "./data/raw/ungrouped/AR_route-b_1639131793394.json",
            "./data/raw/ungrouped/AR_route-b_1639131853501.json",
            "./data/raw/ungrouped/AR_route-b_1639131913608.json",
        ]
    },
    c: {
        ssid: "2949c464-2d78-499b-aea2-b103a3007c96",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-c_1639132208266.json",
            "./data/raw/ungrouped/2D_route-c_1639132267398.json",
            "./data/raw/ungrouped/2D_route-c_1639132327565.json",
            "./data/raw/ungrouped/2D_route-c_1639132387710.json",
        ]
    },
}));

// 10/12/2021 - 13:13:06 (study iteration = 3)
participant_logs.push(create_entry({
    // 13:13:06
    a: {
        ssid: "a103bed4-8ad0-4ae6-b0bf-b35d1b8f9d0d",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-a_1639141927598.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639141986599.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639142046599.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639142106598.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639142166599.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639142226611.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639142286611.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639142346602.json",
        ]
    },
    b: {
        ssid: "a103bed4-8ad0-4ae6-b0bf-b35d1b8f9d0d",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-b_1639143073125.json",
            "./data/raw/ungrouped/2D_route-b_1639143132129.json",
            "./data/raw/ungrouped/2D_route-b_1639143192132.json",
            "./data/raw/ungrouped/2D_route-b_1639143252125.json",
        ]
    },
    c: {
        ssid: "a103bed4-8ad0-4ae6-b0bf-b35d1b8f9d0d",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-c_1639143539991.json",
            "./data/raw/ungrouped/AR_route-c_1639143599050.json",
            "./data/raw/ungrouped/AR_route-c_1639143659109.json",
        ]
    },
}));

// 11/12/2021 - 13:54:20
participant_logs.push(create_entry({
    // 13:54:20
    a: {
        ssid: "b5fe667d-f8fc-4c6e-b8b9-8973e399cbdc",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-a_1639230860913.json",
            "./data/raw/ungrouped/2D_route-a_1639230921086.json",
            "./data/raw/ungrouped/2D_route-a_1639230982843.json",
            "./data/raw/ungrouped/2D_route-a_1639231043956.json",
            "./data/raw/ungrouped/2D_route-a_1639231105182.json",
            "./data/raw/ungrouped/2D_route-a_1639231165892.json",
        ]
    },
    b: {
        ssid: "b5fe667d-f8fc-4c6e-b8b9-8973e399cbdc",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-b_1639231920306.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639231979585.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639232039685.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639232099736.json",
        ]
    },
    c: {
        ssid: "b5fe667d-f8fc-4c6e-b8b9-8973e399cbdc",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-c_1639232849900.json",
            "./data/raw/ungrouped/AR_route-c_1639232908948.json",
            "./data/raw/ungrouped/AR_route-c_1639232969007.json",
            "./data/raw/ungrouped/AR_route-c_1639233029068.json",
        ]
    },
}));

// 12/12/2021 - 16:10:42
participant_logs.push(create_entry({
    // 16:10:42
    a: {
        ssid: "94a13886-b143-4fd2-8259-b22ed22ca8f9",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-a_1639325442843.json",
            "./data/raw/ungrouped/AR_route-a_1639325502912.json",
            "./data/raw/ungrouped/AR_route-a_1639325564103.json",
            "./data/raw/ungrouped/AR_route-a_1639325625304.json",
            "./data/raw/ungrouped/AR_route-a_1639325686505.json",
            "./data/raw/ungrouped/AR_route-a_1639325747705.json",
        ]
    },
    b: {
        ssid: "94a13886-b143-4fd2-8259-b22ed22ca8f9",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-b_1639326607479.json",
            "./data/raw/ungrouped/2D_route-b_1639326666555.json",
            "./data/raw/ungrouped/2D_route-b_1639326726618.json",
            "./data/raw/ungrouped/2D_route-b_1639326786697.json",
            "./data/raw/ungrouped/2D_route-b_1639326846792.json",
        ]
    },
    c: {
        ssid: "94a13886-b143-4fd2-8259-b22ed22ca8f9",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-c_1639327333114.json",
            "./data/raw/ungrouped/AR-Minimap_route-c_1639327393173.json",
            "./data/raw/ungrouped/AR-Minimap_route-c_1639327454385.json",
            "./data/raw/ungrouped/AR-Minimap_route-c_1639327515572.json",
        ]
    },
}));

// 14/12/2021 - 12:51:25
participant_logs.push(create_entry({
    a: {
        ssid: "918cd308-2eeb-4fd9-a017-50d5941a34c1",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-a_1639486285926.json",
            "./data/raw/ungrouped/AR_route-a_1639486345499.json",
            "./data/raw/ungrouped/AR_route-a_1639486405672.json",
            "./data/raw/ungrouped/AR_route-a_1639486465838.json",
            "./data/raw/ungrouped/AR_route-a_1639486525999.json",
        ]
    },
    b: {
        ssid: "52061ccd-c77a-4bcd-8cc4-ea686d2d2ff0",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-b_1639487163105.json",
            "./data/raw/ungrouped/2D_route-b_1639487222173.json",
            "./data/raw/ungrouped/2D_route-b_1639487282289.json",
            "./data/raw/ungrouped/2D_route-b_1639487342406.json",
        ]
    },
    c: {
        ssid: "32e44fe5-e037-4c79-b326-35c77d472121",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-c_1639487618449.json",
            "./data/raw/ungrouped/AR-Minimap_route-c_1639487677538.json",
            "./data/raw/ungrouped/AR-Minimap_route-c_1639487737613.json",
        ]
    },
}));

// 14/12/2021 - 13:37:28
participant_logs.push(create_entry({
    // 13:37:28
    a: {
        ssid: "e161c5d5-4258-48c8-973c-43e05f651a58",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-a_1639489048123.json",
            "./data/raw/ungrouped/2D_route-a_1639489107170.json",
            "./data/raw/ungrouped/2D_route-a_1639489167170.json",
            "./data/raw/ungrouped/2D_route-a_1639489227176.json",
        ]
    },
    // 14:54:13
    b: {
        ssid: "e161c5d5-4258-48c8-973c-43e05f651a58",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-b_1639493653896.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639493712932.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639493772910.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639493832915.json",
        ]
    },
    // 15:04:09
    c: {
        ssid: "e161c5d5-4258-48c8-973c-43e05f651a58",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-c_1639494249291.json",
            "./data/raw/ungrouped/AR_route-c_1639494308292.json",
            "./data/raw/ungrouped/AR_route-c_1639494368292.json",
            "./data/raw/ungrouped/AR_route-c_1639494428292.json",
            "./data/raw/ungrouped/AR_route-c_1639494488292.json",
        ]
    },
}));

// 14/12/2021 - 13:44:24
participant_logs.push(create_entry({
    // 13:44:24
    a: {
        ssid: "4b03550b-6cd0-4f25-8b91-337bb68f5511",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-a_1639489464703.json",
            "./data/raw/ungrouped/2D_route-a_1639489523730.json",
            "./data/raw/ungrouped/2D_route-a_1639489585770.json",
            "./data/raw/ungrouped/2D_route-a_1639489645815.json",
        ]
    },
    // 14:45:46
    b: {
        ssid: "96f24cdd-90c3-4d84-b037-83330e2a8d53",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-b_1639493146315.json",
            // MISSING batch = 1,
            "./data/raw/ungrouped/AR_route-b_1639493265344.json",
            "./data/raw/ungrouped/AR_route-b_1639493325321.json",

        ]
    },
    // 14:54:09
    c: {
        ssid: "96f24cdd-90c3-4d84-b037-83330e2a8d53",
        interface: "ar-minimap",
        logs: [
            // MISSING batch = 0,
            "./data/raw/ungrouped/AR-Minimap_route-c_1639493649287.json",
            "./data/raw/ungrouped/AR-Minimap_route-c_1639493709297.json",
        ]
    },
}));

// 14/12/2021 - 15:31:17
participant_logs.push(create_entry({
    // 15:31:17
    a: {
        ssid: "ffbcc906-1f39-4fd6-9bfa-59c901173e4e",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-a_1639495877016.json",
            "./data/raw/ungrouped/AR_route-a_1639495936064.json",
            "./data/raw/ungrouped/AR_route-a_1639495996111.json",
            "./data/raw/ungrouped/AR_route-a_1639496056158.json",
        ]
    },
    // 15:49:20
    b: {
        ssid: "ffbcc906-1f39-4fd6-9bfa-59c901173e4e",
        interface: "ar-minimap",
        logs: [
            // Only 1 log file?
            "./data/raw/ungrouped/AR-Minimap_route-b_1639496960603.json",
        ]
    },
    // 15:53:45
    c: {
        ssid: "ffbcc906-1f39-4fd6-9bfa-59c901173e4e",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-c_1639497225746.json",
            "./data/raw/ungrouped/2D_route-c_1639497284801.json",
            "./data/raw/ungrouped/2D_route-c_1639497344870.json",
        ]
    },
}));

// 14/12/2021 - 16:14:51
participant_logs.push(create_entry({
    // 16:14:51
    a: {
        ssid: "420c753b-1fcd-4f93-986b-181fe5b55074",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-a_1639498491239.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639498550269.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639498610296.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639498670342.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639498730370.json",
        ]
    },
    // 16:29:05
    b: {
        ssid: "420c753b-1fcd-4f93-986b-181fe5b55074",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-b_1639499345409.json",
            "./data/raw/ungrouped/AR_route-b_1639499404473.json",
            "./data/raw/ungrouped/AR_route-b_1639499466440.json",
            "./data/raw/ungrouped/AR_route-b_1639499527643.json",
            "./data/raw/ungrouped/AR_route-b_1639499589561.json",
        ]
    },
    // 16:37:29
    c: {
        ssid: "420c753b-1fcd-4f93-986b-181fe5b55074",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-c_1639499849766.json",
            "./data/raw/ungrouped/2D_route-c_1639499908831.json",
            "./data/raw/ungrouped/2D_route-c_1639499968902.json",
            "./data/raw/ungrouped/2D_route-c_1639500028962.json",
        ]
    },
}));

// 15/12/2021 - 10:29:41
participant_logs.push(create_entry({
    // 10:29:41
    a: {
        ssid: "76f132d0-d315-4648-b842-5c04b7ac1738",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-a_1639564181056.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639564240056.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639564300056.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639564360057.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639564420056.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639564480056.json",
            "./data/raw/ungrouped/AR-Minimap_route-a_1639564540065.json",
        ]
    },
    // 10:51:51
    b: {
        ssid: "76f132d0-d315-4648-b842-5c04b7ac1738",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-b_1639565511092.json",
            "./data/raw/ungrouped/2D_route-b_1639565570104.json",
            "./data/raw/ungrouped/2D_route-b_1639565630110.json",
            "./data/raw/ungrouped/2D_route-b_1639565690092.json",
            "./data/raw/ungrouped/2D_route-b_1639565750111.json",
        ]
    },
    // 11:03:26
    c: {
        ssid: "96f24cdd-90c3-4d84-b037-83330e2a8d53",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-c_1639566206868.json",
            "./data/raw/ungrouped/AR_route-c_1639566265877.json",
            "./data/raw/ungrouped/AR_route-c_1639566325871.json",
            "./data/raw/ungrouped/AR_route-c_1639566385873.json",
            "./data/raw/ungrouped/AR_route-c_1639566445877.json",
            "./data/raw/ungrouped/AR_route-c_1639566505871.json",
            "./data/raw/ungrouped/AR_route-c_1639566537185.json",
        ]
    },
}));

// // 16/12/2021 - 12:12:24
participant_logs.push(create_entry({
    // 12:12:24
    a: {
        ssid: "e58c708b-3b9e-4255-a3e3-b848a0a046ad",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-a_1639656744773.json",
            "./data/raw/ungrouped/2D_route-a_1639656804849.json",
            "./data/raw/ungrouped/2D_route-a_1639656866133.json",
            "./data/raw/ungrouped/2D_route-a_1639656927363.json",
            "./data/raw/ungrouped/2D_route-a_1639656988637.json",
        ]
    },
    // 12:28:28
    b: {
        ssid: "e58c708b-3b9e-4255-a3e3-b848a0a046ad",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-b_1639657708444.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639657768503.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639657829704.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639657890905.json",
            "./data/raw/ungrouped/AR-Minimap_route-b_1639657952105.json",
        ]
    },
    // 12:40:34
    c: {
        ssid: "e58c708b-3b9e-4255-a3e3-b848a0a046ad",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-c_1639658375432.json",
            "./data/raw/ungrouped/AR_route-c_1639658434512.json",
            "./data/raw/ungrouped/AR_route-c_1639658494603.json",
            "./data/raw/ungrouped/AR_route-c_1639658554667.json",
            "./data/raw/ungrouped/AR_route-c_1639658614756.json",
        ]
    },
}));

// 18/12/2021 - 22:28:53
participant_logs.push(create_entry({
    // 22:28:53
    a: {
        ssid: "2e714dcb-0eac-4bbf-aba0-4823edc6534a",
        interface: "2d",
        logs: [
            "./data/raw/ungrouped/2D_route-a_1639866533940.json",
            "./data/raw/ungrouped/2D_route-a_1639866592958.json",
            "./data/raw/ungrouped/2D_route-a_1639866652941.json",
        ]
    },
    // 22:41:20
    b: {
        ssid: "2e714dcb-0eac-4bbf-aba0-4823edc6534a",
        interface: "ar",
        logs: [
            "./data/raw/ungrouped/AR_route-b_1639867280879.json",
            "./data/raw/ungrouped/AR_route-b_1639867339880.json",
            "./data/raw/ungrouped/AR_route-b_1639867399880.json",
            "./data/raw/ungrouped/AR_route-b_1639867459883.json",
            "./data/raw/ungrouped/AR_route-b_1639867519883.json",
        ]
    },
    // 22:50:22
    c: {
        ssid: "2e714dcb-0eac-4bbf-aba0-4823edc6534a",
        interface: "ar-minimap",
        logs: [
            "./data/raw/ungrouped/AR-Minimap_route-c_1639867822327.json",
            "./data/raw/ungrouped/AR-Minimap_route-c_1639867881328.json",
            "./data/raw/ungrouped/AR-Minimap_route-c_1639867941341.json",
        ]
    },
}));

////////////////////////////////////////////////////////////////////////////////
// Testing
////////////////////////////////////////////////////////////////////////////////

console.log(util.inspect(participant_logs, { colors: true, depth: null, showHidden: false }));

// Create the latin square for our project
const latin_square = generateLatinSquare();

// const required_ids = latin_square.map(row => ({ [row.participant_id]: false }));
const required_ids = latin_square.reduce((prev, curr) => {
    return { ...prev, [curr.participant_id]: { mapped: false, mapped_log: null, candidate_logs: [] } };
}, {});

// Construct a dummy mapping of sorts
participant_logs.forEach((participant, index) => {
    const candidate_ids = getParticipantId({
        a: participant.a.interface,
        b: participant.b.interface,
        c: participant.c.interface,
        latin_square
    });

    let mapped = false;
    for (let i = 0; i < candidate_ids.length && !mapped; i++) {
        const current_id = candidate_ids[i].participant_id;

        if (!required_ids[current_id].mapped) {
            required_ids[current_id].mapped = true;
            required_ids[current_id].mapped_log = index;
            mapped = true;
        } else {
            required_ids[current_id].candidate_logs.push(index);
            console.log("participant", current_id, "already has a log mapping");
        }
    }

    if (!mapped) {
        const possible_ids = candidate_ids.map(r => r.participant_id);
        console.log("log", index, "is likely participant(s):", possible_ids, "but all are currently mapped (if this log was generated more recently, then its possible that this log should replace a previous mapping)");
    }

    // console.log(`[${index}] is likely participant:`, candidate_ids);
});

// Display the created dummy mapping
Object.keys(required_ids).forEach(pid => {
    console.log();

    const row = required_ids[pid];
    console.log("participant id =", Number.parseInt(pid));

    const mapped_log = participant_logs[row.mapped_log];
    const candidate_logs = participant_logs.filter((l, i) => row.candidate_logs.includes(i));

    const mapped_ssid = new Set();
    mapped_ssid.add(mapped_log.a.ssid);
    mapped_ssid.add(mapped_log.b.ssid);
    mapped_ssid.add(mapped_log.c.ssid);

    console.log("  - mapped log =", row.mapped_log);
    console.log("    - ssid(s) =", "[", Array.from(mapped_ssid).map(s => chalk.green("'" + s + "'")).join(" "), "]");
    console.log("    - route a =", mapped_log.a.logs.length, "entries");
    console.log("    - route b =", mapped_log.b.logs.length, "entries");
    console.log("    - route c =", mapped_log.c.logs.length, "entries");

    candidate_logs.forEach((l, i) => {
        console.log();

        const candidate_ssid = new Set();
        candidate_ssid.add(l.a.ssid);
        candidate_ssid.add(l.b.ssid);
        candidate_ssid.add(l.c.ssid);

        console.log("  - candidate log =", i);
        console.log("    - ssid(s) =", "[", Array.from(candidate_ssid).map(s => chalk.green("'" + s + "'")).join(", "), "]");
        console.log("    - route a =", l.a.logs.length, "entries");
        console.log("    - route b =", l.b.logs.length, "entries");
        console.log("    - route c =", l.c.logs.length, "entries");
    });
});

////////////////////////////////////////////////////////////////////////////////
// Combining "study iteration" log files
////////////////////////////////////////////////////////////////////////////////

// https://nestedsoftware.com/2018/03/20/calculating-a-moving-average-on-streaming-data-5a7k.22879.html
const sum = values => values.reduce((a, b) => a + b, 0);

const validate = values => {
    if (!values || values.length == 0) {
        throw new Error("mean is undefined");
    }
};

const simple_mean = values => {
    validate(values);

    const mean = sum(values) / values.length;

    return mean;
};

const simple_stats = values => {
    const mean = simple_mean(values);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const d_squared = sum(values.map(value => (value - mean) ** 2));
    const population_variance = d_squared / values.length;
    const sample_variance = values.length > 1 ? d_squared / (values.length - 1) : 0;
    const population_std = Math.sqrt(population_variance);
    const sample_std = Math.sqrt(sample_variance);

    return {
        min,
        max,
        mean,
        population_variance,
        sample_variance,
        population_std,
        sample_std
    };
};

function getParticipantIdFromStudyIteration(study_iteration) {
    switch (study_iteration) {
        case 0: return { id: 1, removed: true };
        case 1: return { id: 2, removed: false };
        case 2: return { id: 3, removed: false };
        case 3: return { id: 4, removed: false };
        case 4: return { id: 5, removed: true };
        case 5: return { id: 7, removed: false };
        case 6: return { id: 1, removed: false };
        case 7: return { id: 5, removed: false };
        case 8: return { id: 6, removed: false };
        case 9: return { id: 8, removed: false };
        case 10: return { id: 9, removed: false };
        case 11: return { id: 10, removed: false };
        case 12: return { id: 11, removed: false };
        case 13: return { id: 12, removed: false };
        default: return { id: null, removed: false };
    }
}

function getStudyIterationFromParticipantId(participant_id) {
    switch (participant_id) {
        case 1: return 6;
        case 2: return 1;
        case 3: return 2;
        case 4: return 3;
        case 5: return 7;
        case 6: return 8;
        case 7: return 5;
        case 8: return 9;
        case 9: return 10;
        case 10: return 11;
        case 11: return 12;
        case 12: return 13;
        default: return null;
    }
}

function pad(i) {
    return ('0' + i).slice(-2);
}

function getElapsedTime(a, b) {
    let difference = Math.abs(a - b);

    let ms = difference % 1000;
    difference = (difference - ms) / 1000;
    let s = difference % 60;
    difference = (difference - s) / 60;
    let m = difference % 60;
    difference = (difference - m) / 60;
    let h = difference;

    let ss = s <= 9 && s >= 0 ? `0${s}` : s;
    let mm = m <= 9 && m >= 0 ? `0${m}` : m;
    let hh = h <= 9 && h >= 0 ? `0${h}` : h;

    return hh + ':' + mm + ':' + ss;
};

function convertToAccuracyHull(measurements, { route = null, steps = 34 /*32*/, units = "meters", tolerance = 0.000002 /*0.000015*/, highQuality = true, mutate = false, iterations = 1 } = {}) {

    // Generate accuracy bubbles at each location measurement
    const accuracy_circles = measurements.map(p => turf.circle([p.longitude, p.latitude], p.accuracy, { steps, units }));
    const feature_collection = turf.featureCollection(accuracy_circles);

    // Dissolve the accuracy bubbles into a single feature collection
    const dissolved_hull = turf.dissolve(feature_collection);

    // Smooth the dissolved hull then simplify and re-smooth once more
    const smoothed_hull = turf.polygonSmooth(dissolved_hull, { iterations: 3 });
    const simplified_hull = turf.simplify(smoothed_hull, { highQuality, tolerance, mutate });
    const re_smoothed_hull = turf.polygonSmooth(simplified_hull, { iterations });

    // Check if adding inner line string path
    return route ? turf.featureCollection([...re_smoothed_hull.features, ...route.features]) : re_smoothed_hull;
}

////////////////////////////////////////////////////////////////////////////////

const output_directory = path.join(__dirname, "data", "study-iterations");
if (!fs.existsSync(output_directory)) {
    console.log("creating output directory:", output_directory);
    fs.mkdirSync(output_directory, { recursive: true });
} else {
    console.log("using existing output directory:", output_directory);
}

//
const population_accuracy_measures = {
    without_P8: {
        a: {
            combined: [],
            "AR": [],
            "AR-MINIMAP": [],
            "2D": [],
        },
        b: {
            combined: [],
            "AR": [],
            "AR-MINIMAP": [],
            "2D": [],
        },
        c: {
            combined: [],
            "AR": [],
            "AR-MINIMAP": [],
            "2D": [],
        },
    },
    without_P8RB: {
        a: {
            combined: [],
            "AR": [],
            "AR-MINIMAP": [],
            "2D": [],
        },
        b: {
            combined: [],
            "AR": [],
            "AR-MINIMAP": [],
            "2D": [],
        },
        c: {
            combined: [],
            "AR": [],
            "AR-MINIMAP": [],
            "2D": [],
        },
    },
    all: {
        a: {
            combined: [],
            "AR": [],
            "AR-MINIMAP": [],
            "2D": [],
        },
        b: {
            combined: [],
            "AR": [],
            "AR-MINIMAP": [],
            "2D": [],
        },
        c: {
            combined: [],
            "AR": [],
            "AR-MINIMAP": [],
            "2D": [],
        },
    },
};

const csv_collector = {
    headers: [
        "ROUTE.ID", "PARTICIPANT.ID", "STUDY.ITERATION", "INTERFACE", "DURATION", "DISTANCE",
        "LOCATION.ACCURACY.MIN", "LOCATION.ACCURACY.MAX", "LOCATION.ACCURACY.MEAN",
        // "LOCATION.ACCURACY.POPULATION.VARIANCE", "LOCATION.ACCURACY.POPULATION.STD",
        "LOCATION.ACCURACY.SAMPLE.VARIANCE", "LOCATION.ACCURACY.SAMPLE.STD"
    ],
    a: [],
    b: [],
    c: [],
};

function dumpMetricsCSV({ headers = [], a = [], b = [], c = [] } = {}) {
    let csv_string = "";

    console.log(chalk.magenta("\n==================================== METRICS ====================================\n"));

    console.log(util.inspect({ headers, a, b, c }, { colors: true, depth: null, showHidden: false, maxArrayLength: null, breakLength: 220 }));

    // Headers
    csv_string = csv_string.concat(headers.join(",") + "\n");

    // Sort by participant id and dump route a rows
    a.sort((x, y) => x[1] - y[1]).forEach(entry => {
        csv_string = csv_string.concat(entry.join(",") + "\n");
    });

    // Sort by participant id and dump route a rows
    b.sort((x, y) => x[1] - y[1]).forEach(entry => {
        csv_string = csv_string.concat(entry.join(",") + "\n");
    });

    // Sort by participant id and dump route a rows
    c.sort((x, y) => x[1] - y[1]).forEach(entry => {
        csv_string = csv_string.concat(entry.join(",") + "\n");
    });

    console.log(chalk.magenta("\n=================================================================================\n"));

    const target = path.join(__dirname, "data", "study-iterations", "combined-metrics.csv");
    fs.writeFileSync(target, csv_string, "utf-8");
    console.log("saved csv metrics to disk:", chalk.green("'" + target + "'"));
}

//
function main_thing() {
    participant_logs.forEach((candidate, i) => {
        const study_iteration = pad(i);
        const study_iteration_directory = path.join(output_directory, study_iteration);
        const participant = getParticipantIdFromStudyIteration(i);
        const participant_id = participant.id;

        if (!fs.existsSync(study_iteration_directory)) {
            console.log("creating study iteration output directory:", study_iteration_directory);
            fs.mkdirSync(study_iteration_directory, { recursive: true });
        } else {
            console.log("using existing study iteration output directory:", study_iteration_directory);
        }

        const ssids = Array.from(new Set([candidate.a.ssid, candidate.b.ssid, candidate.c.ssid]));

        // Metrics collector
        metrics = {
            participant: { ...participant, study_iteration: i, ssid: ssids },
            a: {
                ssid: candidate.a.ssid,
                interface: "?",
                distance: { value: 0, units: "meters" },
                accuracy: { units: "meters" },
                duration: { value: "00:00:00", format: "hh:mm:ss" },
            },
            b: {
                ssid: candidate.b.ssid,
                interface: "?",
                distance: { value: 0, units: "meters" },
                accuracy: { units: "meters" },
                duration: { value: "00:00:00", format: "hh:mm:ss" },
            },
            c: {
                ssid: candidate.c.ssid,
                interface: "?",
                distance: { value: 0, units: "meters" },
                accuracy: { units: "meters" },
                duration: { value: "00:00:00", format: "hh:mm:ss" },
            },
        };

        const accuracy_hulls = [];

        ["a", "b", "c"].forEach(route => {
            const parsed = candidate[route].logs
                .map(file => fs.readFileSync(file))
                .map(buffer => JSON.parse(buffer))
                .sort((a, b) => a.batch - b.batch);

            const origin = parsed[0];
            const target = parsed.slice(-1)[0];

            const { app_id, start } = origin;
            const { end } = target;
            const interface_type = app_id.toUpperCase();

            // Date start
            const unix_start = start;
            const date_start = new Date(unix_start);

            // Date end
            const unix_end = end;
            const date_end = new Date(unix_end);

            // Positions
            const measurements = parsed
                .flatMap(b => b.measurements)
                .map(m => m.position)
                .map(p => ({ accuracy: p.accuracy, longitude: p.longitude, latitude: p.latitude }));

            // Line string
            const coordinates = measurements.map(p => [p.longitude, p.latitude]);
            const line_string = turf.featureCollection([turf.lineString(coordinates, {
                "stroke-width": 3,
                "participant": participant_id,
                "stroke": getParticipantColour(participant_id).primary,
                "route": route,
                "interface": interface_type.toLowerCase(),
            })
            ]);

            // Metrics
            metrics[route].interface = interface_type;

            // Sample distance
            const distance = turf.length(line_string, { units: "meters" });
            metrics[route].distance.value = distance;

            // Sample accuracy measures
            const accuracy_measures = measurements.map(p => p.accuracy);
            metrics[route].accuracy = {
                ...metrics[route].accuracy,
                ...simple_stats(accuracy_measures)
            };

            // TCT?
            const human_time_duration = getElapsedTime(date_end, date_start);
            metrics[route].duration.value = human_time_duration;

            // Generate the accuracy hull with line string
            // const accuracy_hull = convertToAccuracyHull(measurements, { route: line_string });
            const accuracy_hull = convertToAccuracyHull(measurements);
            accuracy_hulls.push(accuracy_hull);

            // Save basic line string path
            const line_string_path = path.join(study_iteration_directory, `${route}.geojson`);
            fs.writeFileSync(line_string_path, JSON.stringify(line_string, null, 4));

            // Save line string path with accuracy hull
            const accuracy_hull_path = path.join(study_iteration_directory, `${route}-accuracy-hull.geojson`);
            fs.writeFileSync(accuracy_hull_path, JSON.stringify(accuracy_hull, null, 4));

            console.log("completed study iteration", i, "route", chalk.green("'" + route + "'"));
        });

        // Save metrics
        const metrics_path = path.join(study_iteration_directory, "metrics.json");
        fs.writeFileSync(metrics_path, JSON.stringify(metrics, null, 4));

        // Display metrics for easy copy paste
        if (!metrics.participant.removed) {
            const entry_a = [`"A"`, metrics.participant.id, metrics.participant.study_iteration, `"${metrics.a.interface}"`, `"${metrics.a.duration.value}"`, metrics.a.distance.value, metrics.a.accuracy.min, metrics.a.accuracy.max, metrics.a.accuracy.mean, metrics.a.accuracy.sample_variance, metrics.a.accuracy.sample_std];
            const entry_b = [`"B"`, metrics.participant.id, metrics.participant.study_iteration, `"${metrics.b.interface}"`, `"${metrics.b.duration.value}"`, metrics.b.distance.value, metrics.b.accuracy.min, metrics.b.accuracy.max, metrics.b.accuracy.mean, metrics.b.accuracy.sample_variance, metrics.b.accuracy.sample_std];
            const entry_c = [`"C"`, metrics.participant.id, metrics.participant.study_iteration, `"${metrics.c.interface}"`, `"${metrics.c.duration.value}"`, metrics.c.distance.value, metrics.c.accuracy.min, metrics.c.accuracy.max, metrics.c.accuracy.mean, metrics.c.accuracy.sample_variance, metrics.c.accuracy.sample_std];

            csv_collector.a = [...csv_collector.a, entry_a];
            csv_collector.b = [...csv_collector.b, entry_b];
            csv_collector.c = [...csv_collector.c, entry_c];

            console.log(chalk.magenta("\n==================================== METRICS ====================================\n"));
            console.log(entry_a.join(","));
            console.log(entry_b.join(","));
            console.log(entry_c.join(","));
            console.log(chalk.magenta("\n=================================================================================\n"));
        }

        // Save combined accuracy hull data
        const collection = turf.featureCollection(accuracy_hulls.reduce((prev, curr) => [...prev, ...curr.features], []));
        const combined_accuracy_hull_path = path.join(study_iteration_directory, "combined-accuracy-hull.geojson");
        fs.writeFileSync(combined_accuracy_hull_path, JSON.stringify(collection, null, 4));

        console.log("generated accuracy hull for:", i, candidate.a.ssid);
    });
}

// Get real route lengths
function getRouteLength(route, { directory = path.join(__dirname, "data", "raw", "official") } = {}) {
    if (!route) {
        throw new Error("filename cannot be undefined");
    }

    const buffer = fs.readFileSync(path.join(directory, `${route}.json`));
    const geojson = JSON.parse(buffer);
    const feature = geojson.features[0];
    const distance = turf.length(feature, { units: "meters" });
    console.log(`route ${route} actual distance =`, distance);
}

////////////////////////////////////////////////////////////////////////////////
// RUN THE MAIN THING
////////////////////////////////////////////////////////////////////////////////

main_thing();

getRouteLength("a");
getRouteLength("b");
getRouteLength("c");

// DUMP CSV
dumpMetricsCSV(csv_collector);

////////////////////////////////////////////////////////////////////////////////
// DEFAULT PROPS
////////////////////////////////////////////////////////////////////////////////

const default_properties = {
    "stroke-width": 3,
    "stroke-opacity": 0.95,
};


////////////////////////////////////////////////////////////////////////////////
// Route Combining
////////////////////////////////////////////////////////////////////////////////

const participant_geojson_base = path.join(__dirname, "data", "study-iterations");
const skipping = [0, 4];

const participants = fs.readdirSync(participant_geojson_base, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(dirent => dirent.name.match(/^\d+$/))
    .filter(dirent => !skipping.includes(Number.parseInt(dirent.name)))
    .map(dirent => {
        const root = path.join(participant_geojson_base, dirent.name);
        const pid = getParticipantIdFromStudyIteration(Number.parseInt(dirent.name)).id;

        const interface_a = latin_square[pid - 1].a;
        const interface_b = latin_square[pid - 1].b;
        const interface_c = latin_square[pid - 1].c;

        const interface_a_colour = getInterfaceColour(interface_a);
        const interface_b_colour = getInterfaceColour(interface_b);
        const interface_c_colour = getInterfaceColour(interface_c);

        return {
            participant_id: pid,
            study_iteration: Number.parseInt(dirent.name),
            root: root,
            properties: {
                ...getParticipantColour(pid),
                a: { ...interface_a_colour, interface: interface_a },
                b: { ...interface_b_colour, interface: interface_b },
                c: { ...interface_c_colour, interface: interface_c },
            },
            routes: {
                a: path.join(root, "a.geojson"),
                b: path.join(root, "b.geojson"),
                c: path.join(root, "c.geojson"),
            },
            hulls: {
                a: path.join(root, "a-accuracy-hull.geojson"),
                b: path.join(root, "b-accuracy-hull.geojson"),
                c: path.join(root, "c-accuracy-hull.geojson"),
            },
            combined: path.join(root, "combined-accuracy-hull.geojson"),
        };
    });

// // Load the base routes
// const actual_routes = {
//     a: JSON.parse(fs.readFileSync(path.join(__dirname, "data", "raw", "official", "a.json"))),
//     b: JSON.parse(fs.readFileSync(path.join(__dirname, "data", "raw", "official", "b.json"))),
//     c: JSON.parse(fs.readFileSync(path.join(__dirname, "data", "raw", "official", "c.json"))),
//     combined: JSON.parse(fs.readFileSync(path.join(__dirname, "data", "raw", "official", "combined.json"))),
// };

// // Store the base JSON as GeoJSON
// Object.keys(actual_routes).forEach(key => {
//     fs.writeFileSync(path.join(__dirname, "data", "routes", "official", `${key}.geojson`), JSON.stringify(actual_routes[key], null));
// });

// // Copy json to geojson
// // fs.writeFileSync(path.join(__dirname, "data", "routes", "official", "a.geojson"), JSON.stringify(actual_routes.a, null));
// // fs.writeFileSync(path.join(__dirname, "data", "routes", "official", "b.geojson"), JSON.stringify(actual_routes.b, null));
// // fs.writeFileSync(path.join(__dirname, "data", "routes", "official", "c.geojson"), JSON.stringify(actual_routes.c, null));
// // fs.writeFileSync(path.join(__dirname, "data", "routes", "official", "combined.geojson"), JSON.stringify(actual_routes.combined, null));

// COMBINE BY ROUTE COLOUR BY PARTICIPANT
["a", "b", "c"].forEach(route => {
    const combined_features = participants.map(participant => {
        const geojson = JSON.parse(fs.readFileSync(participant.routes[route]));

        turf.featureEach(geojson, feature => {
            feature.properties = {
                ...default_properties,
                ...feature.properties,
                participant: participant.participant_id,
                stroke: participant.properties.primary,
            };
        });

        return geojson;
    }).reduce((prev, curr) => [...prev, ...curr.features], []);

    // Feature collection
    const fc = turf.featureCollection(combined_features, { id: route });

    // Save to disk
    fs.writeFileSync(`./data/routes/${route}-all-participants.geojson`, JSON.stringify(fc, null, 4));

    // TODO: Add start and end markers
});

// COMBINE BY ROUTE COLOUR BY INTERFACE
["a", "b", "c"].forEach(route => {
    const combined_features = participants.map(participant => {
        const geojson = JSON.parse(fs.readFileSync(participant.routes[route]));

        turf.featureEach(geojson, feature => {
            feature.properties = {
                ...default_properties,
                ...feature.properties,
                participant: participant.participant_id,
                stroke: participant.properties[route].primary,
                interface: participant.properties[route].interface,
            };
        });

        return geojson;
    }).reduce((prev, curr) => [...prev, ...curr.features], []);

    // Feature collection
    const fc = turf.featureCollection(combined_features, { id: route });

    // Save to disk
    fs.writeFileSync(`./data/routes/${route}-all-interface.geojson`, JSON.stringify(fc, null, 4));

    const res = turf.featureReduce(fc, (prev, curr) => {
        prev[curr.properties.interface] = [...prev[curr.properties.interface], curr];
        return prev;
    }, { "2d": [], "ar": [], "ar-minimap": [] });

    Object.keys(res).forEach(key => {
        const col = turf.featureCollection(res[key], { id: key });

        // Save to disk
        fs.writeFileSync(`./data/routes/${route}-${key}-interface.geojson`, JSON.stringify(col, null, 4));
    });

    // TODO: Add start and end markers
});

// console.log(util.inspect(combined_routes, { showHidden: false, depth: null, colors: true }));

