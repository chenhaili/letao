$(function() {

  function render() {
    $('.lt_product').html('<div class="loading"></div>');

    var obj = {};
    // 这是必传参数
    obj.proName = $('.lt_search input').val();  // 搜索关键字
    obj.page = 1;
    obj.pageSize = 100;

    // 还有两个可传可不传的参数 price num
    var $current = $('.lt_sort a.current');

    if ( $current.length > 0 ) {
      // 需要排序, 需要加参数  （1升序，2降序）
      var sortName = $current.data("type");
      var sortValue = $current.find("i").hasClass("fa fa-angle-down") ? 2 : 1;
      obj[ sortName ] = sortValue;
    }

    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: obj,
        success: function( info ) {
          console.log( info )
          $('.lt_product').html( template( "productTpl", info ) );
        }
      })
    }, 500);
  }

  // 功能1: 页面一进来, 需要渲染一次, 将地址栏参数解析到 input 框中,  proName 来自于 input 框
  var key = getSearch( "key" );
  $('.lt_search input').val( key );
  // 直接渲染即可
  render();


  // 功能2: 点击搜索按钮, 需要渲染一次, 并持久化到历史记录中
  $('.lt_search button').click(function() {
    render();

    // 搜索关键字
    var key = $('.lt_search input').val();
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse( history );

    // 1. 不能有重复的
    var index = arr.indexOf( key );
    if ( index > -1 ) {
      arr.splice( index, 1 );
    }
    // 2. 不能超过 10 个, 删除最后一项
    if ( arr.length >= 10 ) {
      arr.pop();
    }
    // 添加到最前面
    arr.unshift( key );
    // 持久化到本地存储
    localStorage.setItem( "search_list", JSON.stringify( arr ) );
  })



  // 功能3: 点击排序的时候, 需要渲染一次(传递更多的参数)
  $('.lt_sort a[data-type]').click(function() {

    // 判断有没有 current 类即可
    if ( $(this).hasClass("current") ) {
      // 有类的情况
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    else {
      $(this).addClass("current").siblings().removeClass("current");
      // 重置其他箭头
      $(this).siblings().find("i").removeClass("fa-angle-up").addClass("fa-angle-down");
    }

    // 调用render进行重新渲染
    render();

  })


})