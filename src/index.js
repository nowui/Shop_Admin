import dva from 'dva';
// import { useRouterHistory } from 'dva/router';
// import { createHashHistory } from 'history';
import './index.html';
import './index.css';

// 1. Initialize
const app = dva({
	// history: useRouterHistory(createHashHistory)({ queryKey: false }),
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./model/code'));
app.model(require('./model/role'));
app.model(require('./model/category'));
app.model(require('./model/admin'));
app.model(require('./model/authorization'));
app.model(require('./model/attribute'));
app.model(require('./model/log'));
app.model(require('./model/resource'));
app.model(require('./model/file'));

app.model(require('./model/clazz'));
app.model(require('./model/student'));
app.model(require('./model/teacher'));
app.model(require('./model/course'));
app.model(require('./model/config'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
