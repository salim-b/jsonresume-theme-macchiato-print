const fs = require('fs');
const handlebars = require('handlebars');
const handlebarsWax = require('handlebars-wax');
const moment = require('moment');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt('commonmark');

handlebars.registerHelper({
  concat: (...args) => args.filter(arg => typeof arg !== 'object').join(''),
  eq: (a, b) => a === b,
  // Arguments: {address, city, subdivision, postalCode, countryCode}
  // formatAddress: (...args) => addressFormat(args).join(' '),
  formatAddress: (...args) => args.filter(arg => typeof arg !== 'object').join(' '),
  formatDate: date => moment(date).format('MM/YYYY'),
  lowercase: s => s.toLowerCase(),
  markdownToHtml: s => md.renderInline(s),
  removeProtocol: url => url.replace(/.*?:\/\//g, '')
});

function render(resume) {
  const dir = `${__dirname}/src`;
  const css = fs.readFileSync(`${dir}/style.css`, 'utf-8');
  const resumeTemplate = fs.readFileSync(`${dir}/resume.hbs`, 'utf-8');

  const Handlebars = handlebarsWax(handlebars);

  Handlebars.partials(`${dir}/partials/**/*.{hbs,js}`);

  return Handlebars.compile(resumeTemplate)({
    style: `<style>${css}</style>`,
    resume,
  });
}

module.exports = {
  render,
};
