/**
 * Created by chenli on 2018/5/9.
 */

// 禁用进度条
NProgress.configure({ showSpinner: false });

// 开启进度条
$(document).ajaxStart(function () {
  NProgress.start();
});

// 模拟网络环境
$(document).ajaxStop(function () {
  setTimeout(function () {
    // 结束进度条
    NProgress.done();
  },500);
});