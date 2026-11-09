"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = void 0;
const axios_1 = __importDefault(require("axios"));
const sendPushNotification = async ({ expoPushToken, title, body }) => {
    await axios_1.default.post("https://exp.host/--/api/v2/push/send", {
        to: expoPushToken,
        sound: "default",
        title,
        body
    });
};
exports.sendPushNotification = sendPushNotification;
