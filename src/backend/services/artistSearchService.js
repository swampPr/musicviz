/* NOTE: This artist search is meant to work for user artist search and for artist pages
 *      -* For Artist Search page it should get the following from the spotify api (Check Notion for details):
 *          -* Get Artist Name
 *          -* Get Artist Cover Image
 *          -* Get "next" and "previous" links from the api (again, check notion notes)
 *          -* Get Artists Genres
 *          -* Get artist spotify ID for if the user clicks on that artist
 *      -* For Artist pages it should get the following from whatever API works best (Music Brainz, Spotify, etc..) check Notion for likely ones:
 *          -* Get Artist Name
 *          -* Get Artist Cover Image
 *          -* Get Artist Followers in Spotify
 *          -* Get artists spotify links
 *          -* Get Artists genres
 *          -* Get Artist spotify popularity
 * NOTE: YOU WILL MOST LIKELY HAVE TO MIX AND MATCH REQUESTS FROM SPOTIFY AND OTHER SOURCES SO MAKE SURE TO DO RESEARCH AND TESTS
 */

let ACCESS_TOKEN = null;

export async function genToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.CLIENT_SECRET}`
    }).toString();

    const res = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    const token = await res.json();

    ACCESS_TOKEN = token.access_token;
}

export async function fetchArtists(input) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${input}&type=artist&market=US`, {
            mode: 'cors',
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });
        const artistsInfo = await response.json();

        const responseOBJ = {
            next: artistsInfo.artists.next ? artistsInfo.artists.next : null,
            previous: artistsInfo.artists.previous ? artistsInfo.artists.previous : null,
            data: []
        };
        artistsInfo.artists.items.forEach((artist) => {
            responseOBJ.data.push({
                artist: artist.name,
                mainGenre: artist.genres[0],
                image: artist.images[2] ? artist.images[2].url : null,
                artistAPILink: `${artist.href}`
            });
        });

        return responseOBJ;
    } catch (err) {
        throw err;
    }
}

setInterval(
    async () => {
        try {
            await genToken();
            console.log('New Token Generated ');
        } catch (err) {
            throw err;
        }
    },
    55 * 60 * 1000 //NOTE: Token will refresh every 55 minutes
);
