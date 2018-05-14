/**
 * Created by chenli on 2018/5/12.
 */
$(function() {
  var currentPage = 1;
  var pageSize = 2;
  // 声明一个数组, 专门用于存储需要进行上传提交的图片对象 (地址, 名称)
  var picArr = [];
  
  // 1. 一进入页面, 请求数据, 进行页面渲染
  render();
  
  function render() {
    $.ajax({
      type: "GET",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function( info ) {
        console.log( info );
        var htmlStr = template("productTpl", info);
        $('.lt_content tbody').html( htmlStr );
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil( info.total / info.size ),
          currentPage: info.page,
          // 给页码注册点击事件
          onPageClicked: function( a, b, c, page ) {
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          },
          // 控制按钮大小
          size: "normal",
          itemTexts: function( type, page, current ) {
            switch ( type ) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          
          // 设置了 tooltipTitles 之后, 每个按钮都会调用这个方法 将返回值, 作为提示信息
          tooltipTitles: function( type, page, current ) {
            switch ( type ) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往第" + page + "页";
            }
          },
          
          // 使用 bootstrap 提供的提示框组件
          useBootstrapTooltip: true
        });
      }
    })
    
  }
  
  // 2. 点击添加按钮, 显示添加模态框
  $('#addBtn').click(function() {
    $('#addModal').modal("show");
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100,
      },
      success: function( info ) {
        console.log(info);
        $('.dropdown-menu').html( template( "dropdownTpl", info ) )
      }
    })
  });
  
  // 3. 选择二级分类功能, 通过事件委托来做
  $('.dropdown-menu').on("click", "a", function() {
    // 获取文本, 设置文本
    var txt = $(this).text();
    $('#dropdownText').text( txt );
    // 获取 id, 设置 id 到隐藏域中
    var id = $(this).data("id");
    $('[name="brandId"]').val( id );
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    
  });
  
  
  // 4. 多文件上传步骤
  $('#fileupload').fileupload({
    // 返回数据类型
    dataType: "json",
    // 响应回调函数
    done: function( e, data ) {
      // 每张图片响应回来, 都会调用一次这个响应函数
      var picUrl = data.result.picAddr;
      // 图片对象
      var picObj = data.result;
      // 添加到子元素最前面去
      $('#imgBox').prepend('<img src="'+ picUrl +'" width="100" alt="">');
      // 将图片对象, 添加到数组中
      picArr.unshift( picObj );
      
      // 如果超过 3 张 将最后的一张 删掉
      if ( picArr.length > 3 ) {
        // 删除数组的最后一项
        picArr.pop();
        // 删除图片中的最后一个
        $('#imgBox img:last-of-type').remove();
      }
      
      // 满足上传 3 张的图片的条件 手动更新 picStatus 隐藏域的校验状态
      console.log(picArr);
      if ( picArr.length === 3 ) {
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }
      
    }
  });
  
  
  // 5. 表单校验功能
  $('#form').bootstrapValidator({
    // 默认对隐藏域不进行校验  需要重置
    excluded: [],
    // 指定校验时的图标显示
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    // 校验的字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存要求, 必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品库存要求, 两位数字-两位数字, 例如: 32-40'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入现价"
          }
        }
      },
      // 图片是否上传满三张的校验
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });
  
  
  
  // 6. 注册表单校验成功事件
  $('#form').on("success.form.bv", function( e ) {
    // 阻止默认的提交
    e.preventDefault();
    
    console.log($('#form').serialize());
    
    var params = $('#form').serialize();
    params += "&picName1=" + picArr[0].picName + "&picAddr1="+ picArr[0].picAddr;
    params += "&picName2=" + picArr[1].picName + "&picAddr2="+ picArr[1].picAddr;
    params += "&picName3=" + picArr[2].picName + "&picAddr3="+ picArr[2].picAddr;
    
    console.log(params);
    
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: params,
      success: function( info ) {
        console.log( info )
        if ( info.success ) {
          // 添加成功 关闭模态框
          $('#addModal').modal("hide");
          // 重置所有内容和校验状态
          $('#form').data("bootstrapValidator").resetForm(true);
          // 重新渲染第一页
          currentPage = 1;
          render();
          // 重置文本
          $('#dropdownText').text("请选择二级分类");
          // 删除所有图片
          $('#imgBox img').remove();
          // 清空数组
          picArr = [];
        }
      }
    })
    
  })
  
})
