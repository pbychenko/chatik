import React from 'react';
import { Modal } from 'react-bootstrap';

const MyModal = (props) => {
  const {
    show, onFormChange, onFormSubmit, onHide, newChannelName,
  } = props;
  
  return (
  <Modal show={show} onHide={onHide} size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered animation='true'>
        <Modal.Header closeButton className="border-0 pb-0" >
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="card border-0">
            <div className="card-body pt-0">
              <div className="row">
                <div className="container col-sm-8">
                  <form onSubmit={onFormSubmit}>
                    <div className="form-group">
                      <input type="text" className="form-control" name="newChannelName" onChange={onFormChange} value = {newChannelName }/>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" width="100%">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>);
};

export default MyModal;
