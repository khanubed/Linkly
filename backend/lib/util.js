import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_TOKEN)
    return token;
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}
