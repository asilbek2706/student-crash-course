const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Parol kiritilmagan",
      });
    }

    const passwordHash = process.env.APP_PASSWORD_HASH;

    if (!passwordHash) {
      return res.status(500).json({
        message: "Server authentication sozlanmagan",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Parol noto'g'ri",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      message: "Tizimga muvaffaqiyatli kirdingiz",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server xatosi",
    });
  }
};

module.exports = {
  login,
};
