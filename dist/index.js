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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const db_1 = require("./db");
// import { prismaClient } from "./db";
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const sumInput = zod_1.z.object({
    a: zod_1.z.number(),
    b: zod_1.z.number()
});
console.log(db_1.prismaClient);
//@ts-ignore
exports.app.post("/sum", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedResponse = sumInput.safeParse(req.body);
    // console.log(this)
    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }
    const { a, b } = parsedResponse.data;
    const answer = a + b;
    const response = yield db_1.prismaClient.sum.create({
        data: {
            a: parsedResponse.data.a,
            b: parsedResponse.data.b,
            result: answer
        }
    });
    console.log({ response });
    res.status(200).json({
        answer,
        id: response.id
    });
}));
//@ts-ignore
exports.app.get("/sum", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedResponse = sumInput.safeParse({
        a: Number(req.headers["a"]),
        b: Number(req.headers["b"])
    });
    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }
    const answer = parsedResponse.data.a + parsedResponse.data.b;
    const response = yield db_1.prismaClient.sum.create({
        data: {
            a: parsedResponse.data.a,
            b: parsedResponse.data.b,
            result: answer
        }
    });
    console.log(response);
    res.json({
        answer,
        id: response.id
    });
}));
