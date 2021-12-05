/**
 * A wrapper for setInterval with the addition of immediately calling the handler.
 * 
 * @param {TimerHandler} handler 
 * @param {number} timeout 
 * @returns The id of the interval
 */
function setIntervalImmediately(handler, timeout) {
    handler();
    return window.setInterval(handler, timeout);
}

/**
 * Converts a given data object to json and attempts to download it.
 * 
 * @param {object} data_object - the data to be downloaded.
 * @param {string} filename - the name of the downloaded file.
 * @returns true if successful, otherwise false.
 */
function download_json(data_object = {}, filename = "export") {
    if (!data_object) {
        console.error("[utils]: nothing to download as data_object was empty");
        return false;
    }

    // Convert data object into url
    const url = URL.createObjectURL(new Blob(
        [JSON.stringify(data_object, null, 2)],
        { type: "data:application/json;charset=utf-8" }
    ));

    // Create the download link
    const a = document.createElement("a");
    a.setAttribute("download", `${filename}.json`);
    a.setAttribute("href", url);

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up the DOM
    URL.revokeObjectURL(url);
    a.remove();

    return true;
}