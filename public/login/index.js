const login = async () => {
    console.log("Sent form");
    const username = document.getElementById("usernameLgn").value;
    const password = document.getElementById("passwordLgn").value;

    try {
        const response = await fetch("/login/attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        console.log(await response.json());
    } catch (e) {
        console.error(e);
    }
};

const signin = async () => {
    console.log("Sent form");
    const username = document.getElementById("usernameSgn").value;
    const password1 = document.getElementById("passwordSgn1").value;
    const password2 = document.getElementById("passowrdSgn2").value;

    if (password1 != password2)
    {
        const errorField = document.getElementById("errorSgn");
        errorField.innerHTML = "Password is not the same";
    }

    try {
        const response = await fetch("/signin/attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password1 }),
        });
        console.log(await response.json());
    } catch (e) {
        console.error(e);
    }
};