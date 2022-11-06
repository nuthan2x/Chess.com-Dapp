import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Home = (props) => {
  return (
    <>
      <Navbar activelink={props.activelink} setactivelink = {props.setactivelink}/>
      <Outlet />
    </>
  );
};
export default Home;