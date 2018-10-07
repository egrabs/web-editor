import React from 'react';
// import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';

import { registerKeyStroke } from '../../utils/AutoCompleteCache';

import styles from './CodeEditor.scss';

import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './CodeMirror.css';
import 'codemirror/mode/python/python';
import 'codemirror/mode/shell/shell';


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
            .then(res => res.json())
            .then((json) => {
                const { executionOutput } = json;
                this.setState({ executionOutput });
            })
            .catch(err => console.warn(err));
    };

    onType = (editor, data, value) => {
        this.setState({
            userCode: value,
        });
        registerKeyStroke(value);
    }

    render() {
        const {
            userCode,
            executionOutput,
        } = this.state;

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
                    onBeforeChange={this.onType}
                />
                <hr className={styles.divider} />
                {!!executionOutput && (
                    <CodeMirror
                        className="terminal-output"
                        value={executionOutput}
                        options={{
                            mode: 'shell',
                            theme: 'material',
                            autoRefresh: true,
                            lineNumbers: false,
                            readOnly: true,
                        }}
                    />)
                }
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
