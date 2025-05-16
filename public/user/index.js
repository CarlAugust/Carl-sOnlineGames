const username = document.getElementById('username');
const email = document.getElementById('email');
const country = document.getElementById('country');
const role = document.getElementById('role');
const cookie = document.getElementById('cookie');


async function fetchUser() {
    try {
        const response = await fetch('/api/fetchUser', {
            method: "GET"  
        });
        if(response.ok)
            {
                const data = await response.json();
                console.log(data);
                username.innerText = data.name;
                country.innerText = data.countryCode;
                role.innerText = data.role;
                cookie.checked = data.personalised ? true : false;
            }
            else
            {
                const errorText = await response.text();
                console.error(errorText);
            }
    } catch (err) {
        console.error(err);
    }
}

fetchUser();


async function deleteUser()
{
    try {
        const response = await fetch('/deleteUser', {
            method: 'DELETE'
        });
        if (response.ok)
        {
            const data = await response.json();
            window.location.href = data.redirect;
        }
        else
        {
            const errorText = await response.text();
            console.error("Error:", errorText);
        }
    } catch (err)
    {
        console.error(err);
    }
}

async function updateCookie()
{
    try {
        const response = await fetch('/updateCookie', {
            method: "POST",
            body: {personalised: cookie.checked}
        });
        if (response.ok)
        {
            console.log("Woah");
        }
        else
        {
            console.log("oppsies");
        }
    } catch (err)
    {
        console.error(err);
    }
}