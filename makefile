##
#Modify to where you saved Yahoo's YUI Compressor and Google's Closure Compiler
##
YUI = java -jar ~/apps/yuicompressor/build/yuicompressor-2.4.7.jar
#CLOSURE = java -jar ~/apps/compiler/compiler.jar

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

EXTRA_FILES = $(SHORTEN_LOC) $(ZCLIP) $(BOOTSTRAP) $(WAX) $(PROTOVIS) $(TIPSY) $(JQUERYTIPSY) $(DRUG) $(MAP) $(CARTO) 

#Minimized Ouput
COMBINED_JS_EN = gh-pages/js/combined-en.min.js
COMBINED_JS_ES = gh-pages/js/combined-es.min.js
COMBINED_CSS = gh-pages/css/combined.min.css

NODE = node index.js production


all: html cssmin english spanish webimages

debug: NODE = node index.js
debug: COPYJS = cp $(SPANISH) $(ENGLISH) $(EXTRA_FILES) gh-pages/js
debug: COPYCSS = cp $(CARTO_CSS) $(BOOT_CSS) $(TIPSY_CSS) $(INTERACTIVE_CSS) gh-pages/css

debug:  html cssmin english spanish webimages

html:
	cd build; $(NODE)

cssmin:
	cat $(CARTO_CSS) $(BOOT_CSS) $(TIPSY_CSS) $(INTERACTIVE_CSS) | $(YUI) --type css -o $(COMBINED_CSS)

english:
	cat $(ENGLISH) $(EXTRA_FILES) | uglifyjs -o $(COMBINED_JS_EN)

spanish: 
	cat $(SPANISH) $(EXTRA_FILES) | uglifyjs -o $(COMBINED_JS_ES)

clean:
	rm -f $(COMBINED_JS_EN) $(COMBINED_JS_ES) $(COMBINED_CSS) $(ENGLISH) $(SPANISH)
	cd gh-pages; rm -f *.html
	cd gh-pages/js; rm -f *.js	
	cd gh-pages/css; rm -f *.css
	cd gh-pages/images; rm -f *.png

webimages:
	cd images; optipng *png
	cp images/icons.png images/legend-en.png images/legend-es.png images/plus-minus.png images/result_small.png gh-pages/images/
	$(COPYJS)
	$(COPYCSS)
