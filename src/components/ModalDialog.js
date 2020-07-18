import React from 'react';

class ModalDialog extends React.Component {

    render() {
        return (this.props.show && 
            <div className="modalBackdrop">
            <div className="modalMain">
                {this.props.children}
                <div className="modalFooter">
                <button onClick={this.props.onCancelClick}>
                    Cancel
                </button>
                <button onClick={this.props.onOKClick}>
                    OK
                </button>
                </div>
            </div>
            </div>
        );
    }
}

export default ModalDialog;