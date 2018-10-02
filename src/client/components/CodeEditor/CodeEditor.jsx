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
            </div>
        );
    }
}
