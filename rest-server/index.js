const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const chalk = require("chalk");

// Setup express app
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

function pad(i) {
    return ('0' + i).slice(-2);
}

app.get("/test", (req, res) => {
    console.log("[test]: serving /test");

    res.header("Content-Type", "application/json");
    res.sendFile(path.join(__dirname, "data", "test.json"));
});

app.post("/upload-screenshot", (req, res) => {
    console.log("[screenshot]: resolving /upload-screenshot");

    // Extract fields
    const { filename, directory, imageData } = req.body;

    // Resolve output location
    const base_directory = path.join(__dirname, "screenshots");
    const output_directory = directory ? path.join(base_directory, directory) : base_directory;
    const output_file = path.join(output_directory, filename);

    // Create missing directory (if needed)
    if (!fs.existsSync(output_directory)) {
        console.log("specified output directory was not found");
        fs.mkdirSync(output_directory, { recursive: true });
        console.log("successfully created output directory");
    }

    try {
        // Save file
        fs.writeFileSync(output_file, imageData, "base64");

        // Success
        console.log(chalk.green("[screenshot]:"), "successfully saved screenshot", output_file);
        res.status(200).send({ message: "successfully saved screenshot" });
    } catch (err) {
        // Error
        console.log(chalk.red("[screenshot]:"), "failed to save screenshot", output_file);
        res.status(500).send({ error: "failed to save screenshot" });
    }
});

app.get("/routes/official", (req, res) => {
    console.log("[routes]: serving /routes/official");

    res.header("Content-Type", "application/json");
    res.sendFile(path.join(__dirname, "data", "routes", "official", "combined.geojson"));
});

app.get("/routes/official/:id", (req, res) => {
    const route_id = req.params.id;
    const filename = route_id.endsWith(".geojson") ? route_id : `${route_id}.geojson`;
    console.log(`[routes]: serving /routes/official/${route_id}`);

    res.header("Content-Type", "application/json");
    res.sendFile(path.join(__dirname, "data", "routes", "official", filename));
});

app.get("/routes/:id", (req, res) => {
    const route_id = req.params.id;
    const filename = route_id.endsWith(".geojson") ? route_id : `${route_id}.geojson`;
    console.log(`[routes]: serving /routes/${route_id}`);

    res.header("Content-Type", "application/json");
    res.sendFile(path.join(__dirname, "data", "routes", filename));
});

app.get("/iterations/:sid/:rid", (req, res) => {
    const iteration_id = req.params.sid;
    const route_id = req.params.rid;
    console.log(`[iterations]: serving /iterations/${iteration_id}/${route_id}`);

    res.header("Content-Type", "application/json");
    res.sendFile(path.join(__dirname, "data", "study-iterations", pad(iteration_id), `${route_id}.geojson`));
});

app.get("/accuracy-hulls/:sid/:rid", (req, res) => {
    const iteration_id = req.params.sid;
    const route_id = req.params.rid;
    console.log(`[accuracy-hulls]: serving /accuracy-hulls/${iteration_id}/${route_id}`);

    res.header("Content-Type", "application/json");
    res.sendFile(path.join(__dirname, "data", "study-iterations", pad(iteration_id), `${route_id}-accuracy-hull.geojson`));
});

// Start listening
const server = app.listen(3000, "localhost", () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server listening at http://${host}:${port}`);
});