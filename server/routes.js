const register = (req, res) => {
  if (req.body.username == "test") {
    res.status(400).json({
      status: "err",
      msg: "✖ Registration failed: Invalid username or password provided."
    });
  } else {
    res.status(201).json({
      status: "ok",
      msg: "Registration is successfull."
    });
  }
};

const login = (req, res) => {

};

module.exports = {
  register: register,
  login: login
}