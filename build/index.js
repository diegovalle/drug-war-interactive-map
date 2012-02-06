#!/usr/bin/env node

//the translation strings
require('./html_translation_table.js');
require('./js_translation_table.js');
var hogan = require('hogan.js')
  , fs    = require('fs')
  , prod  = process.argv[2] == 'production';

//read the html template
var page = fs.readFileSync('./drug-war-map.mustache', 'utf-8');


/*
Spanish Translation 
 */
 
context = {};
context._i = _;
context.production = prod;

function _(text, lang) {
  return htmlTranslationTable[text] || text;
};

var template = hogan.compile(page, { sectionTags: [{o:'_i', c:'i'}] });
var output = template.render(context);
fs.writeFileSync('../gh-pages/mapa-guerra-narco.html', output, 'utf-8');

/*
 English Translation
*/

context._i = function(text){
    return text;
};

template = hogan.compile(page, { sectionTags: [{o:'_i', c:'i'}] });
output = template.render(context);
fs.writeFileSync('../gh-pages/drug-war-map.html', output, 'utf-8');


//read the js template
var jsPage = fs.readFileSync('./js_variables.mustache', 'utf-8');

contextJS = {};
contextJS._i = _JS; 

function _JS(text, lang) {
  return jsTranslationTable[text] || text;
};

template = hogan.compile(jsPage, { sectionTags: [{o:'_i', c:'i'}] });
output = template.render(contextJS);
fs.writeFileSync('../js/spanish_text.js', output, 'utf-8');


contextJS._i = function _(text) {
  return text;
};

template = hogan.compile(jsPage, { sectionTags: [{o:'_i', c:'i'}] });
output = template.render(contextJS);
fs.writeFileSync('../js/english_text.js', output, 'utf-8');
