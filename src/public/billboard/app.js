const billboardList = document.getElementById('billboard-list');

async function fetchBillBoard() {
    try {
        const billBoardJSON = await fetch('/api/billboard/recent', {
            mode: 'same-origin',
            header: {
                Accept: 'application/json'
            }
        });

        const billBoardOBJ = await billBoardJSON.json();

        return billBoardOBJ;
    } catch (err) {
        console.log(err);
        return {
            error: 'Something went wrong'
        };
    }
}

function renderBillBoard(billBoardOBJ) {
    const data = billBoardOBJ.data;
    let listItems = '';

    data.forEach((song) => {
        listItems += `
          <li> 
            <div class="rank">
                <h3 class="this-week">${song.this_week} </h3>
            <div id="info">
                <h3 class="title"> ${song.song}</h3>
                <p class="artist">By: ${song.artist}</p>
            </div>
            <ul class="chart-stats">
                <li>Last Week: ${song.last_week ? song.last_week : '<b> - </b>'}</li>
                <li>Peak Position: ${song.peak_position}</li>
                <li>Weeks on Chart: ${song.weeks_on_chart} </li>
            </ul> 
            </div>
        </li>        `;
    });

    billboardList.innerHTML = listItems;
}

document.addEventListener('DOMContentLoaded', async () => {
    const billBoardOBJ = await fetchBillBoard();
    renderBillBoard(billBoardOBJ);
});
