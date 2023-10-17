const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const flash = require('connect-flash')
const multer = require('multer');
const path = require('path');

const bodyParser = require('body-parser');


// ใช้ body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connect('mongodb+srv://pichayab:dOv19PGQJs9roLSI@cluster0.qai4dna.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});







const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './publish/uploaddata');  // กำหนดให้เก็บไฟล์ในโฟลเดอร์ 'uploaddata'
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);  // ใช้ชื่อไฟล์เดิม
    }
});

const upload = multer({ storage: storage });


global.loggedIn = null

// Controllers
const indexController = require('./controllers/indexController');
const storeAgentController = require('./controllers/storeAgentController');
const listAgentController = require('./controllers/listAgentController');
const successController = require('./controllers/successController');
const uploadController = require('./controllers/indexController');

const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')
const storeUserController = require('./controllers/storeUserController')
const logoutController = require('./controllers/logoutController')
const loginUserController = require('./controllers/loginUserController')


const AgentModel = require('./models/Agent');
const Agent = require('./models/Agent');
const User = require('./models/User');

// Middleware
const redirectIfAuth = require('./middleware/redirectIfAuth')
const authMiddleware = require('./middleware/authMiddleware')



// Check 
app.use((req, res, next) => {
    console.log('Received request:', req.method, req.path);
    next();
});



app.use(express.static('publish'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(flash())
app.use(expressSession({
    secret: "node secret"
}))
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId
    next()
})
app.set('view engine', 'ejs');

app.get('/upload', uploadController)
app.get('/listAgent',authMiddleware, listAgentController)
app.get('/success', successController)
app.get('/', indexController)
app.get('/loginMng', loginController)
app.get('/registerMng', registerController)
app.post('/user/register', storeUserController)
app.post('/user/login', loginUserController)
app.get('/logout', logoutController)







app.post('/user/registerAgent', upload.fields([{ name: 'idCardFile', maxCount: 1 }, { name: 'bookBankFile', maxCount: 1 }]), async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const phonenumber = req.body.phonenumber;
        const address = req.body.address;
        const province = req.body.province;
        
        const acceptPDPA = req.body.acceptPDPA === 'Y' ? 'Y' : 'N';
        const confirmFlag = req.body.confirmFlag;  // ในกรณีนี้ไม่ต้องแปลงค่า



        const idCardFile = req.files.idCardFile[0];
        const bookBankFile = req.files.bookBankFile[0];

        const idCardFilePath = idCardFile.path;
        const bookBankFilePath = bookBankFile.path;

        // สร้าง object สำหรับบันทึกข้อมูล
        const agent = new AgentModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phonenumber: phonenumber,
            address: address,
            province: province,
            acceptPDPA: acceptPDPA,
            confirmFlag: confirmFlag,
            idCardFile: {
                filename: idCardFile.filename,
                path: idCardFilePath,
            },
            bookBankFile: {
                filename: bookBankFile.filename,
                path: bookBankFilePath,
            }
        });

        await agent.save();

    

       // Send a response when done
        res.redirect('/success');
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred during registration. Please try again.");
    }
});



app.get('/search', async (req, res) => {
    const query = req.query.query;
    //console.log("Received query:", query); // ใส่ log ดูค่าที่รับมา


    let searchCriteria;

   if (["Y", "N", "Y,N"].includes(query)) {
    const flags = query.split(','); // แยกค่าจาก ","
    searchCriteria = {
        confirmFlag: { $in: flags }
    };
} else {
        // ค้นหาโดยใช้ email, phonenumber, firstName, หรือ lastName
        searchCriteria = {
            $or: [
                { email: new RegExp(query, 'i') },
                { phonenumber: new RegExp(query, 'i') },
                { firstName: new RegExp(query, 'i') },
                { lastName: new RegExp(query, 'i') }
            ]
        };
    }

    try {
        const agents = await Agent.find(searchCriteria);
        res.json(agents);
    } catch (err) {
        res.status(500).send({ message: 'เกิดข้อผิดพลาดในการค้นหา' });
    }
});



app.get('/getAgentDetail', async (req, res) => {
    console.log("Fetching agent details for:", req.query.agentId); // ตรวจสอบที่นี่
    const agentId = req.query.agentId;

    try {
        const agent = await Agent.findById(agentId);
        console.log("Found agent:", agent); // ตรวจสอบว่าพบข้อมูลจริงหรือไม่
        // ...
    } catch (err) {
        console.error("Error fetching agent from database:", err); // แสดง error ที่เกิดขึ้น
        // ...
    }
    
});




app.post('/updateAgentConfirmation', async (req, res) => {
    try {
        const { agentId, confirmFlag } = req.body;

        // ตรวจสอบความเป็นมาก่อนการอัพเดต
        if(!agentId || !confirmFlag) {
            return res.status(400).json({ message: "Missing agentId or confirmFlag." });
        }

        //console.log("About to update agent with ID:", agentId, "with flag:", confirmFlag);

        // ใช้ findOneAndUpdate แทนที่จะใช้ findByIdAndUpdate
        const updatedAgent = await Agent.findOneAndUpdate({ _id: agentId }, { confirmFlag: confirmFlag }, { new: true });
        //console.log("Updated agent:", updatedAgent);

        res.json({ message: "updating Successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error updating agent confirmation." });
    }
});





app.use(expressSession({
    secret: 'rAnD0mS3cR3tK3y$Tr0ng', // คีย์ที่ใช้ในการเข้ารหัส session
    resave: false, // ไม่ควรเรียกใช้การบันทึก session ใหม่ทุกครั้ง
    saveUninitialized: true, // บันทึก session ใหม่ถ้ามีการเปิดเว็บในครั้งแรก
    cookie: {
      maxAge: 86400000, // อายุของ session ใน milliseconds (24 ชั่วโมง)
      secure: false, // ควรตั้งเป็น true หากใช้ HTTPS
    }
  }));




app.listen(4000, () => {
    console.log("App listening on port 4000")
})

