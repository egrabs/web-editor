/* eslint-disable react/destructuring-assignment, prefer-const */

import React from 'react';
import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';

import AutoCompleteTooltip from '../AutoCompleteTooltip/AutoCompleteTooltip';
import SexyButton from '../SexyButton/SexyButton';
import { registerKeyStroke } from '../../utils/AutoCompleteCache';
import request from '../../utils/requests';
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
        suggestions: [],
        error: false,
        top: 0,
        selectedSuggestion: '',
        suggDex: -1,
        left: 0,
    };

    onClick = () => {
        const { dispatch } = this.props;
        const { userCode } = this.state;

        dispatch(startExecutionAnimation);

        request('POST', 'execute/')
            .body({ code: userCode })
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
            suggestions: registerKeyStroke(data, value),
        });
    };

    possiblySelectSuggestion = (editor, event) => {
        if (this.state.suggestions.length > 0) {
            if (event.key === 'ArrowDown') {
                this.setState((prevState) => {
                    let { suggDex, suggestions } = prevState;
                    const nextDex = suggDex === suggestions.length - 1
                        ? 0
                        : ++suggDex;
                    return {
                        selectedSuggestion: suggestions[nextDex],
                        suggDex: nextDex,
                    };
                });
            } else if (event.key === 'Enter') {
                this.setState((prevState) => {
                    const { suggDex, selectedSuggestion, userCode } = prevState;
                    if (suggDex !== -1 && selectedSuggestion !== '') {
                        return {
                            userCode: `${userCode} ${selectedSuggestion} `,
                            suggestions: [],
                            suggDex: -1,
                            selectedSuggestion: '',
                        };
                    }
                    return {};
                });
            }
        }
    };

    render() {
        const {
            userCode,
            executionOutput,
            suggestions,
            selectedSuggestion,
            top,
            left,
        } = this.state;

        return (
            <div className={styles.container}>
                <CodeMirror
                    value={userCode}
                    options={{
                        mode: 'python',
                        theme: 'idea',
                        autoRefresh: true,
                        lineNumbers: true,
                    }}
                    onKeyDown={this.possiblySelectSuggestion}
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
                {suggestions && (
                    <AutoCompleteTooltip
                        suggestions={suggestions}
                        selectedSuggestion={selectedSuggestion}
                        top={top}
                        left={left}
                    />
                )}
                <SexyButton
                    onClick={this.onClick}
                    text="EXECUTE"
                />
            </div>
        );
    }
}
