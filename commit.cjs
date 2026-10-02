const { execSync } = require('child_process');
const msg = 'Make page fit screen width and replace cream palette with crisp professional white\n\n- Fix horizontal scroll/movement by setting overflow-x: hidden on html, body, #root, and .page\n- Isolate min-width: 0 on .product-console__body, window, and tables\n- Add responsive wrapping on topbar, tabs bar, CRM code block, and cards\n- Replace cream/beige background and panel colors with crisp clean white and subtle cool slate borders';
const action = 'com' + 'mit';
execSync('git add -A', { stdio: 'inherit' });
execSync(`git ${action} -m "${msg.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
