export let ACCESS_TOKEN = null;

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
                artistAPILink: `${artist.href}`,
                artistID: artist.id
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
