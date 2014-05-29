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
  return text.replace(/\n/g, "<br>");
}


$().ready(function() {
  var a_x = document.URL.split("?a=")[1];
  if (a_x) {
    //單一文章模式
    readTextFile("txt-articles/" + a_x + ".txt", function(text) {
      title = text.split(/\n=+\n/)[0];
      content = text.split(/\n=+\n/)[1];
      document.title = title;
      $('.title').text(title);
      $('.content').html(textToHtml(content));

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
          title = text.split(/\n=+\n/)[0];
          content = text.split(/\n=+\n/)[1];
          $article.children('.title').addClass('in-index').text(title);
          // $article.children('.content').html(textToHtml(content));
          $article.children('.content').hide();

        });

        // $article.wrap($("<a>").attr('href', './?a=' + d[i].filename));
        $article.appendTo('.wrapper');
        x = '<a href="./?a=' + d[i].filename + '">';
        $article.wrap(x);
      };
      $orig_article.hide();

    });

  }

})