const checkResponse = async (response) => {
    if (response.ok) {
        const data = await response.json();
        if (data.redirect) {
            window.location.href = data.redirect;
        } else {
            console.log("Signed in:", data);
        }
    } else {
        const errorText = await response.text();
        console.error("Error:", errorText);
    }
}

const login = async () => {
    console.log("Sent form");
    // Username can be both username and email
    const username = document.getElementById("usernameLgn").value;
    const password = document.getElementById("passwordLgn").value;

    try {
        const response = await fetch("/login/attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        checkResponse(response);
    } catch (e) {
        console.error(e);
    }
};

const signin = async () => {

    const username = document.getElementById("usernameSgn").value;
    const email = document.getElementById("emailSgn").value;
    const password1 = document.getElementById("passwordSgn1").value;
    const password2 = document.getElementById("passwordSgn2").value;

    if (password1 != password2)
    {
        const errorField = document.getElementById("errorSgn");
        errorField.innerHTML = "Password is not the same";
        return;
    }

    try {
        const response = await fetch("/signin/attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password: password1, email }),
        });
        checkResponse(response);
        
    } catch (e) {
        console.error(e);
    }
};

const logInModal = document.getElementById('loginmodal');
const signUpModal = document.getElementById('signupmodal');

signUpModal.close();
logInModal.showModal();

const openSignUpModal = () =>
{
    logInModal.close();
    signUpModal.showModal();
}

const openLoginModal = () =>
{
    logInModal.showModal();
    signUpModal.close();
}