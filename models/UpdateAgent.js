const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// การเชื่อมต่อกับ MongoDB ด้วย Mongoose
mongoose.connect('mongodb://localhost/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true });
const Agent = mongoose.model('Agent', {
    _id: mongoose.Schema.Types.ObjectId,
    confirmFlag: String, // เพิ่มฟิลด์ confirmFlag ในโมเดล Agent
    // เพิ่มฟิลด์อื่น ๆ ตามที่คุณต้องการ
});

// สร้างเส้นทาง API สำหรับการอัปเดตค่า confirmFlag โดยอิงตาม _id
app.post('/updateAgent/:id', async (req, res) => {
    try {
        const agentId = req.params.id;

        // Validate the agentId variable
        if (!mongoose.Types.ObjectId.isValid(agentId)) {
            return res.status(400).json({ message: 'Invalid agentId' });
        }

        const newConfirmFlag = 'Y';

        // ...
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating confirmFlag' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
