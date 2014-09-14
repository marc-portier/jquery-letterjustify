#jQuery-LetterType

jQuery-lettertype is a simple jquery-plugin that will justify (left and right allign) words in a div 

##How to use it
###step 1 - add dependencies
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="/js/jquery-letterjustify.js"></script>
```
###Step 2 - create div to be justified, tag it with class or id
```html
<div style="width: 100px" class="letter-justify">
LetterJustify did justify this text!
</div>
```
In this case we tag the element to justify with the class "letter-justify"
###Step 3 - activate jquery-lettertype on those elements
So jQuery will find them by using the selector '.letter-justify':
```html
<script type="text/javascript">
    $(function(){ $('.letter-justify').letterjustify(); });
</script>
```
###Result
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="/js/jquery-letterjustify.js"></script>
<script src="https://raw.githubusercontent.com/marc-portier/jquery-letterjustify/master/src/js/jquery-letterjustify.js"></script>
<div style="width: 100px" class="letter-justify">
LetterJustify did justify this text!
</div>
<script type="text/javascript">
    $(function(){ $('.letter-justify').letterjustify(); });
</script>

##Credits 
To designer [Marja Van De Ven](http://www.marjaworks.nl/) for the genious (altough non HTML-ready) design that needed this.

And to the push into the right direction from [this Q+A on StackOverflow](http://stackoverflow.com/questions/4355009/css-text-justify-with-letter-spacing).

##How to tune it (and get some understaning of the inner working)
###avoid split: glue words with &amp;nbsp;
The justify-process will split on word-boundaries as recognised through whitespace.
If you don't want words to be separated, you can glue them with &nbsp; like you would do in normal html
```html
<div style="width: 100px" class="letter-justify">LetterJustify will&nbsp;keep&nbsp;these together but simply split these</div>
```
<div style="width: 100px" class="letter-justify">LetterJustify will&nbsp;keep&nbsp;these together but simply split these</div>

###add emphasis through &lt;em&gt; or * (asterisk)
If you want to put emphasis on certain words in the text, you can mark them with * (asterisk) or &lt;em&gt; (html emphasis) tags.
```html
<div style="width: 100px" class="letter-justify">LetterJustify will apply *emphasis* if you wish</div>
```
<div style="width: 100px" class="letter-justify">LetterJustify will apply <em>emphasis</em> if you wish.</div>

###use configuration options
####Activate options through js
When calling the $.letterjustify() you can pass an options object as argument to control how the justification will be applied. These will overwrite the defaults.
```js
  var options = { "emph" : "off" };
  $(function(){ $('.letter-justify').letterjustify( options ); });
```

####Activate options through data-letterjustify-config
Additionally you can apply a data-letter-justify attribute to the element to be letter-justified.  These work only for that specific element and will further overwrite both defaults and passed down custom options.
```html
<div style="width: 100px" class="letter-justify"
    data-letter-justify='{"case": "upper"}'>Text Here</div>  
```

####options.case = "keep" (default) | "upper" | "lower"
This options alters the 'case' of the text before justification. 

####options.break = "smart" (default) | "word"
This options alters how the word-breaking will apply. 

* word: split each word to occupay its own line
* smart: combine smaller words on one line if they fit

> Note: glued words with &amp;nbsp; will never be broken down

> Note: the current 'smart' mode could probably made even smarter: suggestions (and examples) welcome.

####options.keep = "basic" (default) | "all"

LetterJustify will filter out all strange stuff from the content to justify.
This options alters which letters in the text are kept. 

* basic: only this strict set of alphanumeric glyphs will be displayed: a-z, A-Z, 0-9 (Oh, and in some way emphasis markers, space or &amp;nbsp; of course)
* all: no filtering will be done

####options.emph = "on" (default) | "off"

This enables or disables the emphasis-support. Just in case you don't like it to be creaping in.

####options.lineScaling = 0.60 (default) | your own 'double' value

This option controls how lines are scaled: bigger values will give more whitespace between the lines.