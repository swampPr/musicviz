const newsList = document.getElementById('news-list');
const billboardList = document.getElementById('billboard-list');

//NOTE: Fetchers
async function fetchNews() {
    try {
        const newsJSON = await fetch(`/api/news/all`, {
            mode: 'same-origin',
            headers: {
                Accept: 'application/json'
            }
        });

        const newsOBJ = await newsJSON.json();

        return newsOBJ;
    } catch (err) {
        console.log(err);
        return {
            error: 'Something went wrong'
        };
    }
}

async function fetchBillBoard() {
    try {
        const billboardJSON = await fetch(`/api/billboard/recent`, {
            mode: 'same-origin',
            headers: {
                Accept: 'application/json'
            }
        });

        const billboardOBJ = await billboardJSON.json();

        return billboardOBJ;
    } catch (err) {
        console.log(err);
        return {
            error: 'Something went wrong'
        };
    }
}

//NOTE: Renderers
function renderBillBoard(billboardOBJ) {
    const data = billboardOBJ.data;

    let listItems = data
        .slice(0, 10)
        .map((song) => {
            return `<li class="chart-entry">
            <div class="rank">
                <span class ="this-week">${song.this_week}</span>
             <div>
                <h3 class="title">${song.song}</h3>
                <p class="artist">By: ${song.artist}</p>
             </div>
            </div>
            <ul class="chart-stats">
                <li> Last Week: ${song.last_week ? song.last_week : '<b> - </b>'}</li>
                <li> Peak Position: ${song.peak_position}</li>
                <li> Weeks on Chart: ${song.weeks_on_chart}</li>
            </ul>

        </li>`;
        })
        .join('');

    document.getElementById('loading-billboard').remove();
    billboardList.innerHTML = listItems;
}

function renderNews(newsOBJ) {
    const data = newsOBJ.data;
    console.log(data[0]);
    const listItems = data
        .map((news) => {
            return `
            <li class="news-entry"> 
                <div class="cover-container"> 
                   <img class="cover-img" src="${news.img.src}" alt="${news.img.alt}" /> 
                </div>
                <div class="info">
                    <h3 class="news-headline">${news.headline}</h3>
                    <a class="news-link" href="${news.link}" target="_blank">READ</a>
                </div>
            </li>

        `;
        })
        .join('');

    document.getElementById('read-more').href = newsOBJ.website;
    document.getElementById('read-more').style.display = 'block';
    document.getElementById('loading-news').remove();
    newsList.innerHTML = listItems;
}

document.addEventListener('DOMContentLoaded', async () => {
    const newsOBJ = await fetchNews();
    const billboardOBJ = await fetchBillBoard();
    renderNews(newsOBJ);
    renderBillBoard(billboardOBJ);
});
