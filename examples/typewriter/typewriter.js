/** @jsx React.DOM */
/* globals document:true */
(function () {
  'use strict';
  var Typewriter = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    createParagraph: function (paragraph, index) {
      return <p key={index}>{paragraph.content}</p>;
    },
    render: function () {
      return (
        <div className='typewriter'>
          <h1>{this.props.title}</h1>
          {this.props.collection ? this.props.collection.map(this.createParagraph) : void 0}
        </div>
      );
    }
  });

  var createParagraph = function () {
    return new Backbone.Model({content: ''});
  };

  var paragraph = createParagraph();
  var collection = new Backbone.Collection([paragraph]);

  var typewriter = <Typewriter collection={collection} title='This will be fast' />;

  React.render(typewriter, document.body);

  var loremipsum = 'Maecenas at lorem turpis. Maecenas elementum interdum ornare. Praesent ut lobortis tellus, et luctus eros. Curabitur id tristique justo. Morbi ultrices sapien at neque volutpat pulvinar. Vestibulum fringilla scelerisque justo, ac lacinia diam interdum et. Fusce id dolor in dui dapibus elementum in condimentum arcu. Praesent cursus fermentum porttitor. Praesent et imperdiet orci, lacinia sollicitudin tortor. Ut aliquet semper turpis quis facilisis. Aenean diam odio, malesuada ut velit dapibus, pellentesque egestas mauris. Vestibulum sit amet purus a diam laoreet varius. Donec condimentum pulvinar enim quis molestie. Phasellus tristique, augue ut eleifend fringilla, arcu leo mollis urna, egestas vestibulum lacus mi eu neque. Sed vulputate orci odio, eu egestas est mattis nec. Donec porta dolor vel iaculis fringilla.';
  var caret = 0;
  setInterval(function () {
    paragraph.set('content', paragraph.get('content') + loremipsum[caret]);
    caret++;
    if (caret === loremipsum.length) {
      caret = 0;
      paragraph = createParagraph();
      collection.add(paragraph);
    }
  }, 1);
}());
