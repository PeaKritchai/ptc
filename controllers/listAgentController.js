const Agent = require('../models/Agent');

module.exports = async (req, res) => {
    try {
        // ดึงข้อมูล agent ทั้งหมดจาก MongoDB
        const agents = await Agent.find();
        res.render('listAgent', { agents });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล agent:', error);
        // จัดการข้อผิดพลาดอย่างเหมาะสม
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล agent');
    }
};
