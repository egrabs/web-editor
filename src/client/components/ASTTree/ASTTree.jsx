import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import ASTController from './ASTTreeController';
import SVGContainer from '../SVGContainer/SVGContainer';
import SexyButton from '../SexyButton/SexyButton';

@connect(state => ({ ast: state.ast }))
export default class ASTTree extends React.Component {
    render() {
        const { ast, showing, onClose } = this.props;
        return (
            <div className="modal-container">
                <Modal show={showing} onHide={onClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Abstract Syntax Tree</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SVGContainer ast={ast} controller={ASTController} />
                    </Modal.Body>
                    <Modal.Footer>
                        <SexyButton onClick={onClose} text="Close" />
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
