import middleware from './internal/middleware'
export default middleware

// IE8-compatible-fix: fix upstream Babel export-from bug(?)
import { runSaga } from './internal/runSaga'
export { runSaga }
// IE8-compatible-fix: fix upstream Babel export-from bug(?)
import { END, eventChannel, channel } from './internal/channel'
export { END, eventChannel, channel }
// IE8-compatible-fix: fix upstream Babel export-from bug(?)
import { buffers } from './internal/buffers'
export { buffers }
// IE8-compatible-fix: fix upstream Babel export-from bug(?)
import { takeEvery, takeLatest } from './internal/sagaHelpers'
export { takeEvery, takeLatest }
// IE8-compatible-fix: fix upstream Babel export-from bug(?)
import { delay, CANCEL } from './internal/utils'
export { delay, CANCEL }

import * as effects from './effects'
import * as utils from './utils'

export { effects, utils }
