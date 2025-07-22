import fetchBillboard from '../services/billboardService.js';

export async function getBillboard(req, res) {
    try {
        const billboardOBJ = await fetchBillboard();

        res.json(billboardOBJ);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'Something went wrong...'
        });
    }
}
