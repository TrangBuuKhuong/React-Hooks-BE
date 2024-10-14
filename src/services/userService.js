import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exit
                let user = await db.User.findOne({
                    attributes: ['email', 'password', 'firstName', 'lastName'], // Specify field want to get
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                }
                else {
                    userData.errCode = 1;
                    userData.errMessage = `User not found`;
                }
            }
            else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in system. Please try other email`;
            }
            resolve(userData);
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email exist
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email already in use, Plz try another email!'
                })
            }
            else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                });
                resolve({
                    errCode: 0,
                    message: 'OK'
                });
            }

        } catch (error) {
            reject(error)
        }
    }
    )
}


module.exports = {
    handleUserLogin: handleUserLogin,
    createNewUser: createNewUser,
}