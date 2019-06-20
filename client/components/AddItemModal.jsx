import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000/');
console.log(socket);
socket.on('message', function(data) {
  console.log(data);
});
socket.emit('message', 'yeet');

const mapStateToProps = store => ({
  formControls: store.items.formControls
});

const mapDispatchToProps = dispatch => ({
  formOnChange: (event) => dispatch(actions.formOnChange(event)),
  exitSell: () => dispatch(actions.exitSell()),
  addItem: () => dispatch(actions.addItem()),
})

class AddItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    console.log(this.fileInput.current.files[0])
    let formData = new FormData();
    formData.append('file', this.fileInput.current.files[0]);

    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(imgURL => {

        let data = {
          user_id: this.props.formControls.userID,
          item_name: this.props.formControls.itemName,
          description: this.props.formControls.description,
          pic_url: imgURL
        }

        fetch('/api/items', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(() => this.props.exitSell()) //exits sell modal
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div className='overlay' >
        <div className='modal'>
          <button onClick={this.props.exitSell}>EXIT</button>
          <form onSubmit={this.handleSubmit}>

            <div id='itemNameInput' className='inputField'>
              Item:
              <input
                name='itemName'
                placeholder='itemName'
                value={this.props.formControls.itemName}
                onChange={this.props.formOnChange}
              />
            </div>

            <div className='inputField'>
              UserID:
              <input
                name='userID'
                placeholder='userID'
                value={this.props.formControls.userID}
                onChange={this.props.formOnChange}
              />
            </div>

            <div className='inputField'>
              Description:
            <input
                name='description'
                placeholder='description'
                value={this.props.formControls.description}
                onChange={this.props.formOnChange}
              />
            </div>

            <input type="file" ref={this.fileInput} />

            <input type='submit' />
          </form>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddItemModal);
