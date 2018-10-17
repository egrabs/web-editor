/* eslint-disable react/destructuring-assignment, prefer-const */

import React from 'react';
import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';

import OutputWindow from '../OutputWindow/OutputWindow';
import AutoCompleteTooltip from '../AutoCompleteTooltip/AutoCompleteTooltip';
import ButtonBar from '../ButtonBar/ButtonBar';
import { registerKeyStroke } from '../../utils/AutoCompleteCache';
import request from '../../utils/requests';
import annotateWithReactKeys from '../../utils/reactAnnotations';
import { startExecutionAnimation, stopExecutionAnimation } from '../../redux/RootActions';

import styles from './CodeEditor.scss';

import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/3024-night.css';

import 'codemirror/mode/python/python';


/* eslint-disable react/no-unused-state */

@connect(state => ({ autoComplete: state.autoComplete }))
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

    constructor(props) {
        super(props);
        this.buttons = annotateWithReactKeys([
            {
                text: 'EXECUTE',
                onClick: this.onExecute,
            },
            {
                text: 'ANALYZE',
                onClick: this.onAnalyze,
            },
        ]);
    }

    onExecute = () => {
        const { dispatch } = this.props;
        const { userCode } = this.state;

        dispatch(startExecutionAnimation);

        request('POST', 'execute/')
            .body({ code: userCode })
            .then(res => res.json())
            // TODO: consolidate the error handling blocks into one
            .then((json) => {
                const { executionOutput, error, codeError } = json;
                if (error) {
                    this.setState({
                        executionOutput: error,
                        error: true,
                    });
                    dispatch(stopExecutionAnimation);
                } else if (codeError) {
                    this.setState({
                        executionOutput: codeError,
                        error: true,
                    });
                    dispatch(stopExecutionAnimation);
                } else {
                    this.setState({
                        executionOutput,
                        error: false,
                    });
                    dispatch(stopExecutionAnimation);
                }
            })
            .catch((err) => {
                dispatch(stopExecutionAnimation);
                this.setState({
                    executionOutput: `Error!\n>>> ${err}`,
                    error: true,
                });
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
        // cleanCache(value);
        this.setAutoCompleteTooltipPosition(editor);
        this.setState({
            userCode: value,
            suggestions: registerKeyStroke(data, value),
        });
    };

    possiblySelectSuggestion = (editor, event) => {
        const { autoComplete } = this.props;
        if (!autoComplete) return;

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
            } else if (event.key === 'Tab') {
                this.setState((prevState) => {
                    const { suggDex, selectedSuggestion, userCode } = prevState;
                    if (suggDex !== -1 && selectedSuggestion !== '') {
                        return {
                            userCode: `${userCode}${selectedSuggestion.remaining} `,
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

    onAnalyze = () => {
        const { dispatch } = this.props;
        const { userCode } = this.state;

        dispatch(startExecutionAnimation);

        request('POST', 'analyze/')
            .body({ code: userCode })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                dispatch(stopExecutionAnimation);
            });
    }

    render() {
        const {
            userCode,
            executionOutput,
            suggestions,
            selectedSuggestion,
            top,
            left,
        } = this.state;

        const { autoComplete } = this.props;

        return (
            <div className={styles.container}>
                <CodeMirror
                    value={userCode}
                    options={{
                        mode: 'python',
                        theme: '3024-night',
                        autoRefresh: true,
                        lineNumbers: true,
                    }}
                    onKeyDown={this.possiblySelectSuggestion}
                    onBeforeChange={this.onType}
                />
                <hr className={styles.divider} />
                <OutputWindow executionOutput={executionOutput} />
                {suggestions && autoComplete && (
                    <AutoCompleteTooltip
                        suggestions={suggestions}
                        selectedSuggestion={selectedSuggestion}
                        top={top}
                        left={left}
                    />
                )}
                <ButtonBar buttons={this.buttons} />
            </div>
        );
    }
}
