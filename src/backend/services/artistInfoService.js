import { ACCESS_TOKEN } from './artistSearchService.js';

export async function fetchArtistInfo(artistID) {
    try {
        const [info, topTracks, albums] = await Promise.all([fetchArtistMainInfo(artistID), fetchArtistTopTracks(artistID), fetchArtistAlbums(artistID)]);

        const responseOBJ = {
            mainInfo: info,
            albumsInfo: albums,
            topTracksInfo: topTracks
        };

        return responseOBJ;
    } catch (err) {
        throw err;
    }
}

async function fetchArtistAlbums(artistID) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?limit=10&market=US&include_groups=album`, {
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });

        const artistAlbumInfo = await response.json();

        const responseOBJ = {
            next: artistAlbumInfo.next ? true : false,
            albums: []
        };

        artistAlbumInfo.items.forEach((album) => {
            responseOBJ.albums.push({
                albumName: album.name,
                albumIMG: album.images[1].url,
                albumRelease: album.release_date,
                albumTracks: album.total_tracks,
                albumLink: album.external_urls.spotify
            });
        });

        return responseOBJ;
    } catch (err) {
        throw err;
    }
}

async function fetchArtistTopTracks(artistID) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?market=US`, {
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });

        const artistTopTracks = await response.json();

        const responseOBJ = {
            tracks: []
        };
        let trackRank = 1;

        artistTopTracks.tracks.forEach((track) => {
            responseOBJ.tracks.push({
                rank: trackRank,
                trackName: track.name,
                trackLink: track.external_urls.spotify,
                trackDurationMS: track.duration_ms,
                trackExplicit: track.explicit,
                trackIMG: track.album.images[2].url
            });
            trackRank++;
        });

        return responseOBJ;
    } catch (err) {
        throw err;
    }
}

async function fetchArtistMainInfo(artistID) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistID}`, {
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });

        const artistInfo = await response.json();

        const responseOBJ = {
            artistSpotify: artistInfo.external_urls.spotify,
            genres: [],
            img: artistInfo.images[0].url ? artistInfo.images[0].url : null,
            artist: artistInfo.name
        };

        if (artistInfo.genres.length > 0) {
            artistInfo.genres.forEach((genre) => {
                responseOBJ.genres.push(genre);
            });
        }

        return responseOBJ;
    } catch (err) {
        throw err;
    }
}
