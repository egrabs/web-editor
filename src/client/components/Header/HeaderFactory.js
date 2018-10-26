import DebugHeader from './DebugHeader/DebugHeader';
import StandardHeader from './StandardHeader/StandardHeader';

export default function getHeader(debugMode) {
    if (debugMode) return DebugHeader;
    return StandardHeader;
}
