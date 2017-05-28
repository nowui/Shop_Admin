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

app.model(require('./model/brand'));
app.model(require('./model/product'));
app.model(require('./model/delivery'));
app.model(require('./model/member'));
app.model(require('./model/member_tree'));
app.model(require('./model/member_level'));
app.model(require('./model/order'));
app.model(require('./model/supplier'));
app.model(require('./model/scene'));
app.model(require('./model/bill'));
app.model(require('./model/cart'));
app.model(require('./model/express'));

app.model(require('./model/article'));

// 4. Router
app.router(require('./router'));

document.getElementById("loading").remove();

// 5. Start
app.start('#root');
