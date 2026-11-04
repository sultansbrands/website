/* =========================================================
   SULTAN'S BRANDS
   SUPABASE ACCOUNT SYSTEM
========================================================= */


/* =========================================================
   SUPABASE CONNECTION
========================================================= */

const SUPABASE_URL =
    "https://xhjxeexvibjvzzhmdccf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_BiA8pv0qcfcdfzcdQ9GjWg_QvZvuOnB";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   CUSTOM ALERT
========================================================= */

function sultanAlert(
    message,
    title = "SULTAN'S BRANDS"
) {

    const oldModal =
        document.getElementById(
            "sultanAlertModal"
        );

    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement("div");


    modal.id =
        "sultanAlertModal";


    modal.innerHTML = `

        <div class="sultan-alert-overlay">

            <div class="sultan-alert-box">

                <div class="sultan-alert-crown">
                    ♛
                </div>

                <div class="sultan-alert-title">
                    ${title}
                </div>

                <div class="sultan-alert-line"></div>

                <div class="sultan-alert-message">
                    ${String(message).replace(/\n/g, "<br>")}
                </div>

                <button
                    class="sultan-alert-button"
                    id="sultanAlertOK"
                >
                    OK
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    document
        .getElementById("sultanAlertOK")
        .addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );

}


/* =========================================================
   CUSTOM CONFIRM
========================================================= */

function sultanConfirm(
    message,
    onConfirm
) {

    const oldModal =
        document.getElementById(
            "sultanConfirmModal"
        );

    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement("div");


    modal.id =
        "sultanConfirmModal";


    modal.innerHTML = `

        <div class="sultan-alert-overlay">

            <div class="sultan-alert-box">

                <div class="sultan-alert-crown">
                    ♛
                </div>

                <div class="sultan-alert-title">
                    SULTAN'S BRANDS
                </div>

                <div class="sultan-alert-line"></div>

                <div class="sultan-alert-message">
                    ${String(message).replace(/\n/g, "<br>")}
                </div>

                <div class="sultan-confirm-buttons">

                    <button
                        class="sultan-cancel-button"
                        id="sultanCancelButton"
                    >
                        CANCEL
                    </button>

                    <button
                        class="sultan-alert-button"
                        id="sultanConfirmButton"
                    >
                        YES, LOG OUT
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    document
        .getElementById(
            "sultanCancelButton"
        )
        .addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );


    document
        .getElementById(
            "sultanConfirmButton"
        )
        .addEventListener(
            "click",
            function () {

                modal.remove();

                onConfirm();

            }
        );

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =============================================
           ELEMENTS
        ============================================== */

        const loginBox =
            document.getElementById(
                "loginBox"
            );


        const registerBox =
            document.getElementById(
                "registerBox"
            );


        const authSection =
            document.getElementById(
                "authSection"
            );


        const dashboard =
            document.getElementById(
                "dashboard"
            );


        const loginForm =
            document.getElementById(
                "loginForm"
            );


        const registerForm =
            document.getElementById(
                "registerForm"
            );


        const profileForm =
            document.getElementById(
                "profileForm"
            );


        const userName =
            document.getElementById(
                "userName"
            );


        const userEmail =
            document.getElementById(
                "userEmail"
            );


        const userUsername =
            document.getElementById(
                "userUsername"
            );


        const profileInitial =
            document.getElementById(
                "profileInitial"
            );


        const profileName =
            document.getElementById(
                "profileName"
            );


        const profileUsername =
            document.getElementById(
                "profileUsername"
            );


        const profileEmail =
            document.getElementById(
                "profileEmail"
            );


        const profilePhone =
            document.getElementById(
                "profilePhone"
            );


        /* =============================================
           SHOW LOGIN
        ============================================== */

        window.showLogin =
            function () {

                if (loginBox) {

                    loginBox.style.display =
                        "block";

                }


                if (registerBox) {

                    registerBox.style.display =
                        "none";

                }

            };


        /* =============================================
           SHOW REGISTER
        ============================================== */

        window.showRegister =
            function () {

                if (loginBox) {

                    loginBox.style.display =
                        "none";

                }


                if (registerBox) {

                    registerBox.style.display =
                        "block";

                }

            };


        /* =============================================
           CURRENT USER
        ============================================== */

        async function getCurrentUser() {

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getUser();


            if (error) {

                console.error(
                    "User check error:",
                    error
                );

                return null;

            }


            return data.user || null;

        }


        /* =============================================
           GET PROFILE
        ============================================== */

        async function getProfile(
            userId
        ) {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("profiles")
                    .select("*")
                    .eq(
                        "id",
                        userId
                    )
                    .maybeSingle();


            if (error) {

                console.error(
                    "Profile loading error:",
                    error
                );

                return null;

            }


            return data;

        }


        /* =============================================
           SAVE PROFILE
        ============================================== */

        async function saveProfile(
            user,
            profileData
        ) {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("profiles")
                    .upsert(
                        {

                            id:
                                user.id,

                            full_name:
                                profileData.full_name || "",

                            username:
                                profileData.username || "",

                            email:
                                profileData.email || null,

                            phone:
                                profileData.phone || null

                        },
                        {
                            onConflict: "id"
                        }
                    )
                    .select()
                    .single();


            if (error) {

                console.error(
                    "Profile save error:",
                    error
                );

                return null;

            }


            return data;

        }


        /* =============================================
           UPDATE DASHBOARD
        ============================================== */

        async function updateDashboard() {

            const user =
                await getCurrentUser();


            if (!user) {
                return;
            }


            let profile =
                await getProfile(
                    user.id
                );


            const metadata =
                user.user_metadata || {};


            if (!profile) {

                profile =
                    await saveProfile(
                        user,
                        {

                            full_name:
                                metadata.full_name ||
                                "Customer",

                            username:
                                metadata.username ||
                                "",

                            email:
                                user.email ||
                                null,

                            phone:
                                user.phone ||
                                metadata.phone ||
                                null

                        }
                    );

            }


            const name =
                profile?.full_name ||
                metadata.full_name ||
                "Customer";


            const username =
                profile?.username ||
                metadata.username ||
                "";


            const email =
                user.email ||
                profile?.email ||
                "";


            const phone =
                user.phone ||
                profile?.phone ||
                metadata.phone ||
                "";


            /* USER NAME */

            if (userName) {

                userName.textContent =
                    name;

            }


            /* EMAIL */

            if (userEmail) {

                if (email) {

                    userEmail.textContent =
                        email;

                } else if (phone) {

                    userEmail.textContent =
                        phone;

                } else {

                    userEmail.textContent =
                        "";

                }

            }


            /* USERNAME */

            if (userUsername) {

                userUsername.textContent =
                    username
                        ? "@" + username
                        : "";

            }


            /* INITIAL */

            if (profileInitial) {

                profileInitial.textContent =
                    name
                        .charAt(0)
                        .toUpperCase();

            }


            /* PROFILE NAME */

            if (profileName) {

                profileName.value =
                    name;

            }


            /* PROFILE USERNAME */

            if (profileUsername) {

                profileUsername.value =
                    username;

            }


            /* PROFILE EMAIL */

            if (profileEmail) {

                profileEmail.value =
                    email;

            }


            /* PROFILE PHONE */

            if (profilePhone) {

                profilePhone.value =
                    phone;

            }

        }


        /* =============================================
           SHOW DASHBOARD
        ============================================== */

        async function showDashboard() {

            if (authSection) {

                authSection.style.display =
                    "none";

            }


            if (dashboard) {

                dashboard.style.display =
                    "block";

            }


            await updateDashboard();

        }


        /* =============================================
           SHOW AUTH
        ============================================== */

        function showAuth() {

            if (authSection) {

                authSection.style.display =
                    "block";

            }


            if (dashboard) {

                dashboard.style.display =
                    "none";

            }

        }


        /* =============================================
           CHECK SESSION
        ============================================== */

        async function checkSession() {

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (error) {

                console.error(
                    "Session error:",
                    error
                );

                showAuth();

                return;

            }


            if (data.session) {

                await showDashboard();

            } else {

                showAuth();

            }

        }


        /* =============================================
           REGISTER
        ============================================== */

        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    const name =
                        document
                            .getElementById(
                                "registerName"
                            )
                            .value
                            .trim();


                    const username =
                        document
                            .getElementById(
                                "registerUsername"
                            )
                            .value
                            .trim()
                            .toLowerCase();


                    const email =
                        document
                            .getElementById(
                                "registerEmail"
                            )
                            .value
                            .trim()
                            .toLowerCase();


                    const phone =
                        document
                            .getElementById(
                                "registerPhone"
                            )
                            .value
                            .trim();


                    const password =
                        document
                            .getElementById(
                                "registerPassword"
                            )
                            .value;


                    const confirmPassword =
                        document
                            .getElementById(
                                "registerConfirmPassword"
                            )
                            .value;


                    /* =================================
                       NAME
                    ================================== */

                    if (!name) {

                        sultanAlert(
                            "Please enter your full name."
                        );

                        return;

                    }


                    /* =================================
                       USERNAME
                    ================================== */

                    if (!username) {

                        sultanAlert(
                            "Please choose a username."
                        );

                        return;

                    }


                    if (
                        !/^[a-zA-Z0-9_]{3,20}$/
                            .test(username)
                    ) {

                        sultanAlert(
                            "Username must be 3–20 characters and may contain only letters, numbers and underscore."
                        );

                        return;

                    }


                    /* =================================
                       EMAIL OR PHONE
                    ================================== */

                    if (!email && !phone) {

                        sultanAlert(
                            "Please enter either your email address or phone number."
                        );

                        return;

                    }


                    /* =================================
                       PASSWORD
                    ================================== */

                    if (
                        password.length < 8
                    ) {

                        sultanAlert(
                            "Password must be at least 8 characters."
                        );

                        return;

                    }


                    if (
                        !/[A-Za-z]/.test(
                            password
                        )
                    ) {

                        sultanAlert(
                            "Password must contain at least one letter."
                        );

                        return;

                    }


                    if (
                        !/[0-9]/.test(
                            password
                        )
                    ) {

                        sultanAlert(
                            "Password must contain at least one digit."
                        );

                        return;

                    }


                    if (
                        password !==
                        confirmPassword
                    ) {

                        sultanAlert(
                            "Passwords do not match."
                        );

                        return;

                    }


                    /* =================================
                       BUTTON
                    ================================== */

                    const button =
                        registerForm.querySelector(
                            "button[type='submit']"
                        );


                    if (button) {

                        button.disabled =
                            true;

                        button.textContent =
                            "CREATING ACCOUNT...";

                    }


                    try {


                        /* =================================
                           CHECK USERNAME
                        ================================== */

                        const {
                            data:
                                usernameExists,
                            error:
                                usernameCheckError
                        } =
                            await supabaseClient
                                .from("profiles")
                                .select("id")
                                .eq(
                                    "username",
                                    username
                                )
                                .maybeSingle();


                        if (
                            usernameCheckError
                        ) {

                            console.error(
                                "Username check error:",
                                usernameCheckError
                            );

                            sultanAlert(
                                "Unable to check username. Please try again."
                            );

                            return;

                        }


                        if (
                            usernameExists
                        ) {

                            sultanAlert(
                                "This username is already taken. Please choose another username."
                            );

                            return;

                        }


                        /* =================================
                           CREATE AUTH USER
                        ================================== */

                        let result;


                        /* EMAIL ACCOUNT */

                        if (email) {

                            result =
                                await supabaseClient
                                    .auth
                                    .signUp({

                                        email:
                                            email,

                                        password:
                                            password,

                                        options: {

                                            data: {

                                                full_name:
                                                    name,

                                                username:
                                                    username,

                                                phone:
                                                    phone ||
                                                    null

                                            }

                                        }

                                    });

                        }


                        /* PHONE ACCOUNT */

                        else {

                            result =
                                await supabaseClient
                                    .auth
                                    .signUp({

                                        phone:
                                            phone,

                                        password:
                                            password,

                                        options: {

                                            data: {

                                                full_name:
                                                    name,

                                                username:
                                                    username

                                            }

                                        }

                                    });

                        }


                        const {
                            data,
                            error
                        } = result;


                        /* =================================
                           AUTH ERROR
                        ================================== */

                        if (error) {

                            console.error(
                                "Signup error:",
                                error
                            );

                            sultanAlert(
                                error.message
                            );

                            return;

                        }


                        if (!data.user) {

                            sultanAlert(
                                "Account could not be created."
                            );

                            return;

                        }


                        /* =================================
                           SAVE PROFILE
                        ================================== */

                        if (data.session) {

                            const profile =
                                await saveProfile(
                                    data.user,
                                    {

                                        full_name:
                                            name,

                                        username:
                                            username,

                                        email:
                                            email ||
                                            null,

                                        phone:
                                            phone ||
                                            null

                                    }
                                );


                            if (!profile) {

                                sultanAlert(
                                    "Your account was created, but your profile could not be saved. Please contact support."
                                );

                                return;

                            }

                        }


                        /* =================================
                           SUCCESS
                        ================================== */

                        registerForm.reset();


                        if (
                            data.session
                        ) {

                            sultanAlert(
                                "Account created successfully. Welcome to Sultan's Brands!"
                            );

                            await showDashboard();

                        }

                        else {

                            if (email) {

                                sultanAlert(
                                    "Account created successfully!\n\nPlease check your email and confirm your account before signing in."
                                );

                            }

                            else {

                                sultanAlert(
                                    "Account created successfully!\n\nPlease verify your phone number using the OTP."
                                );

                            }


                            showLogin();

                        }


                    }

                    catch (error) {

                        console.error(
                            "Signup error:",
                            error
                        );

                        sultanAlert(
                            "Something went wrong while creating your account."
                        );

                    }


                    finally {

                        if (button) {

                            button.disabled =
                                false;

                            button.textContent =
                                "CREATE ACCOUNT";

                        }

                    }

                }
            );

        }


        /* =============================================
           LOGIN
        ============================================== */

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    const identifier =
                        document
                            .getElementById(
                                "loginIdentifier"
                            )
                            .value
                            .trim();


                    const password =
                        document
                            .getElementById(
                                "loginPassword"
                            )
                            .value;


                    if (!identifier) {

                        sultanAlert(
                            "Please enter your username, email or phone number."
                        );

                        return;

                    }


                    if (!password) {

                        sultanAlert(
                            "Please enter your password."
                        );

                        return;

                    }


                    const button =
                        loginForm.querySelector(
                            "button[type='submit']"
                        );


                    if (button) {

                        button.disabled =
                            true;

                        button.textContent =
                            "SIGNING IN...";

                    }


                    try {


                        let email = "";
                        let phone = "";


                        /* =================================
                           EMAIL
                        ================================== */

                        if (
                            identifier.includes("@")
                        ) {

                            email =
                                identifier
                                    .toLowerCase();

                        }


                        /* =================================
                           PHONE
                        ================================== */

                        else if (
                            identifier.startsWith("+")
                        ) {

                            phone =
                                identifier;

                        }


                        /* =================================
                           USERNAME
                        ================================== */

                        else {

                            const {
                                data:
                                    profile,
                                error:
                                    profileError
                            } =
                                await supabaseClient
                                    .from("profiles")
                                    .select(
                                        "email, phone"
                                    )
                                    .eq(
                                        "username",
                                        identifier
                                            .toLowerCase()
                                    )
                                    .maybeSingle();


                            if (
                                profileError
                            ) {

                                console.error(
                                    "Username lookup error:",
                                    profileError
                                );

                                sultanAlert(
                                    "Unable to find this username."
                                );

                                return;

                            }


                            if (!profile) {

                                sultanAlert(
                                    "Username not found."
                                );

                                return;

                            }


                            if (
                                profile.email
                            ) {

                                email =
                                    profile.email
                                        .toLowerCase();

                            }

                            else if (
                                profile.phone
                            ) {

                                phone =
                                    profile.phone;

                            }

                            else {

                                sultanAlert(
                                    "This account does not have a valid login method."
                                );

                                return;

                            }

                        }


                        /* =================================
                           SIGN IN
                        ================================== */

                        let loginResult;


                        if (email) {

                            loginResult =
                                await supabaseClient
                                    .auth
                                    .signInWithPassword({

                                        email:
                                            email,

                                        password:
                                            password

                                    });

                        }

                        else {

                            loginResult =
                                await supabaseClient
                                    .auth
                                    .signInWithPassword({

                                        phone:
                                            phone,

                                        password:
                                            password

                                    });

                        }


                        const {
                            data,
                            error
                        } =
                            loginResult;


                        if (error) {

                            console.error(
                                "Login error:",
                                error
                            );

                            sultanAlert(
                                error.message
                            );

                            return;

                        }


                        if (!data.user) {

                            sultanAlert(
                                "Unable to sign in."
                            );

                            return;

                        }


                        loginForm.reset();


                        sultanAlert(
                            "Welcome back to Sultan's Brands!"
                        );


                        await showDashboard();

                    }


                    catch (error) {

                        console.error(
                            "Login error:",
                            error
                        );

                        sultanAlert(
                            "Something went wrong while signing in."
                        );

                    }


                    finally {

                        if (button) {

                            button.disabled =
                                false;

                            button.textContent =
                                "SIGN IN";

                        }

                    }

                }
            );

        }


        /* =============================================
           LOGOUT
        ============================================== */

        window.logout =
            async function () {

                sultanConfirm(
                    "Are you sure you want to log out?",
                    async function () {

                        const {
                            error
                        } =
                            await supabaseClient
                                .auth
                                .signOut();


                        if (error) {

                            console.error(
                                "Logout error:",
                                error
                            );

                            sultanAlert(
                                "Unable to log out. Please try again."
                            );

                            return;

                        }


                        showAuth();

                        showLogin();


                        sultanAlert(
                            "You have been logged out successfully."
                        );

                    }
                );

            };


        /* =============================================
           SHOW PROFILE
        ============================================== */

        window.showProfile =
            async function () {

                const profilePanel =
                    document.getElementById(
                        "profilePanel"
                    );


                if (!profilePanel) {
                    return;
                }


                await updateDashboard();


                profilePanel.style.display =
                    "block";


                profilePanel.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

            };


        /* =============================================
           CLOSE PROFILE
        ============================================== */

        window.closeProfile =
            function () {

                const profilePanel =
                    document.getElementById(
                        "profilePanel"
                    );


                if (profilePanel) {

                    profilePanel.style.display =
                        "none";

                }

            };


        /* =============================================
           UPDATE PROFILE
        ============================================== */

        if (profileForm) {

            profileForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    const user =
                        await getCurrentUser();


                    if (!user) {

                        sultanAlert(
                            "Please sign in first."
                        );

                        return;

                    }


                    const newName =
                        profileName
                            .value
                            .trim();


                    if (!newName) {

                        sultanAlert(
                            "Please enter your name."
                        );

                        return;

                    }


                    const button =
                        profileForm.querySelector(
                            "button[type='submit']"
                        );


                    if (button) {

                        button.disabled =
                            true;

                        button.textContent =
                            "SAVING...";

                    }


                    try {


                        const {
                            error
                        } =
                            await supabaseClient
                                .from("profiles")
                                .update({

                                    full_name:
                                        newName

                                })
                                .eq(
                                    "id",
                                    user.id
                                );


                        if (error) {

                            console.error(
                                "Profile update error:",
                                error
                            );

                            sultanAlert(
                                error.message
                            );

                            return;

                        }


                        /* AUTH METADATA */

                        const {
                            error:
                                metadataError
                        } =
                            await supabaseClient
                                .auth
                                .updateUser({

                                    data: {

                                        full_name:
                                            newName

                                    }

                                });


                        if (
                            metadataError
                        ) {

                            console.error(
                                "Metadata update error:",
                                metadataError
                            );

                        }


                        await updateDashboard();


                        sultanAlert(
                            "Your profile has been updated successfully."
                        );


                        closeProfile();

                    }


                    catch (error) {

                        console.error(
                            "Profile error:",
                            error
                        );

                        sultanAlert(
                            "Unable to update your profile."
                        );

                    }


                    finally {

                        if (button) {

                            button.disabled =
                                false;

                            button.textContent =
                                "SAVE CHANGES";

                        }

                    }

                }
            );

        }


        /* =============================================
           AUTH STATE LISTENER
        ============================================== */

        supabaseClient
            .auth
            .onAuthStateChange(
                async function (
                    event,
                    session
                ) {

                    console.log(
                        "Auth event:",
                        event
                    );


                    if (session) {

                        await showDashboard();

                    }

                    else {

                        showAuth();

                    }

                }
            );


        /* =============================================
           START
        ============================================== */

        checkSession();


    }
);