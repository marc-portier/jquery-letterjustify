/*
 jQuery letterjusify - http://github.com/marc-portier/jquery-letterjustify

 (c) 2014, Marc Portier
 CC-SA-BY license 4.0, see https://creativecommons.org/licenses/by-sa/4.0/
*/
;
( function( $) {

    // ------------------------------------------------------------------------
    
    function jqExtendor(name, fn) {
        var ext = {};
        ext[name] = function(pass) {
            return $(this).map(function(){ 
                return fn($(this), pass);
            });
        }
        $.fn.extend(ext);
    };
    
    function jqDefine(name, cstr) {
        jqExtendor(name, function($e,p){return new cstr($e,p)});
    };
    
    function jqBuild(name, fn) {
        jqExtendor(name, fn);
    };
    
    function jqMerge(defs, vals) {
        return $.extend($.extend({}, defs), vals);
    }

    function jqEnableEvent(obj, name, bubble) {
        bubble = bubble || false;
        if (name == undefined) {return; }
        name = "" + name; //stringify
       
        if (obj[name] != undefined) {
            throw "Can't initialise eventing for " + name + ". Associated property already exists.";
        }
       
        var $obj = $(obj);
        obj[name] = function(fn){
            return (fn && $.isFunction(fn))? $obj.bind(name, null, fn, bubble) : $obj.triggerHandler(name, [fn]);
        }
    };

    
    // -------------------------------------------------------------------------
    //
    // actual justify work
    //
    // -------------------------------------------------------------------------

    
    jqDefine("letterjustify", LetterJustify);
    
    function LetterJustify($elm, config) {
        
        var localConfig = $elm.data('letterjustify-config');
        if (localConfig) {
            config = jqMerge(config, localConfig);
        }
        this.config = jqMerge(LetterJustify.config, config);
        $elm.data('letterjustify', this);
        this.$elm = $elm;
      
        this.apply();
    }
    
    LetterJustify.config = {
        "case"  : "keep"
      , "break" : "smart"
      , "keep"  : "basic"
      , "emph"  : "on"
      , "lineScaling" : 0.60
      , "widthScaling" : 0.75
    }
    
    var BARE = /[*]/g
      , EMTAGS = /((<em>\s*)|(\s*<\/em>))/g
      , BASIC = /[^*a-zA-Z0-9 ]/g
      , WS = /[ \t]+/g
    ;
    LetterJustify.prototype.apply = function() {
        
        // if emph == on we do an effort to maintain <em> info
        if (this.config.emph == "on") {
            //we replace em markers with *
            var org = this.$elm.html();
            console.log("org ==> ", org);
            var emptxt = org.replace(EMTAGS, "*").replace("**"," ");;
            console.log("emptext ==> ", emptxt);
            this.$elm.html(emptxt);
        }
        
        // get the text and normalize the whitespace - but not the nbsp!
        var text = this.$elm.text().replace(WS, " ");
        
        // only keep some chars
        if (this.config.keep == "basic") { 
            text = text.replace(BASIC, "");
        }
        // apply case
        if (this.config.case == "upper") { 
            text = text.toUpperCase(); 
        } else if (this.config.case == "lower") { 
            text = text.toLowerCase(); 
        }
        // break and re-assemble
        var spans;
        if (this.config.break == "word") { 
            spans = text.split(" ");
        } else if (this.config.break == "smart") {
            var xl = 0
              , sm = text.length
              , words = text.split(" ")
              , bares = []
            ;
            
            words.forEach(function(word, i){
                var bare = word.replace(BARE,"")
                bares[i] = bare;
                var size = bare.length;
                if (size > xl) { xl = size; }
                if (size < sm) { sm = size; }
            });
    
            var breaksize = xl;
            
            // smartly group into spans
            words.forEach(function(word, i){
                if (i == 0) {
                    spans = [];
                    spans[0] = word;
                } else {
                    var spi = spans.length -1;
                    var spw = spans[spi];
                    if ((spw + " " + bares[i]).length <= breaksize) {
                        spans[spi] = spw + " " + word;
                    } else {
                        spans[spi+1] = word;
                    }
                }
            });
            
        }
        var html = "<span>" + spans.join("</span><br><span>") + "</span>"
          , me = this
        ; 
        
        this.$elm.html(html);
        $('span', this.$elm).each(function(){ me.justify(this); });
    }
    LetterJustify.prototype.justify = function(span) {
        var $span = $(span)
          , txt = $span.text()
          , emph = false
          , bare = txt.replace(BARE,"")
          , markers = 0
        ;
        
        $span.text(bare);
        $span
          .css('display', 'inline-block')
        ;
        var txtWidth = $span.get(0).clientWidth;
        var txtHeight = $span.get(0).clientHeight;
        
        var tgtWidth = $span.parent().get(0).clientWidth;
        var ratio = this.config.widthScaling * tgtWidth / txtWidth;
        var scale = (10 * Math.floor(10*ratio)) + "%";
        
        $span
          .css('font-size', scale)
          //hard-set the height for line spacing
          .height(Math.ceil($span.height() * this.config.lineScaling) + "px")
          .html("")
        ;
        
        for(var i = 0; i < txt.length; i++)
        {
            //toggle emphasis on * markers
            if (txt.charAt(i) == "*") {
                emph = !emph;
                markers++;
                continue;
            }
            var $ltr = $("<span>" + txt.charAt(i) + "</span>");
            $ltr
              .css('display', 'inline-block')
              .css('position', 'absolute')
            ;
            if (emph) {
                $ltr.css('font-weight', 900);
            }
            $span.append($ltr);

            var positionRatio = (i-markers) / (bare.length - 1);
            var textWidth = $ltr.get(0).clientWidth;

            var indent = 100 * positionRatio;
            var offset = -textWidth * positionRatio;
            $ltr
              .css('left', indent + "%")
              .css('marginLeft', offset + "px")
            ;
        }
    }
    
})(jQuery);
