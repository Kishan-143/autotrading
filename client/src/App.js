import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import UserDashboard from './routes/UserDashboard'
import UserLogin from './routes/UserLogin';
import UserSignup from './routes/Temp';
import AdminDashboard from './routes/AdminDashboard'
import AdminLogin from './routes/AdminLogin';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/user/dashboard" component = {UserDashboard}></Route>
          <Route path="/user/login" component = {UserLogin}></Route>
          <Route path="/user/signup" component = {UserSignup}></Route>
          <Route path="/admin/dashboard" component = {AdminDashboard}></Route>
          <Route path="/admin/login" component = {AdminLogin}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;