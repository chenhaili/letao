/**
 * Created by chenli on 2018/5/12.
 */
$(function () {
  var currentPage = 1;
  var pageSize = 5;
  // 1. 发送请求, 获取数据, 通过模板引擎渲染页面
  render();
  
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        var htmlStr = template("firstTpl", info);
        // 渲染页面
        $('.lt_content tbody').html(htmlStr);
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil(info.total / info.size),
          currentPage: info.page,
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }
  
  
  // 2. 点击添加按钮, 显示模态框
  $('#addBtn').click(function () {
    $('#addModal').modal("show");
  });
  
  
  // 3. 进行表单校验配置
  $('#form').bootstrapValidator({
    // 指定校验时的图标显示
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 配置字段
    fields: {
      categoryName: {
        validators: {
          // 非空校验
          notEmpty: {
            message: "请输入一级分类"
          }
        }
      }
    }
    
  });
  
  // 4. 阻止默认校验成功时的提交, 通过 ajax 进行提交
  $('#form').on("success.form.bv", function (e) {
    // 阻止默认的提交
    e.preventDefault();
    // 通过 ajax 进行提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $('#form').serialize(),
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 添加成功关闭模态框
          $('#addModal').modal("hide");
          // render 重新渲染页面
          currentPage = 1;
          render();
          $('#form').data("bootstrapValidator").resetForm(true);
        }
      }
    })
  })
})
