const Rev = React.createClass({
   render: function () {
       return (
           <div className="rev">{this.props.children}</div>
       );
   }
});

const RevEditor = React.createClass({
    getInitialState: function () {
        return {
            person_name: "",
            text: "",
            imgURL: ""
        };
    },
    hanldeTextChange: function (event) {
        this.setState({ text: event.target.value });
    },

    hanldePerson_nameChange: function (event) {
        this.setState({ person_name: event.target.value });
    },

    hanldeImgURLChange: function () {

            html2canvas(document.getElementsByClassName('rev-editor'), {
                "onrendered": function (canvas) {
                    const img = new Image();
                    img.onload = function () {
                        img.onload = null;
                      window.localStorage.setItem("revs", canvas.toDataURL("image/png"));
                    };
                    img.src = canvas.toDataURL("image/png");
                    const dataURL = canvas.toDataURL();
                    /*document.getElementById('screenshot').src = dataURL;*/
                   /* const tempImgURL = canvas.toDataURL("image/png");*/
                }

            });
        const imgURL = unDataToCanvas(localStorage.getItem("imgURL"));
        function unDataToCanvas(data) {
            const img = new Image();
            const canvas = document.createElement('canvas');
            img.onload = function() {
                canvas.width = 300;
                canvas.height = 200;
                canvas.getContext("2d").drawImage(img, 0, 0);
            };
           }
       this.setState({ imgURL: imgURL });
    },

    handleRevAdd: function () {
        const newRev = {
            text: this.state.text,
            person_name: this.state.person_name,
            id: Date.now(),
            imgURL: this.state.imgURL
        };

        this.props.onRevAdd(newRev);
        this.setState({ text: "" });
        this.setState({ person_name: "" });
        this.setState({ imgURL: "" });
    },

   render: function () {
       return (
           <div id="popup1" className="overlay">
               <div className="popup">
                   <a className="close" href="#">&times;</a>
                   <div className="content">
               <div className="rev-editor">
                   <input type="text" className="inut-text"
                          placeholder="Введите ваше имя"
                          value={this.state.person_name}
                          onChange={this.hanldePerson_nameChange}
                   />
                   <textarea placeholder="Введите ваш отзыв"
                             rows={3}
                             className="textarea"
                             value={this.state.text}
                             onChange={this.hanldeTextChange}
                   />
                   <div className="btn_wrap">
                       <button id="screenshoot_btn"
                               className="add-button print"
                               onClick={this.hanldeImgURLChange}>
                           Сделать скриншот
                       </button>
                       <button className="add-button"
                               onClick={ this.state.text ? this.handleRevAdd : "" && this.state.person_name ? this.handleRevAdd : "" }>
                           Добавить отзыв
                       </button>
                   </div>
               </div>

                   </div>
               </div>
           </div>

       );
   }
});

const RevsGrid = React.createClass({
    componentDidMount: function () {
        const grid = this.refs.grid;
        this.msnry = new Masonry( grid, {
           itemSelector: '.rev',
           columnWidth: 200,
           gutter: 10,
            isFitWidth: true
       });
    },
    componentDidUpdate: function (prevProps) {
        if(this.props.revs.length !== prevProps.revs.length ) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

   render: function () {
       return (
           <div className="revs-grid" ref="grid">
               {
                   this.props.revs.map(function(rev) {
                       return <Rev key={rev.id} >
                           <div className="person_name">{rev.person_name}</div>
                           {rev.text}
                           <img id="screenshot" />
                       </Rev>;
                   })
               }
           </div>
       );
   }
});

const RevApp = React.createClass ({
    getInitialState: function () {
        return {
            revs: []
        }
    },

    componentDidMount: function () {
      const localRevs = JSON.parse(localStorage.getItem('revs'));
      if(localRevs) {
            this.setState({ revs: localRevs });
        }
    },

    handleRevAdd: function (newRev) {
        const newRevs = this.state.revs.slice();
        newRevs.unshift(newRev);
        this.setState({ revs: newRevs }, this._updateLocalStorage);
    },

   render: function () {
       return (
           <div className="rev-app">
               <RevEditor onRevAdd={this.handleRevAdd} />
               <RevsGrid revs={this.state.revs} />
           </div>
       );
   },

    _updateLocalStorage: function () {
        const revs = JSON.stringify(this.state.revs);
        localStorage.setItem('revs', revs);
    }
});

ReactDOM.render(
    <RevApp/>,
    document.getElementById('reviews')
);















