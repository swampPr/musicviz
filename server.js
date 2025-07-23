import express from 'express';
import { genToken } from './src/backend/services/artistSearchService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRouter from './src/backend/routes/mainRoute.js';

const app = express();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

//NOTE: Serving static files
app.use('/', express.static(path.join(__dirname, 'src/public/start')));
app.use('/billboard/full', express.static(path.join(__dirname, 'src/public/billboard')));
app.use('/artist/search', express.static(path.join(__dirname, 'src/public/artistSearch')));

//NOTE: API Routes
app.use('/api', mainRouter);

//NOTE: Not found page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'src/public/notFound/index.html'));
});

app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
    try {
        await genToken();
    } catch (err) {
        console.log(err);
    }
});
