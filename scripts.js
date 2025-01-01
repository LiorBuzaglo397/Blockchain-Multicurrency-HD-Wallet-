function goToHome() {
    window.location.href = "index.html";
}

window.onload = function () {
    // logout current user
    var allUsers = JSON.parse(localStorage.getItem("userData")) || [];

    // Find the logged in user and set isLoggedIn to false
    var loggedInUser = allUsers.find((user) => user.isLoggedIn);
    if (loggedInUser) {
        loggedInUser.isLoggedIn = false;
    }

    // Update the localStorage
    localStorage.setItem("userData", JSON.stringify(allUsers));
};
