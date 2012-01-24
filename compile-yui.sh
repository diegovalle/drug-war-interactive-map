cat css/cartodb.css css/bootstrap.css  css/tipsy.css css/interactive-drug-war.css > css/combined.min.css

java -jar yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar --type css css/combined.css > css/combined.min.css


cat js/english_text.js js/jquery.zclip.js js/bootstrap-modal.js js/wax.g.js js/protovis.min.js js/tipsy.js js/jquery.tipsy.js js/drug-eradication-compiled.js js/google-map.js js/cartodb-gmapsv3.js > js/combined.js

java -jar yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar --type js js/combined.js > js/combined.min.js

