import React from 'react';

import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/shell/shell';
import 'codemirror/theme/idea.css';

import './CodeMirror.css';

export default function OutputWindow(props) {
    const { executionOutput } = props;

    if (!executionOutput) {
        return null;
    }

    return (
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
        />
    );
}
