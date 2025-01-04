"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogin = exports.postSignup = exports.getLogin = exports.getSignup = void 0;
const User_1 = __importDefault(require("../models/User"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getSignup = (req, res) => {
    res.status(200).render("signup");
};
exports.getSignup = getSignup;
const getLogin = (req, res) => {
    res.status(200).render("login");
};
exports.getLogin = getLogin;
const postSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = yield req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields must be filled." });
    }
    if (!validator_1.default.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email." });
    }
    if (!validator_1.default.isStrongPassword(password)) {
        return res.status(200).json({ message: "Weak password: e.g Biko.2022!!." });
    }
    const user = yield User_1.default.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "Email in use." });
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield User_1.default.create({ email, password: hash });
        res.status(200).json(newUser);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.postSignup = postSignup;
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = yield req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields must be filled." });
    }
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Incorrect email." });
    }
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Incorrect password." });
    }
    return res.status(200).json(user);
});
exports.postLogin = postLogin;
