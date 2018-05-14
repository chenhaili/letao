/**
 * Created by chenli on 2018/5/12.
 */
$(function () {
  
  var currentPage = 1;
  
  var pageSize = 5;
  
  // 1. 渲染
  render();
  
  function render() {
    
    $.ajax({
      type: "GET",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        var htmlStr = template("secondTpl", info);
        // 渲染到页面中
        $('.lt_content tbody').html(htmlStr);
        // 进行分页配置
        $('#paginator').bootstrapPaginator({
          // 设置一个版本号
          bootstrapMajorVersion: 3,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),
          // 当前页
          currentPage: info.page,
          // 点击页码渲染页面
          onPageClicked: function (a, b, c, page) {
            // 更新当前页
            currentPage = page;
            // 重新渲染页面
            render();
          }
        })
        
      }
    })
    
  }
  
  
  // 2. 点击添加按钮, 显示添加模态框
  $('#addBtn').click(function () {
    $('#addModal').modal("show");
    $.ajax({
      type: "GET",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
    
  });
  
  
  // 3. 通过事件委托, 给下拉框所有的 a 绑定点击事件
  $('.dropdown-menu').on("click", "a", function () {
    
    var txt = $(this).text();
    // 设置到按钮中去
    $('#dropdownText').text(txt);
    // 获取当前 a 的 id, 设置到 input 框中去
    var id = $(this).data("id");
    $('[name="categoryId"]').val(id);
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });
  
  
  // 4. 配置文件上传
  $('#fileupload').fileupload({
    // 指定返回回来的数据格式
    dataType: "json",
    // 上传完成的回调函数
    done: function (e, data) {
      // 拿到上传完成得到的图片地址
      var picUrl = data.result.picAddr;
      // 设置到图片 src 中
      $('#imgBox img').attr("src", picUrl);
      // 还要设置到 input 中去
      $('[name="brandLogo"]').val(picUrl);
      // 设置隐藏域的校验状态为 VALID
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });
  
  
  // 5. 表单校验
  $('#form').bootstrapValidator({
    
    // 默认对隐藏域不进行校验 需要重置
    excluded: [],
    
    // 指定校验时的图标显示
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    // 配置校验的字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      
      // brandName 品牌名称, 二级分类
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      
      // brandLogo 图片地址
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
      
    }
    
    
  });
  
  
  // 6. 注册表单校验成功事件, 阻止默认提交, 通过 ajax 进行提交
  $('#form').on("success.form.bv", function (e) {
    // 阻止默认的表单提交
    e.preventDefault();
    
    console.log($('#form').serialize());
    
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 添加二级分类成功 隐藏模态框
          $('#addModal').modal("hide");
          // 重新渲染第一页
          currentPage = 1;
          render();
          // 将表单内容重置 resetForm(true)
          $('#form').data("bootstrapValidator").resetForm(true);
          // 将文本重置
          $('#dropdownText').text("请选择一级分类");
          // 将图片重置
          $('#imgBox img').attr("src", "./images/none.png");
        }
      }
    })
  })
  
})