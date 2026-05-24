import { xShareUrl } from '../config/site'
import { trackEvent } from './Analytics'

const SHARE_TEXT =
  "We're opening a private beta for AgencyDesk AI — an AI back office for insurance agencies. Intake PDFs, summarize client files, stage CRM updates, and flag missing forms. Human approval always."

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
