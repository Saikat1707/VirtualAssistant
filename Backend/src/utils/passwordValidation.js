import brcypt from 'bcrypt';

export const comparePassword = (password,originalPassword) =>{
    const isValid = brcypt.compareSync(password, originalPassword)
    return isValid
}