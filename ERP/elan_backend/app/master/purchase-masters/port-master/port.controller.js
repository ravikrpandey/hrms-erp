const db = require("../../../models/index");
class PortController {
    async createPort(req, res) {
        try {
            const { port_name, unlocode, port_type, latitude, longitude, status, country_id, state_id, city_id } = req.body;
            const port = await db.portMaster.create({
                port_name,
                unlocode,
                port_type,
                latitude,
                longitude,
                status,
                country_id,
                state_id,
                city_id
            });
            res.status(201).json(port);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllPorts(req, res) {
        try {
            const ports = await db.portMaster.findAll();
            res.status(200).json({ data: ports });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPortById(req, res) {
        try {
            const { id } = req.params;
            const port = await db.portMaster.findByPk(id);
            if (!port) {
                return res.status(404).json({ error: 'Port not found' });
            }
            res.status(200).json(port);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updatePort(req, res) {
        try {
            const { id } = req.params;
            const { port_name, unlocode, port_type, latitude, longitude, status, country_id, state_id, city_id } = req.body;
            const port = await db.portMaster.findByPk(id);
            if (!port) {
                return res.status(404).json({ error: 'Port not found' });
            }
            port.port_name = port_name;
            port.unlocode = unlocode;
            port.port_type = port_type;
            port.latitude = latitude;
            port.longitude = longitude;
            port.status = status;
            port.country_id = country_id;
            port.state_id = state_id;
            port.city_id = city_id;
            await port.save();
            res.status(200).json(port);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deletePort(req, res) {
        try {
            const { id } = req.params;
            const port = await db.portMaster.findByPk(id);
            if (!port) {
                return res.status(404).json({ error: 'Port not found' });
            }
            await port.destroy();
            res.status(200).json({ message: 'Port deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PortController();