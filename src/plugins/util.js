import store from '@/store';

const tmplPrint = `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8"/>
    <title>Document</title>
    <style>{css}</style>
  </head>
  <body>
    {body}
  </body>
  </html>`;

const Util = {
  nano(template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function (str, key) { // eslint-disable-line
      const keys = key.split('.');
      let v = data[keys.shift()];
      for (let i = 0, l = keys.length; i < l; i++) {
        v = v[keys[i]];
      }
      return (typeof v !== 'undefined' && v !== null) ? v : '';
    });
  },

  print(body, css) {
    const popup = window.open('', 'print');
    const html = this.nano(tmplPrint, {
      body,
      css
    });
    popup.document.write(html);
    popup.document.close();
    popup.focus();
    popup.print();
    popup.close();
  },

  toType(obj) {
    return ({}).toString.call(obj)
      .match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  },

  isJson(text) {
    // return /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@')
    return /^[\],:{}\s]*$/.test(text.replace(/\\["\\/bfnrtu]/g, '@')
      // .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, ']')
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
  },

  stripHTML(texto) {
    return texto.replace(/(<([^>]+)>)/ig, '');
  },

  replace(text, find, replace) {
    for (let i = 0, l = find.length, regex; i < l; i++) {
      regex = new RegExp(find[i], 'g');
      text = text.replace(regex, replace[i]);
    }
    return text;
  },

  fullscreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(window.Element.ALLOW_KEYBOARD_INPUT);
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  },

  size(obj) {
    return Object.keys(obj).length;
  },

  serialize(json) {
    return Object.keys(json)
      .map(key => (json[key] != null ? json[key].toString().length > 0 ? key + '=' + json[key] : null : null))
      .filter(value => value != null)
      .join('&')
      .toString();
  },

  getMenuOption(menu, url) {
    const items = [{
      text: 'Inicio'
    }];
    for (const i in menu) {
      if (menu[i].submenu !== undefined) {
        const pages = menu[i].submenu;
        for (const j in pages) {
          if (pages[j].url === url) {
            items.push({
              text: menu[i].label,
              disabled: false
            });
            items.push({
              text: pages[j].label,
              disabled: false
            });
            return items;
          }
        }
      }
    }
    for (const k in menu) {
      if (menu[k].url === url) {
        items.push({
          text: menu[k].label,
          disabled: false
        });
        return items;
      }
    }
    return items;
  },

  trimUrl(url) {
    if (url) {
      if (url[0] === '/') {
        url = url.substring(1);
      }
    }
    return url;
  },

  getKeys(data) {
    const types = {};

    data.map((el) => {
      types[el.key] = el;
    });

    return types;
  },

  events() {
    // Fullscreen event and hack mozilla
    document.addEventListener('onkeyup', (e) => {
      if (e.keyCode === 27) {
        document.querySelector('body')
          .classList
          .remove('fullscreen');
      }
    });

    document.addEventListener('mozfullscreenchange', () => {
      if (!document.mozFullScreen) {
        document.querySelector('body')
          .classList
          .remove('fullscreen');
      }
    }, false);

    if (process.env.ONBEFOREUNLOAD) {
      window.onbeforeunload = () => '¿Está seguro de abandonar la página?.';
    }
  },

  isRol(...roles) {
    if (store.state.user.rol) {
      for (const i in roles) {
        if (store.state.user.rol === roles[i]) {
          return true;
        }
      }
    }
    return false;
  },

  textToUppercase(stringInput) {
    try {
      return stringInput.toUpperCase();
    } catch (error) {
      return stringInput;
    }
  }
};

export default {
  store,
  install: (Vue) => {
    Vue.prototype.$util = Util;
  }
};
