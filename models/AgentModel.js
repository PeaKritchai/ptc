const mongoose = require('mongoose');

// ... โค้ดสร้างโมเดล MongoDB สำหรับ Agent

const agentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    // เพิ่มฟิลด์อื่น ๆ ที่ต้องการ
    confirmFlag: String, // สร้างฟิลด์ confirmFlag
});

const AgentModel = mongoose.model('Agent', agentSchema);

module.exports = AgentModel;
