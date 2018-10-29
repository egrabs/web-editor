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
import {
    startExecutionAnimation,
    stopExecutionAnimation,
    startDebugMode,
    setDebugOutput,
    setExecutionResults,
} from '../../redux/RootActions';

import styles from './CodeEditor.scss';

import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/base16-dark.css';

import 'codemirror/mode/python/python';
import 'codemirror/mode/javascript/javascript';

@connect(state => ({
    autoComplete: state.autoComplete,
    debugMode: state.debugMode,
    editorMode: state.editorMode,
    editorTheme: state.editorTheme,
}))
export default class CodeEditor extends React.Component {
    state = {
        userCode: '',
        suggestions: [],
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
                disable: this.disable,
            },
            {
                text: 'ANALYZE',
                onClick: this.onAnalyze,
                disable: this.disable,
            },
            {
                text: 'DEBUG',
                onClick: this.onDebug,
                disable: this.disable,
            },
            {
                text: 'COMPILE',
                onClick: () => window.alert('HA! U thought this did sumthin? 😂'),
                disable: this.disable,
            },
        ]);
    }

    disable = () => this.props.debugMode;

    onExecute = () => {
        const { dispatch, editorMode } = this.props;
        const { userCode } = this.state;

        dispatch(startExecutionAnimation);

        request('POST', 'execute/')
            .body({
                code: userCode,
                mode: editorMode,
            })
            .then(res => res.json())
            .then((json) => {
                const { executionResults } = json;
                dispatch(setExecutionResults(executionResults));
                dispatch(stopExecutionAnimation);
            })
            .catch((err) => {
                dispatch(stopExecutionAnimation);
                dispatch(setExecutionResults({
                    err: null,
                    exc: null,
                    content: `Error!\n>>> ${err}`,
                }));
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
    };

    onDebug = () => {
        const { dispatch } = this.props;
        const { userCode } = this.state;
        request('POST', 'debug/')
            .body({ code: userCode })
            .then(res => res.json())
            .then(({ seshId, result }) => {
                dispatch(startDebugMode(seshId));
                dispatch(setDebugOutput(result));
            });
    };

    render() {
        const {
            userCode,
            suggestions,
            selectedSuggestion,
            top,
            left,
        } = this.state;

        const { autoComplete, editorMode, editorTheme } = this.props;

        return (
            <div className={styles.container}>
                <div className={styles.codeContainer}>
                    <div className={styles.inputContainer}>
                        <CodeMirror
                            className={styles.codeEditor}
                            value={userCode}
                            options={{
                                mode: editorMode,
                                theme: editorTheme,
                                autoRefresh: true,
                                lineNumbers: true,
                            }}
                            onKeyDown={this.possiblySelectSuggestion}
                            onBeforeChange={this.onType}
                        />
                        {!!suggestions && !!autoComplete && (
                            <AutoCompleteTooltip
                                suggestions={suggestions}
                                selectedSuggestion={selectedSuggestion}
                                top={top}
                                left={left}
                            />
                        )}
                    </div>
                    <OutputWindow />
                </div>
                <ButtonBar buttons={this.buttons} />
            </div>
        );
    }
}
