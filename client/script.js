(function() {
  var e = React.createElement;

  var List = function(props) {
    var list = props.list.map(function(elem) {
      return e('p', {className: 'item', 'onClick': function() {
        props.onListClick(elem._id)
      }}, elem.text)
    });
    var div = e.bind(null, 'div', {className: 'list'},
      e('h3', null, 'Messages:')
    );
    return div.apply(null, list);
  };

  var Form = function(props) {
    return e(
      'form',
      {onSubmit: props.onSubmit,
       className: 'form'},
      e(
        'input',
        {ref: props.onInput}
      ),
      e(
        'button',
        {type: 'submit'},
        'send'
      )
    );
  }

  var Root = createReactClass({
    getInitialState: function() {
      return {list: []}
    },
    componentDidMount: function() {
      this.fetchData();
    },
    fetchData: function() {
      var self = this;
      axios.get('/api/posts')
        .then(function(response) {
          self.setState({
            list: response.data
          })
        });
    },
    handleSubmit: function(e) {
      e.preventDefault();
      var obj = {
        text: this.input.value
      };
      var self = this;
      axios.post('/api/posts', obj).then(function() {
        self.fetchData();
      });
      this.input.value = '';
    },
    handleInput: function(node) {
      this.input = node;
    },
    handleListClick: function(_id) {
      var self = this;
      axios.delete('/api/posts/' + _id).then(function() {
        self.fetchData();
      });
    },
    render: function() {
      return e(
        'div',
        {className: 'board'},
        e(
          List,
          {list: this.state.list,
            onListClick: this.handleListClick}
        ),
        e(
          Form,
          {
            onSubmit: this.handleSubmit,
            onInput: this.handleInput
          }
        )
      );
    }
  });

  ReactDOM.render(
    e(Root),
    document.getElementById('root')
  );
})();