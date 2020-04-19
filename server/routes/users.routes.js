const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

// Loading input validation
const validateRegisterInput = require("../validator/register");
const validateLoginInput = require("../validator/login");

const User = require('../models/User');

// =============================================================================================

// @route POST /api/users/login
// @desc  Login an User
// @acces PUBLIC
// @return LoginUser and JWT Token

router.post('/login', async (req, res) => {

    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const { username, password } = req.body;
    
    const user = await User.findOne({ username: username });
    //Check username
    if (!user) {
        return res.status(404).json({ emailnotfound: "User not found" });
    } else {
        //Check password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    // User matched
                    // Create JWT Payload
                    const payload = {
                        id: user.id,
                        username: user.username
                    };
                    // Generar el token
                    jwt.sign(payload, 'secret', {
                        expiresIn: 31556926 // 1 year in seconds
                    }, (err, token) => {
                        res.json({
                            succes: true,
                            token: "Bearer" + token
                        });
                    });
                } else {
                    return res.status(400).json({ passwordincorrect: "Password incorrect" });
                }
            });
    }
});

// =============================================================================================

// @route POST /api/users/register
// @desc  Register new User
// @acces PUBLIC

router.post('/register', async (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);
    
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const emailExistente = await User.findOne({email: email});
    const usernameExistente = await User.findOne({username: username});

    if (emailExistente) {

        return res.status(400).json({ email: "Email already exists" });

    } else if (usernameExistente) {

        return res.status(400).json({ email: "Username already exists" });

    } else {

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        // Hash password before saving in database
        bcrypt.genSaltSync(10, (err, salt) => {
            bcrypt.hashSync(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
            });
        });

    }

});

// =============================================================================================


// Modificar Usuario
router.put('/:id', async (req, res) => {
    const { username, email, password, newPassword, newConfirmPassword } = req.body;
    const errors = [];

    const user =  await User.findById(req.params.id);
    // * Credenciales Actuales
    const usernameActual = await user.get('username');
    const emailActual = await user.get('email');

    //! Restricciones para Password
    if(user.matchPassword(password)) {
        errors.push({text: 'Password no coincide con la actual!'});
    }

    if(newPassword!=newConfirmPassword) {
        errors.push({text: 'Passwords nuevas no coinciden!'});
    }

    if(newPassword.length < 5){
        errors.push({text: 'Passwords nuevas demasiado breves!'});
    }

    //! Restricciones para email y username
    if(usernameActual!=username) {
        const usernameExistente = await User.findOne({username: username});
        if(usernameExistente) {
            errors.push({text: 'Username ya en uso!'});
        }
    }

    if(emailActual!=email) {
        const emailExistente = await User.findOne({email: email});
        if(emailExistente) {
            errors.push({text: 'Email ya en uso!'});
        }
    }

    //? Estudiamos si podemos modificarlo o no
    if(errors.length > 0) {
        res.json(errors);
    } else {
        //Antes de guardar encrypt pass llamando al metodo creado en User
        newPasswordEncrypted = await user.encryptPassword(newPassword);
        await User.findByIdAndUpdate(req.params.id, { email, username, newPasswordEncrypted});
        res.json(await User.findById(req.params.id));
    }
});

// =============================================================================================

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Obtener Un usuario por id
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

// Eliminar Usuario
router.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send('Deleted!');
});

// =============================================================================================

module.exports = router;