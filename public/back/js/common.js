/**
 * Created by chenli on 2018/5/9.
 */



/*  一 进度条效果  */

// 禁用进度条
NProgress.configure({showSpinner: false});

// 开启进度条
$(document).ajaxStart(function () {
  NProgress.start();
});

// 模拟网络环境
$(document).ajaxStop(function () {
  setTimeout(function () {
    // 结束进度条
    NProgress.done();
  }, 500);
});

/*  二 首页效果  */
$(function () {
  // 1.二级菜单切换
  $('.category').click(function () {
    $('.lt_aside .child').stop().slideToggle();
  });
  
  // 2.点击菜单按钮切换
  $('.icon_menu').click(function () {
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
  });
  
 
  
});