const wordsList = ["孩子", "家长"];

function sendOCRRequest(base64Image) {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=24.f850749b3290c9d956d6fbeb899de323.2592000.1702470219.282335-42936544",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body:
        "image=" +
        encodeURIComponent(base64Image) +
        "&language_type=CHN_ENG" +
        "&detect_direction=true" +
        "&detect_language=false" +
        "&paragraph=false" +
        "&probability=false",
    };

    http.request(options.url, options, function (response) {
      var result = response.body.json();
      let responseSuccess = false;
      if (result.words_result && wordsList.length) {
        for (var i = 0; i < result.words_result.length; i++) {
          // toastLog(result.words_result[i].words);
          let boo = wordsList.map((x) => {
            return result.words_result[i].words.indexOf(x);
          });
          if (boo.some((result) => result !== -1)) {
            responseSuccess = true;
            break;
          } else {
            responseSuccess = false;
          }
        }
      }
      if (responseSuccess) {
        resolve(true);
      } else {
        reject(new Error("识别失败"));
      }
    });
  });
}

function main() {
  loop();
}

function loop() {
  toastLog("开始滑动");
  gesture(
    1000,
    [500, 1200],
    [510, 950],
    [520, 900],
    [530, 850],
    [540, 800],
    [550, 750],
    [560, 700],
    [570, 650],
    [580, 600],
    [590, 550],
    [600, 500],
    [610, 450],
    [620, 400],
    [630, 350],
    [640, 300]
  );
  toastLog("等待视频");
  sleep(3000); // 等待3秒

  toastLog("开始识别");
  let img = captureScreen();
  let base64Image = images.toBase64(img, "png", 100);

  sendOCRRequest(base64Image)
    .then((result) => {
      if (result) {
        toastLog("识别成功");
        click(986, 1280);
      }
    })
    .catch((error) => {
      console.error(error.message);
    })
    .finally(() => {
      sleep(1000);
      toastLog("下一轮");
      loop();
    });
}

function floatyWindow() {
  if (!floaty.checkPermission()) {
    // 没有悬浮窗权限，提示用户并跳转请求
    toastLog(
      "本脚本需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。"
    );
    floaty.requestPermission();
    exit();
  } else {
    toastLog("已有悬浮窗权限");
    var window = floaty.window(
      <vertical>
        <horizontal>
          <button id="zz" text="终止"></button>
          {/* <button id="zt" text="暂停"></button> */}
        </horizontal>
      </vertical>
    );
    window.setPosition(0, 0);
    window.setSize(-2, -2);
    window.exitOnClose();
    window.zz.click(() => {
      exit();
    });
  }
}

// 设置按键监听
events.observeKey();
events.onKeyDown("volume_down", function (event) {
  toastLog("脚本停止");
  exit(); // 停止脚本
});

launchApp("抖音"); // 打开抖音

if (!requestScreenCapture()) {
  toastLog("请求截图失败");
  exit();
}
floatyWindow();
main();
