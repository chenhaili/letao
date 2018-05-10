/**
 * Created by chenli on 2018/5/9.
 */

// 登录拦截
if ( location.href.indexOf("login.html") === -1 ) {
  // 如果当前地址栏中没有 login.html, 需要判断当前用户状态
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function( info ) {
      console.log( info );
      if ( info.error === 400 ) {
        location.href = "login.html";
      }
    }
  })
}

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
  
  // 3.显示模态框
  $('.icon_logout').click(function() {
    $('#logoutModal').modal("show");
  });
  
  // 4.退出功能 开启/关闭模态框
  $('#logoutBtn').click(function() {
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 退出成功, 退出成功, 跳回登录页
          location.href = "login.html";
        }
      }
    })
  });
  
});