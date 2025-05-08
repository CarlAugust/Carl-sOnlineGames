const leaderBoard = document.getElementById('leaderboard');
const leaderBoardBody = document.getElementById('leaderboardBody');

const fetchLeaderBoardListing = async () => {
    console.log('bruh');
    try {
        const response = await fetch('/api/leaderBoardListing', {
            method: "GET"
        });
        if(response.ok)
        {
            const data = await response.json();
            let html = '';

            for (let item of data)
            {
                html += `<tr>
                            <th scope="row">${item.user}</th>
                            <th>${item.score}</th>
                        </tr>`
            }
            leaderBoardBody.innerHTML = html;
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
};

fetchLeaderBoardListing();