(function (BlogCollection, BlogComponent) {
  'use strict';
  $.get('components/blog', function (componentAndData) {
    document.body.innerHTML = componentAndData.component;
    var blogCollection = new BlogCollection(componentAndData.data);
    new BlogComponent({
      el: document.body,
      collection: blogCollection
    }).mount();
  });
}(this.BlogCollection, this.BlogComponent));