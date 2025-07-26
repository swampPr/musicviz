const resultsList = document.getElementById('results-list');
const textInput = document.getElementById('artist-text');

async function fetchArtists(input) {
    try {
        const encodedInput = encodeURIComponent(input.trim());
        const response = await fetch(`/api/artist/search?q=${encodedInput}`, {
            mode: 'same-origin',
            headers: {
                Accept: 'application/json'
            }
        });

        const artistsResults = await response.json();

        return artistsResults;
    } catch (err) {
        console.log(err);
        return {
            error: 'Something went wrong...'
        };
    }
}

function renderResults(artistsResults) {
    const data = artistsResults.data;

    const listItems = data
        .map((artist) => {
            return `
            <li id="artist-result"> 
                <div class="result-card">
                    <div id="img-container">
                        <img src="${artist.image ? artist.image : './images/fallback160.png'}" alt="${artist.artist}"  class="artist-img"/>
                    </div>
                    <div id="artist-info">
                        <a class="artist-name-link" " href="/artist/info?id=${artist.artistID}">
                            <p class="artist-name" >${artist.artist}</p>
                        </a>
                        <p id="artist-genre"> ${artist.mainGenre ? artist.mainGenre.toUpperCase() : 'No Genre Found'}</p>
                    </div>
                </div>
            </li>
            `;
        })
        .join('');

    resultsList.innerHTML = listItems;

    if (artistsResults.next && !artistsResults.previous) {
        document.getElementById('next').style.display = 'inline';
        return;
    } else if (artistsResults.previous && !artistsResults.next) {
        document.getElementById('previous').style.display = 'inline';
        return;
    }
    document.getElementById('next').style.display = 'inline';
    document.getElementById('previous').style.display = 'inline';
}

document.getElementById('artist-submit').addEventListener('click', async () => {
    const artistsResults = await fetchArtists(textInput.value);
    console.log(artistsResults);
    renderResults(artistsResults);
});

textInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const artistsResults = await fetchArtists(textInput.value);
        console.log(artistsResults);
        renderResults(artistsResults);
    }

    return;
});
