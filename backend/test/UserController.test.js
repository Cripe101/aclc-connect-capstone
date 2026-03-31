const { registerUser, loginUser } = require("../controllers/authController");

const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock dependencies
jest.mock("../models/userModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // =========================
  // REGISTER USER
  // =========================
  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      req.body = {
        name: "John",
        email: "john@example.com",
        password: "123456",
        role: "user",
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");

      User.create.mockResolvedValue({
        _id: "1",
        name: "John",
        email: "john@example.com",
        username: "john@example.com",
        role: "user",
      });

      jwt.sign.mockReturnValue("token");

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(User.create).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "john@example.com",
          token: "token",
        }),
      );
    });

    it("should return error if user already exists", async () => {
      req.body = {
        name: "John",
        email: "john@example.com",
        password: "123456",
        role: "user",
      };

      User.findOne.mockResolvedValue({ email: "john@example.com" });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User already exists",
      });
    });

    it("should return error if fields are missing", async () => {
      req.body = { email: "john@example.com" };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // =========================
  // LOGIN USER
  // =========================
  describe("loginUser", () => {
    it("should login successfully", async () => {
      req.body = {
        email: "john@example.com",
        password: "123456",
      };

      User.findOne.mockResolvedValue({
        _id: "1",
        name: "John",
        email: "john@example.com",
        password: "hashedPassword",
        role: "user",
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "john@example.com",
          token: "token",
        }),
      );
    });

    it("should return error if user not found", async () => {
      req.body = {
        email: "notfound@example.com",
        password: "123456",
      };

      User.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid username",
      });
    });

    it("should return error if password is incorrect", async () => {
      req.body = {
        email: "john@example.com",
        password: "wrongpass",
      };

      User.findOne.mockResolvedValue({
        email: "john@example.com",
        password: "hashedPassword",
      });

      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid password",
      });
    });
  });
});
