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
    }
    
    var BARE = /[*]/g
      , EMTAGS = /((<em>\s*)|(\s*<\/em>))/g
      , BASIC = /[^*a-zA-Z0-9]/g
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
        
        var text = this.$elm.text();
        
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
        var html = "<span>" + spans.join("</span><br><span>") + "</span>"; 
        console.log("spans ==> ", spans);
        this.$elm.html(html);
        $('span', this.$elm).each(LetterJustify.justify);
    }
    LetterJustify.justify = function() {
        var $this = $(this)
          , txt = $this.text()
          , emph = false
          , bare = txt.replace(BARE,"")
          , markers = 0
        ;
        
        $this.text(bare);
        $this.css('display', 'inline-block');
        var txtWidth = $this.get(0).clientWidth;
        var txtHeight = $this.get(0).clientHeight;
        //console.log("txt: " + txt + " has txtWidth = " + txtWidth + " and txtHeight = " + txtHeight);
        
        var tgtWidth = $this.parent().get(0).clientWidth;
        //console.log("parentWidth = " + tgtWidth);
        var ratio = 0.75 * tgtWidth / txtWidth;
        var scale = (10 * Math.floor(10*ratio)) + "%";
        var height = Math.floor(txtHeight * ratio * 0.65) + "px";
        
        $this.css('font-size', scale);
        $this.height(height);
        
        $this.html("");
        
        for(var i = 0; i < txt.length; i++)
        {
            //toggle emphasis on * markers
            if (txt.charAt(i) == "*") {
                emph = !emph;
                markers++;
                continue;
            }
            var $ltr = $("<span>" + txt.charAt(i) + "</span>");
            $ltr.css('display', 'inline-block');
            $ltr.css('position', 'absolute');
            if (emph) {
                $ltr.css('font-weight', 900);
            }
            $this.append($ltr);

            var positionRatio = (i-markers) / (bare.length - 1);
            var textWidth = $ltr.get(0).clientWidth;

            var indent = 100 * positionRatio;
            var offset = -textWidth * positionRatio;
            $ltr.css('left', indent + "%");
            $ltr.css('marginLeft', offset + "px");
        }
    }
    
})(jQuery);
