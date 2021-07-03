export default {
  install: Vue => {
    const instance = new Vue();
    const { $waiting } = instance;
    Vue.directive('generate', {
      bind: (el, { value }) => {
        const message = value || 'Espere unos segundos por favor...';
        el.addEventListener('click', () => {
          $waiting(true, message);
        });
      }
    });

    Vue.directive('custom-tooltip', {
      bind: (el, { value }) => {
        if ((value || '').trim().length === 0) el.style.display = 'none';
        el.addEventListener('mouseover', (e) => {
          const container = document.createElement('div');
          container.innerHTML = value;
          container.id = 'container--tooltip';
          const points = window.localStorage.getItem(`${process.env.VUE_APP_SITENAME}_drawer`);
          const left = points === 'false' ? parseInt(e.pageX) - 300 : parseInt(e.pageX) - 30;
          container.style.left = `${left}px`;
          container.className = 'custom--tooltip';
          container.style.visibility = 'hidden';
          el.parentElement.appendChild(container);
          const caret = document.createElement('div');
          caret.id = 'caret--tooltip';
          setTimeout(() => {
            if (e.pageY + container.clientHeight > window.innerHeight) {
              const position = Math.abs(container.clientHeight - e.pageY) - 200;
              container.style.top = `${position}px`;
              caret.style.bottom = '-22px';
              caret.className = 'caret-top';
            } else {
              caret.style.top = '-22px';
              caret.className = 'caret-bottom';
            }
            container.appendChild(caret);
            container.style.visibility = 'visible';
          }, 10);
        });
        el.addEventListener('mouseout', () => {
          const container = document.querySelector('#container--tooltip');
          if (container) container.remove();
          const caret = document.querySelector('#caret--tooltip');
          if (caret) caret.remove();
        });
      }
    });
  }
};
