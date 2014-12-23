## 使い方
jQueryのプラグインです。  
ブロックを敷き詰めるっていうだけのものです。  
jQueryを読み込んだら`nrtbrick.js`も読み込んでください。  
そして以下のコードを`document.ready`のタイミングで記述すればOKです。  
```javascript
$("【並べたいブロックを包括している要素のセレクター】").nrtbrick({
  target : "li",// 並べたいブロックをjQueryセレクターで指定。（デフォルトは"li"）
  columnAlign : "center",// 表示位置を指定します。（left,center,rightのいずれか。デフォルトはcenter）
  verticalMargin : 10,
  horizontalMargin : 10,
  animate : true,// アニメーションして並べるかどうかを指定(デフォルトは　true)
  animateParam : {// ここからのパラメーターは上の animate を true にしている時に有効
    firstAnimate : false,// ページアクセスした時からアニメーションさせるかどうか。デフォルトはfalse
    easing : "swing",// イージングを指定出来ます。
    duration : 300,// アニメーションのスピードの指定
    delay : 100// 並べるアニメーションの時間差を指定
  },
  primeSelector : null,// 左上に持ってきたいブロックをセレクターで指定
  windowResize : true,// ウィンドウリサイズした時に再度並べ替えをするかどうか
  resizeInterval : 300,// windowがリサイズされたから何ミリ秒後に再配置するかを指定（デフォルトは300）
  complete : function(){// ブロックの並び替え終了時に呼び出されます。
    console.log( "COMPLETE" );
  }
});
```
