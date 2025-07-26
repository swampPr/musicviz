const topTracksList = document.getElementById('top-tracks-list');
const albumsList = document.getElementById('albums-list');

async function fetchArtistInfo(artistID) {
    try {
        const response = await fetch(`/api/artist/info/${artistID}`, {
            mode: 'same-origin',
            headers: {
                Accept: 'application/json'
            }
        });

        const artistInfo = await response.json();
        return artistInfo;
    } catch (err) {
        throw err;
    }
}

function getDuration(durationMS) {
    const minutes = Math.floor(durationMS / 60000);
    const seconds = ((durationMS % 60000) / 1000).toFixed(0);

    return seconds == 60 ? minutes + 1 + ':00' : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function renderArtistInfo(artistInfo) {
    const albums = artistInfo.albumsInfo;
    const topTracks = artistInfo.topTracksInfo;
    const mainInfo = artistInfo.mainInfo;
    document.title = `${mainInfo.artist}`;

    let tracksItems = '';
    topTracks.tracks.forEach((track) => {
        tracksItems += `
        <li id="track"> 
            <div class="track-img-container">
                <img src="${track.trackIMG}" class="track-img" width="64" height="64">
            </div>
            <div class="track-info">
                <a class="track-link" href="${track.trackLink}" target="_blank">
                    <p class="track-name">${track.trackName}</p>
                </a>
                <p class="track-duration">${getDuration(track.trackDurationMS)}</p>
                ${track.trackExplicit ? '<p class="explicit">E</p>' : ''}
            </div>
        </li>

        `;
    });

    let albumItems = '';

    albums.albums.forEach((album) => {
        albumItems += `
        <li class="album">
            <div class="album-img-container"> 
                <img src="${album.albumIMG}" class="album-img"/>
            </div>
            <div class="album-info">
                <a class="album-link" href="${album.albumLink}" target="_blank">
                    <p class="album-name">${album.albumName}</p>
                </a>
                <p class="album-release">${album.albumRelease}</p>
                <p class="album-tracks">${album.albumTracks} tracks</p>
            </div>
        </li>
        `;
    });

    let genres = '';
    if (mainInfo.genres.length > 0) {
        mainInfo.genres.forEach((genre) => {
            genres += `
                <li id="genre">${genre}</li>

                `;
        });
    } else {
        document.getElementById('artist-genres').style.display = 'none';
    }

    document.getElementById('loading-artist-info').remove();
    document.getElementById('loading-tracks').remove();
    document.getElementById('loading-albums').remove();

    if (mainInfo.img) document.getElementById('artist-img').src = mainInfo.img;

    document.getElementById('artist-name').textContent = mainInfo.artist;

    document.getElementById('artist-spotify').href = mainInfo.artistSpotify;
    document.getElementById('artist-genres').innerHTML = genres;

    topTracksList.innerHTML = tracksItems;
    albumsList.innerHTML = albumItems;
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const artistID = searchParams.get('id');
        const artistInfo = await fetchArtistInfo(artistID);
        console.log(artistInfo);
        renderArtistInfo(artistInfo);
    } catch (err) {
        console.log(err);
        //FIX: How should we handle the error here?
        //Maybe use a separate function to render errors?
    }
});
