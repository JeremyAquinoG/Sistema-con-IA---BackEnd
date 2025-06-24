const Log = require('../models/log');

exports.obtenerLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      where: { user_id: req.user.id },
      order: [['fecha_hora', 'DESC']]
    });
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener logs' });
  }
};
