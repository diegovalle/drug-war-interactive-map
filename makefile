##
#Modify to where you saved Yahoo's YUI Compressor and Google's Closure Compiler
##
YUI = java -jar ~/apps/yuicompressor/build/yuicompressor-2.4.7.jar
CLOSURE = java -jar ~/apps/compiler/compiler.jar

#WHITESPACE_ONLY or else closure messes up twitter's bootstrap modal.js
CLOSURE_FLAGS = --compilation_level WHITESPACE_ONLY

#Language string files
ENGLISH = js/english_text.js
SPANISH = js/spanish_text.js

#Javascript files to merge and compile
SHORTEN_LOC= js/shortner.js
ZCLIP= js/jquery.zclip.js 
BOOTSTRAP=js/bootstrap-modal.js 
WAX=js/wax.g.js 
PROTOVIS=js/protovis.min.js 
TIPSY=js/tipsy.js 
JQUERYTIPSY=js/jquery.tipsy.js 
DRUG=js/drug-eradication-compiled.js 
MAP=js/google-map.js 
CARTO=js/cartodb-gmapsv3.js

#Css files to merge and minimize
CARTO_CSS =css/cartodb.css
BOOT_CSS =css/bootstrap.css
TIPSY_CSS=css/tipsy.css
INTERACTIVE_CSS =css/interactive-drug-war.css

EXTRA_FILES = --js=$(SHORTEN_LOC) --js=$(ZCLIP) --js=$(BOOTSTRAP) --js=$(WAX) --js=$(PROTOVIS) --js=$(TIPSY) --js=$(JQUERYTIPSY) --js=$(DRUG) --js=$(MAP) --js=$(CARTO) 

#Minimized Ouput
COMBINED_JS_EN = gh-pages/js/combined-en.min.js
COMBINED_JS_ES = gh-pages/js/combined-es.min.js
COMBINED_CSS = gh-pages/css/combined.min.css

all: html cssmin english spanish webimages

html:
	cd build; node index.js production

cssmin:
	cat $(CARTO_CSS) $(BOOT_CSS) $(TIPSY_CSS) $(INTERACTIVE_CSS) | $(YUI) --type css -o $(COMBINED_CSS)

english:
	$(CLOSURE) $(CLOSURE_FLAGS) --js=$(ENGLISH) $(EXTRA_FILES) --js_output_file=$(COMBINED_JS_EN)

spanish: 
	$(CLOSURE) $(CLOSURE_FLAGS) --js=$(SPANISH) $(EXTRA_FILES) --js_output_file=$(COMBINED_JS_ES)

clean:
	rm -f $(COMBINED_JS_EN) $(COMBINED_JS_ES) $(COMBINED_CSS) 

webimages:
	cd images; optipng *png
	cp images/icons.png images/legend-en.png images/legend-es.png images/plus-minus.png images/result_small.png gh-pages/images/
