const express = require('express')
require('dotenv').config()
const app = express()
const axios = require('axios');
const port = 15000

app.post('/chat', (req, res) => {

    const errorResponse = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": "날씨를 조회할 수 없습니다.\n나중에 다시 시도 해주세요."
                    }
                }
            ],
            "quickReplies": [
                {
                    "messageText": "홈 으로",
                    "action": "message",
                    "label": "홈"
                }
            ]
        }
    }

    const successResponse = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "listCard": {
                        "header": {
                            "title": "현재 경기도 날씨"
                        },
                        "items": [
                            // {
                            //     "title": "챗봇 관리자센터",
                            //     "description": "새로운 AI의 내일과 일상의 변화",
                            //     "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
                            //     "link": {
                            //         "web": "https://namu.wiki/w/%EB%9D%BC%EC%9D%B4%EC%96%B8(%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%94%84%EB%A0%8C%EC%A6%88)"
                            //     }
                            // },
                        ],
                        // "buttons": [
                        //     {
                        //         "label": "구경가기",
                        //         "action": "webLink",
                        //         "webLinkUrl": "https://namu.wiki/w/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%94%84%EB%A0%8C%EC%A6%88"
                        //     }
                        // ]
                    }
                }
            ],
            "quickReplies": [
                {
                    "messageText": "홈 으로",
                    "action": "message",
                    "label": "홈"
                }
            ]
        }
    }

    const instance = axios.create({
        baseURL: 'https://api.openweathermap.org/',
        timeout: 700,
        params: {
            appid: process.env.api_key,
            q: process.env.local_name,
            lang: process.env.lang,
            units: 'metric'
        }
        // headers: { 'X-Custom-Header': 'foobar' }
    });

    instance.get(`data/2.5/weather`)
        .then((res) => res.data)
        .then((data) => {
            // console.log('asdf', data)
            successResponse.template.outputs[0].listCard.items.push(
                {
                    "title": `${data.weather[0].description}`,
                    "description": `현재 날씨`,
                }
            )
            successResponse.template.outputs[0].listCard.items.push(
                {
                    "title": `${data.main.temp}℃ / ${data.main.feels_like}℃`,
                    "description": `현재 기온 / 체감 온도`,
                }
            )
            successResponse.template.outputs[0].listCard.items.push(
                {
                    "title": `${data.wind.speed}m/s / ${data.wind.deg}°`,
                    "description": `바람 세기 / 방향`,
                }
            )
            successResponse.template.outputs[0].listCard.items.push(
                {
                    "title": `${data.main.humidity}%`,
                    "description": `습도`,
                }
            )
            res.send(successResponse)
        })
        .catch(err => {
            console.log('error', err.message)

            res.send(errorResponse)
        })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})