const PythonShell = require('python-shell') ;

module.exports = async (image_path, minAccuracy = 95) =>{
  try{
    process.env.PYTHONHTTPSVERIFY=0;
    let opts = { }
    if (image_path) {
      opts.args = ['--fname', image_path]
    }
    let pythonShell = new PythonShell(`node_modules/captcha-breaker/src/predict.py`, opts );

    let accuracy = 0;

    const resultPromise = new Promise(resolve =>{
      pythonShell.on('message',  (message)=> {
        console.log(message);
        if (message.includes('ACCURACY')) {
          const [,captchaAccuracy] = message.split('-');
          accuracy = Number.parseFloat(captchaAccuracy);
        }
        if (message.includes('RESULT')) {
          const [,captchaText] = message.split('-');
          if (accuracy < minAccuracy ) resolve(null);
          resolve(captchaText);
        }
      });
    })

    let errorLog = [];
    pythonShell.on('error', function (message) {errorLog.push(message)});

    const endPromise = new Promise (resolve=>{
        pythonShell.end( (err, code ) => {
          if (code !== 0) {
            errorLog.forEach(str=> console.log(str));
            resolve(null);
          }
        })
    })

    const timeoutPromise = new Promise((resolve) => setTimeout(()=>resolve(null), 15000))

    return Promise.race([resultPromise, timeoutPromise, endPromise]);
  }
  catch (e){
    console.log('e', e);
    return null
  }
}



