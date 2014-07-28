(function (BlogCollection, BlogComponent) {
  'use strict';
  $.get('components/blog', function (componentAndData) {
    document.body.innerHTML = componentAndData.component;
    var blogCollection = new BlogCollection(componentAndData.data);
    React.renderComponent(BlogComponent({collection: blogCollection}), document.body);
  });
}(this.BlogCollection, this.BlogComponent));
