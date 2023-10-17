const Registration = require('../models/Agent');
const moment = require('moment-timezone');
const currentTimeInGMT7 = moment().tz('Asia/Bangkok'); // แปลงเวลาปัจจุบันเป็น GMT+7



module.exports = async (req, res) => {
    let firstName = "";
    let lastName = "";
    let email = "";
    let phonenumber = "";
    let address = "";
    let province = "";
    let accpetPDPA = "N";
    let confirmFlag = "N";
    let idCardFile = "";
    let bookBankFile = "";
    let dateRegister = moment().tz('Asia/Bangkok');
    let data = req.flash('data')[0];

    if (typeof data != "undefined") {
        firstName = data.firstName;
        lastName = data.lastName;
        email = data.email;
        phonenumber = data.phonenumber;
        address = data.address;
        province = data.province;
        confirmFlag = data.confirmFlag;
        idCardFile = data.idCardFile;
        bookBankFile = data.bookBankFile;

        // เช็คว่า checkbox ถูกเลือกหรือไม่
        if (req.body.accpetPDPA === "Y") {
            accpetPDPA = "Y";
        }
    }

    // เพิ่มตรวจสอบข้อมูลที่ส่งมาจากแบบฟอร์ม
    if (!firstName || !lastName || !email || !phonenumber || !address || !province) {
    } else {
        try {
            // สร้างข้อมูลลงทะเบียนใน MongoDB และระบุค่า dateRegister
            await Registration.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                phonenumber: phonenumber,
                address: address,
                province: province,
                confirmFlag: confirmFlag,
                idCardFile: idCardFile,
                bookBankFile: bookBankFile,
                accpetPDPA: accpetPDPA,
                dateRegister: currentTimeInGMT7.add(7, 'hours') // เพิ่ม 7 ชั่วโมงในเวลาปัจจุบัน (GMT+7)
            });
        
            console.log('บันทึกข้อมูลลงทะเบียนสำเร็จ');
        } catch (err) {
            console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ', err);
            // จัดการข้อผิดพลาดอย่างเหมาะสม
        }
    }
    
    res.render('index', {
        errors: req.flash('validationErrors'),
        firstName: firstName,
        lastName: lastName,
        email: email,
        phonenumber: phonenumber,
        address: address,
        province: province,
        confirmFlag: confirmFlag,
        idCardFile: idCardFile,
        bookBankFile: bookBankFile,
        accpetPDPA: accpetPDPA
    });
};

