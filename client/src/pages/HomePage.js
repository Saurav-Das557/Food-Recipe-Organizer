import React from "react";
import Layout from "./../components/Layout/Layout";
import { useAuth } from "../context/Auth";
import Category from "../components/API/Category";
import Search from "../components/API/Search";
import Popular from "../components/API/Popular";
import { motion } from "framer-motion";
import Vegetable from "../components/API/Vegetable";

const HomePage = () => {
  const [auth, setAuth] = useAuth();
  return (
    <Layout>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exits={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Search />
        <Category />
        <Vegetable />
        <Popular />
        {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      </motion.div>
    </Layout>
  );
};

export default HomePage;
