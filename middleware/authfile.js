const path = require('path');

module.exports = (req, res, next) => {
    if (!req.session.userId) {
        // หากผู้ใช้ยังไม่ได้ login
        return res.status(403).send('Forbidden: Please login first.');  // ส่งคืนข้อความ 403 Forbidden
    }

    // ตรวจสอบว่า request เป็นการเข้าถึงโฟลเดอร์ "uploaddata" หรือไม่
    if (req.path.startsWith('/uploaddata')) {
        const filePath = path.join(__dirname, 'path_to_uploaddata_folder', req.path.replace('/uploaddata', ''));
        res.sendFile(filePath);
    } else {
        next();
    }
}