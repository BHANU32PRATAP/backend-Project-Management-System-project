const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}

const passwordStrength = (password) => {
    const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/
    return passwordRegex.test(password)

}

module.exports = {
    isValidEmail,
    passwordStrength
}