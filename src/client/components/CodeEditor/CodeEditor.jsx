/* eslint-disable react/destructuring-assignment, prefer-const */

import React from 'react';
import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';

import OutputWindow from '../OutputWindow/OutputWindow';
import AutoCompleteTooltip from '../AutoCompleteTooltip/AutoCompleteTooltip';
import ButtonBar from '../ButtonBar/ButtonBar';
import ASTTree from '../ASTTree/ASTTree';
import { registerKeyStroke } from '../../utils/AutoCompleteCache';
import request from '../../utils/requests';
import annotateWithReactKeys from '../../utils/reactAnnotations';
import {
    startDebugMode,
    setDebugOutput,
    setExecutionResults,
} from '../../redux/Execution/ExecutionActions';

import {
    startExecutionAnimation,
    stopExecutionAnimation,
    setAST,
} from '../../redux/UI/UIActions';

import { setUserCode } from '../../redux/FileSystem/FileSystemActions';

import { getUIState } from '../../redux/UI/UIReducer';

import { getExecutionState } from '../../redux/Execution/ExecutionReducer';

import { getFileSystemState } from '../../redux/FileSystem/FileSystemReducer';

import styles from './CodeEditor.scss';

import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/base16-dark.css';

import 'codemirror/mode/python/python';
import 'codemirror/mode/javascript/javascript';

@connect((state) => {
    const { autoComplete, editorMode, editorTheme } = getUIState(state);
    const { userCode } = getFileSystemState(state);
    const { debugMode } = getExecutionState(state);
    return {
        autoComplete,
        debugMode,
        editorMode,
        editorTheme,
        userCode,
    };
})
export default class CodeEditor extends React.Component {
    state = {
        suggestions: [],
        top: 0,
        selectedSuggestion: '',
        suggDex: -1,
        left: 0,
        showingAst: false,
    };

    codeContainer = React.createRef();

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
                onClick: () => window.alert('coming soon . . . maybe'),
                disable: this.disable,
            },
            {
                text: 'DEBUG',
                onClick: this.onDebug,
                disable: this.disable,
            },
            {
                text: 'COMPILE',
                onClick: this.onCompile,
                disable: this.disable,
            },
        ]);
    }

    disable = () => this.props.debugMode;

    onExecute = () => {
        const { dispatch, editorMode, userCode } = this.props;

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

    onCompile = () => {
        const { dispatch, userCode } = this.props;
        request('POST', '/compile/')
            .body({ code: userCode })
            .then(res => res.json())
            .then((res) => {
                const { ast } = res;
                dispatch(setAST(ast));
                this.setState({ showingAst: true });
            });
    };

    setAutoCompleteTooltipPosition = (editor) => {
        const { display: { cursorDiv: { firstChild } } } = editor;
        const { top, left } = firstChild ? firstChild.getBoundingClientRect() : { top: 0, left: 0 };
        const { current } = this.codeContainer;
        const containerDimensions = current.getBoundingClientRect();
        this.setState({
            top: top - containerDimensions.top,
            left: left - containerDimensions.left,
        });
    };

    onType = (editor, data, value) => {
        // cleanCache(value);
        this.setAutoCompleteTooltipPosition(editor);
        const { dispatch } = this.props;
        dispatch(setUserCode(value));
        this.setState({
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
                    const { dispatch, userCode } = this.props;
                    const { suggDex, selectedSuggestion } = prevState;
                    dispatch(setUserCode(`${userCode}${selectedSuggestion.remaining} `));
                    if (suggDex !== -1 && selectedSuggestion !== '') {
                        return {
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
        const { dispatch, userCode } = this.props;

        dispatch(startExecutionAnimation);

        request('POST', 'analyze/')
            .body({ code: userCode })
            // .then(res => res.json())
            .then(() => {
                dispatch(stopExecutionAnimation);
            });
    };

    onDebug = () => {
        const { dispatch, userCode } = this.props;
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
            suggestions,
            selectedSuggestion,
            top,
            left,
            showingAst,
        } = this.state;

        const {
            autoComplete,
            editorMode,
            editorTheme,
            userCode,
        } = this.props;

        const onAstClose = () => { this.setState({ showingAst: false }); };

        return (
            <div className={styles.container}>
                <ASTTree showing={showingAst} onClose={onAstClose} />
                <div ref={this.codeContainer} className={styles.codeContainer}>
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
