const recognizeCaptcha = require('./predict')
const main = async () => {
    const captchaText = await recognizeCaptcha(
        'https://images-na.ssl-images-amazon.com/captcha/cucusdhr/Captcha_pwtdzhrire.jpg'
    );
    // const captchaText = await recognizeCaptcha('data/test.jpg')
    console.log('captchaText', captchaText);
};
main();