export default {
  methods: {
    updateList(className = 'btn-refresh-list') {
      if (document.getElementsByClassName(className)) {
        for (const item of document.getElementsByClassName(className)) {
          item.dispatchEvent(new window.Event('click', { cancelable: true }));
        }
      }
    }
  }
};
