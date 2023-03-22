import dotenv from 'dotenv'
dotenv.config()

import { Configuration, OpenAIApi } from 'openai'
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

import twilio from 'twilio'
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

import express from 'express'
const app = express()

app.get('/', async (req, res) => {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "In a list style fashion give me a: random quote, a random history fact, and an idea for a programming project",
        max_tokens: 2000
    })
    const response = completion.data.choices[0].text

    if (process.env.TO_NUM) {
        client.messages.create({
            body: response,
            from: process.env.FROM_NUM,
            to: process.env.TO_NUM         
        })
        .then(message => console.log(message.sid))
        res.json(`Message sent resposne was ${response}`)
    } else {
        res.json('Error sending message')
    }
})

app.listen(8000 || process.env.PORT, () => {
    console.log('App now running')
})