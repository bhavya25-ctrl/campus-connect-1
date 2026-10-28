const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const requiredFiles = ["index.html", "dashboard.html", "profile.html", "events.html", "groups.html", "style.css", "script.js"];

const requiredMarkers = {
    "index.html": ["data-testid=\"login-button\"", "data-testid=\"register-button\"", "script.js"],
    "dashboard.html": ["data-testid=\"post-input\"", "data-testid=\"post-submit\"", "data-testid=\"post-feed\""],
    "profile.html": ["data-testid=\"edit-profile-btn\"", "data-testid=\"save-profile-btn\"", "data-testid=\"profile-name\""],
    "events.html": ["id=\"eventForm\"", "data-testid=\"events-list\"", "events.html"],
    "groups.html": ["id=\"groupForm\"", "data-testid=\"groups-list\"", "groups.html"],
    "script.js": ["validateLogin", "createPost", "updateProfile", "createEvent", "createGroup", "module.exports"],
};

for (const file of requiredFiles) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Required file missing: ${file}`);
    }
}

for (const [file, markers] of Object.entries(requiredMarkers)) {
    const content = fs.readFileSync(path.join(root, file), "utf8");
    for (const marker of markers) {
        if (!content.includes(marker)) {
            throw new Error(`${file} is missing required marker: ${marker}`);
        }
    }
}

console.log("CampusConnect template validation passed.");
