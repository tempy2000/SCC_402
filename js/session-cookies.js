/**
 * Creates a cookie with given name and value.
 * 
 * @param {string} name - the name of the cookie.
 * @param {string} value - the value associated to the cookie.
 * @param {number} [max_age=86400] - number of seconds until the cookie expires (default = 1 day).
 */
function set_cookie(name, value, max_age = 86400) {
    const date = new Date();
    date.setTime(date.getTime() + (max_age * 1000));

    const cookie = `${name}=${value}; expires=${date.toUTCString()}; SameSite=Lax; Secure; path=/`;
    document.cookie = cookie;
}

/**
 * Gets the value for a given cookie.
 * 
 * @param {string} name - the name of the cookie.
 * @returns The value associated with a cookie
 */
function get_cookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(`${name}=`))
        ?.split("=")[1];
}

/**
 * Checks whether a cookie exists for the given name.
 * 
 * @param {string} name - the name of the cookie.
 * @returns true if the cookie exists, otherwise false.
 */
function check_cookie(name) {
    return document.cookie
        .split(";")
        .some(c => c.trim().startsWith(`${name}=`));
}

/**
 * Generates a UUID for the current session.
 * 
 * @see https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
 * @returns A random uuid
 */
function generate_uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

/**
 * If no session cookie exists, then a new one will be created, otherwise, use the existing cookie.
 * 
 * @returns The uuid for the current session.
 */
function init_session() {
    const name = "__SSID";
    let value;

    if (check_cookie(name)) {
        // Get existing session cookie
        value = get_cookie(name);
    } else {
        // Create new session cookie
        value = generate_uuid();
        set_cookie(name, value);
    }

    return value;
}