/*!
 * jquery.wlbrick.1.0.2.js
 */
;(function(window, $){
  'use strict';
  var win = window,
      document = win.document;

  var wlblick = function($container, param){

    var that = {
      $selector: null,
      $selectorLen: 0,
      containerWidth: $container.width(),
      $window: null,
      resizeTimer: null,
      offset: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      alignOffset: 0,
      cols: new Array(),
      colNum: 0,
      brickWidth: null,
      delayTimer: null,
      callback: function(){
        param.animateParam.firstAnimate = true;
        if(param.complete){
          param.complete.apply( $container[0] );
        }
      },

      /*  get min-width in bricks
      --------------------------------------------*/
      minBrickWidth : function(){
        var
        minWidth = this.$selector.eq(0).width(),
        minOuterWidth = this.$selector.eq(0).outerWidth();

        for(var i = 0; ++ i < this.$selectorLen;){
          var selectorWidth = this.$selector.eq(i).width();
          if( minWidth > selectorWidth ){
            minWidth = selectorWidth;
            minOuterWidth = this.$selector.eq(i).outerWidth();
          }
        }
        return {
          "width": minWidth,
          "outerWidth": minOuterWidth
        };
      },

      /*  positionSet
      --------------------------------------------*/
      positionSet : function(){
        $container.css("position", "relative");
        this.$selector.css("position", "absolute");

        for(var i = -1; ++ i < this.$selectorLen;){
          this.arrangeBrick( this.$selector.eq(i), i );
        }

        if( param.animate && param.animateParam.firstAnimate ) {
          $container.animate({
            "height": that.getMaxVPoint() - param.verticalMargin - that.offset.top + "px"
          });
        } else {
          $container.css("height", that.getMaxVPoint() - param.verticalMargin - that.offset.top + "px");
          this.callback();
        }
      },

      /*  arrangeBrick
      --------------------------------------------*/
      arrangeBrick : function( $brick, index ){
        var
        minIndex = 0,
        position = {};

        if( $brick.width() > this.brickWidth.width && this.colNum > 1) {

          var
          widthRate = Math.ceil( ($brick.outerWidth() + param.horizontalMargin) / (this.brickWidth.outerWidth + param.horizontalMargin) ),
          totalMaxPoint = [];

          for(var i = -1, len = this.colNum - widthRate + 1; ++ i < len;){
            var maxPoint = [];
            for(var j = -1; ++ j < widthRate;){
              maxPoint[j] = this.cols[i + j];
            }
            totalMaxPoint[i] = this.getMaxVPoint(maxPoint);
          }

          var maxTop = totalMaxPoint[minIndex];
          
          for(i = 0; ++ i < len;){
            if(maxTop > totalMaxPoint[i]){
              minIndex = i;
              maxTop = totalMaxPoint[i];
            }
          }

          position.top = maxTop + "px";
          position.left = this.cols[minIndex].left + "px";

          for(i = minIndex - 1, len = minIndex + widthRate; ++ i < len;){
            this.cols[i].vPoint = maxTop + param.verticalMargin + $brick.outerHeight();
          }

        } else {
          minIndex = this.getMinIndex();
          position.top = this.cols[minIndex].vPoint + "px";
          position.left = this.cols[minIndex].left + "px";
          
          this.cols[minIndex].vPoint += (param.verticalMargin + $brick.outerHeight());
        }

        if( param.animate && param.animateParam.firstAnimate ){
          this.brikAnimation( $brick, index, position);
        } else {
          $brick.css(position);
        }
      },

      brikAnimation : function($brick, index, position){
        if( param.animateParam.delay ){
          that.delayTimer[index] = setTimeout(function(){
            $brick.stop().animate({
              "top" : position.top,
              "left" : position.left
            }, {
              "duration" : param.animateParam.duration,
              "easing" : param.animateParam.easing,
              "complete" : index === that.$selectorLen - 1? that.callback : null
            });
          }, index * param.animateParam.delay);
        } else {
          $brick.stop().animate({
            "top" : position.top,
            "left" : position.left
          }, {
            "duration" : param.animateParam.duration,
            "easing" : param.animateParam.easing,
            "complete" : index === that.$selectorLen - 1? that.callback : null
          });
        }
      },

      getMinIndex : function(){
        var
        minPoint = this.cols[0].vPoint,
        minIndex = 0;

        for(var i = 0; ++ i < this.colNum;){
          if( minPoint > this.cols[i].vPoint ){
            minPoint = this.cols[i].vPoint;
            minIndex = i;
          }
        }
        return minIndex;
      },

      getMaxVPoint : function(vPointArray){
        var
        vArray = vPointArray || this.cols,
        max = vArray[0].vPoint;

        for(var i = 0, len = vArray.length; ++ i < len;){
          max = vArray[i].vPoint > max? vArray[i].vPoint : max;
        }
        return max;
      },

      setCols : function(){
        var positionArray = new Array();
        for(var i = - 1; ++ i < this.colNum;) {
          positionArray[i] = {
            "left" : i * (this.brickWidth.outerWidth + param.horizontalMargin) + this.offset.left + that.alignOffset,
            "vPoint" : this.offset.top
          };
        }
        return positionArray;
      },

      layout : function( overWriteParam ){
        that.$selector.stop();

        if( overWriteParam ){
          param = $.extend(param, overWriteParam);
        }

        if( typeof param.primeSelector === "string" && param.primeSelector !== "" ){
          that.arrangePrimSelector(param.primeSelector);
          that.$selector = $container.find( param.target );
          that.$selectorLen = that.$selector.length;
        }

        if( that.delayTimer ){
          that.clearDelayTimer();
          this.delayTimer = null;
        }

        if( param.animate && param.animateParam.delay ){
          this.delayTimer = new Array();
        }

        that.brickWidth = that.minBrickWidth();

        var containerWidth = that.containerWidth = $container.width();

        that.colNum = Math.floor( containerWidth / (that.brickWidth.outerWidth + param.horizontalMargin) );
        that.colNum = containerWidth % (that.brickWidth.outerWidth + param.horizontalMargin) > that.brickWidth.outerWidth? that.colNum + 1 : that.colNum;
        that.colNum = that.colNum < 1? 1 : that.colNum;

        switch( param.columnAlign ){
          case "left" :
            that.alignOffset = 0;
          break;

          case "center" :
            that.alignOffset = Math.floor( ( containerWidth - (that.colNum * that.brickWidth.outerWidth) - (param.horizontalMargin * (that.colNum - 1)) ) / 2 );
          break;

          case "right" :
            that.alignOffset = Math.floor( containerWidth - (that.colNum * that.brickWidth.outerWidth) - (param.horizontalMargin * (that.colNum - 1)) );
          break;

          default :
            that.alignOffset = 0;
          break;
        }        

        that.cols = that.setCols();
        that.positionSet();
      },

      clearDelayTimer : function(){
        for(var i = -1, len = this.delayTimer.length; ++ i < len;){
          clearTimeout( this.delayTimer[i] );
        }
      },

      resizeInterval : function(){
        clearTimeout( that.resizeTimer );
        that.resizeTimer = setTimeout(function(){
          that.layout();
        }, param.resizeInterval);
      },

      arrangePrimSelector : function(primeSelector){
        var primeArray = primeSelector.replace(/\s/g, "").split(",");
        for(var i = primeArray.length; --i >= 0;){
          $container.prepend( $container.find( primeArray[i] ) );
        }
        return $container;
      },

      /*  Initialize
      --------------------------------------------*/
      init : function(){
        this.$selector = $container.find( param.target );
        this.$selectorLen = this.$selector.length;

        this.offset.top = parseInt( $container.css("paddingTop"), 10 );
        this.offset.right = parseInt( $container.css("paddingRight"), 10 );
        this.offset.bottom = parseInt( $container.css("paddingBottom"), 10 );
        this.offset.left = parseInt( $container.css("paddingLeft"), 10 );

        if( param.windowResize && !this.$window ) {
          this.$window = $(win);
          if( $.fn.on ){
            this.$window.on("resize", that.resizeInterval);
          } else {
            this.$window.resize(that.resizeInterval);
          }          
        }
        this.layout();
      }
    };

    that.init();

    return that;
  };// wlblick

  $.fn.wlbrick = function(option){
    var param = $.extend({
      target: "li",
      columnAlign: "center",
      verticalMargin: 10,
      horizontalMargin: 10,
      animate: true,
      animateParam: {
        firstAnimate: false,
        easing: "swing",
        duration: 300,
        delay: 100
      },
      primeSelector: null,
      windowResize: true,
      resizeInterval: 300,
      complete: null
    }, option);

    for(var i = -1, len = this.length; ++ i < len;){
      var $this = this.eq(i);
      if( $this.data("wlbrick") ){
        $this.data("wlbrick").layout( option );
      } else {
        $this.data( "wlbrick", wlblick($this, param) );
      }
    }

    return this;
    
  }// $.fn.wlbrick

})(window, jQuery);