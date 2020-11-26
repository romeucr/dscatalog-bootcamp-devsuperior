import React from 'react';
import Routes from './Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './core/assets/styles/custom.scss';
import './app.scss'

const App = () => {
   return (
      <> {/* <> e </> é um fragment para poder renderizar dois componentes ao inves de colocar uma div. També é possível utiliar <React.Fragment></React.Fragment> */}
      <Routes />
      <ToastContainer /> {/* toast container deve ser importado apenas uma vez na aplicacao. por padrao fica no App.tsx */}
      </>
   )
}

export default App;