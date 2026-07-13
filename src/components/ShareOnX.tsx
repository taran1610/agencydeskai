import { xShareUrl } from '../config/site'
import { trackEvent } from './Analytics'

const SHARE_TEXT =
  "We're opening a private beta for AgencyDesk AI — AI that does insurance operations work for brokers. Reads ACORDs, loss runs, and dec pages, summarizes client files, prepares CRM updates, and flags missing forms."

export const ShareOnX = () => (
  <a
    href={xShareUrl(SHARE_TEXT)}
    className="share-x"
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackEvent('Share on X')}
  >
    Share on X
  </a>
)
