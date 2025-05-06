const scoreParagraph = document.getElementById('score');

const playGame = async () => {
    try {
        const response = await fetch('/game/random/play', {
            method: "GET"
        });
        if(response.ok)
        {
            const data = await response.json();
            scoreParagraph.innerHTML = `Score: ${data.score}`
        }
        else
        {
            const errorText = await response.text();
            console.error(errorText);
        }
    }
    catch(err) {
        console.error(err);
    }
}