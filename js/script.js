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
      $('body').addClass('body-index');
      $orig_article = $('.article');
      for (var i = 0; i < d.length; i++) {
        $article = $orig_article.clone();
        readTextFile("txt-articles/" + d[i].filename + ".txt", function(text) {
          title = text.split(/\n=+\n/)[0];
          content = text.split(/\n=+\n/)[1];
          $article.children('.title').text(title);
          $article.children('.content').html(textToHtml(content));
          // $article.children('.content').hide();

        });

        // $article.wrap($("<a>").attr('href', './?a=' + d[i].filename));
        $article.appendTo('.wrapper');
        x = '<a href="./?a=' + d[i].filename + '">';
        $article.wrap(x);

        after_loading();
      };
      $orig_article.hide();

    });

  }

})

function after_loading() {
  // if (loading_start) {
  $('a').off("mouseenter mouseleave click");
  $('a').hover(function() {
    $(this).find('h2').animate({
      'color': '#ccc'
    });
  }, function() {
    $(this).find('h2').animate({
      'color': '#666'
    });
  });
  //使所有 a 失效
  // $('a').data('href', function() {
  //   return $(this).attr('href');
  // }).attr('onClick', "javascript: void(0);")
  //   .attr('href', 'javascript:void(0)');
  //   
  // 使 a 變成廷展而不是轉網頁  
  // $('a').click(function() {
  //   $(this).find('.article').animate({
  //     width: '100%',
  //   }, 'slow');
  //   $(this).find('.trans').hide('slow');
  // });

  // }
  loading_start = false;
}