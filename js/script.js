var IND_BOX_WIDTH = 130;



function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        callback(allText);
      }
    }
  }
  rawFile.send(null);
}

/**
 * 把換行的純文字轉成 html
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function textToHtml(text) {
  while (text[0] == "\n") {
    text = text.substr(1);
  }
  return text.replace(/\n/g, "<br>");
}


$().ready(function() {
  loading_start = true;

  var a_x = document.URL.split("?a=")[1];
  if (a_x) {
    //單一文章模式
    $('body').addClass('body-article');
    //
    readTextFile("txt-articles/" + a_x + ".txt", function(text) {
      title = text.split(/\n=+\n/)[0];
      content = text.split(/\n=+\n/)[1];
      document.title = title;
      $('.title').text(title);
      $('.content').html(textToHtml(content));

      after_loading();

    });
  } else {
    //目錄模式
    d3.csv("csv-index/index.csv", function(d) {
      return d;
    }, function(e, d) {
      $orig_article = $('.article');
      for (var i = 0; i < d.length; i++) {
        $article = $orig_article.clone();
        readTextFile("txt-articles/" + d[i].filename + ".txt", function(text) {
          $article.addClass('file-'+d[i].filename);
          title = text.split(/\n=+\n/)[0];
          content = text.split(/\n=+\n/)[1];
          $article.children('.title').text(title);
          $article.children('.content').html(textToHtml(content));
          // $article.children('.content').hide();

        });

        // $article.wrap($("<a>").attr('href', './?a=' + d[i].filename));
        $article.appendTo('.wrapper');
        $article.hide();
        x = '<a href="./?a=' + d[i].filename + '" class="click-items">';
        $article.wrap(x);

        after_loading();
      };
      $orig_article.animate({
        width:'100px'
      },1000,'linear',function(){
        $orig_article.animate({
          width:'0px'
        },2000,'easeInBack',function(){
          $orig_article.remove();
          setTimeout(function(){
            $('body').addClass('body-index');
          $('.article').show('slow');
          }, 500);
        });
      });
      // intval = setInterval(function(){
      //   $('html, body').scrollLeft($('.wrapper').width()*2-$(window).width());
      //   console.log($('.wrapper').width()-$(window).width())
      // },30);
      // $orig_article.animate({
      //   'margin-right':'2000px'
      // },3000,'swing',function(){
      //   $orig_article.remove();
      //   $('.article').show('slow');
      //   clearInterval(intval);
      // });

    });

  }

  // var w =$(window);
  // w.resize(function(event) {
  //   $('.wrapper').width(w.width()).height(w.height());
  // });
  

})

function after_loading() {
  // if (loading_start) {
  $('.click-items').off("mouseenter mouseleave click");
  $('.click-items').hover(function() {
    $(this).find('h2').animate({
      'color': '#ccc'
    });
  }, function() {
    $(this).find('h2').animate({
      'color': '#666'
    });
  });
  // 使所有 a 失效
  $('.click-items').data('href', function() {
    return $(this).attr('href');
  }).attr('onClick', "javascript: void(0);")
    .attr('href', 'javascript:void(0)');
    
  // 使 a 變成廷展而不是轉網頁  
  $('.click-items').click(function() {
    var $master_article = $(this).find('.article');
    // console.log($master_article);
    var master_article = $master_article.attr('class').split('file-')[1].split(" ")[0];
    // console.log(master_article);
    $('.click-items').each(function(){
      if($(this).find('.article').hasClass('file-'+master_article)){
        if($(this).find('.article').hasClass('opened')){
          var width = IND_BOX_WIDTH;
          $(this).find('.trans').show('slow');  
        }else{
          var width = $(this).find('.title').width() + $(this).find('.content').width();
          $(this).find('.trans').hide('slow');
        }
        $(this).find('.article').animate({
          'width': width + 'px',
        }, 'slow');
        $(this).find('.article').toggleClass('opened');
      }else{
        $(this).find('.article').animate({
          'width': IND_BOX_WIDTH + 'px',
        }, 'slow').removeClass('opened');
        $(this).find('.trans').show('slow');
      }
    })
  });

  // }
  loading_start = false;
}