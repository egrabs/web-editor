import React from 'react';
import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';

import { registerKeyStroke } from '../../utils/AutoCompleteCache';
import { startExecutionAnimation, stopExecutionAnimation } from '../../redux/RootActions';

import styles from './CodeEditor.scss';

import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/idea.css';
import './CodeMirror.css';
import 'codemirror/mode/python/python';
import 'codemirror/mode/shell/shell';

/* eslint-disable react/no-unused-state */

@connect(() => ({}))
export default class CodeEditor extends React.Component {
    state = {
        userCode: '',
        suggestion: '',
        error: false,
        top: 0,
        left: 0,
    };

    onClick = () => {
        const { dispatch } = this.props;
        const { userCode } = this.state;

        dispatch(startExecutionAnimation);

        fetch('http://0.0.0.0:1234/execute/', {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({ code: userCode }),
        })
            .then(res => res.json())
            // delay response handling for half a sec
            // so that we get to see animation if our code run fast fast
            // also this is FUGLY and really needs cleanup asap
            .then((json) => {
                const { executionOutput, error } = json;
                if (error) {
                    setTimeout(
                        () => {
                            this.setState({
                                executionOutput: error,
                                error: true,
                            });
                            dispatch(stopExecutionAnimation);
                        },
                        500,
                    );
                } else {
                    setTimeout(
                        () => {
                            this.setState({
                                executionOutput,
                                error: false,
                            });
                            dispatch(stopExecutionAnimation);
                        },
                        500,
                    );
                }
            })
            .catch((err) => {
                setTimeout(
                    () => {
                        dispatch(stopExecutionAnimation);
                        this.setState({
                            executionOutput: `Error!\n>>> ${err}`,
                            error: true,
                        });
                    },
                    500,
                );
            });
    };

    setAutoCompleteTooltipPosition = (editor) => {
        const { display: { cursorDiv } } = editor;
        const { top, left } = cursorDiv.firstChild.getBoundingClientRect();
        this.setState({
            top,
            left,
        });
    };

    onType = (editor, data, value) => {
        this.setAutoCompleteTooltipPosition(editor);
        this.setState({
            userCode: value,
            suggestion: registerKeyStroke(data, value),
        });
    }

    render() {
        const {
            userCode,
            executionOutput,
            suggestion,
            top,
            left,
        } = this.state;

        return (
            <div>
                <CodeMirror
                    value={userCode}
                    options={{
                        mode: 'python',
                        theme: '3024-night',
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
                            theme: 'idea',
                            autoRefresh: true,
                            lineNumbers: true,
                            readOnly: true,
                        }}
                    />)
                }
                <div
                    id={styles.autoCompleteTooltip}
                    style={{ top: (top + 10), left: (left + 10) }}
                >
                    {suggestion}
                </div>
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
