
const cheerio = require('cheerio')
const axios = require('axios')
const nodemailer = require('nodemailer')
//const schedule = require('node-schedule')
const SCHEDULE_RULE = '1 30 6 * * *'


//const KEYWORD = '杜兰特'
//const KEYWORD_REG = new RegExp(KEYWORD, 'i')

const url = 'http://sports.163.com/special/nbagd2016/'
const url2 = 'http://sports.sina.com.cn/nba/'
const url3 = 'https://nba.hupu.com/'

let newsArry = []

let nbaSpider = function (email,KEYWORD) {
    return axios.get(url).then(response => {
        if (response.status === 200) {
            const KEYWORD_REG = new RegExp(KEYWORD, 'i')
            let $ = cheerio.load(response.data)

            let news = $('a[href]')
            newsArry = []
            for (let i = 0; i < news.length; ++i) {
                let textHref = $(news[i])
                let text = $(news[i]).text()

                if (KEYWORD_REG.test(text)) {
                    newsArry.push({
                        'title': text.trim(),
                        'href': textHref.attr('href')
                    })
                }
            }
        }
        nbaSpiderqq(email,KEYWORD,newsArry)
    })
}

let nbaSpiderqq = function (email, KEYWORD, newsArry) {
    return axios.get(url3).then(response => {
        if (response.status === 200) {
            const KEYWORD_REG = new RegExp(KEYWORD, 'i')
            let $ = cheerio.load(response.data)

            let news = $('a[href]')
            for (let i = 0; i < news.length; ++i) {
                let textHref = $(news[i])
                let text = $(news[i]).text()

                if (KEYWORD_REG.test(text)) {
                    newsArry.push({
                        'title': text.trim(),
                        'href': textHref.attr('href')
                    })
                }
            }
        }
        nbaSpidersina(email, KEYWORD, newsArry)
    })
}

function nbaSpidersina(email,KEYWORD,newsArry) {
    return axios.get(url2).then(response => {
        if (response.status === 200) {
            const KEYWORD_REG = new RegExp(KEYWORD, 'i')
            let $ = cheerio.load(response.data)

            let news = $('a[href]')
            for (let i = 0; i < news.length; ++i) {
                let textHref = $(news[i])
                let text = $(news[i]).text()

                if (KEYWORD_REG.test(text)) {
                    newsArry.push({
                        'title': text.trim(),
                        'href': textHref.attr('href')
                    })
                }
            }
            formStr(newsArry);
        }

        function formStr(arr) {
            let html = '';
            for (let data of arr) {
                html += `<p><a target="_blank" href="${data.href}">${data.title}</a></p>` // red green blue
            }
            return html;
        }
        function sendEmail() {
            let transporter = nodemailer.createTransport({
                service: 'qq',
                auth: {
                    user: '1761997216@qq.com',//user: 'jiayouzzc@126.com',	//   
                    pass: 'riayndaegoliehgg'//pass: 'kobe241298'// 
                }
            })

            var mailOptions = {
                from: '1761997216@qq.com', // 发送者  
                to: email,//'sonder.cc@gmail.com',//'jiayouzzc@126.com', // 接受者,可以同时发送多个,以逗号隔开  
                subject: `${KEYWORD}新闻`, // 标题  
                //text: 'Hello world', // 文本  
                html: `
                    <h1>zzc找到以下新闻</h1>
                    ${formStr(newsArry)}`
            }

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log('发送成功');
            })
        }
        //		schedule.scheduleJob(SCHEDULE_RULE, () => {
        sendEmail()
        //		})
    })
}

//nbaSpider()
export default nbaSpider
