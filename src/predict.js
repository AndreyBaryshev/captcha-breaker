const PythonShell = require('python-shell') ;

module.exports = async (image_path) =>{
  process.env.PYTHONHTTPSVERIFY=0;
  let opts = { }
  if (image_path) {
    opts.args = ['--fname', image_path]
  }
  let pyshell = new PythonShell(`node_modules/captcha-breaker/src/predict.py`, opts );
  const result = new Promise(resolve =>{
    pyshell.on('message',  (message)=> {
      if (message.includes('RESULT')) {
        const [,captchaText] = message.split('-');
        resolve(captchaText);
      }
    });
  })
  pyshell.on('error', function (message) {});
  const timeout = new Promise((resolve) => setTimeout(()=>resolve(null), 15000))
  return Promise.race([result, timeout]);
}



