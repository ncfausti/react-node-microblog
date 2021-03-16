const register = (req, res) => {
  if (req.body.username != "test") {
    res.status(400).json({
      status: "err",
      msg: "✖ Registration failed: Invalid username or password provided."
    });
  } else {
    res.status(201).json({
      status: "ok",
      msg: "Registration was successfull."
    });
  }
};

const login = (req, res) => {
  if (req.body.username != "test") {
    res.status(400).json({
      status: "err",
      msg: "✖ Login failed: Invalid username or password provided."
    });
  } else {
    res.status(201).json({
      status: "ok",
      msg: "Login was successfull."
    });
  }
};

module.exports = {
  register: register,
  login: login
}