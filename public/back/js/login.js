/**
 * Created by chenli on 2018/5/9.
 */

$(function () {
  // 1.表单校验功能
  $('#form').bootstrapValidator({
    // 配置校验对应图标
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 配置字段
    fields: {
      // 配置对应字段名
      username: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            // 提示信息
            message: "用户名不能为空"
          },
          // 长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名必须是2-6位"
          },
          // 专门用来配置回调校验提示信息
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须在6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  })


// 2 基本登录功能
// 校验成功,调用
  $('#form').on("success.form.bv", function (e) {
    // 阻止默认的提交
    e.preventDefault();
    console.log($('#form').serialize());
    
    // 通过ajax提交
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      dataType: "json",
      data: $('#form').serialize(),
      success: function (info) {
        console.log(info);
        if (info.success) {
          //登录成功
          location.href = "index.html";
        }
        if (info.error === 1001) {
          // 密码错误
          // 将密码框, 校验状态改成 错误状态 INVALID
          // updateStatus 三个参数
          // 参数1: 字段名称
          // 参数2: 校验状态  VALID成功  INVALID失败
          // 参数3: 校验规则(主要是用来设置, 提示信息的)
          $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
        }
        if (info.error === 1000) {
          // 用户名不存在
          $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
        }
      }
    })
  });


// 3 实现重置功能
  $('[type="reset"]').click(function () {
    // 重置所有内容
    // resetForm 传 true, 重置状态和内容
    // 不传 true, 只重置校验状态
    $('#form').data("bootstrapValidator").resetForm(true);
  })
  
  
});



