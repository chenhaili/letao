/**
 * Created by chenli on 2018/5/11.
 */
$(function () {
  // 当前页
  var currentPage = 1;
  // 每页多少条
  var pageSize = 5;
  // 1.页面渲染
  render();
  
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("tpl", info);
        
        // 渲染
        $('.lt_content tbody').html(htmlStr);
        // 配置分页插件
        $('#paginator').bootstrapPaginator({
          // 配置bootstrap版本
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil(info.total / info.size),
          currentPage: info.page,
          onPageClicked: function (a, b, c, page) {
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })
        
        
      }
      
    });
  }
  
  // 2.事件委托/通过禁用按钮开启模态框
  $('.lt_content tbody').on("click", ".btn", function () {
    // 显示模态框
    $('#userModal').modal("show");
    
    // 用户id, 以data- 开头的自定义属性, 可以直接 data("id") 就可以获取
    var id = $(this).parent().data("id");
    
    // 用户状态,1 正常  0 禁用
    
    var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
    
    $('#submitBtn').off().click(function () {
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: id,
          isDelete: isDelete
        },
        success: function (info) {
          console.log(info);
          
          // 模态框隐藏
          $('#userModal').modal("hide");
          
          render();
        }
      })
      
      
    })
    
  });
})

