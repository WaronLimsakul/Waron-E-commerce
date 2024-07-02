import './App.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/">
  </Route>
));
function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
