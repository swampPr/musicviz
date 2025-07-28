export let ACCESS_TOKEN = null;
import chalk from 'chalk';

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
    console.log(ACCESS_TOKEN);
}

export async function fetchArtists(input, retries = 3) {
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
        //INFO: If the fetch doesn't work, recursively retry the call with delays until 3 errors are returned or 1 success
        if (retries <= 0) {
            throw err;
        }
        await new Promise((res, rej) => setTimeout(res, Math.ceil(Math.random() * 500)));
        console.warn(chalk.bgRed(`API Call failed, retrying.. attempt number ${3 - retries + 1}`));
        return await fetchArtists(input, retries - 1);
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
