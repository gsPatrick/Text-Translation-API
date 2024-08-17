const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'senhaLegal';

const newUser = async (userData) => {

    try{
        const hashedPassword = await bcrypt.hash(userData.password,15);
        const newUser = await User.create(
            {
                username: userData.username,
                email: userData.email, 
                password: hashedPassword
        });
        return newUser;
    } catch (error) {
        console.log(userData)
        console.log(error)
        throw new Error("Não foi possível criar a sua conta");   
    }
};


const loginUser = async (email,password) => {
    try {
        const user = await User.findOne({where: {email}});
        if (!user) {
            throw new Error ('Usuário ou senha incorretos, tente novamente')
        }
    

    const isPasswordValid = await bcrypt.compare (password, user.password);

    if(!isPasswordValid) {
        throw new Error ('Usuário ou senha incorretos, tente novamente')
    }

    const token = jwt.sign (
        {userId: user.id, username: user.username},
        JWT_SECRET,
        {expiresIn: 3600}
    );

    return {user, token};
    console.log(user,userId,username,token)

    
}  catch (error) {
    throw new Error('Email ou senha incorretos, tente novamente')
}
};

const profile = async (token) => {
    try{
        const decoded = jwt.verify (token, JWT_SECRET);
        const user = await User.findOne ({
            where: { id: decoded.userId },
            attributes: ['username', 'email']
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        return user;
    } catch (error) {
        console.log(error);
        throw new Error('Token inválido ou expirado');
    }
}


module.exports = {
    newUser,
    loginUser,
    profile
};