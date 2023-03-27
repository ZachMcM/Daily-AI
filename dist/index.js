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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai_1 = require("openai");
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new openai_1.OpenAIApi(configuration);
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const node_cron_1 = __importDefault(require("node-cron"));
const sendMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    const completion = yield openai.createCompletion({
        model: "text-davinci-003",
        prompt: "In a list style fashion give me a: random quote, a random history fact, and an idea for a programming project",
        max_tokens: 2000
    });
    const response = completion.data.choices[0].text;
    if (process.env.TO_NUM) {
        client.messages.create({
            body: response,
            from: process.env.FROM_NUM,
            to: process.env.TO_NUM
        })
            .then(message => console.log(message.sid));
        return response;
    }
    else {
        return 'error sending message';
    }
});
node_cron_1.default.schedule('30 6 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield sendMessage();
    console.log(message);
}));
