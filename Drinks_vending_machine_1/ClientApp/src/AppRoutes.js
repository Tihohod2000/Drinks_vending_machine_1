import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { Test } from "./components/Test";
import { Pay } from "./components/Pay";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/test',
    element: <Test />
  },
  {
    path: '/pay',
    element: <Pay />
  }
];

export default AppRoutes;
