import React from 'react';

import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/shell/shell';
import 'codemirror/theme/idea.css';

import './CodeMirror.css';

export default class OutputWindow extends React.Component {
    parseValue = () => {
        const { executionResults: { error, output } } = this.props;
        if (error) return this.handleError(output, error);

        return output;
    };

    handleError = (output, error) => {
        // TODO handle differently based on type
        // ex: CodeErrors should still display whatever code output
        // successfully happened before the error
        const { content, type } = error;
        if (type === 'code_error') {
            return `${output}${content}`;
        }
        if (type === 'server_error') {
            return 'There was a problem with the server. Please try again momentarily.';
        }
        if (type === 'timeout') {
            return content;
        }
        return 'An unexpected error occurred. Please try again.';
    };

    render() {
        const { executionResults } = this.props;
        if (!executionResults) return null;

        return (
            <CodeMirror
                className="terminal-output"
                value={this.parseValue()}
                options={{
                    mode: 'shell',
                    theme: 'idea',
                    autoRefresh: true,
                    lineNumbers: true,
                    readOnly: true,
                }}
            />
        );
    }
}
