import App from './app.js';
import UsersRoute from './components/user/user.routes.js';
import StudentsRoute from './components/student/student.routes.js';

const app = new App([new UsersRoute(), new StudentsRoute()]);

app.listen();