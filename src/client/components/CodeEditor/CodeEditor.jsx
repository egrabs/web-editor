import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/python/python';

export default class CodeEditor extends React.Component {
    state = {
        userCode: '',
    };

    onClick = () => {
        const { userCode } = this.state;
        fetch('http://0.0.0.0:1234/execute/', {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({ code: userCode }),
        })
            .then(res => console.log(res))
            .catch(err => console.warn(err));
    };

    render() {
        const { userCode } = this.state;

        return (
            <div>
                <CodeMirror
                    value={userCode}
                    options={{
                        mode: 'python',
                        theme: 'material',
                        autoRefresh: true,
                        lineNumbers: true,
                    }}
                    onBeforeChange={(editor, data, value) => {
                        this.setState({
                            userCode: value,
                        });
                    }}
                />
                <button
                    onClick={this.onClick}
                    type="button"
                >
                    EXECUTE
                </button>
            </div>
        );
    }
}
