import ReactDOM from 'react-dom';
import App from './components/App/App';
import './index.css';
import './i18n/index';
import { Provider } from 'react-redux';
import store from './redux';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
