const db = require("../../../models/index");

class IncotermController {
    async createIncoterm(req, res) {
        try {
            const { incoterm_code, incoterm_meaning, incoterm_responsibility, status } = req.body;
            const incoterm = await db.incotermMaster.create({
                incoterm_code,
                incoterm_meaning,
                incoterm_responsibility,
                status,
            });
            res.status(201).json(incoterm);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllIncoterms(req, res) {
        try {
            const incoterms = await db.incotermMaster.findAll();
            res.status(200).json({ data: incoterms });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getIncotermById(req, res) {
        try {
            const { id } = req.params;
            const incoterm = await db.incotermMaster.findByPk(id);
            if (!incoterm) {
                return res.status(404).json({ error: 'Incoterm not found' });
            }
            res.status(200).json(incoterm);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateIncoterm(req, res) {
        try {
            const { id } = req.params;
            const { incoterm_code, incoterm_meaning, incoterm_responsibility, status } = req.body;
            const incoterm = await db.incotermMaster.findByPk(id);
            if (!incoterm) {
                return res.status(404).json({ error: 'Incoterm not found' });
            }
            incoterm.incoterm_code = incoterm_code;
            incoterm.incoterm_meaning = incoterm_meaning;
            incoterm.incoterm_responsibility = incoterm_responsibility;
            incoterm.status = status;
            await incoterm.save();
            res.status(200).json(incoterm);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteIncoterm(req, res) {
        try {
            const { id } = req.params;
            const incoterm = await db.incotermMaster.findByPk(id);
            if (!incoterm) {
                return res.status(404).json({ error: 'Incoterm not found' });
            }
            await incoterm.destroy();
            res.status(200).json({ message: 'Incoterm deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new IncotermController();