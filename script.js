const CampusConnect = (() => {
    const demoUsers = [
        {
            id: 1,
            name: "Student Name",
            email: "student@campus.edu",
            password: "password123",
            department: "Computer Science '25",
            bio: "Passionate about web development, AI, and open source. CS batch of '25.",
            location: "University Campus",
            github: "github.com/student",
        },
        {
            id: 2,
            name: "Jane Doe",
            email: "jane@campus.edu",
            password: "campus2026",
            department: "AI&DS '26",
            bio: "Learning software engineering through practical projects.",
            location: "Innovation Block",
            github: "github.com/janedoe",
        },
    ];

    const demoPosts = [
        {
            id: 1,
            author: "Jane Doe",
            content: "Looking for a study group for the upcoming Data Structures midterm! Anyone interested?",
            time: "2 hours ago",
            likes: 12,
            comments: 3,
        },
        {
            id: 2,
            author: "John Smith",
            content: "The new cafeteria menu is amazing today. Highly recommend the pasta bar!",
            time: "5 hours ago",
            likes: 45,
            comments: 1,
        },
        {
            id: 3,
            author: "Student Name",
            content: "Completed the CampusConnect login and profile templates for SE Lab.",
            time: "1 day ago",
            likes: 8,
            comments: 2,
        },
    ];

    const demoEvents = [
        {
            id: 101,
            title: "Campus Coding Hackathon",
            date: "2026-11-04",
            time: "10:00 AM",
            location: "Main Hall",
            category: "Technology",
            description: "Work with a team to build a practical solution and present it to campus mentors.",
            createdBy: "Computer Science Club",
            baseAttendees: 28,
            registeredEmails: [],
        },
        {
            id: 102,
            title: "AI and Data Science Talk",
            date: "2026-11-10",
            time: "02:00 PM",
            location: "Room 304",
            category: "Workshop",
            description: "A student-friendly session on current AI tools, responsible use, and career paths.",
            createdBy: "AI & DS Society",
            baseAttendees: 16,
            registeredEmails: [],
        },
        {
            id: 103,
            title: "Resume Review Meetup",
            date: "2026-11-14",
            time: "11:30 AM",
            location: "Library Seminar Room",
            category: "Career",
            description: "Bring your resume and get peer feedback before internship applications.",
            createdBy: "Campus Career Cell",
            baseAttendees: 9,
            registeredEmails: [],
        },
    ];

    const demoGroups = [
        {
            id: 201,
            name: "Web Development Circle",
            category: "Technology",
            description: "Share frontend and backend projects, solve bugs together, and learn by building.",
            createdBy: "Jane Doe",
            baseMembers: 34,
            memberEmails: [],
        },
        {
            id: 202,
            name: "DSA Practice Club",
            category: "Study Group",
            description: "Practice data structures and algorithms, discuss solutions, and prepare for interviews.",
            createdBy: "John Smith",
            baseMembers: 27,
            memberEmails: [],
        },
        {
            id: 203,
            name: "AI & Machine Learning",
            category: "Technology",
            description: "Explore machine learning concepts, datasets, research papers, and small experiments.",
            createdBy: "AI & DS Society",
            baseMembers: 41,
            memberEmails: [],
        },
    ];

    const storageKey = "campusConnectState";

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function defaultState() {
        return {
            users: clone(demoUsers),
            posts: clone(demoPosts),
            events: clone(demoEvents),
            groups: clone(demoGroups),
            currentUserEmail: "student@campus.edu",
        };
    }

    function hasLocalStorage() {
        try {
            return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
        } catch {
            return false;
        }
    }

    function loadState() {
        if (!hasLocalStorage()) return defaultState();
        const stored = window.localStorage.getItem(storageKey);
        if (!stored) return defaultState();
        try {
            const parsed = JSON.parse(stored);
            return {
                users: Array.isArray(parsed.users) ? parsed.users : clone(demoUsers),
                posts: Array.isArray(parsed.posts) ? parsed.posts : clone(demoPosts),
                events: Array.isArray(parsed.events) ? parsed.events : clone(demoEvents),
                groups: Array.isArray(parsed.groups) ? parsed.groups : clone(demoGroups),
                currentUserEmail: parsed.currentUserEmail || "student@campus.edu",
            };
        } catch {
            return defaultState();
        }
    }

    function saveState(state) {
        if (hasLocalStorage()) {
            window.localStorage.setItem(storageKey, JSON.stringify(state));
        }
        return state;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    }

    function validateLogin(email, password) {
        const errors = {};
        if (!validateEmail(email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!password || String(password).length < 8) {
            errors.password = "Password must be at least 8 characters.";
        }
        return { valid: Object.keys(errors).length === 0, errors };
    }

    function authenticateUser(email, password, users = demoUsers) {
        const validation = validateLogin(email, password);
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }
        const user = users.find(
            (candidate) => candidate.email.toLowerCase() === String(email).trim().toLowerCase()
        );
        if (!user || user.password !== password) {
            return { success: false, errors: { credentials: "Invalid email or password." } };
        }
        return { success: true, user: { ...user, password: undefined } };
    }

    function registerUser(name, email, password, users = demoUsers) {
        const errors = {};
        if (!String(name || "").trim()) {
            errors.name = "Name is required.";
        }
        const loginValidation = validateLogin(email, password);
        Object.assign(errors, loginValidation.errors);
        if (users.some((user) => user.email.toLowerCase() === String(email).trim().toLowerCase())) {
            errors.email = "Email is already registered.";
        }
        if (Object.keys(errors).length) {
            return { success: false, errors };
        }
        const user = {
            id: users.length + 1,
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            password,
            department: "AI&DS",
            bio: "New CampusConnect member.",
            location: "University Campus",
            github: "github.com/new-student",
        };
        return { success: true, user };
    }

    function createPost(content, author = "Student Name") {
        const trimmed = String(content || "").trim();
        if (trimmed.length < 3) {
            return { success: false, error: "Post content must be at least 3 characters." };
        }
        return {
            success: true,
            post: {
                id: Date.now(),
                author,
                content: trimmed,
                time: "Just now",
                likes: 0,
                comments: 0,
            },
        };
    }

    function updateProfile(profile, updates) {
        const nextProfile = { ...profile };
        const name = String(updates.name || "").trim();
        const bio = String(updates.bio || "").trim();
        if (!name) {
            return { success: false, errors: { name: "Name is required." } };
        }
        if (bio.length < 10) {
            return { success: false, errors: { bio: "Bio must be at least 10 characters." } };
        }
        nextProfile.name = name;
        nextProfile.bio = bio;
        return { success: true, profile: nextProfile };
    }

    function createEvent(details, creator = "Student Name") {
        const title = String(details.title || "").trim();
        const date = String(details.date || "").trim();
        const time = String(details.time || "").trim();
        const location = String(details.location || "").trim();
        const category = String(details.category || "Other").trim() || "Other";
        const description = String(details.description || "").trim();
        if (!title || !date || !time || !location || !description) {
            return { success: false, error: "Please fill in all event fields." };
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
            return { success: false, error: "Please choose a valid event date." };
        }
        return {
            success: true,
            event: {
                id: Date.now(), title, date, time, location, category, description,
                createdBy: creator, baseAttendees: 0, registeredEmails: [],
            },
        };
    }

    function toggleEventRegistration(event, email) {
        const registeredEmails = Array.isArray(event.registeredEmails) ? event.registeredEmails : [];
        const registered = registeredEmails.includes(email);
        return {
            ...event,
            registeredEmails: registered
                ? registeredEmails.filter((registeredEmail) => registeredEmail !== email)
                : [...registeredEmails, email],
        };
    }

    function createGroup(details, creator = "Student Name", creatorEmail = "") {
        const name = String(details.name || "").trim();
        const category = String(details.category || "Other").trim() || "Other";
        const description = String(details.description || "").trim();
        if (!name || !description) {
            return { success: false, error: "Please enter a group name and description." };
        }
        return {
            success: true,
            group: {
                id: Date.now(), name, category, description, createdBy: creator,
                baseMembers: 0, memberEmails: creatorEmail ? [creatorEmail] : [],
            },
        };
    }

    function toggleGroupMembership(group, email) {
        const memberEmails = Array.isArray(group.memberEmails) ? group.memberEmails : [];
        const member = memberEmails.includes(email);
        return {
            ...group,
            memberEmails: member
                ? memberEmails.filter((memberEmail) => memberEmail !== email)
                : [...memberEmails, email],
        };
    }

    function currentUser(state) {
        return state.users.find((user) => user.email === state.currentUserEmail) || state.users[0];
    }

    function showMessage(message, type = "success") {
        const messageBox = document.querySelector("[data-testid='message-box']");
        if (!messageBox) return;
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.hidden = false;
    }

    function renderPost(post) {
        const card = document.createElement("div");
        card.className = "card post";
        card.innerHTML = `
            <div class="post-header">
                <div class="avatar-small"></div>
                <div class="post-meta">
                    <h4>${post.author}</h4>
                    <span>${post.time}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
            </div>
            <div class="post-footer">
                <button class="btn btn-text" data-testid="like-btn">Like (${post.likes})</button>
                <button class="btn btn-text" data-testid="comment-btn">Comment (${post.comments})</button>
            </div>
        `;
        return card;
    }

    function setupAuthPage() {
        const loginForm = document.querySelector("#loginForm");
        const registerForm = document.querySelector("#registerForm");
        const showRegister = document.querySelector("#showRegister");
        const showLogin = document.querySelector("#showLogin");
        const state = loadState();

        if (showRegister && showLogin && loginForm && registerForm) {
            showRegister.addEventListener("click", (event) => {
                event.preventDefault();
                loginForm.hidden = true;
                registerForm.hidden = false;
            });
            showLogin.addEventListener("click", (event) => {
                event.preventDefault();
                registerForm.hidden = true;
                loginForm.hidden = false;
            });
        }

        if (loginForm) {
            loginForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const email = loginForm.email.value;
                const password = loginForm.password.value;
                const result = authenticateUser(email, password, state.users);
                if (!result.success) {
                    showMessage(result.errors.credentials || "Please check the login form.", "error");
                    return;
                }
                state.currentUserEmail = result.user.email;
                saveState(state);
                window.location.href = "dashboard.html";
            });
        }

        if (registerForm) {
            registerForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const result = registerUser(
                    registerForm.fullName.value,
                    registerForm.registerEmail.value,
                    registerForm.registerPassword.value,
                    state.users
                );
                if (!result.success) {
                    showMessage(Object.values(result.errors)[0], "error");
                    return;
                }
                state.users.push(result.user);
                state.currentUserEmail = result.user.email;
                saveState(state);
                window.location.href = "dashboard.html";
            });
        }
    }

    function setupDashboardPage() {
        const state = loadState();
        const user = currentUser(state);
        const nameTargets = document.querySelectorAll("[data-current-user]");
        const departmentTarget = document.querySelector("[data-current-department]");
        const postFeed = document.querySelector("[data-testid='post-feed']");
        const postForm = document.querySelector("#postForm");
        const upcomingEventsList = document.querySelector("[data-testid='event-list']");

        nameTargets.forEach((target) => {
            target.textContent = user.name;
        });
        if (departmentTarget) {
            departmentTarget.textContent = user.department;
        }
        if (postFeed) {
            postFeed.innerHTML = "";
            state.posts.forEach((post) => postFeed.appendChild(renderPost(post)));
        }
        if (upcomingEventsList) {
            upcomingEventsList.innerHTML = "";
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            state.events
                .filter((event) => new Date(`${event.date}T00:00:00`) >= today)
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 3)
                .forEach((event) => {
                    const item = document.createElement("li");
                    const date = document.createElement("div");
                    date.className = "event-date";
                    date.textContent = new Date(`${event.date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });
                    const details = document.createElement("div");
                    details.className = "event-details";
                    const title = document.createElement("h4");
                    title.textContent = event.title;
                    const location = document.createElement("p");
                    location.textContent = event.location;
                    details.append(title, location);
                    item.append(date, details);
                    upcomingEventsList.appendChild(item);
                });
            if (!upcomingEventsList.children.length) {
                const item = document.createElement("li");
                item.textContent = "No upcoming events yet.";
                upcomingEventsList.appendChild(item);
            }
        }
        if (postForm) {
            postForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const input = postForm.querySelector("[data-testid='post-input']");
                const result = createPost(input.value, user.name);
                if (!result.success) {
                    showMessage(result.error, "error");
                    return;
                }
                state.posts.unshift(result.post);
                saveState(state);
                if (postFeed) {
                    postFeed.prepend(renderPost(result.post));
                }
                input.value = "";
                showMessage("Post created on the dashboard.", "success");
            });
        }
    }

    function setupEventsPage() {
        const list = document.querySelector("[data-testid='events-list']");
        const form = document.querySelector("#eventForm");
        if (!list && !form) return;

        const state = loadState();
        const user = currentUser(state);

        function localDateInputValue() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }

        function renderEvents() {
            list.innerHTML = "";
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const events = state.events.slice().sort((a, b) => a.date.localeCompare(b.date));
            if (!events.length) {
                const empty = document.createElement("div");
                empty.className = "card empty-state";
                empty.textContent = "No events yet. Create the first campus event using the form.";
                list.appendChild(empty);
                return;
            }
            events.forEach((event) => {
                const card = document.createElement("article");
                card.className = "card listing-card";
                card.setAttribute("data-testid", "event-card");
                const header = document.createElement("div");
                header.className = "listing-card-header";
                const category = document.createElement("span");
                category.className = "listing-tag";
                category.textContent = event.category || "Other";
                const title = document.createElement("h2");
                title.textContent = event.title;
                header.append(category, title);
                const description = document.createElement("p");
                description.className = "listing-description";
                description.textContent = event.description;
                const metadata = document.createElement("div");
                metadata.className = "listing-meta";
                const date = document.createElement("span");
                date.textContent = `📅 ${new Date(`${event.date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
                const time = document.createElement("span");
                time.textContent = `🕒 ${event.time}`;
                const location = document.createElement("span");
                location.textContent = `📍 ${event.location}`;
                metadata.append(date, time, location);
                const bottom = document.createElement("div");
                bottom.className = "listing-card-bottom";
                const attendeeCount = document.createElement("span");
                attendeeCount.className = "muted-text";
                const registeredEmails = Array.isArray(event.registeredEmails) ? event.registeredEmails : [];
                attendeeCount.textContent = `${(Number(event.baseAttendees) || 0) + registeredEmails.length} attendee(s)`;
                const action = document.createElement("button");
                const isRegistered = registeredEmails.includes(user.email);
                action.type = "button";
                action.className = isRegistered ? "btn btn-outline" : "btn btn-primary";
                action.textContent = isRegistered ? "Cancel registration" : "Register";
                action.addEventListener("click", () => {
                    const index = state.events.findIndex((candidate) => candidate.id === event.id);
                    if (index < 0) return;
                    state.events[index] = toggleEventRegistration(state.events[index], user.email);
                    saveState(state);
                    renderEvents();
                    showMessage(isRegistered ? "Event registration cancelled." : "You are registered for this event.", "success");
                });
                bottom.append(attendeeCount, action);
                card.append(header, description, metadata, bottom);
                list.appendChild(card);
            });
        }

        renderEvents();
        if (form) {
            const dateInput = form.querySelector("[name='date']");
            if (dateInput) dateInput.min = localDateInputValue();
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                const formDate = form.elements.date.value;
                const todayString = localDateInputValue();
                if (formDate < todayString) {
                    showMessage("Choose today or a future date for the event.", "error");
                    return;
                }
                const result = createEvent({
                    title: form.elements.title.value,
                    date: form.elements.date.value,
                    time: form.elements.time.value,
                    location: form.elements.location.value,
                    category: form.elements.category.value,
                    description: form.elements.description.value,
                }, user.name);
                if (!result.success) {
                    showMessage(result.error, "error");
                    return;
                }
                state.events.push(result.event);
                saveState(state);
                form.reset();
                renderEvents();
                showMessage("Event created successfully.", "success");
            });
        }
    }

    function setupGroupsPage() {
        const list = document.querySelector("[data-testid='groups-list']");
        const form = document.querySelector("#groupForm");
        if (!list && !form) return;

        const state = loadState();
        const user = currentUser(state);

        function renderGroups() {
            list.innerHTML = "";
            if (!state.groups.length) {
                const empty = document.createElement("div");
                empty.className = "card empty-state";
                empty.textContent = "No groups yet. Create the first campus group using the form.";
                list.appendChild(empty);
                return;
            }
            state.groups.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach((group) => {
                const card = document.createElement("article");
                card.className = "card listing-card";
                card.setAttribute("data-testid", "group-card");
                const category = document.createElement("span");
                category.className = "listing-tag";
                category.textContent = group.category || "Other";
                const title = document.createElement("h2");
                title.textContent = group.name;
                const description = document.createElement("p");
                description.className = "listing-description";
                description.textContent = group.description;
                const meta = document.createElement("div");
                meta.className = "listing-meta";
                const count = document.createElement("span");
                const memberEmails = Array.isArray(group.memberEmails) ? group.memberEmails : [];
                count.textContent = `👥 ${(Number(group.baseMembers) || 0) + memberEmails.length} member(s)`;
                const creator = document.createElement("span");
                creator.textContent = `Created by ${group.createdBy || "CampusConnect member"}`;
                meta.append(count, creator);
                const bottom = document.createElement("div");
                bottom.className = "listing-card-bottom";
                const action = document.createElement("button");
                const isMember = memberEmails.includes(user.email);
                action.type = "button";
                action.className = isMember ? "btn btn-outline" : "btn btn-primary";
                action.textContent = isMember ? "Leave group" : "Join group";
                action.addEventListener("click", () => {
                    const index = state.groups.findIndex((candidate) => candidate.id === group.id);
                    if (index < 0) return;
                    state.groups[index] = toggleGroupMembership(state.groups[index], user.email);
                    saveState(state);
                    renderGroups();
                    showMessage(isMember ? `You left ${group.name}.` : `You joined ${group.name}.`, "success");
                });
                bottom.append(count, action);
                card.append(category, title, description, meta, bottom);
                list.appendChild(card);
            });
        }

        renderGroups();
        if (form) {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                const result = createGroup({
                    name: form.elements.name.value,
                    category: form.elements.category.value,
                    description: form.elements.description.value,
                }, user.name, user.email);
                if (!result.success) {
                    showMessage(result.error, "error");
                    return;
                }
                state.groups.unshift(result.group);
                saveState(state);
                form.reset();
                renderGroups();
                showMessage("Group created successfully. You are its first member.", "success");
            });
        }
    }

    function setupProfilePage() {
        const state = loadState();
        let user = currentUser(state);
        const modal = document.querySelector("#editModal");
        const editButton = document.querySelector("[data-testid='edit-profile-btn']");
        const closeButton = document.querySelector("[data-testid='close-modal']");
        const profileForm = document.querySelector("#profileForm");

        function renderProfile() {
            const name = document.querySelector("[data-testid='profile-name']");
            const bio = document.querySelector("[data-testid='profile-bio']");
            const email = document.querySelector("[data-testid='profile-email']");
            const github = document.querySelector("[data-testid='profile-github']");
            if (name) name.textContent = user.name;
            if (bio) bio.textContent = user.bio;
            if (email) email.textContent = user.email;
            if (github) github.textContent = user.github;
        }

        function openModal() {
            if (!modal || !profileForm) return;
            profileForm.fullName.value = user.name;
            profileForm.bio.value = user.bio;
            modal.style.display = "block";
            modal.setAttribute("aria-hidden", "false");
        }

        function closeModal() {
            if (!modal) return;
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
        }

        renderProfile();
        if (editButton) editButton.addEventListener("click", openModal);
        if (closeButton) closeButton.addEventListener("click", closeModal);
        if (profileForm) {
            profileForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const result = updateProfile(user, {
                    name: profileForm.fullName.value,
                    bio: profileForm.bio.value,
                });
                if (!result.success) {
                    showMessage(Object.values(result.errors)[0], "error");
                    return;
                }
                const index = state.users.findIndex((candidate) => candidate.email === user.email);
                user = { ...state.users[index], ...result.profile };
                state.users[index] = user;
                saveState(state);
                renderProfile();
                closeModal();
                showMessage("Profile updated successfully.", "success");
            });
        }
    }

    function initPage() {
        if (typeof document === "undefined") return;
        setupAuthPage();
        setupDashboardPage();
        setupEventsPage();
        setupGroupsPage();
        setupProfilePage();
    }

    return {
        demoUsers,
        demoPosts,
        validateLogin,
        authenticateUser,
        registerUser,
        createPost,
        updateProfile,
        createEvent,
        toggleEventRegistration,
        createGroup,
        toggleGroupMembership,
        loadState,
        saveState,
        initPage,
    };
})();

if (typeof window !== "undefined") {
    window.CampusConnect = CampusConnect;
    document.addEventListener("DOMContentLoaded", CampusConnect.initPage);
}

if (typeof module !== "undefined") {
    module.exports = CampusConnect;
}
