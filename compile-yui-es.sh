cat js/spanish_text.js js/jquery.zclip.js js/bootstrap-modal.js js/wax.g.js js/protovis.min.js js/tipsy.js js/jquery.tipsy.js js/drug-eradication-compiled.js js/google-map.js js/cartodb-gmapsv3.js > js/combined-es.js

java -jar yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar --type js js/combined-es.js > js/combined-es.min.js

